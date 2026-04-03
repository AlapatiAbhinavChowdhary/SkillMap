import pickle
import re
import sys
from pathlib import Path

import numpy as np
import spacy
from flask import Flask, jsonify, request
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = (BASE_DIR / "../../models").resolve()

# Compatibility shim for model files pickled with NumPy 2.x internals.
if "numpy._core" not in sys.modules:
    import numpy.core as _numpy_core

    sys.modules["numpy._core"] = _numpy_core
    try:
        import numpy.core.multiarray as _numpy_multiarray

        sys.modules["numpy._core.multiarray"] = _numpy_multiarray
    except Exception:
        pass


def load_pickle(filename):
    with open(MODELS_DIR / filename, "rb") as model_file:
        return pickle.load(model_file)


kmeans = load_pickle("kmeans.pkl")
tfidf = load_pickle("tfidf.pkl")
svd = load_pickle("svd.pkl")
normalizer = load_pickle("normalizer.pkl")
cluster_names_data = load_pickle("cluster_names.pkl")

try:
    nlp = spacy.load("en_core_web_sm", disable=["ner", "parser"])
except OSError:
    # Fallback keeps API running if the model is missing.
    nlp = spacy.blank("en")


def normalize_cluster_names(names_data):
    if isinstance(names_data, dict):
        return {int(k): str(v) for k, v in names_data.items()}

    if isinstance(names_data, (list, tuple)):
        return {idx: str(name) for idx, name in enumerate(names_data)}

    return {}


cluster_names = normalize_cluster_names(cluster_names_data)


def preprocess_text(text):
    text = re.sub(r"https?://\S+|www\.\S+", " ", text)
    text = re.sub(r"\S+@\S+", " ", text)
    text = re.sub(r"[^a-zA-Z\s]", " ", text)
    text = text.lower()
    text = re.sub(r"\s+", " ", text).strip()

    doc = nlp(text)
    lemmas = []
    for token in doc:
        if token.is_stop or token.is_space:
            continue
        if token.lemma_:
            lemmas.append(token.lemma_)
        else:
            lemmas.append(token.text)
    return " ".join(lemmas)


def get_top_terms_from_vector(tfidf_vector, top_n=8):
    feature_names = tfidf.get_feature_names_out()
    dense_vector = tfidf_vector.toarray().ravel()
    if dense_vector.size == 0:
        return []

    top_indices = np.argsort(dense_vector)[::-1]
    terms = []
    for idx in top_indices:
        if dense_vector[idx] <= 0:
            continue
        terms.append(str(feature_names[idx]))
        if len(terms) >= top_n:
            break
    return terms


def get_confidence(normalized_vector):
    distances = kmeans.transform(normalized_vector)[0]
    inv_distances = 1 / (distances + 1e-9)
    score = float(np.max(inv_distances) / np.sum(inv_distances))
    return round(score, 4)


def get_cluster_sizes(n_clusters):
    sizes = {cluster_id: 0 for cluster_id in range(n_clusters)}

    labels = getattr(kmeans, "labels_", None)
    if labels is not None:
        unique_ids, counts = np.unique(labels, return_counts=True)
        for cluster_id, count in zip(unique_ids, counts):
            sizes[int(cluster_id)] = int(count)

    return sizes


def get_cluster_key_terms():
    terms_by_cluster = {}
    feature_names = tfidf.get_feature_names_out()

    components = getattr(svd, "components_", None)
    centers = getattr(kmeans, "cluster_centers_", None)
    if components is None or centers is None:
        return {cluster_id: [] for cluster_id in range(kmeans.n_clusters)}

    projected = np.dot(centers, components)
    for cluster_id, row in enumerate(projected):
        top_indices = np.argsort(row)[::-1][:8]
        terms_by_cluster[cluster_id] = [str(feature_names[idx]) for idx in top_indices]

    return terms_by_cluster


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}})


@app.route("/predict", methods=["POST"])
def predict_cluster():
    payload = request.get_json(silent=True) or {}
    resume_text = payload.get("resume_text", "")

    if not resume_text.strip():
        return jsonify({"error": "resume_text is required"}), 400

    cleaned_text = preprocess_text(resume_text)
    tfidf_vector = tfidf.transform([cleaned_text])
    svd_vector = svd.transform(tfidf_vector)
    normalized_vector = normalizer.transform(svd_vector)

    cluster_id = int(kmeans.predict(normalized_vector)[0])
    cluster_name = cluster_names.get(cluster_id, f"Cluster {cluster_id}")

    return jsonify(
        {
            "cluster_id": cluster_id,
            "cluster_name": cluster_name,
            "top_terms": get_top_terms_from_vector(tfidf_vector),
            "confidence": get_confidence(normalized_vector),
        }
    )


@app.route("/clusters", methods=["GET"])
def list_clusters():
    n_clusters = int(getattr(kmeans, "n_clusters", 8))
    sizes = get_cluster_sizes(n_clusters)
    key_terms = get_cluster_key_terms()

    clusters = []
    for cluster_id in range(n_clusters):
        clusters.append(
            {
                "id": cluster_id,
                "name": cluster_names.get(cluster_id, f"Cluster {cluster_id}"),
                "size": int(sizes.get(cluster_id, 0)),
                "key_terms": key_terms.get(cluster_id, []),
            }
        )

    return jsonify({"clusters": clusters})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

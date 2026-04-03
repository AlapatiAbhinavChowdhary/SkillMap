export const CLUSTER_EMOJIS = {
  'Healthcare & People Management': '🏥',
  'Education & Creative Arts': '🎓',
  'Engineering & Construction': '🏗️',
  'Business & Marketing': '📈',
  'Finance & Accounting': '💰',
  'Information Technology': '💻',
  'Sales & Retail': '🛍️',
  'Culinary & Hospitality': '🍳',
}

export const emojiForCluster = (name) => CLUSTER_EMOJIS[name] || '🧭'

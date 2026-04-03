import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
})

export const analyzeResume = async (resumeText) => {
  const response = await api.post('/predict', { resume_text: resumeText })
  return response.data
}

export const fetchClusters = async () => {
  const response = await api.get('/clusters')
  return response.data
}

export default api

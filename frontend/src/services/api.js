import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchHealth = async () => (await api.get('/health')).data;
export const fetchDashboardSummary = async () => (await api.get('/dashboard/summary')).data;
export const fetchPosts = async (platform = 'all', skip = 0, limit = 20) => 
  (await api.get(`/posts?platform=${platform}&skip=${skip}&limit=${limit}`)).data;
export const uploadPostsFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return (await api.post('/posts/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })).data;
};
export const fetchSentiment = async () => (await api.get('/sentiment')).data;
export const fetchDemographics = async () => (await api.get('/demographics')).data;
export const fetchTrends = async () => (await api.get('/trends')).data;
export const fetchNetwork = async () => (await api.get('/network')).data;
export const fetchNetworkInfluencers = async () => (await api.get('/network/influencers')).data;
export const fetchPropagation = async (topic = 'AI Autonomous Agents') => 
  (await api.get(`/propagation?topic=${encodeURIComponent(topic)}`)).data;
export const fetchTimeline = async (topic = '', platform = 'all', sentiment = 'all') => 
  (await api.get(`/timeline?topic=${encodeURIComponent(topic)}&platform=${platform}&sentiment=${sentiment}`)).data;
export const fetchAlerts = async (severity = 'all') => (await api.get(`/alerts?severity=${severity}`)).data;
export const triggerSeedDemo = async () => (await api.post('/demo/seed')).data;
export const globalSearch = async (query) => (await api.get(`/search?query=${encodeURIComponent(query)}`)).data;
export const fetchEntityIntelligence = async (query) => (await api.get(`/entity/${encodeURIComponent(query)}`)).data;

export default api;

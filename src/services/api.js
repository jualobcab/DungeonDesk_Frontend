import axios from 'axios';

// Create an axios instance with base URL and default headers
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
  },
});

// Add request interceptor to include auth token and handle content type
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Only set Content-Type to application/json if it's not already defined
  // This prevents overriding 'multipart/form-data' for file uploads
  if (!config.headers['Content-Type'] && !config.headers['content-type']) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

// Authentication service
export const authService = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  logout: () => api.post('/logout'),
  getCurrentUser: () => api.get('/user'),
};

export const classService = {
  getAll: () => api.get('/classes'),
  getTypes: () => api.get('/classes/types'),
  getOne: (id) => api.get(`/classes/${id}`),
  getFeatures: (id) => api.get(`/classes/${id}/features`),
  getFeature: (id, featureId) => api.get(`/classes/${id}/features/${featureId}`),
  getSubclasses: (id) => api.get(`/classes/${id}/subclasses`),
  getSubclass: (id, subclassId) => api.get(`/classes/${id}/subclasses/${subclassId}`),
  getSubclassTypes: (id) => api.get(`/classes/${id}/subclasses/types`),
  getSubclassFeatures: (id, subclassId) => api.get(`/classes/${id}/subclasses/${subclassId}/features`),
  getSubclassFeature: (id, subclassId, featureId) =>
    api.get(`/classes/${id}/subclasses/${subclassId}/features/${featureId}`),
};

export const equipmentService = {
  getAll: () => api.get('/equipment'),
  getOne: (id) => api.get(`/equipment/${id}`),
  getArmors: () => api.get('/equipment/armors'),
  getArmor: (id) => api.get(`/equipment/armors/${id}`),
  getWeapons: () => api.get('/equipment/weapons'),
  getWeapon: (id) => api.get(`/equipment/weapons/${id}`),
  getArtifacts: () => api.get('/equipment/artifacts'),
  getArtifact: (id) => api.get(`/equipment/artifacts/${id}`),
};

export const characterService = {
  getAll: () => api.get('/characters'),
  getOne: (id) => api.get(`/characters/${id}`),
  getFeatures: (id) => api.get(`/characters/${id}/features`),
  create: (data) => api.post('/characters/create', data),
  update: (id, data) => api.put(`/characters/${id}/update`, data),
  delete: (id) => api.delete(`/characters/${id}/delete`),
  getEquipment: (id) => api.get(`/characters/${id}/equipment`),
  addEquipment: (id, equipmentId) =>
    api.post(`/characters/${id}/equipment/add`, { equipment_id: equipmentId }),
  updateEquipment: (id, equipmentId, quantity) =>
    api.put(`/characters/${id}/equipment/${equipmentId}/update`, { quantity }),
  removeEquipment: (id, equipmentId) =>
    api.delete(`/characters/${id}/equipment/${equipmentId}/delete`),
  levelUp: (id, data) => api.post(`/characters/${id}/level-up`, data),
};

export const campaignService = {
  getAll: () => api.get('/campaigns'),
  getOne: (id) => api.get(`/campaigns/${id}`),
  create: (data) => api.post('/campaigns/create', data),
  update: (id, data) => api.put(`/campaigns/${id}/update`, data),
  delete: (id) => api.delete(`/campaigns/${id}/delete`),
  getDiary: (id) => api.get(`/campaigns/${id}/diary`),
  createDiaryEntry: (id, data) => api.post(`/campaigns/${id}/diary/create`, data),
  getDiaryEntry: (id, entryId) => api.get(`/campaigns/${id}/diary/${entryId}`),
  updateDiaryEntry: (id, entryId, data) => api.put(`/campaigns/${id}/diary/${entryId}/update`, data),
  deleteDiaryEntry: (id, entryId) => api.delete(`/campaigns/${id}/diary/${entryId}/delete`),
};

export const diaryService = {
  getCampaignDiary: (campaignId) => api.get(`/campaigns/${campaignId}/diary`),
  getEntry: (campaignId, entryId) => api.get(`/campaigns/${campaignId}/diary/${entryId}`),
  create: (campaignId, data) => api.post(`/campaigns/${campaignId}/diary/create`, data),
  update: (campaignId, entryId, data) => api.put(`/campaigns/${campaignId}/diary/${entryId}/update`, data),
  delete: (campaignId, entryId) => api.delete(`/campaigns/${campaignId}/diary/${entryId}/delete`),
};

export const adminService = {
  // LISTAR
  getFeatures: () => api.get('/admin/features'),
  getFeature: (id) => api.get(`/admin/features/${id}`),

  // CREAR
  createArmor: (data) => api.post('/admin/armor/create', data),
  createWeapon: (data) => api.post('/admin/weapon/create', data),
  createArtifact: (data) => api.post('/admin/artifact/create', data),
  createEquipment: (data) => api.post('/admin/equipment/create', data),
  createFeature: (data) => api.post('/admin/feature/create', data),
  createSubclass: (data) => api.post('/admin/subclass/create', data),
  createClass: (data) => api.post('/admin/class/create', data),

  // RELACIONES
  addSubclassToClass: (data) => api.post('/admin/class/add-subclass', data),
  addFeatureToClass: (data) => api.post('/admin/class/add-feature', data),
  addFeatureToSubclass: (data) => api.post('/admin/subclass/add-feature', data),

  // UPDATE
  updateArmor: (id, data) => api.put(`/admin/armor/${id}/update`, data),
  updateWeapon: (id, data) => api.put(`/admin/weapon/${id}/update`, data),
  updateArtifact: (id, data) => api.put(`/admin/artifact/${id}/update`, data),
  updateEquipment: (id, data) => api.put(`/admin/equipment/${id}/update`, data),
  updateFeature: (id, data) => api.put(`/admin/feature/${id}/update`, data),
  updateSubclass: (id, data) => api.put(`/admin/subclass/${id}/update`, data),
  updateClass: (id, data) => api.put(`/admin/class/${id}/update`, data),

  // DELETE
  deleteArmor: (id) => api.delete(`/admin/armor/${id}/delete`),
  deleteWeapon: (id) => api.delete(`/admin/weapon/${id}/delete`),
  deleteArtifact: (id) => api.delete(`/admin/artifact/${id}/delete`),
  deleteEquipment: (id) => api.delete(`/admin/equipment/${id}/delete`),
  deleteFeature: (id) => api.delete(`/admin/feature/${id}/delete`),
  deleteSubclass: (id) => api.delete(`/admin/subclass/${id}/delete`),
  deleteClass: (id) => api.delete(`/admin/class/${id}/delete`),
  deleteFeatureFromClass: (data) => api.delete(`/admin/feature/${data.feature_id}/delete`, { data }),
};

export default api;
const API_BASE = 'http://localhost:5000';

const apiRequest = async (url, options = {}) => {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};


const normalizeDeals = (deals) => {
  return deals.map(deal => ({
    ...deal,
    value: Number(deal.value || 0) 
  }));
};

const normalizeClients = (clients) => {
  return clients.map(client => ({
    ...client,
    id: String(client.id) 
  }));
};

const normalizeActivities = (activities) => {
  return activities.map(activity => ({
    ...activity,
    id: String(activity.id) 
  }));
};


export const usersAPI = {
  getAll: () => apiRequest('/users'),
  getById: (id) => apiRequest(`/users/${id}`),
  create: (user) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify({
      ...user,
      id: Date.now().toString(),
      role: user.role || 'user',
      createdAt: new Date().toISOString()
    })
  }),

  update: (id, user) => apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(user)
  }),

  login: async (email, password) => {
    const users = await apiRequest('/users');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    return { data: user };
  }
};

export const clientsAPI = {
  getAll: async () => {
    try {
      const data = await apiRequest('/clients');
      return { data: normalizeClients(data) };
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      throw error;
    }
  },
  getById: (id) => apiRequest(`/clients/${id}`),
  create: (client) => apiRequest('/clients', {
    method: 'POST',
    body: JSON.stringify({
      ...client,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    })
  }),
  update: (id, client) => apiRequest(`/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(client)
  }),
  delete: (id) => apiRequest(`/clients/${id}`, { method: 'DELETE' })
};


export const dealsAPI = {
  getAll: async () => {
    try {
      const data = await apiRequest('/deals');
      return { data: normalizeDeals(data) };
    } catch (error) {
      console.error('Failed to fetch deals:', error);
      throw error;
    }
  },
  getById: (id) => apiRequest(`/deals/${id}`),
  create: (deal) => apiRequest('/deals', {
    method: 'POST',
    body: JSON.stringify({
      ...deal,
      id: Date.now().toString(),
      value: Number(deal.value || 0), 
      createdAt: new Date().toISOString()
    })
  }),
  update: (id, deal) => apiRequest(`/deals/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      ...deal,
      value: Number(deal.value || 0) 
    })
  }),
  delete: (id) => apiRequest(`/deals/${id}`, { method: 'DELETE' })
};

export const activitiesAPI = {
  getAll: async () => {
    try {
      const data = await apiRequest('/activities');
      return { data: normalizeActivities(data) };
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      throw error;
    }
  },
  create: (activity) => apiRequest('/activities', {
    method: 'POST',
    body: JSON.stringify({
      ...activity,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    })
  })
};


export const dashboardAPI = {
  getStats: async () => {
    try {
      const [clients, deals, activities] = await Promise.all([
        clientsAPI.getAll(),
        dealsAPI.getAll(),
        activitiesAPI.getAll()
      ]);
      
      return {
        clients: clients.data,
        deals: deals.data,
        activities: activities.data
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  }
};
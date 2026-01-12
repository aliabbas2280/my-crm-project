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

export const usersAPI = {
  getAll: () => apiRequest('/users'),
  getById: (id) => apiRequest(`/users/${id}`),
  create: (user) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify({
      ...user,
      id: Date.now().toString(),
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
    return user;
  }
};

export const clientsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/clients${queryString ? `?${queryString}` : ''}`);
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
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/deals${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => apiRequest(`/deals/${id}`),
  create: (deal) => apiRequest('/deals', {
    method: 'POST',
    body: JSON.stringify({
      ...deal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    })
  }),
  update: (id, deal) => apiRequest(`/deals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(deal)
  }),
  delete: (id) => apiRequest(`/deals/${id}`, { method: 'DELETE' })
};

export const activitiesAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/activities${queryString ? `?${queryString}` : ''}`);
  },
  create: (activity) => apiRequest('/activities', {
    method: 'POST',
    body: JSON.stringify({
      ...activity,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    })
  })
};

export const dashboardAPI = {
  getStats: async () => {
    const [users, clients, deals, activities] = await Promise.all([
      apiRequest('/users'),
      apiRequest('/clients'),
      apiRequest('/deals'),
      apiRequest('/activities')
    ]);
    return {
      users,
      clients,
      deals,
      activities
    };
  }
};
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
    throw new Error(`HTTP Error: ${response.status}`);
  }

  const data = await response.json();
  const total =
    response.headers.get('X-Total-Count') ||
    response.headers.get('x-total-count');

  return { data, total: total ? Number(total) : null };
};


const buildQuery = (params = {}) => {
  const query = new URLSearchParams();

  if (params.q?.trim()) query.append('q', params.q.trim());
  if (params.limit) query.append('_limit', params.limit);
  if (params.page) query.append('_page', params.page);
  if (params.sort) query.append('_sort', params.sort);
  if (params.order) query.append('_order', params.order);
  if (params.status && params.status !== 'All') query.append('status', params.status);

  return query.toString();
};

const getList = async (endpoint, params) => {
  const query = buildQuery(params);
  const { data, total } = await apiRequest(`/${endpoint}${query ? `?${query}` : ''}`);
  return { data, total: total ?? data.length };
};

export const usersAPI = {
  getAll: () => getList('users'),
  getById: (id) => apiRequest(`/users/${id}`),
  create: (user) =>
    apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify({
        ...user,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      })
    }),
  update: (id, user) =>
    apiRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(user) }),
  login: async (email, password) => {
    const { data: users } = await getList('users');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    return { data: user };
  }
};

export const clientsAPI = {
  getAll: (params) => getList('clients', params),
  getById: (id) => apiRequest(`/clients/${id}`),
  create: (client) =>
    apiRequest('/clients', {
      method: 'POST',
      body: JSON.stringify({
        ...client,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      })
    }),
  update: (id, client) =>
    apiRequest(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(client) }),
  delete: (id) => apiRequest(`/clients/${id}`, { method: 'DELETE' })
};

export const dealsAPI = {
  getAll: (params) => getList('deals', params),
  getById: (id) => apiRequest(`/deals/${id}`),
  create: (deal) =>
    apiRequest('/deals', {
      method: 'POST',
      body: JSON.stringify({
        ...deal,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      })
    }),
  update: (id, deal) =>
    apiRequest(`/deals/${id}`, { method: 'PUT', body: JSON.stringify(deal) }),
  delete: (id) => apiRequest(`/deals/${id}`, { method: 'DELETE' })
};

export const activitiesAPI = {
  getAll: (params) => getList('activities', params),
  create: (activity) =>
    apiRequest('/activities', {
      method: 'POST',
      body: JSON.stringify({
        ...activity,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      })
    })
};

export const dashboardAPI = {
  getStats: async ({ latestDeals, latestActivities, search }) => {
    const dealsQuery = buildQuery({ q: search, sort: 'createdAt', order: 'desc', limit: latestDeals });
    const activitiesQuery = buildQuery({ q: search, sort: 'createdAt', order: 'desc', limit: latestActivities });

    const [{ data: deals }, { data: activities }] = await Promise.all([
      apiRequest(`/deals?${dealsQuery}`),
      apiRequest(`/activities?${activitiesQuery}`)
    ]);

    return { deals, activities };
  }
};


export const metricsAPI = {
  getMetrics: async () => {
    const [{ data: clients }, { data: deals }] = await Promise.all([apiRequest('/clients'), apiRequest('/deals')]);

    const activeClients = clients.filter(c => c.status === 'Active').length;
    const wonDeals = deals.filter(d => d.status === 'Won');
    const activeDeals = deals.filter(d => d.status === 'Lead' || d.status === 'Qualified');

    const totalRevenue = wonDeals.reduce((sum, d) => sum + Number(d.value || 0), 0);
    const activeDealsValue = activeDeals.reduce((sum, d) => sum + Number(d.value || 0), 0);
    const conversionRate = deals.length ? Math.round((wonDeals.length / deals.length) * 100) : 0;

    return { totalRevenue, activeDealsValue, activeClients, conversionRate };
  }
};

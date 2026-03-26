const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('nvh_token');
};

const buildHeaders = (isFormData = false) => {
  const token = getToken();
  const headers = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    const message = data.error || data.message || 'Something went wrong.';
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
};

// ─── AUTH ─────────────────────────────────────────────────────────────
export const authAPI = {
  register: async (body) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  login: async (body) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  getProfile: async () => {
    const res = await fetch(`${API_URL}/api/auth/profile`, {
      headers: buildHeaders(),
    });
    return handleResponse(res);
  },

  updateProfile: async (body) => {
    const res = await fetch(`${API_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  changePassword: async (body) => {
    const res = await fetch(`${API_URL}/api/auth/change-password`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },
};

// ─── LISTINGS ─────────────────────────────────────────────────────────
export const listingsAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    const res = await fetch(`${API_URL}/api/listings${query ? `?${query}` : ''}`, {
      headers: buildHeaders(),
    });
    return handleResponse(res);
  },

  getOne: async (id) => {
    const res = await fetch(`${API_URL}/api/listings/${id}`, {
      headers: buildHeaders(),
    });
    return handleResponse(res);
  },

  getMyListings: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/api/listings/my/listings${query ? `?${query}` : ''}`, {
      headers: buildHeaders(),
    });
    return handleResponse(res);
  },

  getLocations: async () => {
    const res = await fetch(`${API_URL}/api/listings/locations`);
    return handleResponse(res);
  },

  create: async (formData) => {
    const res = await fetch(`${API_URL}/api/listings`, {
      method: 'POST',
      headers: buildHeaders(true),
      body: formData,
    });
    return handleResponse(res);
  },

  update: async (id, formData) => {
    const res = await fetch(`${API_URL}/api/listings/${id}`, {
      method: 'PUT',
      headers: buildHeaders(true),
      body: formData,
    });
    return handleResponse(res);
  },

  delete: async (id) => {
    const res = await fetch(`${API_URL}/api/listings/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    });
    return handleResponse(res);
  },
};

// ─── FAVORITES ────────────────────────────────────────────────────────
export const favoritesAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/api/favorites${query ? `?${query}` : ''}`, {
      headers: buildHeaders(),
    });
    return handleResponse(res);
  },

  toggle: async (listingId) => {
    const res = await fetch(`${API_URL}/api/favorites/${listingId}/toggle`, {
      method: 'POST',
      headers: buildHeaders(),
    });
    return handleResponse(res);
  },
};

// ─── IMAGE HELPER ─────────────────────────────────────────────────────
export const getImageUrl = (path) => {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
};

export const HOUSE_TYPE_LABELS = {
  SINGLE_ROOM: 'Single Room',
  BEDSITTER: 'Bedsitter',
  ONE_BEDROOM: '1 Bedroom',
  TWO_BEDROOM: '2 Bedrooms',
  THREE_BEDROOM: '3 Bedrooms',
  FOUR_BEDROOM_PLUS: '4+ Bedrooms',
};

export const NAIROBI_LOCATIONS = [
  'Westlands', 'Kilimani', 'Kileleshwa', 'Lavington', 'Karen',
  'Langata', 'South B', 'South C', 'Parklands', 'Eastleigh',
  'Buruburu', 'Embakasi', 'Donholm', 'Kasarani', 'Roysambu',
  'Ruaraka', 'Zimmerman', 'Githurai', 'Ngong', 'Rongai',
  'Kitengela', 'Thika', 'Ruiru', 'Juja', 'Kikuyu',
];

export const AMENITIES_LIST = ['Water', 'Electricity', 'Parking', 'WiFi', 'Security'];

export const formatPrice = (price) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(price);

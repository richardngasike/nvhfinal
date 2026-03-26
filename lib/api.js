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
  // High-End & Prime Areas
  'Westlands', 'Kilimani', 'Kileleshwa', 'Lavington', 'Karen',
  'Runda', 'Muthaiga', 'Gigiri', 'Nyari', 'Rosslyn', 'Spring Valley',

  // CBD & Surrounding
  'Nairobi CBD', 'Upper Hill', 'Hurlingham', 'Ngara',
  'Pangani', 'Kariokor', 'Gikomba', 'Globe Cinema',

  // South Nairobi
  'South B', 'South C', 'Nairobi West', 'Madaraka',
  'Highrise', 'Hazina', 'Langata', 'Nyayo Estate',

  // Eastlands (Very High Demand Rentals)
  'Eastleigh', 'Buruburu', 'Umoja', 'Umoja Innercore',
  'Umoja Outercore', 'Kayole', 'Kayole Junction',
  'Komarock', 'Saika', 'Njiru', 'Ruai', 'Donholm',
  'Embakasi', 'Embakasi East', 'Embakasi West',
  'Pipeline', 'Tassia', 'Fedha', 'Nyayo Estate Embakasi',

  // Thika Road Belt (Student + Young Professionals)
  'Kasarani', 'Roysambu', 'Zimmerman', 'Githurai',
  'Githurai 44', 'Githurai 45', 'Kahawa West',
  'Kahawa Sukari', 'Kahawa Wendani', 'Ruaraka',
  'Garden Estate', 'Safari Park',

  // Ngong Road & Dagoretti
  'Ngong', 'Rongai', 'Dagoretti', 'Uthiru',
  'Kawangware', 'Satellite', 'Kabiria',
  'Waithaka', 'Racecourse', 'Riruta',

  // Waiyaki Way & Western Nairobi
  'Kikuyu', 'Lower Kabete', 'Upper Kabete',
  'Mountain View', 'Kangemi', 'Westlands (Lower)',

  // Industrial & Airport Zone
  'Industrial Area', 'Syokimau', 'Mlolongo',
  'Athi River', 'JKIA', 'Imara Daima',

  // Emerging & Peri-Urban Hotspots
  'Kitengela', 'Athi River', 'Joska', 'Kamulu',
  'Ruai Bypass', 'Malaa',

  // Kiambu Metro (Very Important for Rentals)
  'Ruiru', 'Juja', 'Thika', 'Limuru',
  'Kiambu Town', 'Gikambura'
];

export const AMENITIES_LIST = [
  // Basic Utilities (must-have)
  'Water', 'Electricity', 'Backup Generator', 'Borehole', 'Solar Power',

  // Connectivity
  'WiFi', 'Fiber Internet', 'DSTV', 'Cable TV',

  // Security (very important in Nairobi)
  '24/7 Security', 'CCTV', 'Electric Fence', 'Gated Community',
  'Security Guard', 'Alarm System', 'Intercom',

  // Parking & Access
  'Parking', 'Ample Parking', 'Basement Parking', 'Visitor Parking',
  'Cabro Paved Driveway', 'Tarmac Access Road',

  // Water & Sanitation
  'Water Tank', 'Constant Water Supply', 'Hot Shower',
  'Instant Shower', 'Solar Water Heater',

  // Interior Features
  'Built-in Wardrobes', 'Tiles', 'Wooden Floor', 'Modern Finishes',
  'Spacious Rooms', 'Balcony', 'Closed Kitchen', 'Open Kitchen',
  'Furnished', 'Semi-Furnished',

  // Kitchen Features
  'Kitchen Cabinets', 'Granite Countertops', 'Pantry',

  // Laundry
  'Laundry Area', 'Washing Machine Space', 'Drying Area',

  // Building Features
  'Lift/Elevator', 'Stairs', 'Rooftop Access',

  // Outdoor & Lifestyle
  'Garden', 'Play Area', 'Swimming Pool', 'Gym',
  'Jogging Track', 'Recreational Area',

  // Accessibility
  'Wheelchair Accessible', 'Disabled Access',

  // Extras (high-conversion features)
  'Pet Friendly', 'Servant Quarter (DSQ)', 'Study Room',
  'Office Space', 'Air Conditioning', 'Fireplace',

  // Location Advantages
  'Near Road', 'Near School', 'Near Hospital', 'Near Mall',
  'Near Public Transport', 'Near CBD'
];

export const formatPrice = (price) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(price);

import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// Otomatis selipkan token (jika ada) setiap kali mengambil data
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
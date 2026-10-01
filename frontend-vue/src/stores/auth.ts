import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '@/axios';

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref(null);
    const token = ref(localStorage.getItem('auth_token'));

    const login = async (credentials: any) => {
        const response = await apiClient.post('/login', credentials);
        
        if (response.data.success) {
            token.value = response.data.data.token;
            user.value = response.data.data.user;
            localStorage.setItem('auth_token', token.value as string);
        }
    };

    const logout = async () => {
        try {
            await apiClient.post('/logout');
        } catch (error) {
            console.warn('Sesi di backend tidak ditemukan, memaksa hapus data lokal...');
        } finally {
            token.value = null;
            user.value = null;
            localStorage.removeItem('auth_token');
        }
    };

    const fetchUser = async () => {
        if (token.value) {
            try {
                const response = await apiClient.get('/me');
                user.value = response.data.data.user;
            } catch (error) {
                console.error('Token tidak valid, silakan login ulang.');
                logout(); 
            }
        }
    };

    return { user, token, login, logout, fetchUser };
});
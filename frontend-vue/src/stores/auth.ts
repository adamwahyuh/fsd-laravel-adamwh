import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '@/axios';

interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResponse {
    success: boolean;
    data: {
        token: string;
        user: User;
    };
}

interface MeResponse {
    success: boolean;
    data: {
        user: User;
    };
}

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref<User | null>(null);
    const token = ref<string | null>(
        localStorage.getItem('auth_token')
    );

    // Login
    const login = async (credentials: LoginCredentials) => {
        const response = await apiClient.post<LoginResponse>('/login', credentials);

        if (response.data.success) {
            token.value = response.data.data.token;
            user.value = response.data.data.user;

            localStorage.setItem(
                'auth_token',
                token.value
            );
        }
    };

    // Logout
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

    // Get current user
    const fetchUser = async () => {
        if (!token.value) {
            return;
        }

        try {
            const response = await apiClient.get<MeResponse>('/me');

            user.value = response.data.data.user;
        } catch (error) {
            console.error(
                'Token tidak valid, silakan login ulang.'
            );

            await logout();
        }
    };

    return { user, token, login, logout, fetchUser };
});
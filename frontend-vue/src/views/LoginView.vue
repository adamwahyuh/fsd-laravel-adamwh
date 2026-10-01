<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
    try {
        errorMessage.value = '';

        await auth.login({
            email: email.value,
            password: password.value,
        });

        router.push('/');
    } catch (error: any) {
        errorMessage.value =
            error.response?.data?.message || 'Email atau password salah';
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div class="w-full max-w-sm bg-white p-6 rounded-lg shadow">

            <h2 class="text-2xl font-semibold text-gray-900 mb-6">
                Login
            </h2>

            <div
                v-if="errorMessage"
                class="mb-4 p-3 bg-red-100 text-red-600 rounded text-sm"
            >
                {{ errorMessage }}
            </div>

            <form @submit.prevent="handleLogin" class="space-y-4">

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>

                    <input
                        v-model="email"
                        type="email"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>

                    <input
                        v-model="password"
                        type="password"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    class="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Login
                </button>

            </form>

        </div>
    </div>
</template>
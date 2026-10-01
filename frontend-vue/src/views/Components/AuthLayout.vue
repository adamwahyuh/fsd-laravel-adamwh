<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const auth = useAuthStore();
const router = useRouter();

const currentTime = ref('');

let timer: number;

const updateTime = () => {
    currentTime.value = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

const handleLogout = async () => {
    await auth.logout();
    router.push('/login');
};

onMounted(async () => {
    if (!auth.user) {
        await auth.fetchUser();
    }

    updateTime();
    timer = window.setInterval(updateTime, 1000);
});

onUnmounted(() => {
    clearInterval(timer);
});
</script>

<template>
    <div class="min-h-screen bg-gray-100">

        <!-- Navbar -->
        <nav class="bg-white border-b border-gray-200">
            <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                <!-- User & Time -->
                <div>
                    <p class="font-semibold text-gray-900">
                        Welcome, {{ auth.user?.name }}
                    </p>

                    <p class="text-sm text-gray-500">
                        {{ currentTime }}
                    </p>
                </div>

                <!-- Logout -->
                <button
                    @click="handleLogout"
                    class="px-4 py-2 text-sm font-medium text-white
                           bg-red-500 rounded-lg
                           hover:bg-red-600 transition"
                >
                    Logout
                </button>

            </div>
        </nav>

        <!-- Content -->
        <main class="max-w-7xl mx-auto px-6 py-8">
            <RouterView />
        </main>

    </div>
</template>
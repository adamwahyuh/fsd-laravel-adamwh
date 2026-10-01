<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { getMetrics } from '@/stores/systemMetrics';

interface Metric {
    id: number;
    timestamp: string;
    cpu_usage_pct: number;
    ram_total_mb: number;
    ram_used_mb: number;
    ram_usage_pct: number;
    disk_total_gb: number;
    disk_used_gb: number;
    disk_usage_pct: number;
    created_at: string;
    updated_at: string;
}

const metrics = ref<Metric[]>([]);
const loading = ref(true);
const errorMessage = ref('');

let refreshTimer: number;

const fetchMetrics = async () => {
    try {
        errorMessage.value = '';

        metrics.value = await getMetrics();
    } catch (error) {
        errorMessage.value = 'Gagal mengambil data metrics.';
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    // Ambil data langsung ketika halaman dibuka
    fetchMetrics();

    // Kemudian refresh setiap 1 menit
    refreshTimer = window.setInterval(() => {
        fetchMetrics();
    }, 60_000);
});

onUnmounted(() => {
    // Hentikan timer ketika meninggalkan halaman
    clearInterval(refreshTimer);
});
</script>

<template>
    <div>
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-semibold text-gray-900">
                Server Metrics
            </h1>

            <p class="text-gray-500">
                Monitoring penggunaan CPU, RAM, dan Disk.
            </p>
        </div>

        <!-- Error -->
        <div
            v-if="errorMessage"
            class="mb-6 p-3 bg-red-100 text-red-600 rounded"
        >
            {{ errorMessage }}
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-gray-500">
            Mengambil data metrics...
        </div>

        <template v-else>
            <!-- Metrics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

                <!-- CPU -->
                <div class="bg-white p-5 rounded-lg border">
                    <p class="text-sm text-gray-500">
                        CPU Usage
                    </p>

                    <p class="text-3xl font-semibold mt-2">
                        {{ metrics[0]?.cpu_usage_pct.toFixed(2) }}%
                    </p>
                </div>

                <!-- RAM -->
                <div class="bg-white p-5 rounded-lg border">
                    <p class="text-sm text-gray-500">
                        RAM Usage
                    </p>

                    <p class="text-3xl font-semibold mt-2">
                        {{ metrics[0]?.ram_usage_pct.toFixed(2) }}%
                    </p>

                    <p class="text-sm text-gray-500 mt-1">
                        {{ metrics[0]?.ram_used_mb }} /
                        {{ metrics[0]?.ram_total_mb }} MB
                    </p>
                </div>

                <!-- Disk -->
                <div class="bg-white p-5 rounded-lg border">
                    <p class="text-sm text-gray-500">
                        Disk Usage
                    </p>

                    <p class="text-3xl font-semibold mt-2">
                        {{ metrics[0]?.disk_usage_pct.toFixed(2) }}%
                    </p>

                    <p class="text-sm text-gray-500 mt-1">
                        {{ metrics[0]?.disk_used_gb }} /
                        {{ metrics[0]?.disk_total_gb }} GB
                    </p>
                </div>

            </div>

            <!-- Table -->
            <div class="mt-6 bg-white rounded-lg border overflow-hidden">

                <div class="p-5 border-b">
                    <h2 class="font-semibold">
                        Metric History <sup class="text-gray-500">(Last one hour)</sup>
                    </h2>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-sm">

                        <thead class="bg-gray-50">
                            <tr>
                                <th class="text-left px-5 py-3">
                                    Timestamp
                                </th>

                                <th class="text-left px-5 py-3">
                                    CPU
                                </th>

                                <th class="text-left px-5 py-3">
                                    RAM
                                </th>

                                <th class="text-left px-5 py-3">
                                    Disk
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr
                                v-for="metric in metrics"
                                :key="metric.id"
                                class="border-t"
                            >
                                <td class="px-5 py-3">
                                    {{ metric.timestamp }}
                                </td>

                                <td class="px-5 py-3">
                                    {{ metric.cpu_usage_pct.toFixed(2) }}%
                                </td>

                                <td class="px-5 py-3">
                                    {{ metric.ram_usage_pct.toFixed(2) }}%
                                </td>

                                <td class="px-5 py-3">
                                    {{ metric.disk_usage_pct.toFixed(2) }}%
                                </td>
                            </tr>
                        </tbody>

                    </table>
                </div>

            </div>
        </template>
    </div>
</template>
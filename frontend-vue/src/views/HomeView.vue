
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { getMetrics } from '@/stores/systemMetrics'
import MetricsChart from './Components/MetricsChart.vue'

interface Metric {
    id: number
    timestamp: string
    cpu_usage_pct: number
    ram_total_mb: number
    ram_used_mb: number
    ram_usage_pct: number
    disk_total_gb: number
    disk_used_gb: number
    disk_usage_pct: number
    created_at: string
    updated_at: string
}

const metrics = ref<Metric[]>([])
const loading = ref(true)
const errorMessage = ref('')
let refreshTimer: ReturnType<typeof setInterval> | undefined

const latestMetric = computed(() => metrics.value[0])

const chartMetrics = computed(() => [...metrics.value].reverse())

const fetchMetrics = async () => {
    try {
        errorMessage.value = ''

        const data = await getMetrics()
        metrics.value = data
    } catch (error) {
        console.error('Gagal mengambil data metrics:', error)
        errorMessage.value = 'Gagal mengambil data metrics.'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
  // Ambil data saat halaman pertama kali dibuka
    fetchMetrics()

  // Refresh setiap 1 menit
    refreshTimer = setInterval(() => {
        fetchMetrics()
    }, 60_000)
})

onUnmounted(() => {
    if (refreshTimer) {
        clearInterval(refreshTimer)
    }
})
</script>

<template>
    <div class="p-4 md:p-6">
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
        class="mb-6 rounded-lg bg-red-100 p-3 text-red-600"
        >
        {{ errorMessage }}
        </div>

        <!-- Loading -->
        <div
        v-if="loading"
        class="py-10 text-center text-gray-500"
        >
        Mengambil data metrics...
        </div>

        <template v-else>
        <!-- Metrics Cards -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <!-- CPU -->
            <div class="rounded-lg border bg-white p-5">
            <p class="text-sm text-gray-500">
                CPU Usage
            </p>

            <p class="mt-2 text-3xl font-semibold text-blue-600">
                {{ latestMetric?.cpu_usage_pct.toFixed(2) ?? '0.00' }}%
            </p>
            </div>

            <!-- RAM -->
            <div class="rounded-lg border bg-white p-5">
            <p class="text-sm text-gray-500">
                RAM Usage
            </p>

            <p class="mt-2 text-3xl font-semibold text-emerald-600">
                {{ latestMetric?.ram_usage_pct.toFixed(2) ?? '0.00' }}%
            </p>

            <p class="mt-1 text-sm text-gray-500">
                {{ latestMetric?.ram_used_mb ?? 0 }} /
                {{ latestMetric?.ram_total_mb ?? 0 }} MB
            </p>
            </div>

            <!-- Disk -->
            <div class="rounded-lg border bg-white p-5">
            <p class="text-sm text-gray-500">
                Disk Usage
            </p>

            <p class="mt-2 text-3xl font-semibold text-amber-600">
                {{ latestMetric?.disk_usage_pct.toFixed(2) ?? '0.00' }}%
            </p>

            <p class="mt-1 text-sm text-gray-500">
                {{ latestMetric?.disk_used_gb ?? 0 }} /
                {{ latestMetric?.disk_total_gb ?? 0 }} GB
            </p>
            </div>
        </div>

        <!-- Chart -->
        <div class="mt-6 rounded-lg border bg-white p-5">
            <div class="mb-5">
            <h2 class="text-lg font-semibold text-gray-900">
                Server Performance
            </h2>

            <p class="text-sm text-gray-500">
                Grafik penggunaan CPU, RAM, dan Disk.
            </p>
            </div>

            <div v-if="metrics.length > 0">
            <MetricsChart :metrics="chartMetrics" />
            </div>

            <div
            v-else
            class="flex h-[350px] items-center justify-center text-gray-500"
            >
            Belum ada data metrics.
            </div>
        </div>

        <!-- Table -->
        <div class="mt-6 overflow-hidden rounded-lg border bg-white">
            <div class="border-b p-5">
            <h2 class="font-semibold">
                Metric History
                <span class="text-sm font-normal text-gray-500">
                (Last one hour)
                </span>
            </h2>
            </div>

            <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50">
                <tr>
                    <th class="px-5 py-3 text-left">
                    Timestamp
                    </th>

                    <th class="px-5 py-3 text-left">
                    CPU
                    </th>

                    <th class="px-5 py-3 text-left">
                    RAM
                    </th>

                    <th class="px-5 py-3 text-left">
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
                    <td class="whitespace-nowrap px-5 py-3">
                    {{ new Date(metric.timestamp).toLocaleString('id-ID') }}
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

                <tr v-if="metrics.length === 0">
                    <td
                    colspan="4"
                    class="px-5 py-8 text-center text-gray-500"
                    >
                    Belum ada riwayat metrics.
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
        </template>
    </div>
</template>
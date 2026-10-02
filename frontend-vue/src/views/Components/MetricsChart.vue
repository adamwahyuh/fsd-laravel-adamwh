
<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
} from 'chart.js'

interface Metric {
    timestamp: string
    cpu_usage_pct: number
    ram_usage_pct: number
    disk_usage_pct: number
}

const props = defineProps<{
    metrics: Metric[]
}>()

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale
)

const chartData = computed(() => ({
    labels: props.metrics.map((item) =>
        new Date(item.timestamp).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        })
    ),

    datasets: [
        {
        label: 'CPU',
        data: props.metrics.map((item) => item.cpu_usage_pct),
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        tension: 0.3,
        pointRadius: 2,
        },
        {
        label: 'RAM',
        data: props.metrics.map((item) => item.ram_usage_pct),
        borderColor: '#10b981',
        backgroundColor: '#10b981',
        tension: 0.3,
        pointRadius: 2,
        },
        {
        label: 'Disk',
        data: props.metrics.map((item) => item.disk_usage_pct),
        borderColor: '#f59e0b',
        backgroundColor: '#f59e0b',
        tension: 0.3,
        pointRadius: 2,
        },
    ],
}))

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
        intersect: false,
        mode: 'index' as const,
    },

    plugins: {
        legend: {
        position: 'top' as const,
        },

        tooltip: {
        callbacks: {
            label(context: any) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`
            },
        },
        },
    },

    scales: {
        y: {
        min: 0,
        max: 100,
        title: {
            display: true,
            text: 'Usage (%)',
        },
        ticks: {
            callback(value: string | number) {
            return `${value}%`
            },
        },
        },

        x: {
        title: {
            display: true,
            text: 'Waktu',
        },
        },
    },
}
</script>

<template>
    <div class="h-[350px] w-full">
        <Line
        :data="chartData"
        :options="chartOptions"
        />
    </div>
</template>
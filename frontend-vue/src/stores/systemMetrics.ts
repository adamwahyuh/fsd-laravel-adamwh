import apiClient from "@/axios";

export const getMetrics = async () => {
    try {
        const response = await apiClient.get('/metrics');
        return response.data.data; 
    } catch (error) {
        console.error("Gagal mengambil data metrics:", error);
        throw error;
    }
};
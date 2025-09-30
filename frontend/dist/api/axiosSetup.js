import axios, { AxiosError } from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const api = axios.create({
    baseURL: "/api/",
    headers: { "Content-Type": "application/json" },
    withCredentials: true
});
api.interceptors.request.use((config) => {
    config.withCredentials = true;
    return config;
}, (error) => {
    return Promise.reject(error);
});
api.interceptors.response.use((respone) => {
    return respone;
}, (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
        alert("You don't have permission to access it")
        console.log("Error occured 401 and 403");
        router.push('/display');
    }
    return Promise.reject(error);
});
export default api;

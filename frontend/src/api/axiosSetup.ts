import axios, { AxiosError} from 'axios';
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();


const api = axios.create({
    baseURL: "/api/", 
    headers: {"Content-Type": "application/json"},
    withCredentials: true
})

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig=>{
        config.withCredentials=true;
        return config;
    },
    (error: AxiosError):Promise<never> => {
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    (respone: AxiosResponse):AxiosResponse => {
        return respone
    },
    (error: AxiosError):Promise<never> => { //it will not execute properly always throws an error
        if(error.response?.status === 401 || error.response?.status === 403){
           
        console.log("Error occured 401 and 403");
        alert("You don't have permission")
    router.replace("/display");


  alert("You don't have permission to access it");
      router.replace("/display");
        }
        return Promise.reject(error);
    }
)

export default api;
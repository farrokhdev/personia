import axios, {AxiosError} from "axios";

export const httpApi = axios.create({
    baseURL: process.env["REACT_APP_API_BASE_URL"],
});

httpApi.interceptors.request.use((config) => {
    // @ts-ignore
    config.headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        ...config.headers,
    };

    return config;
});


httpApi.interceptors.response.use(undefined, (error: AxiosError)=> {
    if(error) {
        // @ts-ignore
        throw new AxiosError<ApiErrorData>(
            // @ts-ignore
            error.response?.data.message || error.message,
            // @ts-ignore
            error.response.data?.statusCode || error.response.status,
            // @ts-ignore
            error.response.data || null
        )
    }
});

export interface ApiErrorData {
    message: string;
    code: number
    config: any
}

import axios from 'axios';
import {
    showErrorToast,
    showConfirmationDialog
} from '@/helpers/alert';

const app = window.__APP__;

export function axiosInterceptors() {
    axios.interceptors.request.use(config => {
        const token = app?.$pinia?.getToken();
        if (token) config.headers['Authorization'] = `Bearer ${token}`;
        if (!config.headers['Content-Type']) config.headers['Content-Type'] = 'application/json';
        config.headers['Accept'] = 'application/json';
        return config;
    }, error => {
        showErrorToast('Request Error', 'Terjadi kesalahan pada request');
        return Promise.reject(error);
    });

    axios.interceptors.response.use(response => {
        return response;
    }, async error => {
        if (error.response && [403, 401].includes(error.response.status)) {
            const confirmed = await showConfirmationDialog(
                'Ooops',
                error.response.data.errors[0] || 'Terjadi kesalahan pada response'
            );
            if (confirmed) {
                await app?.$pinia?.logout();
                window.location.reload();
            }
        } else {
            showErrorToast('Error', 'Terjadi kesalahan pada response');
        }
        return Promise.reject(error);
    });
}

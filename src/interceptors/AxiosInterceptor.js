import axios from "axios";

const AxiosInterceptor = () => {

    axios.interceptors.request.use( config => {

        config.headers['Authorization'] = `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`;

            return config;

        },

        error => {

            return Promise.reject(error);
            
        }
    
    );

}

export default AxiosInterceptor;
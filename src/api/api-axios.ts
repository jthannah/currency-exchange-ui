import axios, { AxiosRequestConfig } from 'axios'

const instance = axios.create({
  baseURL: '/api',
})

// Will run for every Axios request made using this instance
instance.interceptors.request.use((config: AxiosRequestConfig) => {
  return config
})

// Will run for every Axios response from this instance
instance.interceptors.response.use(
  (response) => response,
  (err) => {
    const response = err.response

    // Request timed out or any other error type occurred
    return Promise.reject(err)
  }
)

export default instance

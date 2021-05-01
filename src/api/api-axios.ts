import axios, { AxiosRequestConfig } from 'axios'

const instance = axios.create({
  baseURL: '/api',
})

// Will run for every Axios request made using this instance
instance.interceptors.request.use((config: AxiosRequestConfig) => {
  // if (currentSupplierId) {
  //   config.headers['x-tenant-id'] = currentSupplierId
  // }
  return config
})

export default instance

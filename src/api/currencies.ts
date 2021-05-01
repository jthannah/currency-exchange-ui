import instance from './api-axios'

export default {
  getCurrencies(): Promise<string[]> {
    return instance.get('/currencies').then((response) => {
      return response.data
    })
  },
}

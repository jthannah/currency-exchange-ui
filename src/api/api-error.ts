import { AxiosError, AxiosResponse } from 'axios'

export class ApiError extends Error {
  private response: AxiosResponse | undefined
  statusCode: string | undefined
  constructor(axiosError: AxiosError | undefined) {
    super()

    this.stack = new Error().stack

    this.message = axiosError ? axiosError.message : ''
    this.name = 'ReactorApiError'
    this.response = axiosError ? axiosError.response : undefined

    this.statusCode = undefined
    if (axiosError?.code) {
      this.statusCode = axiosError.code
    } else if (axiosError?.response?.status) {
      this.statusCode = axiosError?.response?.status.toString()
    }
  }
}

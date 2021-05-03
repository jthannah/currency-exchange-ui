import instance from './api-axios'

export interface CurrencyConversionRequest {
  amount: number
  baseCurrency?: string
  currenciesToConvert?: string
}

export interface CurrencyConversion {
  baseCode: string
  baseName: string
  convertedAmount: number
  amount: number
  code: string
  rate: number
  name: string
}

export interface SaveCurrencyConversionRequest {
  email: string
  conversionRequest: CurrencyConversionRequest
}

export default {
  getCurrencyConversions(conversionData: CurrencyConversionRequest): Promise<CurrencyConversion[]> {
    return instance
      .post('/convert', {
        amount: conversionData.amount,
        baseCurrency: conversionData.baseCurrency,
        currenciesToConvert: conversionData.currenciesToConvert,
      })
      .then((response) => {
        return response.data
      })
  },

  saveCurrencyConversions(saveData: SaveCurrencyConversionRequest): Promise<void> {
    return instance.post('/saveConversion', saveData).then((response) => {
      return response.data
    })
  },

  getSavedCurrencyConversions(email: string): Promise<CurrencyConversion[]> {
    return instance.post('/getConversions', { email: email }).then((response) => {
      return response.data
    })
  },
}

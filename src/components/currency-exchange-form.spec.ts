import '@testing-library/jest-dom'
import { render, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import Conversions, { CurrencyConversion, CurrencyConversionRequest } from '../api/conversions'
import CurrencyExchangeForm from '../components/currency-exchange-form.vue'
import { createFormMachine } from '../machines/form-machine'
import { interpret } from 'xstate'
import { ref } from 'vue'

jest.mock('../api/conversions')
const mockedConversions = Conversions as jest.Mocked<typeof Conversions>

const fakeConversionResponse: CurrencyConversion[] = [
  {
    baseCode: 'sdk',
    baseName: 'some name',
    convertedAmount: 23,
    amount: 5398,
    code: 'gdh',
    rate: 48.4785,
    name: 'another name',
  },
]

describe('currency-exchange-form.vue', () => {
  it('shows error message when form machine is in error state', async () => {
    const currencyConversionFormMachine = interpret(
      createFormMachine<CurrencyConversionRequest>({
        id: 'currency-conversion-form',
        initialFormData: {
          amount: 1,
          baseCurrency: undefined,
          currenciesToConvert: undefined,
        },
      }).withConfig({
        services: {
          submit: () => Promise.reject(),
        },
      })
    ).start('error')

    const { getByText, getByRole } = render(CurrencyExchangeForm, {
      global: {
        provide: {
          currencyConversionFormService: currencyConversionFormMachine,
          currencyConversionFormState: ref(currencyConversionFormMachine.state),
        },
      },
    })

    mockedConversions.getCurrencyConversions.mockResolvedValue(Promise.resolve(fakeConversionResponse))

    await waitFor(() => userEvent.click(getByRole('button', { name: 'Convert!' })))
    expect(getByText('Make sure all fields are filled out!')).toBeInTheDocument()
  })
})

import '@testing-library/jest-dom'
import { render, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import Conversions, { CurrencyConversionRequest } from '../api/conversions'
import SaveRequestForm from '../components/save-request-form.vue'
import Toast, { provideToast } from 'vue-toastification'
import { interpret } from 'xstate'
import { createFormMachine } from '../machines/form-machine'
import { ref } from 'vue'

jest.mock('../api/conversions')
const mockedConversions = Conversions as jest.Mocked<typeof Conversions>

const createCurrencyConversionFormMachine = () => {
  return interpret(
    createFormMachine<CurrencyConversionRequest>({
      id: 'currency-conversion-form',
      initialFormData: {
        amount: 1,
        baseCurrency: undefined,
        currenciesToConvert: undefined,
      },
    }).withConfig({
      services: {
        submit: () => Promise.resolve(),
      },
    })
  ).start('editing')
}

// TODO: figure out how to get the vue-svg-loader to properly transform the SVG icons. This will get rid of those pesky
// warnings currently seen when running these tests.
describe('save-request-form.vue', () => {
  it('shows modal on first click, when we do not already have the users email address', async () => {
    const currencyConversionFormMachine = createCurrencyConversionFormMachine()
    const { queryByRole, getByRole } = render(SaveRequestForm, {
      global: {
        plugins: [Toast],
        provide: {
          currencyConversionFormState: ref(currencyConversionFormMachine.state),
        },
      },
    })

    mockedConversions.saveCurrencyConversions.mockResolvedValue(Promise.resolve())

    expect(queryByRole('dialog')).toBeNull()
    await userEvent.click(getByRole('button', { name: 'Save Conversions' }))
    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument())
  })

  it('saves requests when user fills out email address and clicks button', async () => {
    const currencyConversionFormMachine = createCurrencyConversionFormMachine()
    const { queryByRole, getByRole } = render(SaveRequestForm, {
      global: {
        plugins: [Toast],
        provide: {
          currencyConversionFormState: ref(currencyConversionFormMachine.state),
        },
      },
    })

    mockedConversions.saveCurrencyConversions.mockResolvedValue(Promise.resolve())

    expect(queryByRole('dialog')).toBeNull()
    await userEvent.click(getByRole('button', { name: 'Save Conversions' }))
    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument())

    await userEvent.type(getByRole('textbox', { name: 'Email' }), 'test@email.com')
    expect(mockedConversions.saveCurrencyConversions).toHaveBeenCalledTimes(0)
    await userEvent.click(getByRole('button', { name: 'Save Conversions' }))

    await waitFor(() => expect(mockedConversions.saveCurrencyConversions).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(expect(queryByRole('dialog')).toBeNull()))
  })



  it('saves requests when save button is clicked after the user has already given their email address', async () => {
    const currencyConversionFormMachine = createCurrencyConversionFormMachine()
    const { queryByRole, getByRole, getAllByText } = render(SaveRequestForm, {
      global: {
        plugins: [Toast],
        provide: {
          currencyConversionFormState: ref(currencyConversionFormMachine.state),
        },
      },
    })

    mockedConversions.saveCurrencyConversions.mockResolvedValue(Promise.resolve())

    const saveButton = getByRole('button', { name: 'Save Conversions' })

    await userEvent.click(saveButton)

    await userEvent.type(getByRole('textbox', { name: 'Email' }), 'test@email.com')
    expect(mockedConversions.saveCurrencyConversions).toHaveBeenCalledTimes(0)
    await userEvent.click(saveButton)

    await waitFor(() => expect(mockedConversions.saveCurrencyConversions).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(expect(queryByRole('dialog')).toBeNull()))

    await userEvent.click(saveButton)
    await waitFor(() => expect(mockedConversions.saveCurrencyConversions).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(getAllByText('Success! Conversion data has been saved.')[0]).toBeInTheDocument())
  })
})

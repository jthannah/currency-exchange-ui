<template>
  <form class="flex flex-wrap p-5 space-x-8" @submit.prevent="currencyConversionFormService.send('SUBMIT')">
    <div class="w-1/6">
      <label for="price" class="block text-sm font-medium text-gray-100"> Amount </label>
      <div class="relative mt-1 rounded-md shadow-sm">
        <input
          type="number"
          step="0.01"
          name="price"
          id="price"
          class="focus:ring-indigo-500 focus:border-indigo-500 pl-7 sm:text-sm block w-full h-10 border-gray-300 rounded-md"
          placeholder="1.00"
          value="1.00"
          aria-describedby="price-currency"
          @input="updateAmount($event.target)"
          required
        />
      </div>
    </div>

    <div class="flex-1">
      <label for="price" class="block text-sm font-medium text-gray-100"> From </label>
      <div class="relative mt-1 rounded-md shadow-sm">
        <Multiselect
          v-model="fromCurrency"
          :options="currencyOptions"
          :multiple="false"
          :close-on-select="true"
          :clear-on-select="true"
          placeholder="Select base currency"
          @select="updateFromSelected"
          :allow-empty="false"
        />
      </div>
    </div>

    <div class="flex-1">
      <label for="price" class="block text-sm font-medium text-gray-100"> To </label>
      <div class="relative mt-1 rounded-md shadow-sm">
        <Multiselect
          v-model="toCurrencies"
          :options="currencyOptions"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="true"
          placeholder="Select Currencies"
        />
      </div>
    </div>

    <button
      type="submit"
      class="hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm inline-flex items-center justify-center w-full h-10 px-4 py-2 mt-6 text-base font-medium text-white bg-indigo-500 border border-transparent rounded-md shadow-sm"
    >
      Convert!
    </button>
  </form>

  <div v-if="formError" class="w-full px-5 pb-4 font-bold text-center text-pink-400" role="alert">
    Make sure all fields are filled out!
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, Ref, ref, watch } from 'vue'
import Multiselect from '@suadelabs/vue3-multiselect'
import { createDataMachine } from '../machines/data-fetch-machine'
import { useMachine } from '@xstate/vue'
import Currencies from '../api/currencies'
import { CurrencyConversionRequest } from '../api/conversions'
import { Interpreter, State } from 'xstate'
import { FormContext, FormEvents, FormSchema } from '../machines/form-machine'

export default defineComponent({
  name: 'Home',
  components: { Multiselect },
  setup: () => {
    const fromCurrency = ref('')
    const toCurrencies = ref([])

    const currencyConversionFormService = inject('currencyConversionFormService') as Interpreter<
      FormContext<CurrencyConversionRequest>,
      FormSchema<CurrencyConversionRequest>,
      FormEvents<CurrencyConversionRequest>
    >
    const currencyConversionFormState = inject('currencyConversionFormState') as Ref<
      State<
        FormContext<CurrencyConversionRequest>,
        FormEvents<CurrencyConversionRequest>,
        FormSchema<CurrencyConversionRequest>
      >
    >

    const { state: fetchState, send: fetchSend } = useMachine(
      createDataMachine<string[]>('get-available-currencies').withConfig({
        services: {
          fetchData: () => {
            return Currencies.getCurrencies().catch((error) => {
              console.error('There was an issue getting currencies!', error)
            })
          },
        },
      }),
      { devTools: true }
    )
    fetchSend('FETCH')

    const currencyOptions = computed(() => {
      return fetchState.value.context.results ?? []
    })

    const updateFormData = (updatedFormData: CurrencyConversionRequest) => {
      currencyConversionFormService.send({ type: 'CHANGE', formData: updatedFormData })
    }

    const updateAmount = (amountInput: HTMLInputElement) => {
      const updatedFormData = {
        ...(currencyConversionFormState.value.context.formData as CurrencyConversionRequest),
        amount: parseFloat(amountInput.value),
      }
      updateFormData(updatedFormData)
    }

    const updateFromSelected = (fromSelected: string) => {
      const updatedFormData = {
        ...(currencyConversionFormState.value.context.formData as CurrencyConversionRequest),
        baseCurrency: fromSelected,
      }
      updateFormData(updatedFormData)
    }

    watch(
      () => toCurrencies.value,
      () => {
        const updatedFormData = {
          ...(currencyConversionFormState.value.context.formData as CurrencyConversionRequest),
          currenciesToConvert: toCurrencies.value.toString(),
        }

        updateFormData(updatedFormData)
      }
    )

    const formError = computed(() => {
      return currencyConversionFormState.value.matches('error') ?? false
    })

    return {
      currencyConversionFormService,
      fromCurrency,
      toCurrencies,
      currencyOptions,
      updateFromSelected,
      updateAmount,
      formError,
    }
  },
})
</script>

<!-- TODO: override styles to reduce layout shifts when opening dropdown and making selections -->
<style src="@suadelabs/vue3-multiselect/dist/vue3-multiselect.css"></style>
<style lang="css">
.multiselect__tags {
  padding: 8px 40px 8px;
}
.multiselect__placeholder {
  margin: 0;
}
.multiselect__input[type='text'],
.multiselect__input[type='text']:focus {
  margin: 0;
  outline: 0;
  padding: 0;
  box-shadow: none;
  border: 0;
}
.multiselect__single {
  margin: 0;
}
</style>

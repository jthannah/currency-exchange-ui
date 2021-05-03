<template>
  <div>
    <CurrencyExchangeForm class="p-5" />

    <div v-if="formSubmitting" class="flex items-center justify-center px-5 pb-4">
      <LoadingIcon class="w-6 h-6" />
      <span class="px-5 text-xl font-medium text-gray-200">Calculating...</span>
    </div>
    <div v-else class="sm:grid-cols-2 grid grid-cols-1 pb-4 gap-5 px-5">
      <SaveRequestForm v-if="conversionResults.length > 0" />
      <ResultItem v-for="result in conversionResults" :key="result.code" :result="result" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, provide, Ref, ref } from 'vue'
import { useMachine } from '@xstate/vue'
import Conversions, { CurrencyConversion, CurrencyConversionRequest } from '../api/conversions'
import { createFormMachine } from '../machines/form-machine'
import ResultItem from '../components/result-item.vue'
import CurrencyExchangeForm from '../components/currency-exchange-form.vue'
import SaveRequestForm from '../components/save-request-form.vue'
import LoadingIcon from '../assets/icons/spinner.svg'

export default defineComponent({
  name: 'Home',
  components: { ResultItem, LoadingIcon, CurrencyExchangeForm, SaveRequestForm },
  setup: () => {
    const conversionResults: Ref<CurrencyConversion[]> = ref([])

    const { state: formState, send: formSend, service: formService } = useMachine(
      createFormMachine<CurrencyConversionRequest>({
        id: 'currency-conversion-form',
        initialFormData: {
          amount: 1,
          baseCurrency: undefined,
          currenciesToConvert: undefined,
        },
      }).withConfig({
        services: {
          submit: (context) => {
            if (
              context.formData === undefined ||
              context.formData.baseCurrency === undefined ||
              context.formData.currenciesToConvert === undefined ||
              context.formData.amount === undefined
            ) {
              return Promise.reject('Request data cannot be undefined!')
            }
            return Conversions.getCurrencyConversions(context.formData).then((response) => {
              conversionResults.value = response
            })
          },
        },
      }),
      { devTools: true }
    )
    provide('currencyConversionFormService', formService)
    provide('currencyConversionFormState', formState)

    const formSubmitting = computed(() => {
      return formState.value.matches('submitting') ?? false
    })

    return {
      formSubmitting,
      conversionResults,
    }
  },
})
</script>

<!-- TODO: override styles to reduce layout shifts -->
<style src="@suadelabs/vue3-multiselect/dist/vue3-multiselect.css"></style>

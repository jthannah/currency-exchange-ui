<template>
  <form class="w-full col-span-2" @submit.prevent="saveRequest">
    <input ref="emailInput" type="email" name="email" required />
    <input type="submit" value="Save!" />
  </form>
</template>

<script lang="ts">
import { defineComponent, inject, ref, Ref } from 'vue'
import Conversions, { CurrencyConversionRequest, SaveCurrencyConversionRequest } from '../api/conversions'
import { State } from 'xstate'
import { createFormMachine, FormContext, FormEvents, FormSchema } from '../machines/form-machine'
import { useMachine } from '@xstate/vue'
import { useToast } from 'vue-toastification'

export default defineComponent({
  name: 'ResultItem',
  setup: () => {
    const toast = useToast()
    const emailInput: Ref<HTMLInputElement | null> = ref(null)

    const currencyConversionFormState = inject('currencyConversionFormState') as Ref<
      State<
        FormContext<CurrencyConversionRequest>,
        FormEvents<CurrencyConversionRequest>,
        FormSchema<CurrencyConversionRequest>
      >
    >

    const { state, send } = useMachine(
      createFormMachine<SaveCurrencyConversionRequest>({
        id: 'save-conversion-request-form',
      }).withConfig({
        services: {
          submit: (context) => {
            if (context.formData === undefined) {
              return Promise.reject('Request data cannot be undefined!')
            }

            return Conversions.saveCurrencyConversions(context.formData).catch((error) => {
              console.error('There was an error saving!', error)
            })
          },
        },
        actions: {
          successCallback: () => {
            toast.success(`Success! Conversion data has been saved.`)
          },
        },
      }),
      { devTools: true }
    )

    const saveRequest = () => {
      if (currencyConversionFormState.value.context.formData && emailInput.value?.value) {
        send({
          type: 'CHANGE',
          formData: {
            email: emailInput.value.value,
            conversionRequest: currencyConversionFormState.value.context.formData,
          },
        })
        send('SUBMIT')
      }
    }

    return { emailInput, saveRequest }
  },
})
</script>

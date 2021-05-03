<template>
  <div
    v-if="modalState.matches('displayed')"
    @click="modalSend('HIDE')"
    class="opacity-90 fixed inset-0 z-10 w-full h-full bg-gray-900"
  ></div>
  <FadeTransition>
    <div
      v-if="modalState.matches('displayed')"
      class="sm:rounded-lg top-1/2 left-1/2 absolute z-20 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow"
      role="dialog"
    >
      <div class="sm:p-6 px-4 py-5">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Save your conversions</h3>
        <div class="max-w-xl mt-2 text-sm text-gray-500">
          <p>Save your conversions and come back to them any time using only an email address!</p>
        </div>
        <form class="sm:flex sm:items-center mt-5" @submit.prevent="saveRequest">
          <div class="sm:max-w-xs w-full">
            <label for="email" class="sr-only">Email</label>
            <input
              v-model="email"
              type="email"
              name="email"
              id="email"
              class="focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="you@example.com"
              required
            />
          </div>
          <button
            type="submit"
            class="hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-4 sm:w-auto sm:text-sm inline-flex items-center justify-center w-full px-4 py-2 mt-3 font-medium text-white bg-indigo-500 border border-transparent rounded-md shadow-sm"
          >
            Save
          </button>
          <button type="button" class="hover:underline ml-6 text-gray-600" @click="modalSend('HIDE')">cancel</button>
        </form>
      </div>
    </div>
  </FadeTransition>

  <div class="flex w-full col-span-2">
    <div class="flex flex-col ml-auto">
      <button
        class="hover:text-blue-300 focus:outline-none flex items-center text-gray-200"
        @click="handleSaveButtonClick"
      >
        <SaveIcon class="w-5 h-5" />
        <span class="pl-2">Save Conversions</span>
      </button>
      <span v-if="email" class="text-sm italic text-gray-200">{{ email }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, Ref } from 'vue'
import Conversions, { CurrencyConversionRequest, SaveCurrencyConversionRequest } from '../api/conversions'
import { State } from 'xstate'
import { createFormMachine, FormContext, FormEvents, FormSchema } from '../machines/form-machine'
import { useMachine } from '@xstate/vue'
import { useToast } from 'vue-toastification'
import SaveIcon from '../assets/icons/save-icon.svg'
import { modalMachine } from '../machines/modal-machine'
import FadeTransition from './fade-transition.vue'

export default defineComponent({
  name: 'ResultItem',
  components: { SaveIcon, FadeTransition },
  setup: () => {
    const toast = useToast()
    const email = ref('')

    const currencyConversionFormState = inject('currencyConversionFormState') as Ref<
      State<
        FormContext<CurrencyConversionRequest>,
        FormEvents<CurrencyConversionRequest>,
        FormSchema<CurrencyConversionRequest>
      >
    >

    const { state: modalState, send: modalSend, service: modalService } = useMachine(modalMachine, { devTools: false })

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
              //console.error('There was an error saving!', error)
              toast.error(`There was a problem saving! Please try again.`)
              modalSend('HIDE')
              return Promise.reject(error)

            })
          },
        },
        actions: {
          successCallback: () => {
            toast.success(`Success! Conversion data has been saved.`)
            modalSend('HIDE')
          },
        },
      }),
      { devTools: true }
    )

    const saveRequest = () => {
      if (currencyConversionFormState.value.context.formData) {
        send({
          type: 'CHANGE',
          formData: {
            email: email.value,
            conversionRequest: currencyConversionFormState.value.context.formData,
          },
        })
        send('SUBMIT')
      }
    }

    const handleSaveButtonClick = () => {
      email.value !== '' ? saveRequest() : modalSend('SHOW')
    }

    return { email, modalState, modalSend, saveRequest, handleSaveButtonClick }
  },
})
</script>

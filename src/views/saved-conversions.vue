<template>
  <div class="p-5">
    <form class="sm:flex sm:items-center pb-10 mt-5" @submit.prevent="getSavedConversions">
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
        Get My Conversions!
      </button>
    </form>

    <div v-if="formSubmitting" class="flex items-center justify-center px-5 pb-4">
      <LoadingIcon class="w-6 h-6" />
      <span class="px-5 text-xl font-medium text-gray-200">Searching...</span>
    </div>
    <div
      v-if="state.matches('success') && savedConversions.length === 0"
      class="w-full px-5 py-4 font-bold text-center text-pink-400"
    >
      Sorry, we couldn't find any saved conversions for this email address.
    </div>
    <div v-else class="sm:grid-cols-2 grid grid-cols-1 gap-5 pb-4">
      <SavedConversionResultItem v-for="result in savedConversions" :key="result" :result="result" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref } from 'vue'
import { useMachine } from '@xstate/vue'
import { createFormMachine } from '../machines/form-machine'
import Conversions, { CurrencyConversionRequest } from '../api/conversions'
import LoadingIcon from '../assets/icons/spinner.svg'
import SavedConversionResultItem from '../components/saved-conversion-result-item.vue'

export default defineComponent({
  name: 'SavedConversions',
  components: { LoadingIcon, SavedConversionResultItem },
  setup: () => {
    const email = ref('')
    const savedConversions: Ref<CurrencyConversionRequest[]> = ref([])

    const { state, send } = useMachine(
      createFormMachine<string>({
        id: 'get-saved-conversions-form',
      }).withConfig({
        services: {
          submit: (context) => {
            if (context.formData === undefined) {
              return Promise.reject('Email cannot be undefined!')
            }

            return Conversions.getSavedCurrencyConversions(context.formData)
              .then((response) => {
                savedConversions.value = response
              })
              .catch((error) => {
                console.error('There was an error saving!', error)
              })
          },
        },
      }),
      { devTools: true }
    )

    const formSubmitting = computed(() => {
      return state.value.matches('submitting') ?? false
    })

    const getSavedConversions = () => {
      send({ type: 'CHANGE', formData: email.value })
      send('SUBMIT')
    }

    return { send, state, email, formSubmitting, savedConversions, getSavedConversions }
  },
})
</script>

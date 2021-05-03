<template>
  <div>
    <div class="border-b border-gray-500">
      <nav class="flex -mb-px" aria-label="Tabs">
        <!-- Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" -->
        <router-link
          :to="{ name: 'Home' }"
          class="hover:text-blue-300 hover:border-blue-300 w-1/2 px-1 py-4 text-sm font-medium text-center text-gray-300 border-b border-transparent"
          :class="isHome ? 'border-blue-500 text-blue-300 font-medium' : ''"
        >
          New Conversion
        </router-link>

        <router-link
          :to="{ name: 'SavedConversions' }"
          class="hover:text-blue-300 hover:border-blue-300 w-1/2 px-1 py-4 text-sm font-medium text-center text-gray-300 border-b border-transparent"
          :class="isSavedConversions ? 'border-blue-500 text-blue-300 font-medium' : ''"
        >
          Saved Conversions
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue'
import {useRoute} from 'vue-router';

export default defineComponent({
  name: 'AppNav',

  setup: () => {
    const route = useRoute()

    const isHome = computed(() => {
      return route.name === 'Home'
    })

     const isSavedConversions = computed(() => {
      return route.name === 'SavedConversions'
    })

    return { isHome, isSavedConversions }
  },
})
</script>

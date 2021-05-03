<template>
  <div class="h-full min-h-screen bg-gray-700">
    <main class="max-w-5xl pb-10 m-auto text-center">
      <h1 class="text-gray-300 text-shadow-lg font-light text-5xl leading-loose">Currency Exchange</h1>
      <div class="p-0 text-left bg-gray-600 rounded-md shadow-md">
        <AppNav />
        <router-view />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppNav from './components/app-nav.vue'

export default defineComponent({
  name: 'App',
  components: { AppNav },
})
</script>

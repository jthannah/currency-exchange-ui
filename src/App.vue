<template>
  <main class="focus:outline-none relative flex flex-1 overflow-y-auto" tabindex="-1">
      <div class="sm:px-2 md:px-4 flex flex-col flex-1 px-1 mx-auto">
        <BreadCrumb />
        <router-view :key="supplierId" />
      </div>
    </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

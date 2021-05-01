<template>
  <div class="h-full min-h-screen bg-gray-700">
  <main class="text-center m-auto max-w-5xl pb-10">
    <h1 class="text-5xl leading-loose text-embossed">Currency Exchange</h1>
    <router-view :key="supplierId" />
  </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>

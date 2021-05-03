<template>
  <transition
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
    mode="out-in"
  >
    <slot></slot>
  </transition>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SlideTransition',
})
</script>

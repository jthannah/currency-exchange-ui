<template>
  <div class="sm:p-6 flex flex-col px-4 py-5 overflow-hidden bg-white rounded-lg shadow">
    <span class="text-sm font-medium text-gray-500 truncate">
      {{ result.amount }} {{ result.baseName }} ({{ result.baseCode }}) =
    </span>
    <span class="mt-1 text-3xl font-semibold text-gray-900">
      {{ result.convertedAmount }} {{ result.name }} ({{ result.code }})
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { CurrencyConversion } from '../api/conversions'

export default defineComponent({
  name: 'ResultItem',
  props: {
    result: {
      type: Object as PropType<CurrencyConversion>,
      required: true,
    },
  },
})
</script>

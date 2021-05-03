<template>
  <div class="sm:p-6 relative z-0 flex flex-col px-4 py-5 overflow-hidden bg-white rounded-lg shadow">
    <div class="text-md font-medium text-gray-500 truncate">
      {{ result.amount }} {{ result.baseName }} ({{ result.baseCode }}) =

      <span class="top-2 right-4 absolute flex flex-col text-xs">
        <span>Exchange Rate:</span> <span>{{ result.rate }}</span>
      </span>
    </div>
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

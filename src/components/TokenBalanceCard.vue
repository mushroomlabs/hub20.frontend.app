<template>
  <card :title="tokenBalance.code">
    <slot>
      {{ tokenBalance.balance | formattedAmount(tokenBalance) }}
    </slot>
  </card>
</template>
<script>
import {filters} from 'hub20-vue-sdk'

export default {
  name: 'token-balance-card',
  filters: {
    formattedAmount: filters.formattedAmount
  },
  props: {
    tokenBalance: {
      type: Object
    }
  }
}
</script>

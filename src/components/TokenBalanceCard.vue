<template>
  <card v-if="token" :title="token.symbol">
    <slot>
      {{ tokenBalance.amount | formattedAmount(token) }}
    </slot>
  </card>
</template>
<script>
import {mixins} from 'hub20-vue-sdk'

export default {
  name: 'token-balance-card',
  mixins: [mixins.TokenMixin],
  props: {
    tokenBalance: {
      type: Object
    }
  },
  computed: {
    token() {
      return this.tokensByUrl[this.tokenBalance.token]
    },
  },
  created() {
    this.fetchTokenByUrl(this.tokenBalance.token)
  }
}
</script>

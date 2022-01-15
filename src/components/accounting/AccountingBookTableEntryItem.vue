<template>
  <tr v-if="chain && token">
    <td :title="token.address">{{ token.symbol }}</td>
    <td>{{ chain.name }}</td>
    <td>{{ entry.total_debit }}</td>
    <td>{{ entry.total_credit }}</td>
    <td>{{ entry.balance }}</td>
  </tr>
</template>
<script>
import {mixins} from 'hub20-vue-sdk'

export default {
  name: 'AccountingBookTableEntryItem',
  mixins: [mixins.TokenMixin],
  props: {
    entry: Object,
  },
  computed: {
    token() {
      return this.tokensByUrl[this.entry.token]
    },
    chain() {
      return this.getChain(this.token)
    },
  },
  created() {
    this.fetchToken(this.entry.token)
  },
}
</script>

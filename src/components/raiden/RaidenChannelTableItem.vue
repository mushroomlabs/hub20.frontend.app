<template>
  <tr>
    <td class="identifier">{{ channel.identifier }}</td>
    <td class="network">{{ channel.token.chain_id }}</td>
    <td class="balance">{{ channel.balance | formattedAmount(channel.token) }}</td>
  </tr>
</template>
<script>
import hub20 from 'hub20-vue-sdk'
export default {
  filters: {
    formattedAmount: hub20.filters.formattedAmount
  },
  props: {
    channel: {
      type: Object
    }
  }
}
</script>

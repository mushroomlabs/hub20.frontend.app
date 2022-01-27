<template>
  <tr>
    <td class="token-data">
      <TokenLogo :token="token" />
      <span class="token-name">{{ token.name }}</span>
      <span class="token-symbol">{{ token.symbol }}</span>
    </td>
    <td class="chain-data">
      <span class="chain-name">{{ chainName }}</span>
    </td>
    <slot> </slot>
  </tr>
</template>
<script>
import hub20 from 'hub20-vue-sdk'

export default {
  name: 'TokenTableItem',
  mixins: [hub20.mixins.TokenMixin],
  components: {
    TokenLogo: hub20.components.TokenLogo
  },
  props: {
    token: Object,
  },
  computed: {
    chain() {
      return this.getChain(this.token)
    },
    chainName() {
      return this.chain.name
    },
  },
}
</script>

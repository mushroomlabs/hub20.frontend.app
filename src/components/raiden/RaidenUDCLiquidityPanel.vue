<template>
  <dl v-if="chain && raiden && nativeToken" class="udc-liquidity-info">
    <TokenLogo :token="serviceToken" />
    <dt>Raiden Address</dt>
    <dd>{{ raiden.address }}</dd>
    <dt>On-chain ({{ chain.name }}) balances</dt>
    <dd>
      <span class="onchain-balance">
        {{ nativeTokenBalance | formattedAmount(nativeToken, 6) }}
      </span>
      <span class="onchain-balance">
        {{ onChainBalance | formattedAmount(serviceToken, 6) }}
      </span>
    </dd>
  </dl>
</template>
<script>
import {mapGetters} from 'vuex'

import hub20 from 'hub20-vue-sdk'

export default {
  mixins: [hub20.mixins.TokenMixin, hub20.mixins.RaidenMixin],
  components: {
    TokenLogo: hub20.components.TokenLogo,
  },
  computed: {
    ...mapGetters('audit', ['onChainTokenBalance']),
    onChainBalance() {
      return this.onChainTokenBalance(this.raiden.address, this.serviceToken) || 0
    },
    nativeTokenBalance() {
      return this.onChainTokenBalance(this.raiden.address, this.nativeToken) || 0
    },
  },
  created() {
    this.fetchRaidenStatus(this.raiden.id)
  },
}
</script>

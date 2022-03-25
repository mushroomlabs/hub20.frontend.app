<template>
  <dl v-if="chain && raiden && channel && nativeToken" class="channel-liquidity-info">
    <TokenLogo :token="token" />
    <dt>Raiden Address</dt>
    <dd>{{ raiden.address }}</dd>
    <dt>Channel Balance</dt>
    <dd>{{ channel.balance | formattedAmount(token, 6) }}</dd>
    <dt>On-chain ({{ chain.name }}) balances</dt>
    <dd>
      <span class="onchain-balance">{{
        nativeTokenBalance | formattedAmount(nativeToken, 6)
      }}</span>
      <span class="onchain-balance">{{ onChainBalance | formattedAmount(token, 6) }}</span>
    </dd>
  </dl>
</template>
<script>
import {mapGetters} from 'vuex'

import hub20 from 'hub20-vue-sdk'

export default {
  mixins: [hub20.mixins.TokenMixin, hub20.mixins.RaidenMixin],
  components: {
    TokenLogo: hub20.components.TokenLogo
  },
  props: {
    channel: Object,
    token: Object
  },
  computed: {
    ...mapGetters('audit', ['onChainTokenBalance']),
    tokenUrl() {
      return this.channel && this.channel.token
    },
    onChainBalance() {
      return this.onChainTokenBalance(this.raiden.address, this.token) || 0
    },
    chain() {
      return this.token && this.getChain(this.token)
    },
    chainName() {
      return this.chain && this.chain.name
    },
    nativeToken() {
      return this.getNativeToken(this.token)
    },
    nativeTokenBalance() {
      return this.onChainTokenBalance(this.raiden.address, this.nativeToken) || 0
    }
  },
  created() {
    this.fetchRaidenStatus(this.raiden.id)
  }
}
</script>

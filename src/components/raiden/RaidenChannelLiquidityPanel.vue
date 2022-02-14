<template>
  <dl v-if="chain && token && raiden" class="channel-liquidity-info">
    <TokenLogo :token="token" />
    <dt>Token Network</dt>
    <dd>
      {{ token.symbol }} ({{ token.address }}) (Balance: {{ tokenBalance }})
    </dd>
    <dt>Base Blockchain</dt>
    <dd>{{ chain.name }} (Balance: {{ nativeTokenBalance | formattedAmount(nativeToken, 6) }})</dd>
    <dt>Raiden Address</dt>
    <dd>{{ raiden.address }}</dd>
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
  },
  computed: {
    ...mapGetters('audit', ['walletBalances']),
    token() {
      return this.channel && this.channel.token
    },
    tokenBalance() {
      return this.walletBalances(this.raiden.address, this.token) || 0
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
      return this.walletBalances(this.raiden.address, this.token) || 0
    }
  },
  created() {
    this.fetchRaidenStatus(this.raiden.id)
  }
}
</script>

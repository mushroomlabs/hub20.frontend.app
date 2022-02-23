<template>
<card v-if="token" :title="cardTitle" :subTitle="cardSubTitle">
  <template v-slot:image>
    <TokenLogo :token="token" :defaultUrl="defaultLogoUrl" />
  </template>
  <dl>
    <dt>Node</dt>
    <dd>{{ raiden.hostname }} ({{ raiden.address | shortAddress }})</dd>
    <dt>Token Network</dt>
    <dd>{{ token.name }} ({{ token.symbol }})</dd>
    <dt>Partner Address</dt>
    <dd>{{ channel.partner_address }}</dd>
    <dt>Current Balance</dt>
    <dd>{{ channel.balance | formattedAmount(token) }}</dd>
  </dl>

  <template v-slot:footer>
    <router-link :to="{name: 'raiden-channel-deposit', params: {raiden: raiden.id, channel: channel.id}}">Deposit</router-link>
    <router-link :to="{name: 'raiden-channel-withdraw', params: {raiden: raiden.id, channel: channel.id}}">Withdraw</router-link>
  </template>
  </card>
</template>
<script>
import hub20 from 'hub20-vue-sdk'

import DefaultLogoUrl from '@/assets/img/logos/ethereum.svg'


export default {
  name: 'RaidenChannelCard',
  mixins: [hub20.mixins.TokenMixin],
  components: {
    TokenLogo: hub20.components.TokenLogo
  },
  filters: hub20.filters,
  props: {
    raiden: {
      type: Object
    },
    channel: {
      type: Object
    }
  },
  computed: {
    token() {
      return this.tokensByUrl[this.channel.token]
    },
    cardTitle() {
      return `Channel #${this.channel.identifier}`
    },
    chainName() {
      const chainData = this.getChain(this.token)
      return chainData && chainData.name
    },
    cardSubTitle() {
      return this.chainName
    },
    defaultLogoUrl() {
      return DefaultLogoUrl
    }
  },
  created() {
    this.fetchTokenByUrl(this.channel.token)
  }
}
</script>

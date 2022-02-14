<template>
<card :title="cardTitle" :subTitle="cardSubTitle">
  <template v-slot:image>
    <TokenLogo :token="token" :defaultUrl="defaultLogoUrl" />
  </template>
  Current Balance: {{ channel.balance | formattedAmount(token) }}
  <template v-slot:footer>
    <router-link :to="{name: 'raiden-channel-deposit', params: {raiden: raiden.id, channel: channel.identifier}}">Deposit</router-link>
    <router-link :to="{name: 'raiden-channel-withdraw', params: {raiden: raiden.id, channel: channel.identifier}}">Withdraw</router-link>
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
  filters: {
    formattedAmount: hub20.filters.formattedAmount
  },
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
      return this.channel.token
    },
    cardTitle() {
      return `Channel #${this.channel.identifier}`
    },
    cardSubTitle() {
      const chainData = this.getChain(this.token)
      return chainData && chainData.name
    },
    defaultLogoUrl() {
      return DefaultLogoUrl
    }
  }
}
</script>

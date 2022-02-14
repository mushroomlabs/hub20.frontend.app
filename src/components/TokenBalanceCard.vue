<template>
  <card v-if="token" :title="token.name" :subTitle="chainName">
    <template v-slot:image>
      <TokenLogo :token="token" :defaultUrl="defaultLogoUrl" />
    </template>
    {{ balance | formattedAmount(token) }}
  </card>
</template>
<script>
import {mapGetters} from 'vuex'
import {mixins, components} from 'hub20-vue-sdk'

import DefaultLogoUrl from '@/assets/img/logos/ethereum.svg'

export default {
  name: 'token-balance-card',
  mixins: [mixins.TokenMixin],
  components: {
    TokenLogo: components.TokenLogo
  },
  props: {
    token: {
      type: Object
    }
  },
  computed: {
    ...mapGetters('account', ['tokenBalance']),
    balance() {
      return this.tokenBalance(this.token)
    },
    defaultLogoUrl() {
      return DefaultLogoUrl
    },
    chainName() {
      const chain = this.getChain(this.token)
      return chain && chain.name
    }
  },
  beforeMount() {
    this.fetchToken(this.token)
  }
}
</script>

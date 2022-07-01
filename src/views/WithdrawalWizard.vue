<template>
<card :title="cardTitle">
  <WithdrawalForm v-if="token && networks.length > 0" :token="token" />
</card>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'

import WithdrawalForm from '../components/funding/WithdrawalForm'

export default {
  name: 'WithdrawalWizard',
  components: {
    WithdrawalForm
  },
  computed: {
    ...mapGetters('tokens', ['tokensById']),
    ...mapGetters('network', ['networks']),
    cardTitle() {
      return this.token && `Withdraw ${this.token.symbol}`
    },
    tokenId() {
      return this.$route.params.tokenId
    },
    token() {
      return this.tokensById[this.tokenId]
    }
  },
  methods: {
    ...mapActions('tokens', ['fetchTokenById'])
  },
  beforeMount() {
    this.fetchTokenById(this.tokenId)
  }
}
</script>

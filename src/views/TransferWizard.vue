<template>
<card :title="cardTitle">
    <InternalTransferForm v-if="token && networks.length > 0" :token="token" />
  </card>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'

import InternalTransferForm from '../components/funding/InternalTransferForm'

export default {
  name: 'TransferWizard',
  components: {
    InternalTransferForm
  },
  computed: {
    ...mapGetters('tokens', ['tokensById']),
    ...mapGetters('network', ['networks']),
    cardTitle() {
      return this.token && `Transfer ${this.token.symbol}`
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

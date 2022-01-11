<template>
  <card :title="tokenBalance.symbol">
    <slot>
      {{ tokenBalance.balance | formattedAmount(tokenBalance) }}
    </slot>
  </card>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import {filters} from 'hub20-vue-sdk'

export default {
  name: 'token-balance-card',
  filters: {
    formattedAmount: filters.formattedAmount
  },
  props: {
    tokenBalance: {
      type: Object
    }
  },
  computed: {
    ...mapGetters('tokens', ['tokensByAddress']),
    token() {
      return this.tokensByAddress(this.tokenBalance.address)
    },
  },
  methods: {
    ...mapActions('tokens', ['fetchToken']),
  },
  mounted() {
    this.fetchToken({tokenAddress: this.tokenBalance.address, chainId: this.tokenBalance.network_id})
  }
}
</script>

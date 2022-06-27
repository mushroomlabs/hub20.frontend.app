<template>
<card :title="cardTitle">
  <div v-if="!hasOpenRoute">
    <button v-for="network in depositNetworks" :key="network.id" @click="makeRoute(network)">
      Deposit via {{network.name}}
    </button>
  </div>
  <PaymentRequest v-if="deposit" :paymentRequest="deposit" />
</card>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import hub20 from 'hub20-vue-sdk'

export default {
  name: 'Deposit',
  mixins: [hub20.mixins.TokenMixin],
  components: {
    PaymentRequest: hub20.components.Payment.Invoice
  },
  data() {
    return {
      deposit: null
    }
  },
  computed: {
    ...mapGetters('funding', ['depositsById']),
    ...mapGetters('network', ['networksByUrl']),
    cardTitle() {
      return this.token && `Deposit ${this.token.symbol}`
    },
    networks() {
      const networkUrls = this.usableNetworksForToken(this.token)
      return networkUrls && networkUrls.map(url => this.networksByUrl[url])
    },
    depositNetworks() {
      return this.networks && this.networks.filter(network => network.type !== "internal")
    },
    depositId() {
      return this.$route.params.depositId
    },
    routes() {
      return this.deposit && this.deposit.routes
    },
    openRoutes() {
      return this.routes && this.routes.filter(route => route.is_open)
    },
    token() {
      return this.deposit && this.deposit.token && this.tokensByUrl[this.deposit.token]
    },
    hasOpenRoute() {
      return this.openRoutes && this.openRoutes.length > 0
    }
  },
  methods: {
    ...mapActions('network', ['fetchNetworks']),
    ...mapActions('funding', ['createDepositRoute', 'fetchDeposit']),
    makeRoute(network) {
      this.createDepositRoute({deposit: this.deposit, network})
        .then(() => this.fetchDeposit(this.depositId))
        .then(deposit => this.deposit = deposit)
    },
  },
  async created() {
    await this.fetchNetworks()
    this.deposit = await this.fetchDeposit(this.depositId)
    const token = await this.fetchTokenByUrl(this.deposit.token)
    await this.fetchTokenNetworks(token)

  }
}
</script>

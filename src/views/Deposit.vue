<template>
<card :title="cardTitle" v-if="token && deposit">
  <section v-if="payments.length">
    <h5>Received Payments</h5>
    <PaymentList :payments="payments" />
  </section>

  <section>
    <PaymentRoute
      v-for="route in openRoutes"
      :route="route"
      :token="token"
      :key="route.id"
      />
  </section>
  <section class="route-selector" v-if="!hasOpenRoute">
    <p>
        Select one of the payment networks below to make a new payment:
    </p>
    <div class="routing-options">
      <button v-for="network in depositNetworks" :key="network.id"  @click="makeRoute(network)">{{network.name}}</button>
    </div>
  </section>
</card>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import hub20 from 'hub20-vue-sdk'

export default {
  name: 'Deposit',
  mixins: [hub20.mixins.TokenMixin],
  components: {
    PaymentRoute: hub20.components.Payment.PaymentRoute,
    PaymentList: hub20.components.Payment.PaymentList
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
    deposit() {
      return this.depositsById[this.depositId]
    },
    payments() {
      return this.deposit && this.deposit.payments
    },
    routes() {
      return this.deposit && this.deposit.routes
    },
    openRoutes() {
      return this.routes.filter(route => route.is_open && !route.is_used && !route.is_expired)
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
    },
  },
  async created() {
    await this.fetchNetworks()
    await this.fetchDeposit(this.depositId)
    const token = await this.fetchTokenByUrl(this.deposit.token)
    await this.fetchTokenNetworks(token)
  }
}
</script>

<template>
<card :title="cardTitle">
  <PaymentRoute
    v-for="route in openRoutes"
    :route="route"
    :token="token"
    :key="route.id"
    />
  <div v-if="!hasOpenRoute">
    <button v-for="network in depositNetworks" :key="network.id" @click="makeRoute(network)">
      Deposit via {{network.name}}
    </button>
  </div>
</card>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import hub20 from 'hub20-vue-sdk'

export default {
  name: 'Deposit',
  mixins: [hub20.mixins.TokenMixin],
  components: {
    PaymentRoute: hub20.components.Payment.PaymentRoute
  },
  data() {
    return {
      deposit: null,
      routes: [],
      payments: []
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
    openRoutes() {
      return this.routes.filter(route => route.is_open)
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
        .then((route) => this.routes.push(route))
        .catch(error => console.error(error))
    },
  },
  async created() {
    await this.fetchNetworks()
    this.deposit = await this.fetchDeposit(this.depositId)
    const token = await this.fetchTokenByUrl(this.deposit.token)
    await this.fetchTokenNetworks(token)

    this.deposit.routes.forEach(route => this.routes.push(route))
    this.deposit.payments.forEach(payment => this.payments.push(payment))
  }
}
</script>

<template>
<card :title="cardTitle">
  <dl v-if="transfer && token && networkName">
    <dt>Network</dt>
    <dd name="network">{{ networkName }}</dd>
    <dt>Amount</dt>
    <dd name="amount">{{ transfer.amount | formattedAmount(token) }}</dd>
    <dt>Status</dt>
    <dd name="status">{{ transfer.status }}</dd>
    <dt>Requested on</dt>
    <dd name="created">{{ new Date(transfer.created).toLocaleString() }}</dd>
    <dt>Scheduled Date</dt>
    <dd name="executed">{{ new Date(transfer.execute_on).toLocaleString() }}</dd>
  </dl>
</card>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'

import hub20 from 'hub20-vue-sdk'

export default {
  mixins: [hub20.mixins.TokenMixin, hub20.mixins.PaymentNetworkMixin],
  data() {
    return {
      pollingTimer: null
    }
  },
  computed: {
    ...mapGetters('funding', ['transfersById']),
    cardTitle() {
      return `Transfer ${this.transferId}`
    },
    transferId() {
      return this.$route.params.transferId
    },
    transfer() {
      return this.transfersById[this.transferId]
    },
    token() {
      return this.transfer && this.tokensByUrl[this.transfer.token]
    },
    network() {
      return this.transfer && this.networksByUrl[this.transfer.network]
    },
    networkName() {
      return this.network && this.network.name
    },
    isFinalized() {
      const FINALIZED_STATUSES = [
        'processed', 'confirmed', 'failed', 'canceled'
      ]
      return this.transfer && FINALIZED_STATUSES.includes(this.transfer.status)
    }
  },
  methods: {
    ...mapActions('funding', ['fetchTransfer']),
    refresh() {
      if (this.transfer && !this.isFinalized) {
        this.fetchTransfer(this.transferId)
      }

      if (this.isFinalized) {
        this.stopPolling()
      }
    },
    startPolling() {
      console.log('setting polling timer')
      this.pollingTimer = setInterval(this.refresh, 15 * 1000)
    },
    stopPolling() {
      console.log('stopping polling timer')
      if (this.pollingTimer) {
        clearInterval(this.pollingTimer)
        this.pollingTimer = null
      }
    }
  },
  created() {
    if (!this.networks) {
      this.fetchNetworks()
    }
    this.fetchTransfer(this.transferId).then(transferData => {
      this.fetchTokenByUrl(transferData.token)
    })
    .catch(error => console.log(error))

    this.startPolling()
  },
  beforeDestroy() {
    this.stopPolling()
  }

}
</script>

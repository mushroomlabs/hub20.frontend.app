<template>
  <div>
    <card title="Your Funds" subTitle="Tokens listed and managed by your account">
      <ChainDisconnectionWarning v-for="chain in blockchains" :chainId="chain.chain_id" :key="chain.chain_id">
        Server reported that can not connect with {{ chain.name }} at the moment, so all funding
        operations are disabled.
      </ChainDisconnectionWarning>

      <FundingTable />
    </card>
  </div>
</template>
<script>
import {mapActions, mapGetters, mapState} from 'vuex'

import ChainDisconnectionWarning from '@/components/chain/ChainDisconnectionWarning'
import FundingTable from '@/components/funding/FundingTable'

export default {
  components: {
    FundingTable,
    ChainDisconnectionWarning
  },
  data() {
    return {
      networkStateTracker: null
    }
  },
  computed: {
    ...mapState('network', ['availableNetworks', 'networkMap']),
    ...mapGetters('network', ['blockchains'])
  },
  methods: {
    ...mapActions('network', ['fetchNetworkState']),
    clearTimer() {
      if (this.networkStateTracker) {
        clearInterval(this.networkStateTracker)
      }
    },
    refreshNetworkState() {
      this.availableNetworks.forEach(network => this.fetchNetworkState(network.id))
    }
  },
  mounted() {
    this.clearTimer()
    this.networkStateTracker = setInterval(this.refreshNetworkState, 180 * 1000)
  },
  beforeDestroy() {
    this.clearTimer()
  }
}
</script>

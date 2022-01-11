<template>
  <div>
    <card title="Your Funds" subTitle="Tokens listed and managed by your account">
      <ChainDisconnectionWarning v-for="chain in blockchains" :chainId="chain.id" :key="chain.id">
        Server reported that can not connect with {{chain.name}} at the moment, so all funding
        operations are disabled.
      </ChainDisconnectionWarning>

      <FundingTable />
    </card>
  </div>
</template>
<script>
import {mapState} from 'vuex'

import ChainDisconnectionWarning from '@/components/chain/ChainDisconnectionWarning'
import FundingTable from '@/components/funding/FundingTable'

export default {
  components: {
   FundingTable,
    ChainDisconnectionWarning
  },
  computed: {
    ...mapState('network', ['blockchains']),
  }
}
</script>

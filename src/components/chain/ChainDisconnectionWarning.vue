<template>
  <div v-if="!connected" class="alert alert-warning">
    <slot> Server has disconnected from {{ chainName }} </slot>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
  props: {
    chainId: Number
  },
  computed: {
    chain() {
      return this.getChainData(this.chainId)
    },
    chainState() {
      return this.getChainState(this.chainId)
    },
    chainName() {
      return this.chain.name
    },
    connected() {
      return this.chainState && this.chainState.online && this.chainState.synced
    },
    ...mapGetters('network', ['getChainData', 'getChainState'])
  }
}
</script>

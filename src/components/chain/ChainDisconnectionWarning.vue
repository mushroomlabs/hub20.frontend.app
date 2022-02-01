<template>
  <div v-if="!connected" class="alert alert-warning">
    <slot> Server has disconnected from {{ chainName }} </slot>
  </div>
</template>
<script>
import {mapGetters, mapState} from 'vuex'

export default {
  props: {
    chainId: Number
  },
  computed: {
    chain() {
      return this.chainData(this.chainId)
    },
    chainName() {
      return this.chain.name
    },
    connected() {
      return this.IsNodeOnline(this.chainId)
    },
    ...mapState('network', ['blockchains']),
    ...mapGetters('network', ['chainData', 'IsNodeOnline'])
  }
}
</script>

<template>
<card v-if="hasAdminAccess && chain" class="raiden-management" :title="cardTitle">
  <RaidenUDCLiquidityPanel v-if="raiden" :raiden="raiden" />
  <RaidenUDCDepositForm v-if="raiden" :raiden="raiden"/>
  <router-link :to="{name: 'raiden'}">Back</router-link>
</card>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'

import RaidenUDCDepositForm from '@/components/raiden/RaidenUDCDepositForm'
import RaidenUDCLiquidityPanel from '@/components/raiden/RaidenUDCLiquidityPanel'



export default {
  components: {
    RaidenUDCDepositForm,
    RaidenUDCLiquidityPanel
  },
  computed: {
    ...mapGetters('account', ['hasAdminAccess']),
    ...mapGetters('raiden', ['raidenNodesById']),
    ...mapGetters('network', ['chainsByUrl']),
    cardTitle() {
      return this.raiden && `Deposit into UDC to pay for Raiden Services`
    },
    raidenId() {
      return this.$route.params.raiden
    },
    raiden() {
      return this.raidenId && this.raidenNodesById && this.raidenNodesById[this.raidenId]
    },
    chain() {
      return this.raiden && this.chainsByUrl[this.raiden.chain]
    }
  },
  methods: {
    ...mapActions('raiden', ['fetchNode']),
    ...mapActions('network', ['getBlockchains']),
  },
  created() {
    this.fetchNode(this.raidenId)
  }
}
</script>

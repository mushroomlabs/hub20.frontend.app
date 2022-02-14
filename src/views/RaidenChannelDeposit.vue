<template>
<card v-if="hasAdminAccess" class="raiden-channel-management" :title="cardTitle">
  <RaidenChannelLiquidityPanel v-if="channel && raiden" :channel="channel" :raiden="raiden" />
  <RaidenChannelDepositForm v-if="channel && raiden" :channel="channel" :raiden="raiden" />
  <router-link :to="{name: 'raiden'}">Back</router-link>
</card>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'

import RaidenChannelDepositForm from '@/components/raiden/RaidenChannelDepositForm'
import RaidenChannelLiquidityPanel from '@/components/raiden/RaidenChannelLiquidityPanel'

export default {
  name: 'RaidenChannelDeposit',
  components: {
    RaidenChannelDepositForm,
    RaidenChannelLiquidityPanel
  },
  computed: {
    ...mapGetters('account', ['hasAdminAccess']),
    ...mapGetters('raiden', ['raidenNodesById']),
    cardTitle() {
      return this.token && `Add Liquidity to ${this.token.name} (${this.token.symbol}) channel`
    },
    raidenId() {
      return this.$route.params.raiden
    },
    channelId() {
      return this.$route.params.channel
    },
    raiden() {
      return this.raidenId && this.raidenNodesById && this.raidenNodesById[this.raidenId]
    },
    channel() {
      if (!this.raiden || !this.channelId) {
        return
      }

      return this.raiden.channels.filter(channel => channel.identifier == this.channelId).pop()
    },
    token() {
      return this.channel && this.channel.token
    }
  },
  methods: {
    ...mapActions('raiden', ['fetchNode'])
  },
  created() {
    this.fetchNode(this.raidenId)
  }
}
</script>

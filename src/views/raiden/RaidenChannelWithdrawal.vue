<template>
  <card v-if="hasAdminAccess" class="raiden-management" :title="cardTitle">
    <RaidenChannelLiquidityPanel
      v-if="channel && raiden && token"
      :channel="channel"
      :raiden="raiden"
      :token="token"
    />
    <RaidenChannelWithdrawalForm
      v-if="channel && raiden && token"
      :channel="channel"
      :raiden="raiden"
      :token="token"
    />
    <router-link :to="{name: 'raiden'}">Back</router-link>
  </card>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'

import RaidenChannelWithdrawalForm from '@/components/raiden/RaidenChannelWithdrawalForm'
import RaidenChannelLiquidityPanel from '@/components/raiden/RaidenChannelLiquidityPanel'

export default {
  name: 'RaidenChannelWithdrawal',
  components: {
    RaidenChannelWithdrawalForm,
    RaidenChannelLiquidityPanel
  },
  computed: {
    ...mapGetters('account', ['hasAdminAccess']),
    ...mapGetters('raiden', ['raidenNodesById']),
    ...mapGetters('tokens', ['tokensByUrl']),
    cardTitle() {
      return (
        this.token && `Remove Liquidity from ${this.token.name} (${this.token.symbol}) channel`
      )
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

      return this.raiden.channels.filter(channel => channel.id == this.channelId).pop()
    },
    token() {
      return this.tokensByUrl[this.tokenUrl]
    },
    tokenUrl() {
      return this.channel && this.channel.token
    }
  },
  methods: {
    ...mapActions('raiden', ['fetchNode']),
    ...mapActions('tokens', ['fetchTokenByUrl'])
  },
  created() {
    this.fetchNode(this.raidenId).then(() => this.fetchTokenByUrl(this.tokenUrl))
  }
}
</script>

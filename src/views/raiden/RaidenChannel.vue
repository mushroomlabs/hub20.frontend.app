<template>
  <div v-if="raiden && channel && hasAdminAccess" class="raiden-management">
    <RaidenChannelCard :raiden="raiden" :channel="channel" />
  </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'

import RaidenChannelCard from '@/components/raiden/RaidenChannelCard'

export default {
  components: {
    RaidenChannelCard
  },
  computed: {
    ...mapGetters('account', ['hasAdminAccess']),
    ...mapGetters('raiden', ['raidenNodesById']),
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

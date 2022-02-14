<template>
<div v-if="hasAdminAccess" class="raiden-node">
  <h3>{{ title }}</h3>
  <ul class="raiden-channels">
    <li>
      <RaidenChannelCard v-for="channel in raiden.channels" :raiden="raiden" :channel="channel" :key="channel.identifier" />
    </li>
  </ul>
</div>
</template>
<script>
import {mapGetters} from 'vuex'

import RaidenChannelCard from '@/components/raiden/RaidenChannelCard'

export default {
  name: 'raiden-node-detail',
  components: {
    RaidenChannelCard
  },
  props: {
    raiden: {
      type: Object
    }
  },
  computed: {
    ...mapGetters('account', ['hasAdminAccess']),
    title() {
      return `Node ${this.raiden.address}`
    }
  }
}
</script>

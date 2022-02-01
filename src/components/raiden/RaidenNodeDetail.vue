<template>
  <card v-if="hasAdminAccess" class="raiden-node" :title="title">
    <RaidenChannelTable :raiden="raiden" />
  </card>
</template>
<script>
import {mapGetters} from 'vuex'

import RaidenChannelTable from '@/components/raiden/RaidenChannelTable'

export default {
  name: 'raiden-node-detail',
  components: {
    RaidenChannelTable
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

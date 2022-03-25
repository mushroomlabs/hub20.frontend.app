<template>
  <table class="table raiden-nodes">
    <thead>
      <th>Host</th>
      <th>Address</th>
      <th>User Deposit Contract Balance</th>
      <th>Active Channels</th>
    </thead>
    <tbody>
      <RaidenNodeTableItem v-for="raiden in raidenNodes" :key="raiden.id" :raiden="raiden" />
    </tbody>
  </table>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'

import RaidenNodeTableItem from './RaidenNodeTableItem'

export default {
  name: 'raiden-node-table',
  components: {
    RaidenNodeTableItem
  },
  computed: {
    ...mapGetters('raiden', ['raidenNodes'])
  },
  methods: {
    ...mapActions('raiden', ['fetchNodeList'])
  },
  created() {
    if (this.raidenNodes.length == 0) {
      this.fetchNodeList()
    }
  }
}
</script>

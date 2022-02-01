<template>
  <div v-if="hasAdminAccess" class="raiden-management">
    <RaidenNodeDetail v-for="raiden in raidenNodes" :raiden="raiden" :key="raiden.address" />
  </div>
</template>
<script>
import {mapActions, mapGetters, mapState} from 'vuex'

import RaidenNodeDetail from '@/components/raiden/RaidenNodeDetail'

export default {
  name: 'raiden',
  components: {
    RaidenNodeDetail
  },
  computed: {
    ...mapGetters('account', ['hasAdminAccess']),
    ...mapState('raiden', ['raidenNodes'])
  },
  methods: {
    ...mapActions('raiden', ['fetch'])
  },
  mounted() {
    this.fetch()
  }
}
</script>

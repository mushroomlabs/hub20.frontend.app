<template>
<card v-if="hasAdminAccess"
      class="raiden-management"
      title="Raiden Nodes"
      subTitle="Manage your Raiden Nodes and Channel Liquidity"
      >
  <RaidenNodeTable/>
</card>
</template>
<script>
import {mapGetters} from 'vuex'

import RaidenNodeTable from '@/components/raiden/RaidenNodeTable'


export default {
  components: {
    RaidenNodeTable
  },
  computed: {
    ...mapGetters('account', ['hasAdminAccess']),
  }
}
</script>

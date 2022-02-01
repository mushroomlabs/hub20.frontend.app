<template>
  <StoreEditor :storeId="storeId" />
</template>
<script>
import {mapActions} from 'vuex'

import StoreEditor from '@/components/stores/StoreEditor'

export default {
  name: 'StoreDetail',
  components: {
    StoreEditor
  },
  computed: {
    storeId() {
      return this.$route.params.id
    }
  },
  methods: {
    ...mapActions('tokens', ['fetchUserTokenLists'])
  },
  beforeMount() {
    this.fetchUserTokenLists()
  }
}
</script>

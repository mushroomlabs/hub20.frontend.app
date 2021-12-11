<template>
<card v-if="hasAdminAccess" title="Raiden Management">

</card>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
  name: 'raiden',
  components: {
  },
  computed: {
    ...mapGetters('account', ['hasAdminAccess'])

  }
}
</script>

<template>
  <TokenListEditor :tokenListId="tokenListId" />
</template>
<script>
import {mapActions} from 'vuex'

import TokenListEditor from '@/components/tokens/TokenListEditor'

export default {
  name: 'TokenListDetail',
  components: {
    TokenListEditor
  },
  computed: {
    tokenListId() {
      return this.$route.params.id
    }
  },
  methods: {
    ...mapActions('tokens', ['fetchUserTokens'])
  },
  async beforeMount() {
    await this.fetchUserTokens()
  }
}
</script>

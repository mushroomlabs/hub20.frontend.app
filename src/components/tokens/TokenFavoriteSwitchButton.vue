<template>
  <input
    name="token-watchlist"
    type="checkbox"
    v-model="selected"
    :checked="{selected}"
    :disabled="isTokenNative(token)"
  />
</template>
<script>
import {mixins} from 'hub20-vue-sdk'

export default {
  name: 'TokenFavoriteSwitchButton',
  mixins: [mixins.UserTokenMixin, mixins.TokenMixin],
  props: {
    token: Object
  },
  computed: {
    selected: {
      get() {
        return this.isUserToken(this.token)
      },
      set(value) {
        const action = value ? this.trackToken : this.untrackToken
        action(this.token)
      }
    }
  }
}
</script>

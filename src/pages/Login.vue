<template>
  <div class="login-screen">
    <LoginForm v-if="!isAuthenticated" />
    <Spinner v-if="authenticating && !isAuthenticated" message="Authenticating..." />
  </div>
</template>

<script>
import {mapState} from 'vuex'
import hub20 from 'hub20-vue-sdk'

import LoginForm from '@/components/LoginForm'
import Spinner from '@/components/Spinner'

export default {
  name: 'login',
  components: {
    LoginForm,
    Spinner
  },
  data() {
    return {
      unsubscribe: null
    }
  },
  computed: {
    ...mapState('auth', ['authenticating', 'isAuthenticated'])
  },
  mounted() {
    this.unsubscribe = this.$store.subscribe(mutation => {
      switch (mutation.type) {
        case `auth/${hub20.types.LOGIN_SUCCESS}`:
          this.$router.push('/')
          break
      }
    })
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }
}
</script>

<template>
  <card class="login-form" title="Sign in" :class="{submitted: authenticating}">
    <slot>
      <ServerIndicator>
        Sign-in to your account on
      </ServerIndicator>
      <form @submit.prevent="login(username, password)" :class="{error: hasErrors}">
        <span class="error-message" v-if="hasErrors">{{ errorMessage }}</span>
        <fg-input
          v-model="username"
          id="username"
          placeholder="Username"
          autocomplete="username"
          :disabled="authenticating"
          required
        />
        <fg-input
          v-model="password"
          id="password"
          type="password"
          placeholder="Password"
          autocomplete="current-password"
          :disabled="authenticating"
          required
        />
        <input type="submit" hidden />
      </form>
    </slot>
    <slot name="footer">
      <action-panel>
        <template v-slot:secondary>
          <router-link to="register">Not registered?</router-link>
        </template>
        <p-button type="submit" @click.native="login(username, password)">Login</p-button>
      </action-panel>
    </slot>
  </card>
</template>

<script>
import {mapState, mapGetters} from 'vuex'

import ServerIndicator from '@/components/ServerIndicator'

export default {
  name: 'login-form',
  components: {
    ServerIndicator
  },
  data() {
    return {
      username: '',
      password: ''
    }
  },
  computed: {
    ...mapState('auth', ['authenticating']),
    ...mapGetters('auth', ['submissionErrors', 'errorMessage']),
    hasErrors() {
      return this.submissionErrors.length > 0
    }
  },
  methods: {
    login(username, password) {
      this.$store.dispatch('auth/login', {username, password}).catch(err => console.error(err))
    }
  }
}
</script>

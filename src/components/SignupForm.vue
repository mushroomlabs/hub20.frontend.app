<template>
  <card
    class="registration-form"
    title="Create Account"
    :class="{submitted: registrationLoading || registrationCompleted}"
  >
    <slot>
      <ServerIndicator>
        Register to an account on
      </ServerIndicator>

      <div v-if="registrationLoading">
        loading...
      </div>
      <form v-if="!registrationLoading && !registrationCompleted" @submit.prevent="signUp(inputs)">
        <fg-input
          v-model="inputs.username"
          type="text"
          id="username"
          placeholder="username"
          autocomplete="username"
          :errorMessage="registrationFieldError('username')"
          required
        />
        <fg-input
          v-model="inputs.password1"
          type="password"
          id="password1"
          placeholder="password"
          autocomplete="new-password"
          :errorMessage="registrationFieldError('password1')"
          required
        />
        <fg-input
          v-model="inputs.password2"
          type="password"
          id="password2"
          placeholder="confirm password"
          autocomplete="new-password"
          :errorMessage="registrationFieldError('password2')"
          required
        />
        <fg-input
          v-model="inputs.email"
          type="email"
          id="email"
          placeholder="email"
          :errorMessage="registrationFieldError('email')"
        />
        <input type="submit" hidden />
        <span class="error-message" v-if="registrationErrorMessage">
          {{ registrationErrorMessage }}
        </span>
      </form>
    </slot>
    <slot name="footer">
      <action-panel v-if="!registrationCompleted">
        <template v-slot:secondary>
          <router-link to="/login">Already have an account?</router-link>
        </template>
        <p-button @click.native="signUp(inputs)">Signup</p-button>
      </action-panel>
      <div v-if="registrationCompleted">
        Registration complete. <router-link to="/login">Return to login page</router-link>
      </div>
    </slot>
  </card>
</template>
<script>
import {mapActions, mapGetters, mapState} from 'vuex'

import ServerIndicator from '@/components/ServerIndicator'

export default {
  components: {
    ServerIndicator
  },
  data() {
    return {
      inputs: {
        username: '',
        password1: '',
        password2: '',
        email: ''
      }
    }
  },
  computed: {
    ...mapState('signup', ['registrationCompleted', 'registrationError', 'registrationLoading']),
    ...mapGetters('signup', ['registrationErrorMessage', 'registrationFieldError'])
  },
  methods: {
    ...mapActions('signup', ['createAccount', 'clearRegistrationStatus']),
    signUp(inputs) {
      this.createAccount(inputs).then(token => {
        this.$store.commit('auth/AUTH_SET_TOKEN', token)
        this.$store.commit('auth/AUTH_SET_USERNAME', inputs.username)
        this.$store.commit('signup/REGISTRATION_SUCCESS', inputs.username)
      })
    }
  }
}
</script>

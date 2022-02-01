<template>
  <div class="registration-screen">
    <SignupForm v-if="!registrationCompleted" />
    <Spinner
      v-if="registrationLoading || registrationCompleted"
      message="Completing registration..."
    />
  </div>
</template>
<script>
import {mapActions, mapState} from 'vuex'
import hub20 from 'hub20-vue-sdk'

import SignupForm from '@/components/SignupForm'
import Spinner from '@/components/Spinner'

export default {
  components: {
    SignupForm,
    Spinner
  },
  data() {
    return {
      unsubscribe: null
    }
  },
  computed: {
    ...mapState('signup', ['registrationLoading', 'registrationCompleted'])
  },
  methods: {
    ...mapActions('signup', ['clearRegistrationStatus'])
  },
  mounted() {
    this.unsubscribe = this.$store.subscribe(mutation => {
      switch (mutation.type) {
        case `signup/${hub20.types.REGISTRATION_SUCCESS}`:
          this.$router.push('/')
          break
      }
    })
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  },
  beforeRouteLeave(to, from, next) {
    this.clearRegistrationStatus()
    next()
  }
}
</script>

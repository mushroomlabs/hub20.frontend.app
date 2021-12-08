<template>
  <div class="registration-screen">
    <SignupForm v-if="!registrationLoading" />
    <Spinner v-if="registrationLoading" message="Completing registration..." />
  </div>
</template>
<script>
import {mapState} from 'vuex'

import SignupForm from '@/components/SignupForm'
import Spinner from '@/components/Spinner'

export default {
  components: {
    SignupForm,
    Spinner
  },
  computed: {
    ...mapState('signup', ['registrationLoading'])
  }
}
</script>

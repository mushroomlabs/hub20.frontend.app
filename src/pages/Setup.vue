<template>
  <div class="setup-screen">
    <InstanceSelectorForm v-if="!processing" />
    <Spinner v-if="processing" message="Checking connection to server" />
  </div>
</template>
<script>
import {mapState} from 'vuex'

import InstanceSelectorForm from '@/components/InstanceSelectorForm'
import Spinner from '@/components/Spinner'

export default {
  components: {
    InstanceSelectorForm,
    Spinner
  },
  computed: {
    ...mapState('server', ['processing'])
  }
}
</script>

<template>
  <div id="dashboard">
    <side-bar>
      <template v-if="!hasAdminAccess" slot="links">
        <sidebar-link to="/" name="Overview" icon="ti-dashboard" />
        <sidebar-link to="/tokens" name="Asset Management" icon="ti-wallet" />
        <sidebar-link to="/stores" name="Stores" icon="ti-shopping-cart" />
        <sidebar-link to="/funding" name="Funding" icon="ti-exchange-vertical" />
        <sidebar-link to="/history" name="History" icon="ti-receipt" />
      </template>
      <template v-if="hasAdminAccess" slot="links">
        <sidebar-link to="/" name="Overview" icon="ti-dashboard" />
        <sidebar-link to="/raiden" name="Raiden" icon="ti-bolt" />
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar />
      <dashboard-content v-if="isRunning" />
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

import TopNavbar from './TopNavbar'
import DashboardContent from './Content'

export default {
  components: {
    TopNavbar,
    DashboardContent
  },
  computed: {
    ...mapGetters(['isRunning']),
    ...mapGetters('account', ['hasAdminAccess'])
  }
}
</script>

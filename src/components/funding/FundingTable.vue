<template>
  <table id="funding-data" class="table funding-status">
    <thead>
      <th class="name">Token</th>
      <th class="chain">Network</th>
      <th class="price">Price</th>
      <th class="balance">Current Balance</th>
      <th class="actions"></th>
    </thead>
    <tbody>
      <FundingTableItem
        v-for="userToken in userTokens"
        :userToken="userToken"
        :key="userToken.address"
        v-on="$listeners"
      />
    </tbody>
  </table>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'

import {mixins} from 'hub20-vue-sdk'

import FundingTableItem from '@/components/funding/FundingTableItem'

export default {
  name: 'FundingTable',
  mixins: [mixins.TokenMixin, mixins.UserTokenMixin],
  components: {
    FundingTableItem
  },
  computed: {
    ...mapGetters('account', ['openBalances'])
  },
  methods: {
    ...mapActions('account', ['fetchBalances']),
    ...mapActions('funding', ['fetchOpenDeposits']),
    ...mapActions('network', {loadBlockchainData: 'initialize'}),
    ...mapActions('tokens', ['fetchTokenByUrl', 'fetchUserTokens']),
    ...mapActions('users', ['fetchUsers'])
  },
  async created() {
    await this.loadBlockchainData()
    await this.fetchBalances()
    await this.fetchUserTokens()

    this.fetchUsers()
    this.fetchOpenDeposits()
  }
}
</script>

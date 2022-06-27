<template>
  <table id="funding-data" class="table funding-status">
    <thead>
      <th class="name">Token</th>
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
    ...mapActions('network', {fetchNetworks: 'initialize'}),
    ...mapActions('tokens', ['fetchUserTokens']),
    ...mapActions('users', ['fetchUsers'])
  },
  async created() {
    await this.fetchNetworks()
    await this.fetchBalances()
    const userTokens = await this.fetchUserTokens()

    userTokens.forEach(async userToken => {
      const token = await this.fetchTokenByUrl(userToken.token)
      this.fetchTokenNetworks(token)
    })

    this.fetchUsers()
    this.fetchOpenDeposits()
  }
}
</script>

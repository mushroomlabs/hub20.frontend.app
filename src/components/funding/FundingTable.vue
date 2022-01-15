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
        v-for="token in tokens"
        :token="token"
        :key="token.address"
        v-on="$listeners"
      />
    </tbody>
  </table>
</template>
<script>
import {mapActions, mapGetters, mapState} from 'vuex'
import FundingTableItem from '@/components/funding/FundingTableItem'

export default {
  components: {
    FundingTableItem,
  },
  computed: {
    ...mapGetters('account', ['openBalances']),
    ...mapState('tokens', ['tokens']),
  },
  methods: {
    ...mapActions('account', ['fetchBalances']),
    ...mapActions('funding', ['fetchOpenDeposits']),
    ...mapActions('network', {loadBlockchainData: 'initialize'}),
    ...mapActions('tokens', ['fetchToken']),
    ...mapActions('users', ['fetchUsers']),
  },
  async created() {
    await this.loadBlockchainData()
    await this.fetchBalances()

    this.fetchUsers()
    this.fetchOpenDeposits()
    this.openBalances.forEach(balance => this.fetchToken(balance.token))
  },
}
</script>

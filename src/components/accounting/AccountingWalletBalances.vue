<template>
  <table class="table">
    <thead>
      <th>Account Address</th>
      <th>Chain</th>
      <th>Balance</th>
    </thead>
    <tbody>
      <AccountingWalletBalancesTableItem
        v-for="balance in balances"
        :balance="balance"
        :key="balance.key"
      />
    </tbody>
  </table>
</template>
<script>
import {ethers} from 'ethers'
import {mapState, mapActions} from 'vuex'

import AccountingWalletBalancesTableItem from './AccountingWalletBalancesTableItem'

export default {
  name: 'AccountingWalletBalances',
  components: {
    AccountingWalletBalancesTableItem,
  },
  computed: {
    ...mapState('audit', ['wallets']),
    balances() {
      if (!this.wallets) {
        return []
      }

      let acc = []
      this.wallets.forEach(wallet =>
        wallet.balances.forEach(balance =>
          acc.push({
            walletAddress: wallet.address,
            tokenUrl: balance.token,
            amount: balance.amount,
            key: ethers.utils.id(`${wallet.address}-${balance.token}`),
          })
        )
      )
      return acc
    },
  },
  methods: {
    ...mapActions('audit', ['fetchWalletBalances']),
  },
  created() {
    this.fetchWalletBalances()
  },
}
</script>

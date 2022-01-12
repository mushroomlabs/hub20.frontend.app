<template>
  <table class="table">
    <thead>
      <th>Account Address</th>
      <th v-for="(token, address) in tokensByAddress" :key="address" :title="address">
        {{ token.symbol }}
      </th>
    </thead>
    <tbody>
      <AccountingWalletBalancesTableItem
        v-for="walletAddress in walletAddresses"
        :key="walletAddress"
        :address="walletAddress"
        :chain="chain"
      />
    </tbody>
  </table>
</template>
<script>
import {mapGetters} from 'vuex'
import {mixins} from 'hub20-vue-sdk'

import AccountingWalletBalancesTableItem from './AccountingWalletBalancesTableItem'

export default {
  name: 'AccountingWalletBalances',
  components: {
    AccountingWalletBalancesTableItem,
  },
  mixins: [mixins.TokenMixin],
  props: {
    chain: Object
  },
  computed: {
    ...mapGetters('audit', ['walletAddresses']),
  },
}
</script>

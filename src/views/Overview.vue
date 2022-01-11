<template>
  <div id="overview">
    <ul v-if="!hasAdminAccess" class="token-balances">
      <li v-for="balance in openBalances" :key="balance.address">
        <token-balance-card :tokenBalance="balance" />
      </li>
    </ul>

    <div v-if="hasAdminAccess">
      <card title="Accounting Books (Summary)"
            v-for="chain in blockchains"
            :key="chain.network"
            >
        <accounting-report-table  />
      </card>

      <card :title="walletBalanceCardTitle(chain)"
            v-for="chain in blockchains"
            :key="chain.network"
            >
        <accounting-wallet-balances :chain="chain" />
      </card>
    </div>
  </div>
</template>
<script>
import {mapGetters, mapState, mapActions} from 'vuex'

import TokenBalanceCard from '@/components/TokenBalanceCard'
import AccountingReportTable from '@/components/accounting/AccountingReportTable.vue'
import AccountingWalletBalances from '@/components/accounting/AccountingWalletBalances.vue'

export default {
  name: 'overview',
  components: {
    TokenBalanceCard,
    AccountingReportTable,
    AccountingWalletBalances
  },
  computed: {
    ...mapGetters('account', ['openBalances', 'hasAdminAccess']),
    ...mapState('network', ['blockchains']),
  },
  methods: {
    walletBalanceCardTitle(chain) {
      return `Account Balances: Chain #${ chain.blockchain.network }`
    },
    ...mapActions('account', {loadAccountData: 'initialize'}),
    ...mapActions('network', {loadBlockchainData: 'initialize'})
  },
  mounted() {
    this.loadAccountData()
    this.loadBlockchainData()
  }
}
</script>

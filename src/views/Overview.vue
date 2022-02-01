<template>
  <div id="overview">
    <ul v-if="!hasAdminAccess" class="token-balances">
      <li v-for="token in tokensToDisplay" :key="token.url">
        <token-balance-card :token="token" />
      </li>
    </ul>

    <div v-if="hasAdminAccess">
      <card title="Wallet">
        <accounting-report-table :book="walletBook" />
      </card>

      <card title="Raiden">
        <accounting-report-table :book="raidenBook" />
      </card>

      <card title="User Accounts" subTitle="Liabilities">
        <accounting-report-table :book="userBook" />
      </card>

      <card title="External Accounts" subTitle="Accounts not under control of the Hub">
        <accounting-report-table :book="userBook" />
      </card>

      <card title="Treasury">
        <accounting-report-table :book="treasuryBook" />
      </card>

      <card v-for="wallet in walletsWithFunds" :title="wallet.address" :key="wallet.address">
        <accounting-report-table :book="wallet.balances" />
      </card>
    </div>
  </div>
</template>
<script>
import {mapGetters, mapState, mapActions} from 'vuex'

import {mixins} from 'hub20-vue-sdk'

import TokenBalanceCard from '@/components/TokenBalanceCard'
import AccountingReportTable from '@/components/accounting/AccountingReportTable.vue'

export default {
  name: 'overview',
  mixins: [mixins.TokenMixin, mixins.UserTokenMixin],
  components: {
    TokenBalanceCard,
    AccountingReportTable
  },
  computed: {
    ...mapGetters('account', ['openBalances', 'hasAdminAccess']),
    ...mapGetters('audit', [
      'treasuryBook',
      'walletBook',
      'raidenBook',
      'userBook',
      'externalAccountBook'
    ]),
    ...mapState('network', ['blockchains']),
    ...mapState('audit', ['wallets']),
    walletsWithFunds() {
      return this.wallets.filter(wallet => wallet.balances.length > 0)
    },
    tokensToDisplay() {
      const tokensWithBalances = this.openBalances.map(balance => balance.token)
      const trackedTokens = this.userTokens.map(userToken => userToken.token)

      const tokenUrls = Array.from(new Set(tokensWithBalances.concat(trackedTokens)))
      return tokenUrls.map(tokenUrl => this.tokensByUrl[tokenUrl])
    }
  },
  methods: {
    ...mapActions('account', {loadAccountData: 'initialize'}),
    ...mapActions('network', {loadBlockchainData: 'initialize'}),
    ...mapActions('audit', ['fetchAccountingReport', 'fetchWalletBalances'])
  },
  created() {
    this.fetchUserTokens()
    this.loadAccountData()
    this.loadBlockchainData()
    this.fetchAccountingReport()
    this.fetchWalletBalances()
  }
}
</script>

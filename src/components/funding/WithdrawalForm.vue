<template>
  <div>
    <form name="transfer">
      <fg-select
        type="text"
        label="Payment Network"
        v-model="selectedNetworkUrl"
        :options="withdrawalNetworkOptions"
        :errorMessage="validationErrors.withdrawalNetworkOptions"
      />

      <fg-input
        type="number"
        :label="amountLabel"
        v-model="amount"
        :errorMessage="validationErrors.amount"
        required
      />

      <fg-input
        type="text"
        label="Address"
        v-model="address"
        :errorMessage="validationErrors.address"
      />

      <fg-input
        type="text"
        label="Payment Identifier (optional)"
        v-model="identifier"
        :errorMessage="validationErrors.identifier"
      />

      <fg-input
        type="text"
        label="Memo (optional)"
        v-model="memo"
        :errorMessage="validationErrors.memo"
      />

      <span v-if="transferCost && nativeToken" class="blockchain-transfer cost-estimate">
        Transfer cost (estimate): {{ transferCost | formattedAmount(nativeToken, 6) }}
      </span>

      <button block :disabled="!isValid" @click.prevent="submitTransfer()">
        Transfer
      </button>
    </form>
  </div>
</template>
<script>
import {ethers} from 'ethers'
import {mapActions, mapGetters, mapState} from 'vuex'

import hub20 from 'hub20-vue-sdk'

export default {
  name: 'WithdrawalForm',
  mixins: [hub20.mixins.TokenMixin, hub20.mixins.PaymentNetworkMixin],
  props: {
    token: Object
  },
  data() {
    return {
      validationErrors: {},
      selectedNetworkUrl: null,
      amount: 0,
      address: null,
      memo: null,
      identifier: null,
      transferCostTimer: null
    }
  },
  watch: {
    address(value) {
      const isAddress = ethers.utils.isAddress(value)
      this.$set(
        this.validationErrors,
        'address',
        isAddress ? null : 'not a valid ethereum address'
      )
    },
    amount(value) {
      if (value <= 0) {
        this.$set(this.validationErrors, 'amount', 'Transfer amount should be greater than zero')
      } else if (value > this.balance) {
        this.$set(
          this.validationErrors,
          'amount',
          'Transfer amount is greater than available balance'
        )
      } else {
        this.$set(this.validationErrors, 'amount', null)
      }
    },
    withdrawalNetworkOptions(value) {
      if (!value) {
        this.$set(
          this.validationErrors,
          'withdrawalNetworkOptions',
          'Please select the network used to make the transfer'
        )
      }
    },
    identifier(value) {
      const isNumericOrEmpty = !isNaN(value) || value.trim() == ''
      this.$set(
        this.validationErrors,
        'identifier',
        isNumericOrEmpty ? null : 'Identifier must be numeric value'
      )
    }
  },
  computed: {
    ...mapState('account', {hasBalances: 'initialized'}),
    ...mapGetters('network', ['getChainData']),
    ...mapState('tokens', ['transferCosts', 'tokenNetworkMap']),
    ...mapGetters('account', ['tokenBalance']),
    ...mapGetters('users', ['usersByUsername']),
    transferData() {
      return {
        token: this.token,
        amount: this.amount,
        memo: this.memo,
        identifier: this.identifier,
        address: this.address
      }
    },
    amountLabel() {
      return `Amount (max. available: ${this.balance} ${this.token.symbol})`
    },
    balance() {
      return this.tokenBalance(this.token)
    },
    hasMultipleWithdrawalOptions() {
      return this.withdrawalNetworkOptions.length > 1
    },
    isValid() {
      return [
        this.amount && this.amount > 0,
        this.amount && this.amount <= this.balance,
        this.address != null,
        this.selectedNetwork != null,
        !this.validationErrors.identifier,
        !this.validationErrors.memo
      ].every(pred => Boolean(pred))
    },
    nativeToken() {
      return this.getNativeToken(this.token)
    },
    chain() {
      return this.getChainData(this.token.chain_id)
    },
    networks() {
      return this.usableNetworksForToken(this.token).map(networkUrl => this.networksByUrl[networkUrl])
    },
    withdrawalNetworks() {
      return this.networks && this.networks.filter(network => network && network.type !== 'internal')
    },
    withdrawalNetworkOptions() {
      return this.networks && this.withdrawalNetworks.map(network => ({value: network.url, text: network.name}))
    },
    selectedNetwork() {
      return this.selectedNetworkUrl && this.networksByUrl[this.selectedNetworkUrl]
    },
    transferCost() {
      if (!this.nativeToken || !this.token) {
        return null
      }

      const networkEstimates = this.transferCosts[this.token.url]
      const estimate = networkEstimates && networkEstimates[this.selectedNetworkUrl]
      const weiCost = estimate && ethers.utils.parseUnits(estimate.toString(), 0)
      const denominator = ethers.BigNumber.from((10 ** this.nativeToken.decimals).toString())
      return weiCost && weiCost / denominator
    }
  },
  methods: {
    ...mapActions('account', ['fetchBalances']),
    ...mapActions('funding', ['createTransfer']),
    ...mapActions('tokens', ['fetchTransferCostEstimate', 'fetchTokenNetworks']),
    selectAmount(evt) {
      this.amount = evt.target.value
    },
    submitTransfer() {
      this.createTransfer({payload: this.transferData, network: this.selectedNetwork})
        .then(transferData => this.$router.push({name: 'transfer-detail', params: {transferId: transferData.id}}))
        .catch(error => console.error(error))
    },
    updateTransferCost() {
      this.fetchTransferCostEstimate(this.token)
    }
  },
  created() {
    this.fetchTokenNetworks(this.token)
    this.updateTransferCost()
    if (!this.hasBalances) {
      this.fetchBalances()
    }
  },
  mounted() {
    this.transferCostTimer = setInterval(this.updateTransferCost, 120 * 1000)
  },
  beforeDestroy() {
    if (this.transferCostTimer) {
      clearInterval(this.transferCostTimer)
    }
  }
}
</script>

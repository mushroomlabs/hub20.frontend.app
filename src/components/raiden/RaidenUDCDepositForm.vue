<template>
<form v-if="serviceToken" class="raiden-udc-operation deposit">
  <panel v-if="!balance" class="warning" title="No funds on-chain">
    No {{ serviceToken.symbol }} on {{ raiden.address }} available at the base layer.
  </panel>

  <panel v-if="nativeToken && !hasFundsForGas" class="warning" title="Can not pay transaction fees">
    Wallet {{ raiden.address }} does not have enough {{ nativeToken.name }} to pay for on-chain transaction fees.
  </panel>

  <fg-input
    type="number"
    :label="amountLabel"
    v-model="amount"
    :errorMessage="validationErrors.amount"
    required
    :disabled="!hasFunds"
    />

  <span v-if="estimatedCost && nativeToken" class="raiden-operation cost-estimate">
    cost (estimate): {{ estimatedCost | formattedAmount(nativeToken, 2) }}
  </span>

  <button :disabled="!isValid" @click.prevent="submitDepositRequest()">
    Submit
  </button>
</form>
</template>
<script>
import Decimal from 'decimal.js-light'
import {mapActions, mapGetters} from 'vuex'

import hub20 from 'hub20-vue-sdk'

export default {
  mixins: [hub20.mixins.TokenMixin, hub20.mixins.RaidenMixin],
  data() {
    return {
      validationErrors: {},
      amount: 0,
      estimateCostTimer: null
    }
  },
  watch: {
    amount(value) {
      const decimalValue = value ? new Decimal(value) : new Decimal(0)

      if (decimalValue.lte(0)) {
        this.$set(this.validationErrors, 'amount', 'Transfer amount should be greater than zero')
      } else if (decimalValue.gt(this.balance.toNumber())) {
        this.$set(
          this.validationErrors,
          'amount',
          'Transfer amount is greater than available balance'
        )
      } else {
        this.$set(this.validationErrors, 'amount', null)
      }
    },
  },
  computed: {
    ...mapGetters('network', {getChainData: 'chainData'}),
    ...mapGetters('audit', ['onChainTokenBalance']),
    amountLabel() {

      const formattedBalance = this.balance && hub20.filters.formattedAmount(this.balance.toNumber(), this.serviceToken)
      return this.balance ? `Amount (max. available: ${formattedBalance})` : 'No funds available'
    },
    balance() {
      return this.onChainTokenBalance(this.raiden.address, this.serviceToken)
    },
    hasFunds() {
      return this.hasFundsForGas && this.balance.gte(0)
    },
    hasFundsForGas() {
      return this.nativeTokenBalance >= this.estimatedCost
    },
    isValid() {
      const amount = this.amount && Number(this.amount)
      return this.hasFunds && amount && amount > 0 && this.balance >= amount
    },
    nativeTokenBalance() {
      return this.onChainTokenBalance(this.raiden.address, this.nativeToken) || 0
    },
    estimatedCost() {
      const weiAmount = this.raidenOperationsCosts && this.raidenOperationsCosts['channel-deposit']

      return weiAmount && (weiAmount / (10 ** this.nativeToken.decimals))
    }
  },
  methods: {
    ...mapActions('audit', ['fetchWalletBalances']),
    ...mapActions('raiden', ['createUDCDepositRequest']),
    submitDepositRequest() {
      this.createUDCDepositRequest({raiden: this.raiden, amount: this.amount})
    },
    updateEstimatedCost() {
      this.fetchRaidenStatus(this.raiden.id)
    }
  },
  created() {
    this.fetchWalletBalances()
  },
  mounted() {
    this.estimateCostTimer = setInterval(this.updateEstimatedCost, 120 * 1000)
    this.fetchRaidenStatus(this.raiden.id)
  },
  beforeDestroy() {
    if (this.estimateCostTimer) {
      clearInterval(this.estimateCostTimer)
    }
  }
}
</script>

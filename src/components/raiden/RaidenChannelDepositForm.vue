<template>
<form class="raiden-channel-operation deposit">
  <panel v-if="!balance" class="warning" title="No funds on-chain">
    No {{ token.symbol }} on {{ raiden.address }} available at the base layer.
  </panel>

  <panel v-if="nativeToken && !hasFundsForGas" class="warning" title="Can not pay transaction fees">
    Wallet {{ raiden.address }} does not have enough {{ nativeToken.name }} to pay for on-chain transaction fees.
  </panel>

  <fg-input
    type="number"
    label="Amount"
    v-model="amount"
    :errorMessage="validationErrors.amount"
    required
    :disabled="!balance"
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
import {mapActions, mapGetters} from 'vuex'

import hub20 from 'hub20-vue-sdk'

export default {
  mixins: [hub20.mixins.TokenMixin, hub20.mixins.RaidenMixin],
  props: {
    channel: Object,
  },
  data() {
    return {
      validationErrors: {},
      amount: 0,
      estimateCostTimer: null
    }
  },
  watch: {
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
  },
  computed: {
    ...mapGetters('network', {getChainData: 'chainData'}),
    ...mapGetters('audit', ['walletBalances']),
    amountLabel() {
      return this.balance ? `Amount (max. available: ${this.balance} ${this.token.symbol})` : 'No funds available'
    },
    balance() {
      return 10
      // return this.walletBalances(this.raiden.address, this.token)
    },
    isValid() {
      return true
      //return this.hasFundsForGas && this.amount && this.amount > 0
    },
    hasFundsForGas() {
      return this.nativeTokenBalance >= this.estimatedCost
    },
    nativeTokenBalance() {
      return this.walletBalances(this.raiden.address, this.token) || 0
    },
    nativeToken() {
      return this.getNativeToken(this.token)
    },
    estimatedCost() {
      const weiAmount = this.raidenOperationsCosts && this.raidenOperationsCosts['channel-deposit']

      return weiAmount && (weiAmount / (10 ** this.token.decimals))
    },
    token() {
      return this.channel && this.channel.token
    }
  },
  methods: {
    ...mapActions('audit', ['fetchWalletBalances']),
    ...mapActions('raiden', ['createDepositRequest']),
    submitDepositRequest() {
      this.createDepositRequest({raiden: this.raiden, channel: this.channel, amount: this.amount})
    },
    updateEstimatedCost() {
      this.fetchRaidenStatus(this.raiden.id)
    }
  },
  created() {
    this.fetchNativeToken(this.token)
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

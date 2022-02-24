<template>
<form class="raiden-channel-operation withdrawal">
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

  <button :disabled="!isValid" @click.prevent="submitWithdrawalRequest()">
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
  props: {
    channel: Object,
    token: Object,
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
      const decimalValue = value ? new Decimal(value) : new Decimal(0)

      if (decimalValue.lte(0)) {
        this.$set(this.validationErrors, 'amount', 'Withdraw amount should be greater than zero')
      } else if (decimalValue.gt(this.channelBalance.toNumber())) {
        this.$set(
          this.validationErrors,
          'amount',
          'Withdraw amount is greater than current channel balance'
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

      const formattedBalance = this.channelBalance && hub20.filters.formattedAmount(this.channelBalance.toNumber(), this.token)
      return this.onChainBalance ? `Amount (max. available: ${formattedBalance})` : 'No funds available'
    },
    channelBalance() {
      return new Decimal(this.channel.balance)
    },
    onChainBalance() {
      return this.onChainTokenBalance(this.raiden.address, this.token)
    },
    hasFunds() {
      return this.hasFundsForGas && this.channelBalance.gte(0)
    },
    hasFundsForGas() {
      return this.nativeTokenBalance >= this.estimatedCost
    },
    isValid() {
      const amount = this.amount && Number(this.amount)
      return this.hasFunds && amount && amount > 0 && this.channelBalance.toNumber() >= amount
    },
    nativeTokenBalance() {
      return this.onChainTokenBalance(this.raiden.address, this.nativeToken) || 0
    },
    estimatedCost() {
      const weiAmount = this.raidenOperationsCosts && this.raidenOperationsCosts['channel-withdraw']

      return weiAmount && (weiAmount / (10 ** this.token.decimals))
    },
    tokenUrl() {
      return this.channel && this.channel.token
    }
  },
  methods: {
    ...mapActions('audit', ['fetchWalletBalances']),
    ...mapActions('raiden', ['createChannelWithdrawalRequest']),
    submitWithdrawalRequest() {
      this.createChannelWithdrawalRequest({raiden: this.raiden, channel: this.channel, amount: this.amount})
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

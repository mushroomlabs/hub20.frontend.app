<template>
  <div>
    <span v-if="submitted">Transfer submitted successfully!</span>
    <form v-if="!submitted" name="transfer">
      <div class="button-bar">
        <button
          type="button"
          :class="{active: isInternalTransfer}"
          @click="setTransferType('internal')"
        >
          Internal
        </button>
        <button
          type="button"
          :class="{active: !isInternalTransfer}"
          @click="setTransferType('external')"
        >
          External
        </button>
      </div>

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
        v-if="!isInternalTransfer"
        v-model="address"
        :errorMessage="validationErrors.address"
        />

      <fg-select
        type="text"
        label="Payment Network"
        v-if="!isInternalTransfer && hasMultipleWithdrawalOptions"
        v-model="paymentNetwork"
        :options="withdrawalNetworkOptions"
        :errorMessage="validationErrors.withdrawalNetworkOptions"
      />


      <fg-select
        type="text"
        label="Recipient"
        v-if="isInternalTransfer"
        v-model="recipientUsername"
        :options="recipientOptions"
        :errorMessage="validationErrors.recipientUsername"
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

import AuthMixin from '@/mixins/auth'

export default {
  mixins: [AuthMixin, hub20.mixins.TokenMixin],
  props: {
    token: Object
  },
  data() {
    return {
      validationErrors: {},
      transferType: 'external',
      paymentNetwork: 'blockchain',
      amount: 0,
      address: null,
      recipientUsername: null,
      memo: null,
      identifier: null,
      submitted: false,
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
    transferType(value) {
      if (value === 'internal' && !this.recipientUsername) {
        this.$set(
          this.validationErrors,
          'recipientUsername',
          'Please provide username of recipient'
        )
      }
      if (value === 'external' && !this.address) {
        this.$set(this.validationErrors, 'address', 'Please provide recipient ethereum address')
      }
    },
    withdrawalNetworkOptions(value) {
      if (this.transferType === 'external' && !value) {
        this.$set(
          this.validationErrors,
          'withdrawalNetworkOptions',
          'Please select the network used to make the transfer'
        )
      }
    },
    recipientUsername(value) {
      if (!value) {
        this.$set(
          this.validationErrors,
          'recipientUsername',
          'Please provide username of recipient'
        )
      } else {
        this.$set(this.validationErrors, 'recipientUsername', null)
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
    ...mapGetters('network', {getChainData: 'chainData'}),
    ...mapState('tokens', ['transferCosts', 'routes']),
    ...mapGetters('account', ['tokenBalance']),
    ...mapGetters('users', ['usersByUsername']),
    transferData() {
      let payload = {
        token: this.token,
        amount: this.amount,
        memo: this.memo,
        identifier: this.identifier,
        payment_network: this.paymentNetwork
      }

      if (this.transferType == 'internal') {
        payload.recipient = this.recipientUsername
      } else {
        payload.address = this.address
      }
      return payload
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
    isInternalTransfer() {
      return this.transferType === 'internal'
    },
    isValid() {
      return [
        this.amount && this.amount > 0,
        this.isInternalTransfer ? this.recipientUsername != null : this.address != null,
        !this.validationErrors.identifier,
        !this.validationErrors.memo
      ].every(pred => Boolean(pred))
    },
    nativeToken() {
      return this.getNativeToken(this.token)
    },
    recipients() {
      return Object.values(this.usersByUsername).filter(
        user => user.username != this.loggedUsername
      )
    },
    recipientOptions() {
      return this.recipients.map(user => ({value: user.username, text: user.username}))
    },
    withdrawalNetworkOptions() {
      const tokenRoutes = this.routes[this.token.url]

      if (!tokenRoutes) {
        return []
      }

      const options = []

      const chainData = this.getChainData(this.token.chain_id)
      if (tokenRoutes.blockchain) {
        options.push({value: 'blockchain', text: `${chainData.name} (On-Chain)`})
      }

      if (tokenRoutes.networks && tokenRoutes.networks.raiden) {
        options.push({value: 'raiden', text: `${chainData.name} (Raiden)`})
      }

      return options
    },
    transferCost() {
      if (this.transferType === 'internal' || this.paymentNetwork !== 'blockchain'){
        return null
      }

      const estimate = this.transferCosts[this.token.url]
      const weiCost = estimate && ethers.utils.parseUnits(estimate.toString(), 0)
      const denominator = ethers.BigNumber.from((10 ** this.nativeToken.decimals).toString())
      return weiCost && weiCost / denominator
    }
  },
  methods: {
    ...mapActions('funding', ['createTransfer', 'createWithdrawal']),
    ...mapActions('tokens', ['fetchTransferCostEstimate', 'fetchRoutes']),
    setTransferType(transferType) {
      this.transferType = transferType
    },
    selectAmount(evt) {
      this.amount = evt.target.value
    },
    submitTransfer() {
      const action = this.isInternalTransfer ? this.createTransfer : this.createWithdrawal
      action(this.transferData).then(() => {
        this.$emit('transferFormSubmitted')
        this.submitted = true
      })
    },
    updateTransferCost() {
      this.fetchTransferCostEstimate(this.token)
    }
  },
  created() {
    this.fetchRoutes(this.token)
    this.updateTransferCost()
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

<template>
  <div>
    <form name="transfer">
      <fg-input
        type="number"
        :label="amountLabel"
        v-model="amount"
        :errorMessage="validationErrors.amount"
        required
      />

      <fg-select
        type="text"
        label="Recipient"
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

      <button block :disabled="!isValid" @click.prevent="submitTransfer()">
        Transfer
      </button>
    </form>
  </div>
</template>
<script>
import {mapActions, mapGetters, mapState} from 'vuex'

import hub20 from 'hub20-vue-sdk'

import AuthMixin from '@/mixins/auth'

export default {
  mixins: [AuthMixin, hub20.mixins.TokenMixin, hub20.mixins.PaymentNetworkMixin],
  props: {
    token: Object
  },
  data() {
    return {
      validationErrors: {},
      amount: 0,
      address: null,
      recipientUsername: null,
      memo: null,
      identifier: null
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
    ...mapState('account', {hasBalances: 'initialized'}),
    ...mapGetters('account', ['tokenBalance']),
    ...mapGetters('users', ['usersByUsername']),
    transferData() {
      return {
        token: this.token,
        amount: this.amount,
        memo: this.memo,
        identifier: this.identifier,
        recipient: this.recipientUsername
      }
    },
    amountLabel() {
      return `Amount (max. available: ${this.balance} ${this.token.symbol})`
    },
    balance() {
      return this.tokenBalance(this.token)
    },
    isValid() {
      return [
        this.amount && this.amount > 0,
        this.amount && this.amount <= this.balance,
        this.internalNetwork,
        this.recipientUsername,
        !this.validationErrors.identifier,
        !this.validationErrors.memo
      ].every(pred => Boolean(pred))
    },
    recipients() {
      return Object.values(this.usersByUsername).filter(
        user => user.username != this.loggedUsername
      )
    },
    recipientOptions() {
      return this.recipients.map(user => ({value: user.username, text: user.username}))
    },
    networks() {
      return this.usableNetworksForToken(this.token).map(networkUrl => this.networksByUrl[networkUrl])
    },
    internalNetwork() {
      return this.networks && this.networks.filter(network => network && network.type === 'internal').pop()
    },
  },
  methods: {
    ...mapActions('account', ['fetchBalances']),
    ...mapActions('funding', ['createTransfer']),
    ...mapActions('users', ['fetchUsers']),
    ...mapActions('tokens', ['fetchTokenNetworks']),
    selectAmount(evt) {
      this.amount = evt.target.value
    },
    submitTransfer() {
      this.createTransfer({payload: this.transferData, network: this.internalNetwork}).then(transferData => {
        this.$router.push({name: 'transfer-detail', params: {transferId: transferData.id}})
      }).catch(error => console.error(error))
    }
  },
  created() {
    this.fetchTokenNetworks(this.token)
    this.fetchUsers()
    if (!this.hasBalances) {
      this.fetchBalances()
    }
  }
}
</script>

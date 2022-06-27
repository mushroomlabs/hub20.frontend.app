<template>
  <tr v-if="token">
    <td class="name" :title="token.symbol">{{ token.name }} ({{ token.symbol }})</td>
    <td class="balance">{{ balance }}</td>
    <td class="actions">
      <button @click="openDeposit()">Receive</button>
      <button @click="openTransferModal()" :disabled="!hasFunds">
        Send
      </button>
    </td>
    <Modal
      label="withdraw-modal"
      :title="withdrawModalTitle"
      :id="withdrawModalId"
      :hidden="!isWithdrawModalOpen"
      @modalClosed="closeModals()"
    >
      <TransferForm :token="token" @transferFormSubmitted="closeModals()" />
    </Modal>
  </tr>
</template>
<script>
import {mapActions, mapGetters, mapState} from 'vuex'
import hub20 from 'hub20-vue-sdk'

import Modal from '@/widgets/dialogs/Modal'

import TransferForm from './TransferForm'

export default {
  name: 'FundingTableItem',
  mixins: [hub20.mixins.UserTokenMixin, hub20.mixins.TokenMixin],
  components: {
    Modal,
    TransferForm
  },
  filters: {
    formattedCurrency: hub20.filters.formattedCurrency
  },
  props: {
    userToken: {
      type: Object
    }
  },
  data() {
    return {
      isDepositModalOpen: false,
      isWithdrawModalOpen: false
    }
  },
  computed: {
    ...mapGetters('account', ['tokenBalance']),
    ...mapGetters('funding', ['openDepositsByToken']),
    ...mapState('coingecko', ['baseCurrency']),
    token() {
      return this.tokensByUrl[this.userToken.token]
    },
    balance() {
      return (this.token && this.tokenBalance(this.token)) || 'N/A'
    },
    hasFunds() {
      return this.balance.gt(0)
    },
    depositModalTitle() {
      return `Deposit ${this.userToken.symbol}`
    },
    depositModalId() {
      return `modal-deposit-${this.userToken.id}`
    },
    withdrawModalTitle() {
      return `Withdraw ${this.userToken.symbol}`
    },
    withdrawModalId() {
      return `modal-withdraw-${this.userToken.id}`
    }
  },
  methods: {
    ...mapActions('funding', ['createDeposit']),
    openDeposit() {
      this.createDeposit(this.token).then(
        deposit => this.$router.push({name: 'deposit', params: {depositId: deposit.id}})
      )
    },
    openTransferModal() {
      this.isWithdrawModalOpen = true
    },
    closeModals() {
      this.isDepositModalOpen = false
      this.isWithdrawModalOpen = false
    }
  }
}
</script>

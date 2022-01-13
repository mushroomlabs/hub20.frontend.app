<template>
  <tr>
    <td class="name" :title="token.address">{{ token.name }} ({{ token.symbol }})</td>
    <td class="network" :title="chain.name">{{ chain.name }}</td>
    <td class="price">{{ exchangeRate(token) | formattedCurrency(baseCurrency) }}</td>
    <td class="balance">{{ balance }}</td>
    <td class="actions">
      <button @click="openDepositModal()" :disabled="!canDeposit">Receive</button>
      <button @click="openTransferModal()" :disabled="!canWithdraw">
        Send
      </button>
    </td>
    <Modal
      label="deposit-modal"
      :title="depositModalTitle"
      :id="depositModalId"
      :hidden="!isDepositModalOpen"
      @modalClosed="closeModals()"
    >
      <DepositTracker :token="token" />
    </Modal>
    <Modal
      label="withdraw-modal"
      :title="withdrawModalTitle"
      :id="withdrawModalId"
      :hidden="!isWithdrawModalOpen"
      @modalClosed="closeModals()"
    >
      <TransferForm
        :token="token"
        @transferFormSubmitted="closeModals()"
      />
    </Modal>
  </tr>
</template>
<script>
import {mapActions, mapGetters, mapState} from 'vuex'
import hub20 from 'hub20-vue-sdk'

import Modal from '@/widgets/dialogs/Modal'

import DepositTracker from './DepositTracker'
import TransferForm from './TransferForm'

export default {
  components: {
    Modal,
    DepositTracker,
    TransferForm
  },
  filters: {
    formattedCurrency: hub20.filters.formattedCurrency
  },
  props: {
    token: {
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
    ...mapGetters('network', ['chainsById', 'IsNodeOnline', 'IsNodeSynced', 'chainData']),
    ...mapGetters('coingecko', ['exchangeRate']),
    ...mapState('coingecko', ['baseCurrency']),
    ...mapState('network', ['blockchains']),
    balance() {
      return this.tokenBalance(this.token.address)
    },
    canDeposit() {
      return this.IsNodeOnline(this.chainId) && this.IsNodeSynced(this.chainId)
    },
    canWithdraw() {
      return this.IsNodeOnline(this.chainId) && this.IsNodeSynced(this.chainId) && this.hasFunds
    },
    chainId() {
      return this.token.network_id
    },
    chain() {
      return this.chainsById[this.chainId]
    },
    chainState() {
      return this.chainData(this.chainId)
    },
    hasFunds() {
      return this.balance.gt(0)
    },
    depositModalTitle() {
      return `Deposit ${this.token.symbol}`
    },
    depositModalId() {
      return `modal-deposit-${this.token.address}`
    },
    withdrawModalTitle() {
      return `Withdraw ${this.token.symbol}`
    },
    withdrawModalId() {
      return `modal-withdraw-${this.token.address}`
    }
  },
  methods: {
    ...mapActions('coingecko', ['fetchRate']),
    ...mapActions('funding', ['createDeposit']),
    async openDepositModal() {
      const hasOpenDeposits = (this.openDepositsByToken(this.token).length > 0)
      if (!hasOpenDeposits) {
        await this.createDeposit(this.token)
      }
      this.isDepositModalOpen = true
    },
    openDeposits() {
      return this.openDepositsByToken(this.token)
    },
    openTransferModal() {
      this.isWithdrawModalOpen = true
    },
    closeModals() {
      this.isDepositModalOpen = false
      this.isWithdrawModalOpen = false
    }
  },
  created() {
    this.fetchRate(this.token)
  }
}
</script>

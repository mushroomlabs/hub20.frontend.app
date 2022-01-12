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
      label="funding-modal"
      :title="modalTitle"
      :id="modalId"
      :hidden="!isModalOpen"
      @modalClosed="onModalClosed()"
    >
      <DepositTracker :token="token" v-if="hasOpenDeposit" />
      <TransferForm
        :token="token"
        v-if="hasOpenTransfer"
        @transferFormSubmitted="onTransferSubmitted()"
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
      hasOpenDeposit: false,
      hasOpenTransfer: false
    }
  },
  computed: {
    ...mapGetters('account', ['tokenBalance']),
    ...mapGetters('network', ['chainsById', 'IsNodeOnline', 'IsNodeSynced', 'chainData']),
    ...mapGetters('coingecko', ['exchangeRate']),
    ...mapState('coingecko', ['baseCurrency']),
    ...mapState('network', ['blockchains']),
    balance() {
      return this.tokenBalance(this.token.address)
    },
    canDeposit() {
      let chainId = this.token.network_id
      return this.IsNodeOnline(chainId) && this.IsNodeSynced(chainId)
    },
    canWithdraw() {
      let chainId = this.chain && this.chain.id
      return this.IsNodeOnline(chainId) && this.IsNodeSynced(chainId) && this.hasFunds
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
    modalTitle() {
      const action = this.hasOpenDeposit ? 'Deposit' : 'Transfer'
      return `${action} ${this.token.symbol}`
    },
    modalId() {
      return `modal-funding-${this.token.address}`
    },
    isModalOpen() {
      return this.hasOpenDeposit || this.hasOpenTransfer
    }
  },
  methods: {
    ...mapActions('coingecko', ['fetchRate']),
    openDepositModal() {
      this.hasOpenDeposit = true
    },
    openTransferModal() {
      this.hasOpenTransfer = true
    },
    onModalClosed() {
      this.hasOpenDeposit = false
      this.hasOpenTransfer = false
    },
    onTransferSubmitted() {
      this.hasOpenTransfer = false
    }
  },
  created() {
    this.fetchRate(this.token)
  }
}
</script>

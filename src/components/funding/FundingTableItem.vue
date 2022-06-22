<template>
  <tr v-if="userToken">
    <td class="name" :title="token.id">{{ token.name }} ({{ token.symbol }})</td>
    <td class="network" :title="network.name">{{ network.name }}</td>
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
      <TransferForm :token="token" @transferFormSubmitted="closeModals()" />
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
  name: 'FundingTableItem',
  mixins: [hub20.mixins.UserTokenMixin, hub20.mixins.TokenMixin],
  components: {
    Modal,
    DepositTracker,
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
    ...mapGetters('network', ['isOnline', 'getChainData']),
    ...mapGetters('coingecko', ['exchangeRate']),
    ...mapState('coingecko', ['baseCurrency']),
    token() {
      return this.tokensByUrl[this.userToken.token]
    },
    balance() {
      return (this.token && this.tokenBalance(this.token)) || 'N/A'
    },
    chainId() {
      return this.token.chain_id
    },
    canDeposit() {
      return this.isOnline(this.networkId)
    },
    canWithdraw() {
      return this.isOnline(this.networkId) && this.hasFunds
    },
    networkId() {
      return this.network && this.network.id
    },
    network() {
      return this.getChainData(this.chainId)
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
    async openDepositModal() {
      const hasOpenDeposits = this.openDeposits.length > 0
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
  }
}
</script>

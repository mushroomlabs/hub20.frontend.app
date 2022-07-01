<template>
  <tr v-if="token">
    <td class="name" :title="token.symbol">{{ token.name }} ({{ token.symbol }})</td>
    <td class="balance">{{ balance }}</td>
    <td class="actions">
      <button @click="openDeposit()">Receive</button>
      <router-link
        :to="{name: 'internal-transfer-create', params: {tokenId: token.id}}"
        :disabled="!hasFunds"
        title="Send to other users in this hub">
        Send
      </router-link>
      <router-link
        :to="{name: 'withdrawal-create', params: {tokenId: token.id}}"
        :disabled="!hasFunds"
        title="Transfer to External Address">
        Withdraw
      </router-link>
    </td>
  </tr>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
import hub20 from 'hub20-vue-sdk'

export default {
  name: 'FundingTableItem',
  mixins: [hub20.mixins.UserTokenMixin, hub20.mixins.TokenMixin],
  props: {
    userToken: {
      type: Object
    }
  },
  computed: {
    ...mapGetters('account', ['tokenBalance']),
    ...mapGetters('funding', ['openDepositsByToken']),
    token() {
      return this.tokensByUrl[this.userToken.token]
    },
    balance() {
      return (this.token && this.tokenBalance(this.token)) || 'N/A'
    },
    hasFunds() {
      return this.balance.gt(0)
    }
  },
  methods: {
    ...mapActions('funding', ['createDeposit']),
    openDeposit() {
      this.createDeposit(this.token).then(
        deposit => this.$router.push({name: 'deposit', params: {depositId: deposit.id}})
      )
    }
  }
}
</script>

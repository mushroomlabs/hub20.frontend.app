<template>
  <ul class="deposit-tracker">
    <li>
      <PaymentRequest
        v-for="deposit in openDeposits"
        :paymentRequest="deposit"
        :key="deposit.id"
      />
    </li>
  </ul>
</template>

<script>
import {mapGetters} from 'vuex'

import hub20 from 'hub20-vue-sdk'

export default {
  components: {
    PaymentRequest: hub20.components.Payment.Invoice,
  },
  props: {
    token: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters('funding', ['openDepositsByToken']),
    openDeposits() {
      return this.openDepositsByToken(this.token)
    },
  }
}
</script>

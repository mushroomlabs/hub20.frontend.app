<template>
  <table class="table" :class="{'empty': !hasEntries}">
    <thead v-if="hasEntries">
      <th>Token</th>
      <th>Chain</th>
      <th>Total Debit</th>
      <th>Total Credit</th>
      <th>Balance</th>
    </thead>
    <tbody>
      <tr v-if="!hasEntries"><td>No book entries</td></tr>
      <AccountingBookTableEntryItem v-for="entry in book" :key="entry.token" :entry="entry" />
    </tbody>
  </table>
</template>
<script>
  import AccountingBookTableEntryItem from './AccountingBookTableEntryItem'
export default {
  name: 'AccountingReportTable',
  components: {
    AccountingBookTableEntryItem
  },
  props: {
    book: {
      type: Array
    }
  },
  computed: {
    hasEntries() {
      return this.book.length > 0
    }
  }
}
</script>

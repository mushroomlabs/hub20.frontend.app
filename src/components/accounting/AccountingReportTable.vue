<template>
  <table class="table">
    <thead>
      <th>Token</th>
      <th>Chain</th>
      <th>Total Debit</th>
      <th>Total Credit</th>
      <th>Balance</th>
    </thead>
    <tbody>
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
  }
}
</script>

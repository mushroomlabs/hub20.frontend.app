<template>
  <table class="table raiden-channels">
    <thead>
      <th class="identifier">Identifier</th>
      <th class="network">Network</th>
      <th class="balance">Balance</th>
    </thead>
    <tbody>
      <RaidenChannelTableItem
        v-for="channel in raiden.channels"
        :channel="channel"
        :key="channel.identifier"
      />
    </tbody>
  </table>
</template>
<script>
import RaidenChannelTableItem from '@/components/raiden/RaidenChannelTableItem'

export default {
  props: {
    raiden: {
      type: Object
    }
  },
  components: {
    RaidenChannelTableItem,
  },
}
</script>

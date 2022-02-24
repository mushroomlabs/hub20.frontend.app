<template>
  <tr v-if="raiden">
    <td rowspan="openChannels.length">{{ raiden.hostname }}</td>
    <td rowspan="openChannels.length">{{ raiden.address }}</td>
    <td rowspan="openChannels.length">
      <router-link :to="{name: 'raiden-udc-deposit', params: {raiden: raiden.id}}">
        {{ raiden.service_deposit_balance.balance | formattedAmount(serviceToken, 6) }}
      </router-link>
    </td>
    <td rowspan="openChannels.length">
      <tr v-for="channel in openChannels" :key="channel.id">
        <td v-if="getChannelToken(channel)">
          <router-link
            :to="{name: 'raiden-channel', params: {raiden: raiden.id, channel: channel.id}}"
          >
            {{ getChannelToken(channel).symbol }}
          </router-link>
        </td>
      </tr>
    </td>
  </tr>
</template>

<script>
import hub20 from 'hub20-vue-sdk'

export default {
  name: 'raiden-node-table-item',
  mixins: [hub20.mixins.TokenMixin, hub20.mixins.RaidenMixin]
}
</script>

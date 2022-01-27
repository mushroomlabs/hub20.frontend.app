<template>
  <div>
    <card title="Tokens" subTitle="See and choose tokens available for trading">
      <p>
        The base currency of every active chain is always going to be in your watchlist, because
        they are needed to pay for transfer fees.
      </p>
      <TokenTable>
        <template v-slot:header>
          <th>On Watch List</th>
        </template>

        <TokenTableItem v-for="userToken in userTokens" :key="userToken.url" :token="userToken">
          <td>
            <TokenFavoriteSwitchButton :token="asToken(userToken)" />
          </td>
        </TokenTableItem>
      </TokenTable>

      <TokenSearch />
    </card>
  </div>
</template>
<script>
import {mapActions} from 'vuex'
import {mixins} from 'hub20-vue-sdk'

import TokenSearch from '@/components/tokens/TokenSearch'
import TokenTable from '@/components/tokens/TokenTable'
import TokenTableItem from '@/components/tokens/TokenTableItem'
import TokenFavoriteSwitchButton from '@/components/tokens/TokenFavoriteSwitchButton'

export default {
  name: 'Settings',
  mixins: [mixins.TokenMixin, mixins.UserTokenMixin],
  components: {
    TokenFavoriteSwitchButton,
    TokenSearch,
    TokenTable,
    TokenTableItem,
  },
  methods: {
    ...mapActions('network', ['getBlockchains']),
  },
  async created() {
    await this.getBlockchains()
    await this.fetchUserTokens()

    this.userTokens.forEach(userToken => this.fetchToken(userToken))
  },
}
</script>

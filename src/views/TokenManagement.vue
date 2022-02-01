<template>
  <div class="token-management">
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

    <card
      title="Token Lists"
      subTitle="Sets of tokens that you manage with specific purposes"
      class="user-tokenlists"
    >
      <ul class="table-action-menu">
        <li>
          <router-link :to="{name: 'tokenlist-create'}">Add New</router-link>
        </li>
      </ul>

      <table class="table token-list">
        <thead>
          <th class="name">Name</th>
          <th class="description">Description</th>
          <th class="current-token-list">Current Tokens</th>
          <th class="actions"></th>
        </thead>
        <tbody>
          <TokenListTableItem
            v-for="tokenList in userTokenLists"
            :key="tokenList.id"
            :tokenList="tokenList"
          >
            <td class="actions">
              <router-link :to="{name: 'tokenlist-edit', params: {id: tokenList.id}}"
                >Edit</router-link
              >
            </td>
          </TokenListTableItem>
        </tbody>
      </table>
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
import TokenListTableItem from '@/components/tokens/TokenListTableItem'

export default {
  name: 'TokenManagement',
  mixins: [mixins.TokenMixin, mixins.UserTokenMixin],
  components: {
    TokenFavoriteSwitchButton,
    TokenSearch,
    TokenTable,
    TokenTableItem,
    TokenListTableItem
  },
  methods: {
    ...mapActions('network', ['getBlockchains'])
  },
  async created() {
    await this.getBlockchains()
    await this.fetchUserTokens()
    await this.fetchUserTokenLists()

    this.userTokens.forEach(userToken => this.fetchToken(userToken))
  }
}
</script>

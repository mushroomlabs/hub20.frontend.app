<template>
  <div class="token-search">
    <div class="search-box">
      <fg-input placeholder="Search all tokens" v-model="searchTerm" />
    </div>

    <div class="token-search-results">
      <p v-if="resultsAvailable">
        Showing <span class="search-results-total">{{ totalResults }}</span> results for
        <em class="search-term">{{ searchTerm }}</em>
      </p>
      <p v-if="noResults">
        No results for <em class="search-term">{{ searchTerm }}</em>
      </p>
      <TokenTable v-if="resultsAvailable" class="search-token-results">
        <template v-slot:header>
          <th>Add to Watch List</th>
        </template>
        <TokenTableItem v-for="token in results" :key="token.url" :token="token">
          <td>
            <TokenFavoriteSwitchButton :token="token" />
          </td>
        </TokenTableItem>
      </TokenTable>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import {mapActions} from 'vuex'
import {ethers} from 'ethers'

import TokenTable from './TokenTable'
import TokenTableItem from './TokenTableItem'
import TokenFavoriteSwitchButton from './TokenFavoriteSwitchButton'

export default {
  name: 'TokenSearch',
  components: {
    TokenTable,
    TokenTableItem,
    TokenFavoriteSwitchButton,
  },
  data() {
    return {
      searchTerm: '',
      resultsCache: {},
      searchTimer: null,
    }
  },
  watch: {
    searchTerm() {
      // Poor man's implementation of "debounce".
      const waitTime = 250
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }

      this.searchTimer = setTimeout(() => {
        const term = this.searchTerm.trim()
        const queryId = this.getQueryId(term)
        if (term && !Object.keys(this.resultsCache).includes(queryId)) {
          this.search(term)
        }
      }, waitTime)
    },
  },
  computed: {
    results() {
      const queryId = this.getQueryId(this.searchTerm)
      return queryId && this.resultsCache[queryId]
    },
    totalResults() {
      return this.results && this.results.length
    },
    resultsAvailable() {
      return this.results && this.totalResults > 0
    },
    noResults() {
      return this.results && this.results.length == 0
    },
  },
  methods: {
    ...mapActions('tokens', ['searchTokens']),
    getQueryId(searchTerm) {
      return searchTerm && ethers.utils.id(searchTerm)
    },
    search(searchTerm) {
      const queryId = this.getQueryId(searchTerm)
      this.searchTokens({searchTerm}).then(({data}) =>
        Vue.set(this.resultsCache, queryId, data)
      )
    },
  },
}
</script>

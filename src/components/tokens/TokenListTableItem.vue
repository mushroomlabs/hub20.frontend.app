<template>
  <tr>
    <td class="tokenlist-data">
      <span class="tokenlist-name">{{ tokenList.name }}</span>
    </td>
    <td class="tokenlist-description">
      <span class="tokenlist-description">{{ tokenList.description }}</span>
    </td>
    <td class="tokenlist-tokens">
      <ul>
        <li v-for="token in currentTokens" :key="token.url">{{ token.symbol }}</li>
      </ul>
    </td>

    <slot> </slot>
  </tr>
</template>
<script>
import hub20 from 'hub20-vue-sdk'

export default {
  name: 'TokenListTableItem',
  mixins: [hub20.mixins.TokenMixin],
  props: {
    tokenList: Object
  },
  computed: {
    currentTokens() {
      return this.tokens.filter(token => this.tokenList.tokens.includes(token.url))
    }
  },
  methods: {
    hasLogo(token) {
      return Boolean(this.getLogoUrl(token))
    }
  },
  created() {
    this.tokenList.tokens.forEach(tokenUrl => this.fetchTokenByUrl(tokenUrl))
  }
}
</script>

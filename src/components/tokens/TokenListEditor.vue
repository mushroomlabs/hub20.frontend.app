<template>
  <div v-if="tokenList" class="token-list-editor">
    <fg-input
      label="Name"
      v-model="name"
      placeholder='"DeFI Governance tokens" or "E-commerce stabletokens"'
      :errorMessage="submissionErrorMessages.name || validationErrors.name"
      required
    />

    <fg-textarea
      label="Description"
      v-model="description"
      :errorMessage="submissionErrorMessages.description || validationErrors.description"
      required
    />

    <fg-select
      label="Tokens"
      helpMessage="Select at least one token below"
      v-model="tokens"
      :options="userTokenOptions"
      :errorMessage="submissionErrorMessages.tokens || validationErrors.tokens"
      multiple
    />

    <p-button block @click.native="save()" :disabled="!isValid">Save</p-button>
  </div>
</template>
<script>
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'
import {mixins} from 'hub20-vue-sdk'

export default {
  name: 'TokenListEditor',
  mixins: [mixins.TokenMixin, mixins.UserTokenMixin],
  props: {
    tokenListId: [Number, String]
  },
  data() {
    return {
      validationErrors: {},
      loaded: false
    }
  },
  watch: {
    name() {
      if (!this.name.trim()) {
        this.$set(this.validationErrors, 'name', 'Name can not be empty')
      } else {
        this.$set(this.validationErrors, 'name', null)
      }
    },
    description() {
      if (!this.description.trim()) {
        this.$set(this.validationErrors, 'description', 'Please provide a description')
      } else {
        this.$set(this.validationErrors, 'description', null)
      }
    },
    tokens() {
      if (this.tokens.length == 0) {
        this.$set(this.validationErrors, 'tokens', 'Need at least one token')
      } else {
        this.$set(this.validationErrors, 'tokens', null)
      }
    }
  },
  computed: {
    ...mapState('tokens', {tokenList: 'editingUserTokenList'}),
    ...mapGetters('tokens', {submissionErrorMessages: 'tokenListSubmissionErrors'}),
    isValid() {
      return Object.values(this.validationErrors).every(attr => !attr)
    },
    name: {
      get() {
        return this.tokenList && this.tokenList.name
      },
      set(value) {
        this.setName(value && value.trim())
      }
    },
    description: {
      get() {
        return this.tokenList && this.tokenList.description
      },
      set(value) {
        this.setDescription(value && value.trim())
      }
    },
    tokens: {
      get() {
        return (this.tokenList && this.tokenList.tokens) || []
      },
      set(value) {
        this.setTokens(value)
      }
    }
  },
  methods: {
    ...mapActions('tokens', ['fetchUserTokenList', 'saveUserTokenList']),
    ...mapMutations('tokens', {
      startEditor: 'USER_TOKENLIST_EDIT_BEGIN',
      setName: 'USER_TOKENLIST_EDIT_SET_NAME',
      setDescription: 'USER_TOKENLIST_EDIT_SET_DESCRIPTION',
      setTokens: 'USER_TOKENLIST_EDIT_SET_TOKENS'
    }),
    save() {
      this.saveUserTokenList(this.tokenList).then(() => {
        this.$notify({message: `${this.tokenList.name} saved successfully`, type: 'success'})
        this.$router.push({name: 'tokens'})
      })
    }
  },
  created() {
    if (this.tokenListId) {
      this.fetchUserTokenList(this.tokenListId).then(data => this.startEditor(data))
    } else {
      this.startEditor()
    }
  }
}
</script>

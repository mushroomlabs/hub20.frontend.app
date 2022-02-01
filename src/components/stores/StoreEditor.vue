<template>
  <card id="store-detail" v-if="store" :title="cardTitle">
    <fg-input
      v-if="store.id"
      label="Store ID"
      :value="store.id"
      addon-right-icon="ti-files"
      disabled
    />

    <fg-input
      :errorMessage="validationErrors.name"
      placeholder='"My Shopify Integration" or "Acme, Inc"'
      label="Name"
      v-model="name"
      required
    />

    <fg-input
      label="URL"
      placeholder="https://acme.example.com"
      v-model="siteUrl"
      :errorMessage="submissionErrorMessages.siteUrl || validationErrors.siteUrl"
      required
    />

    <fg-input
      label="Webhook URL"
      placeholder="https://my.shop.example.com/process_checkout"
      :errorMessage="submissionErrorMessages.webhookUrl || validationErrors.webhookUrl"
      v-model="webhookUrl"
    />

    <fg-select
      label="Token List"
      helpMessage="The list of tokens you want to accept for payment"
      v-model="tokenList"
      :options="userTokenListOptions"
      :errorMessage="submissionErrorMessages.tokenList || validationErrors.tokenList"
    />

    <fg-input
      v-if="store.public_key"
      label="Public Key"
      :value="store.public_key"
      addon-right-icon="ti-files"
      disabled
    />

    <p-button block @click.native="save(store)" :disabled="!isValid">Save</p-button>
  </card>
</template>
<script>
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'
import {mixins} from 'hub20-vue-sdk'

export default {
  name: 'StoreDetail',
  mixins: [mixins.TokenMixin, mixins.UserTokenMixin],
  props: {
    storeId: String
  },
  data() {
    return {
      validationErrors: {}
    }
  },
  watch: {
    name() {
      if (!this.name.trim()) {
        this.$set(this.validationErrors, 'name', 'Store Name can not be empty')
      } else {
        this.$set(this.validationErrors, 'name', null)
      }
    },
    siteUrl() {
      if (!this.siteUrl.trim()) {
        this.$set(this.validationErrors, 'siteUrl', 'Store must have a valid URL')
      } else {
        this.$set(this.validationErrors, 'siteUrl', null)
      }
    }
  },
  computed: {
    ...mapState('stores', {store: 'editingData', submissionErrors: 'submissionErrors'}),
    ...mapGetters('stores', {
      stores: 'storesById',
      submissionErrorMessages: 'submissionErrorMessages'
    }),
    isNew() {
      return this.$route.name == 'store-create'
    },
    cardTitle() {
      return this.isNew ? 'Create new Store' : `Edit Store ${this.store.name}`
    },
    isValid() {
      return Object.values(this.validationErrors).every(attr => !attr)
    },
    name: {
      get() {
        return this.store && this.store.name
      },
      set(value) {
        this.updateName(value.trim())
      }
    },
    webhookUrl: {
      get() {
        return this.store && this.store.checkout_webhook_url
      },
      set(value) {
        this.updateWebhookUrl(value.trim())
      }
    },
    tokenList: {
      get() {
        return this.store && this.store.accepted_token_list
      },
      set(value) {
        this.updateTokenList(value)
      }
    },
    siteUrl: {
      get() {
        return this.store && this.store.site_url
      },
      set(value) {
        return this.updateSiteUrl(value)
      }
    }
  },
  methods: {
    ...mapMutations('stores', {
      updateName: 'STORE_EDIT_SET_NAME',
      updateSiteUrl: 'STORE_EDIT_SET_URL',
      updateWebhookUrl: 'STORE_EDIT_SET_WEBHOOK_URL',
      updateTokenList: 'STORE_EDIT_SET_TOKEN_LIST'
    }),
    ...mapActions('stores', ['editStore', 'updateStore', 'createStore', 'fetchStores']),
    save(storeData) {
      const action = this.isNew ? this.createStore : this.updateStore

      action(storeData).then(() => {
        if (!this.submissionErrors) {
          this.$notify({message: `${storeData.name} saved successfully`, type: 'success'})
          this.$router.push({name: 'stores'})
        }
      })
    }
  },
  mounted() {
    this.editStore(this.storeId).then(() => {
      this.validationErrors = {}
    })
  }
}
</script>

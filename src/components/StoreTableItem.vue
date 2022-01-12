<template>
  <tr>
    <td class="name">{{ store.name }}</td>
    <td class="url">{{ store.site_url }}</td>
    <td class="identifier">{{ store.id }}</td>
    <td class="actions">
      <router-link :to="{name: 'store', params: {id: store.id}}">Edit</router-link>
      <button class="destructive-action" name="remove" @click="promptRemoval(store)">
        Remove
      </button>
    </td>
  </tr>
</template>
<script>
import {mapActions} from 'vuex'

export default {
  props: {
    store: {
      type: Object
    }
  },
  methods: {
    ...mapActions('stores', ['removeStore']),
    promptRemoval(store) {
      if (confirm(`Are you sure you want to remove ${store.name}?`)) {
        this.removeStore(store).then(() =>
          this.$notify({message: `${store.name} removed`, type: 'info'})
        )
      }
    },
  }
}
</script>

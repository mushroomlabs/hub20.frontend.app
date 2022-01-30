<template>
  <div id="stores">
    <card title="Store Settings" subTitle="Set up a store for each site integration where you want to accept payments online">
      <ul class="table-action-menu">
        <li>
          <router-link :to="{name: 'store-create'}">Add New</router-link>
        </li>
      </ul>
      <store-table />
    </card>
  </div>
</template>
<script>
import StoreTable from '@/components/StoreTable'

export default {
  components: {
    StoreTable
  }
}
</script>

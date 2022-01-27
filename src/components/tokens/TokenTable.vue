<template>
  <table class="tokens table">
    <thead>
      <th class="token-data">Token</th>
      <th class="chain-data">Chain</th>
      <slot name="header">
      </slot>
    </thead>
    <tbody>
      <slot></slot>
    </tbody>
  </table>
</template>
<script>
export default {
  name: 'TokenTable',
}
</script>

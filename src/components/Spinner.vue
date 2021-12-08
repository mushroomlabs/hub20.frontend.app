<template>
  <div class="spinner">
    {{ message }}
  </div>
</template>
<script>
export default {
  name: 'spinner',
  props: {
    message: {
      type: String,
      default: 'Loading...',
    },
  },
}
</script>

<template>
  <component :is="tag" class="panel">
    <slot name="header">
      <span v-if="title" class="panel-title">{{ title }}</span>
    </slot>
    <div class="panel-body" v-if="$slots.default">
      <slot></slot>
    </div>
  </component>
</template>
<script>
export default {
  name: 'panel',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    title: String
  }
}
</script>

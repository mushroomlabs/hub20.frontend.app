<template>
  <div class="form-group" :class="{'has-error': errorMessage}">
    <slot name="label">
      <label v-if="label" class="control-label">
        {{ label }}
      </label>
    </slot>
    <textarea
      :value="value"
      @input="$emit('input', $event.target.value)"
      v-bind="$attrs"
      class="form-control"
    />
    <slot></slot>
    <span v-if="errorMessage" class="error-message">{{ errorMessage }}</span>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  name: 'fg-textarea',
  props: {
    label: String,
    value: [String, Number],
    errorMessage: String
  },
}
</script>

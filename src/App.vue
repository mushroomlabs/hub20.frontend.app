<template>
  <div>
    <notifications />
    <router-view v-if="isAuthenticated" />
    <BaseLayout v-if="!isAuthenticated" />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import BaseLayout from '@/layout/BaseLayout'

export default {
  components: {
    BaseLayout
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated'])
  },
  data() {
    return {
      timer: null
    }
  },
  mounted() {
    this.$store.subscribe(mutation => {
      switch (mutation.type) {
        case 'notifications/NOTIFICATION_ADD':
          this.$notify(mutation.payload)
          break
      }
    })
  }
}
</script>

<style lang="scss">
@import '@/assets/sass/app';

.vue-notifyjs.notifications {
  .alert {
    z-index: 10000;
  }
  .list-move {
    transition: transform 0.3s, opacity 0.4s;
  }
  .list-item {
    display: inline-block;
    margin-right: 10px;
  }
  .list-enter-active {
    transition: transform 0.2s ease-in, opacity 0.4s ease-in;
  }
  .list-leave-active {
    transition: transform 1s ease-out, opacity 0.4s ease-out;
  }

  .list-enter {
    opacity: 0;
    transform: scale(1.1);
  }
  .list-leave-to {
    opacity: 0;
    transform: scale(1.2, 0.7);
  }
}
</style>

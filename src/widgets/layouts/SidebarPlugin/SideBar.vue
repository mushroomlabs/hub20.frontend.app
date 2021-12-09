<template>
<div class="sidebar">
  <router-link to="/" class="logo" exact>
    <img :src="blockie" />
    <span>{{ userId }}</span>
  </router-link>
    <slot></slot>
    <ul class="nav">
      <slot name="links"> </slot>
    </ul>
    <moving-arrow :move-y="arrowMovePx"> </moving-arrow>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'

import blockies from 'ethereum-blockies'

import MovingArrow from './MovingArrow'

export default {
  props: {
    autoClose: {
      type: Boolean,
      default: true,
    },
  },
  provide() {
    return {
      autoClose: this.autoClose,
    }
  },
  components: {
    MovingArrow,
  },
  computed: {
    ...mapGetters('server', ['serverHostname']),
    ...mapGetters('auth', ['loggedUsername']),
    blockie() {
      const blockie = blockies.create({seed: this.userId, size: 12, scale: 3, color: '#235699', spotColor: '#420690'})
      return blockie.toDataURL()
    },
    userId() {
      return `${this.loggedUsername}@${this.serverHostname}`
    },
    links() {
      return this.$children.filter(component => {
        return component.$options.name === 'sidebar-link'
      })
    },
    arrowMovePx() {
      return this.linkHeight * this.activeLinkIndex
    },
  },
  data() {
    return {
      linkHeight: 65,
      activeLinkIndex: 0,
      windowWidth: 0,
      isWindows: false,
      hasAutoHeight: false,
    }
  },
  methods: {
    findActiveLink() {
      this.links.forEach((link, index) => {
        if (link.isActive) {
          this.activeLinkIndex = index
        }
      })
    },
  },
  mounted() {
    this.$watch('$route', this.findActiveLink, {
      immediate: true,
    })
  },
}
</script>

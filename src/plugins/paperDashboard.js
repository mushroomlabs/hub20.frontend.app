import Notify from 'vue-notifyjs'
import SideBar from '@/widgets/layouts/SidebarPlugin'
import GlobalComponents from './globalComponents'
import GlobalDirectives from './globalDirectives'

import 'es6-promise/auto'

export default {
  install(Vue) {
    Vue.use(GlobalComponents)
    Vue.use(GlobalDirectives)
    Vue.use(SideBar)
    Vue.use(Notify)
  }
}

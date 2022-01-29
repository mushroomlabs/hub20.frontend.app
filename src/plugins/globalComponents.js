import {
  ActionPanel,
  FormGroupInput,
  FormGroupTextarea,
  FormGroupSelect,
  Card,
  DropDown,
  Button
} from '../widgets/index'

const GlobalComponents = {
  install(Vue) {
    Vue.component('fg-input', FormGroupInput)
    Vue.component('fg-select', FormGroupSelect)
    Vue.component('fg-textarea', FormGroupTextarea)
    Vue.component('drop-down', DropDown)
    Vue.component('card', Card)
    Vue.component('p-button', Button)
    Vue.component('action-panel', ActionPanel)
  }
}

export default GlobalComponents

import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

import {store} from 'hub20-vue-sdk'

export const APP_SET_INITIALIZED = 'APP_SET_INITIALIZED'
export const APP_SET_RUNNING = 'APP_SET_RUNNING'
export const APP_SET_LOADED = 'APP_SET_LOADED'
export const APP_SET_FINALIZED = 'APP_SET_FINALIZED'
export const APP_RESET_STATE = 'APP_RESET_STATE'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

const initialState = () => ({
  running: false,
  loaded: false,
})

const getters = {
  isRunning: state => state.running,
  isLoaded: state => state.loaded,
  isReady: state => state.running && state.loaded,
}

const mutations = {
  [APP_SET_INITIALIZED](state) {
    state.running = true
    state.loaded = true
  },
  [APP_SET_RUNNING](state) {
    state.running = true
  },
  [APP_SET_LOADED](state) {
    state.loaded = true
  },
  [APP_SET_FINALIZED](state) {
    state.running = false
  },
  [APP_RESET_STATE](state) {
    Object.assign(state, initialState())
  },
}

const actions = {
  setServer({dispatch}, url) {
    dispatch('server/setUrl', url)
  },
  initialize({commit, dispatch, getters}) {
    if (!getters['server/isConnected']) {
      throw 'Not connected to any server'
    }

    if (!getters['auth/isAuthenticated']) {
      throw 'Not logged in'
    }

    const eventHandler = evt => {
      let eventTypes = store.EVENT_TYPES
      const message = JSON.parse(evt.data)
      const eventData = message.data
      switch (message.event) {
        case eventTypes.BLOCKCHAIN_BLOCK_CREATED:
          commit('network/NETWORK_SET_BLOCKCHAIN_HEIGHT', {
            chainId: eventData.chain_id,
            blockNumber: eventData.number,
          })
          break
        case eventTypes.BLOCKCHAIN_DEPOSIT_BROADCAST:
          commit('notifications/ADD_NOTIFICATION', {
            message: 'Blockchain transaction sent',
            type: 'info',
          })
          break
        case eventTypes.RAIDEN_ROUTE_EXPIRED:
        case eventTypes.BLOCKCHAIN_ROUTE_EXPIRED:
          commit('notifications/ADD_NOTIFICATION', {
            message:
              'Payment route is expired. Any payment received now will may not be credited to your account',
            type: 'warning',
          })
          break
        case eventTypes.ETHEREUM_NODE_UNAVAILABLE:
          commit('notifications/ADD_NOTIFICATION', {
            message: 'Server reported loss of connection with ethereum network',
            type: 'danger',
          })
          break
        case eventTypes.ETHEREUM_NODE_OK:
          commit('notifications/ADD_NOTIFICATION', {
            message: 'Server connection with ethereum network established',
            type: 'success',
          })
          break
        case eventTypes.BLOCKCHAIN_DEPOSIT_RECEIVED:
          dispatch('funding/fetchDeposit', eventData.depositId)
          commit('notifications/ADD_NOTIFICATION', {
            message: 'Deposit received via blockchain',
            type: 'success',
          })
          break
        default:
          console.log(evt)
      }
    }

    dispatch('events/initialize', getters['server/eventWebsocketUrl'])
    dispatch('events/setEventHandler', eventHandler)
    commit(APP_SET_INITIALIZED)
  },
  tearDown({commit, dispatch}) {
    return dispatch('auth/logout')
      .then(() => {
        dispatch('auth/tearDown')
        dispatch('account/tearDown')
        dispatch('notifications/tearDown')
        dispatch('funding/tearDown')
        dispatch('stores/tearDown')
        dispatch('events/tearDown')
        dispatch('audit/tearDown')
      })
      .finally(() => commit(APP_SET_FINALIZED))
  },
}

export default new Vuex.Store({
  modules: store,
  state: initialState(),
  strict: debug,
  plugins: debug ? [createLogger()] : [],
  actions,
  getters,
  mutations,
})

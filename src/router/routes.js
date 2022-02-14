import DashboardLayout from '@/layout/dashboard/DashboardLayout'

// Pages outside of Dashboard
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Setup from '@/pages/Setup'

// GeneralViews
import NotFound from '@/pages/NotFoundPage'

// Application Views
import Overview from '@/views/Overview'
import History from '@/views/History'
import Funding from '@/views/Funding'
import Deposit from '@/views/Deposit'
import Raiden from '@/views/Raiden'
import RaidenChannelDeposit from '@/views/RaidenChannelDeposit'
import RaidenChannelWithdraw from '@/views/RaidenChannelWithdraw'
import Stores from '@/views/Stores'
import StoreDetail from '@/views/StoreDetail'
import Transfer from '@/views/Transfer'
import TokenManagement from '@/views/TokenManagement'
import TokenListDetail from '@/views/TokenListDetail'

// Everything else
import store from '@/store/index'

const requireServerConnection = (to, from, next) => {
  store.dispatch('server/initialize').then(() => {
    if (!store.getters['server/isConnected']) {
      next('/setup')
    } else {
      next()
    }
  })
}

const requireAuthenticated = (to, from, next) => {
  store
    .dispatch('server/initialize')
    .then(() => store.dispatch('auth/initialize'))
    .then(() => {
      if (!store.getters['server/isConnected']) {
        next('/setup')
      }

      if (!store.getters['auth/isAuthenticated']) {
        next('/login')
      }

      store.dispatch('initialize')
      next()
    })
}

const requireAdmin = (to, from, next) => {
  store
    .dispatch('server/initialize')
    .then(() => store.dispatch('auth/initialize'))
    .then(() => store.dispatch('account/fetchProfileData'))
    .then(() => {
      if (!store.getters['server/isConnected']) {
        next('/setup')
      }

      if (!store.getters['auth/isAuthenticated']) {
        next('/login')
      }

      if (!store.getters['account/hasAdminAccess']) {
        next('/')
      }

      store.dispatch('initialize')
      next()
    })
}



const requireAnonymous = (to, from, next) => {
  if (store.getters['auth/isAuthenticated']) {
    store.dispatch('auth/tearDown').then(() => next())
  } else {
    next()
  }
}

const redirectLogout = (to, from, next) => {
  store.dispatch('tearDown').then(() => next('/login'))
}

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    beforeEnter: requireAuthenticated,
    children: [
      {
        path: '',
        name: 'home',
        component: Overview
      },
      {
        path: 'history',
        name: 'history',
        component: History
      },
      {
        path: 'funding',
        name: 'funding',
        component: Funding
      },
      {
        path: 'receive/:token',
        name: 'payment-order',
        component: Deposit,
        meta: {
          viewTitle: 'Request Payment'
        }
      },
      {
        path: 'deposit/:token',
        name: 'deposit',
        component: Deposit
      },
      {
        path: 'send/:token',
        name: 'withdraw',
        component: Transfer,
        meta: {
          viewTitle: 'Send'
        }
      },
      {
        path: 'transfer/:token',
        name: 'transfer',
        component: Transfer,
        meta: {
          viewTitle: 'Send Payment'
        }
      },
      {
        path: 'stores',
        name: 'stores',
        component: Stores
      },
      {
        path: 'store/new',
        name: 'store-create',
        component: StoreDetail,
        meta: {
          viewTitle: 'Add Store'
        }
      },
      {
        path: 'store/:id',
        name: 'store',
        component: StoreDetail
      },
      {
        path: 'tokens',
        name: 'tokens',
        component: TokenManagement
      },
      {
        path: 'tokens/lists/new',
        name: 'tokenlist-create',
        component: TokenListDetail,
        meta: {
          viewTitle: 'Create new Token List'
        }
      },
      {
        path: 'tokens/lists/:id',
        name: 'tokenlist-edit',
        component: TokenListDetail,
        meta: {
          viewTitle: 'Edit Token List'
        }
      }
    ]
  },
  {
    path: '/admin',
    component: DashboardLayout,
    beforeEnter: requireAdmin,
    children: [
      {
        path: '',
        name: 'admin',
        component: Overview
      },
      {
        path: 'raiden',
        name: 'raiden',
        component: Raiden
      },
      {
        path: 'raiden/:raiden/channel/:channel/deposit',
        name: 'raiden-channel-deposit',
        component: RaidenChannelDeposit,
        meta: {
          viewTitle: 'Request Deposit into Raiden Channel'
        }
      },
      {
        path: 'raiden/:raiden/channel/:channel/withdraw',
        name: 'raiden-channel-withdraw',
        component: RaidenChannelWithdraw,
        meta: {
          viewTitle: 'Request Withdraw from Raiden Channel'
        }
      },
    ]
  },
  {
    path: '/setup',
    name: 'setup',
    component: Setup,
    beforeEnter: requireAnonymous
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    beforeEnter: requireServerConnection
  },
  {
    path: '/logout',
    name: 'logout',
    beforeEnter: redirectLogout
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    beforeEnter: requireServerConnection
  },
  {
    path: '*',
    component: NotFound
  }
]

export default routes

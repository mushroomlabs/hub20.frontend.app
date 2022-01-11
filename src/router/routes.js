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
import Transfer from '@/views/Transfer'
import Raiden from '@/views/Raiden'
import Stores from '@/views/Stores'
import StoreDetail from '@/views/StoreDetail'

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
  store.dispatch('server/initialize')
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
        component: Overview,
      },
      {
        path: 'history',
        name: 'history',
        component: History,
      },
      {
        path: 'funding',
        name: 'funding',
        component: Funding,
      },
      {
        path: 'receive/:token',
        name: 'payment-order',
        component: Deposit,
        meta: {
          viewTitle: 'Request Payment',
        },
      },
      {
        path: 'deposit/:token',
        name: 'deposit',
        component: Deposit,
      },
      {
        path: 'send/:token',
        name: 'withdraw',
        component: Transfer,
        meta: {
          viewTitle: 'Send',
        },
      },
      {
        path: 'transfer/:token',
        name: 'transfer',
        component: Transfer,
        meta: {
          viewTitle: 'Send Payment',
        },
      },
      {
        path: 'stores',
        name: 'stores',
        component: Stores,
      },
      {
        path: 'store/new',
        name: 'store-create',
        component: StoreDetail,
        meta: {
          viewTitle: 'Add Store',
        },
      },
      {
        path: 'store/:id',
        name: 'store',
        component: StoreDetail,
      },
      {
        path: 'raiden',
        name: 'raiden',
        component: Raiden,
      },
    ],
  },
  {
    path: '/setup',
    name: 'setup',
    component: Setup,
    beforeEnter: requireAnonymous,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    beforeEnter: requireServerConnection,
  },
  {
    path: '/logout',
    name: 'logout',
    beforeEnter: redirectLogout,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    beforeEnter: requireServerConnection,
  },
  {
    path: '*',
    component: NotFound,
  },
]

export default routes

import Vue from 'vue'
import Router from 'vue-router'
import Store from './../store/index.js'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')

const Colors = () => import('@/views/theme/Colors')
const Typography = () => import('@/views/theme/Typography')

const Charts = () => import('@/views/charts/Charts')
const Widgets = () => import('@/views/widgets/Widgets')

// Views - Components
const Cards = () => import('@/views/base/Cards')
const Switches = () => import('@/views/base/Switches')
const Tabs = () => import('@/views/base/Tabs')
const Breadcrumbs = () => import('@/views/base/Breadcrumbs')
const Carousels = () => import('@/views/base/Carousels')
const Collapses = () => import('@/views/base/Collapses')
const Jumbotrons = () => import('@/views/base/Jumbotrons')
const ListGroups = () => import('@/views/base/ListGroups')
const Navs = () => import('@/views/base/Navs')
const Navbars = () => import('@/views/base/Navbars')
const Paginations = () => import('@/views/base/Paginations')
const Popovers = () => import('@/views/base/Popovers')
const ProgressBars = () => import('@/views/base/ProgressBars')
const Tables = () => import('@/views/tables/Tables')
const AdvancedTables = () => import('@/views/tables/AdvancedTables')
const Tooltips = () => import('@/views/base/Tooltips')

// Views - Buttons
const StandardButtons = () => import('@/views/buttons/StandardButtons')
const ButtonGroups = () => import('@/views/buttons/ButtonGroups')
const Dropdowns = () => import('@/views/buttons/Dropdowns')
const BrandButtons = () => import('@/views/buttons/BrandButtons')
const LoadingButtons = () => import('@/views/buttons/LoadingButtons')

// Views - Editors
const TextEditors = () => import('@/views/editors/TextEditors')
const CodeEditors = () => import('@/views/editors/CodeEditors')

// Views - Forms
const BasicForms = () => import('@/views/forms/Forms')
const AdvancedForms = () => import('@/views/forms/AdvancedForms')
const ValidationForms = () => import('@/views/forms/ValidationForms')
const MultiSelect = () => import('@/views/forms/MultiSelect')

// Views GoogleMaps
const GoogleMaps = () => import('@/views/GoogleMaps')

// Views - Icons
const CoreUIIcons = () => import('@/views/icons/CoreUIIcons')
const Brands = () => import('@/views/icons/Brands')
const Flags = () => import('@/views/icons/Flags')

// Views - Notifications
const Alerts = () => import('@/views/notifications/Alerts')
const Badges = () => import('@/views/notifications/Badges')
const Modals = () => import('@/views/notifications/Modals')
const Toaster = () => import('@/views/notifications/Toaster')


// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/authentication/Login')
const Register = () => import('@/views/pages/authentication/Register')
const ChangePassword = () => import('@/views/pages/authentication/ChangePassword')

// Views - Pages - Dealership
const DealershipAdd = () => import('@/views/pages/dealerships/DealershipAdd')
const Dealership = () => import('@/views/pages/dealerships/Dealership')
const Dealerships = () => import('@/views/pages/dealerships/Dealerships')

// Views - Pages - Inventory
const Inventory = () => import('@/views/pages/inventory/Inventory')

// Users
const Users = () => import('@/views/users/Users')
const User = () => import('@/views/users/User')

// Plugins
const Draggable = () => import('@/views/plugins/Draggable')
const Calendar = () => import('@/views/plugins/Calendar')
const Spinners = () => import('@/views/plugins/Spinners')

// Apps -> Invoice
const Invoice = () => import('@/views/apps/invoicing/Invoice')

// Apps -> Email
const EmailApp = () => import('@/views/apps/email/EmailApp')
const Compose = () => import('@/views/apps/email/Compose')
const Inbox = () => import('@/views/apps/email/Inbox')
const Message = () => import('@/views/apps/email/Message')

Vue.use(Router)

const router = new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: TheContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: { authRequired: true },
          component: Dashboard
        },
        {
          path: 'dealerships',
          name: 'Dealerships',
          meta: {
            authRequired: true,
            permissionsRequired: [
              'View Dealerships'
            ]
          },
          component: Dealerships,
        },
        {
          path: 'dealerships/:dealershipId',
          name: 'Dealership Details',
          meta: {
            authRequired: true,
            permissionsRequired: [
              'View Dealerships'
            ]
          },
          component: Dealership
        },
        {
          path: 'inventory',
          name: 'Vehicle Inventory',
          meta: {
            authRequired: true,
            permissionsRequired: [
              'View Vehicles'
            ]
          },
          component: Inventory
        },
        {
          path: '/pages',
          redirect: '/pages/404',
          name: 'Pages',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: '404',
              name: 'Page404',
              component: Page404
            },
            {
              path: '500',
              name: 'Page500',
              component: Page500
            },
            {
              path: 'login',
              name: 'Login',
              meta: {
                unAuthRequired: true
              },
              component: Login
            },
            {
              path: 'register',
              name: 'Register',
              meta: {
                unAuthRequired: true
              },
              component: Register
            },
            {
              path: 'changePassword',
              name: 'Change Password',
              meta: {
                authRequired: true
              },
              component: ChangePassword
            }
          ]
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {

  // if the promptPasswordChange flag is true and we're not already going to the 
  // change password page, redirect to change password page
  if (Store.state.auth.promptPasswordChange && to.path != '/pages/changePassword') {
    next('/pages/changePassword');
  }

  else if (Store.state.auth.role != "Administration" && to.name == 'Dealerships') {
    next(`/dealerships/${Store.state.auth.dealership}`);
  }

  else if (!Store.state.auth.promptPasswordChange && to.path == '/pages/changePassword') {
    next('/dashboard');
  }

  // add the meta tag "authRequired: true" to any routes you want protected
  else if (to.meta.authRequired && !Store.state.auth.token) {
    next('/pages/login');
  }

  // add the meta tage "unAuthRequired: true" to any routes which requires the user
  // to be logged out to access
  else if (to.meta.unAuthRequired && !!Store.state.auth.token) {
    next('/dashboard');
  }

  // add the meta tag "permissionsRequired: [permissions]" to any routes needing specific permissions
  else if (to.meta.permissionsRequired) {
    // go through the permissionsRequired list and verify they exist in the logged in user permissions
    // if not, call next(false) to cancel the request

    const BreakLoop = {};
    let authorized = true;
    try {
      to.meta.permissionsRequired.forEach(permission => {
        if (!Store.state.auth.userPermissions.includes(permission)) {
          throw BreakLoop;
        }
      });
    } catch (e) {
      authorized = false;
    }
    // user has the correct permissions, therefore continue with the request
    if (authorized)
      next();
    else
      next('/dashboard');
  }

  // all checks validated, therefore continue with the request
  else {
    next();
  }

})

export default router;

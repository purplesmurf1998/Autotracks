import Vue from 'vue'
import Router from 'vue-router'
import Store from './../store/index.js'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/pages/Dashboard')

// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/authentication/Login')
const Register = () => import('@/views/pages/authentication/Register')
const ChangePassword = () => import('@/views/pages/authentication/ChangePassword')

// Views - Pages - Dealership
const Dealership = () => import('@/views/pages/dealerships/Dealership')
const Dealerships = () => import('@/views/pages/dealerships/Dealerships')

// Views - Pages - Inventory
const Inventory = () => import('@/views/pages/inventory/Inventory')
const InventoryAdd = () => import('@/views/pages/inventory/InventoryAdd')
const Vehicle = () => import('@/views/pages/vehicle/Vehicle')

// Views - Pages - Transactions
const Transaction = () => import('@/views/pages/transactions/Transaction')

// Views - Pages - VehicleLists
const UserVehicleLists = () => import('@/views/pages/vehicleLists/UserVehicleLists.vue')

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
              'Administration'
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
              'Administration',
              'Management'
            ]
          },
          component: Dealership
        },
        {
          path: 'inventory',
          name: 'Vehicle Inventory',
          meta: {
            authRequired: true,
          },
          component: Inventory,
          children: [
            {
              path: 'details/:vehicleId',
              name: 'Vehicle',
              meta: {
                authRequired: true,
              },
              component: Vehicle
            }
          ]
        },
        {
          path: 'inventory/add/:dealershipId',
          name: 'Add Vehicle Inventory',
          meta: {
            authRequired: true,
            permissionsRequired: [
              'Administration',
              'Management',
              'Reception'
            ]
          },
          component: InventoryAdd
        },
        {
          path: 'transactions',
          name: 'transactions',
          meta: {
            authRequired: true,
            permissionsRequired: [
              'Administration',
              'Management',
              'Sales Rep'
            ]
          },
          component: Transaction
        },
        {
          path: 'vehicle-lists',
          name: 'Vehicle Lists Table',
          meta: {
            authRequired: true,
            permissionsRequired: [
              'Administration',
              'Management',
              'Sales Rep'
            ]
          },
          component: UserVehicleLists
        },
      ]
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
});

router.beforeEach((to, from, next) => {

  //If path name is null, redirect to 404 page.
  if (!to.name) {
    router.replace('/pages/404');
  }

  // if the promptPasswordChange flag is true and we're not already going to the 
  // change password page, redirect to change password page
  else if (Store.state.auth.promptPasswordChange && to.path != '/pages/changePassword') {
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
    // go through the permissionsRequired list that contains allowed Roles, and verify that the user has a valid role
    // if not, call next(false) to cancel the request

    let authorized = false;
    to.meta.permissionsRequired.forEach(role => {
      if (Store.state.auth.role == role)
        next();
    });
    
    if (!authorized)
      next('/dashboard');
  }

  // all checks validated, therefore continue with the request
  else {
    next();
  }

})

export default router;

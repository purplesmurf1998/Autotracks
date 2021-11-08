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

const DealershipAdd = () => import('@/views/pages/dealerships/DealershipAdd')
const Dealership = () => import('@/views/pages/dealerships/Dealership')
const Dealerships = () => import('@/views/pages/dealerships/Dealerships')

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


export default new Router({

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
          children: [
            {
              path: 'add',
              name: 'Add',
              meta: {
                authRequired: true,
                permissionsRequired: [
                  'Add Dealerships'
                ]
              },
              component: DealershipAdd
            },
            {
              path: 'details',
              name: 'Details',
              meta: {
                authRequired: true,
                permissionsRequired: [
                  'View Dealerships'
                ]
              },
              component: Dealership
            }
          ]
        },
        {
          component: Dashboard
        },
        {
          path: 'theme',
          redirect: '/theme/colors',
          name: 'Theme',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: 'colors',
              name: 'Colors',
              component: Colors
            },
            {
              path: 'typography',
              name: 'Typography',
              component: Typography
            }
          ]
        },
        {
          path: 'charts',
          name: 'Charts',
          component: Charts
        },
        {
          path: 'tables',
          redirect: '/tables/tables',
          name: 'Tables',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: 'tables',
              name: 'Basic tables',
              component: Tables
            },
            {
              path: 'advanced-tables',
              name: 'Advanced tables',
              component: AdvancedTables
            }
          ]
        },
        {
          path: 'widgets',
          name: 'Widgets',
          component: Widgets
        },
        {
          path: 'users',
          meta: { label: 'Users' },
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: '',
              name: 'Users',
              component: Users
            },
            {
              path: ':id',
              meta: {
                label: 'User Details'
              },
              name: 'User',
              component: User
            }
          ]
        },
        {
          path: 'base',
          redirect: '/base/cards',
          name: 'Base',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: 'breadcrumbs',
              name: 'Breadcrumbs',
              component: Breadcrumbs
            },
            {
              path: 'cards',
              name: 'Cards',
              component: Cards
            },
            {
              path: 'carousels',
              name: 'Carousels',
              component: Carousels
            },
            {
              path: 'collapses',
              name: 'Collapses',
              component: Collapses
            },
            {
              path: 'jumbotrons',
              name: 'Jumbotrons',
              component: Jumbotrons
            },
            {
              path: 'list-groups',
              name: 'List Groups',
              component: ListGroups
            },
            {
              path: 'navs',
              name: 'Navs',
              component: Navs
            },
            {
              path: 'navbars',
              name: 'Navbars',
              component: Navbars
            },
            {
              path: 'paginations',
              name: 'Paginations',
              component: Paginations
            },
            {
              path: 'popovers',
              name: 'Popovers',
              component: Popovers
            },
            {
              path: 'progress-bars',
              name: 'Progress Bars',
              component: ProgressBars
            },
            {
              path: 'switches',
              name: 'Switches',
              component: Switches
            },
            {
              path: 'tabs',
              name: 'Tabs',
              component: Tabs
            },
            {
              path: 'tooltips',
              name: 'Tooltips',
              component: Tooltips
            }
          ]
        },
        {
          path: 'buttons',
          redirect: '/buttons/standard-buttons',
          name: 'Buttons',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: 'standard-buttons',
              name: 'Standard Buttons',
              component: StandardButtons
            },
            {
              path: 'button-groups',
              name: 'Button Groups',
              component: ButtonGroups
            },
            {
              path: 'dropdowns',
              name: 'Dropdowns',
              component: Dropdowns
            },
            {
              path: 'brand-buttons',
              name: 'Brand Buttons',
              component: BrandButtons
            },
            {
              path: 'loading-buttons',
              name: 'Loading Buttons',
              component: LoadingButtons
            }
          ]
        },
        {
          path: 'editors',
          redirect: '/editors/text-editors',
          name: 'Editors',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: 'text-editors',
              name: 'Text Editors',
              component: TextEditors
            },
            {
              path: 'code-editors',
              name: 'Code Editors',
              component: CodeEditors
            }
          ]
        },
        {
          path: 'forms',
          redirect: '/forms/basic-forms',
          name: 'Forms',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'basic-forms',
              name: 'Basic Forms',
              component: BasicForms
            },
            {
              path: 'advanced-forms',
              name: 'Advanced Forms',
              component: AdvancedForms
            },
            {
              path: 'validation-forms',
              name: 'Form Validation',
              component: ValidationForms
            },
            {
              path: 'multi-select',
              name: 'Multiselect',
              component: MultiSelect
            },
          ]
        },
        {
          path: 'google-maps',
          name: 'Google Maps',
          component: GoogleMaps
        },
        {
          path: 'icons',
          redirect: '/icons/font-awesome',
          name: 'Icons',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'coreui-icons',
              name: 'CoreUI Icons',
              component: CoreUIIcons
            },
            {
              path: 'flags',
              name: 'Flags',
              component: Flags
            },
            {
              path: 'brands',
              name: 'Brands',
              component: Brands
            }
          ]
        },
        {
          path: 'notifications',
          redirect: '/notifications/alerts',
          name: 'Notifications',
          component: {

            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'alerts',
              name: 'Alerts',
              component: Alerts
            },
            {
              path: 'badges',
              name: 'Badges',
              component: Badges
            },
            {
              path: 'modals',
              name: 'Modals',
              component: Modals
            },
            {
              path: 'toaster',
              name: 'Toaster',
              component: Toaster
            }
          ]
        },
        {
          path: 'plugins',
          redirect: '/plugins/draggable',
          name: 'Plugins',
          component: {

    
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'draggable',
              name: 'Draggable Cards',
              component: Draggable
            },
            {
              path: 'calendar',
              name: 'Calendar',
              component: Calendar
            },
            {
              path: 'spinners',
              name: 'Spinners',
              component: Spinners
            }
          ]
        },
       
        {
          path: 'apps',
          name: 'Apps',
          redirect: '/apps/invoicing/invoice',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'invoicing',
              redirect: '/apps/invoicing/invoice',
              name: 'Invoicing',
              component: {
                render (c) { return c('router-view') }
              },
              children: [
                {
                  path: 'invoice',
                  name: 'Invoice',
                  component: Invoice
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/apps/email',
      redirect: '/apps/email/inbox',
      name: 'Email',
      component: EmailApp,
      children: [{
        path: 'compose',
        name: 'Compose',
        component: Compose
      },
      {
        path: 'inbox',
        name: 'Inbox',
        component: Inbox
      },
      {
        path: 'message',
        name: 'Message',
        component: Message
      }
      ]
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render (c) { return c('router-view') }
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
          component: Register
        },
      ]
    },
  ]
});

router.beforeEach((to, from, next) => {
  console.log(`Logged In: ${Store.state.auth.loggedIn}`);
  console.log(`Auth Required: ${to.meta.authRequired}`);
  console.log(`UnAuth Required: ${to.meta.unAuthRequired}`);
  console.log(`Permissions Required: ${to.meta.permissionsRequired}`);
  console.log(`Permissions: ${!Store.state.auth.userPermissions}`);
  // add the meta tag "authRequired: true" to any routes you want protected
  if (to.meta.authRequired && !Store.state.auth.loggedIn) {
    next('/pages/login');
  }

  // add the meta tage "unAuthRequired: true" to any routes which requires the user
  // to be logged out to access
  else if (to.meta.unAuthRequired && Store.state.auth.loggedIn) {
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
    } catch(e) {
      authorized = false;
    }

    if (authorized)
      next();
    else
      next('/pages/500');
  }

  // all checks validated, therefore continue with the request
  else {
    next();
  }
  
})

export default router;
        }
      ]
    }
  ]
})

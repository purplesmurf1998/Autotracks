<script>
export default {
  name: 'nav',
  computed: { 
    sidebarItems () {
      return [{
        _name: 'CSidebarNav',
        _children: [
          {
            _name: 'CSidebarNavItem',
            name: this.$t('menu.dashboard'),
            to: '/dashboard',
            icon: 'cil-speedometer'
          },
          {
            _name: 'CSidebarNavTitle',
            _children: ['Pages']
          },
          {
            _name: 'CSidebarNavItem',
            _attrs: {
              hidden: !this.$store.state.auth.userPermissions.includes('View Dealerships')
            },
            name: 'Dealerships',
            to: '/dealerships',
            icon: 'cil-user',
            ...(!this.$store.state.auth.createDealershipCompleted || !this.$store.state.auth.createUserCompleted) ? {
              badge: {
                color: 'danger',
                text: 'NEW!'
              }
            } : null
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Vehicle Properties',
            to: '/pages/vehicle/properties',
            icon: 'cil-pencil'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Inventory',
            to: '/pages/vehicle/inventory',
            icon: 'cil-spreadsheet'
          }
        ]
      }]
    }
  }
}
</script>

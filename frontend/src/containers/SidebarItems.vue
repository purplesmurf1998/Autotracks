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
            icon: 'cil-speedometer',
            badge: {
              color: 'primary',
              text: 'NEW'
            }
          },
          {
            _name: 'CSidebarNavTitle',
            _children: ['Pages']
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Dealerships',
            to: '/pages/dealerships',
            icon: 'cil-drop'
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
            icon: 'cil-pencil'
          }
        ]
      }]
    }
  }
}
</script>

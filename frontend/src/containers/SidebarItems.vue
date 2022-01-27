<script>
export default {
  name: "nav",
  computed: {
    sidebarItems() {
      return [
        {
          _name: "CSidebarNav",
          _children: [
            {
              _name: "CSidebarNavItem",
              name: this.$t("menu.dashboard"),
              to: "/dashboard",
              icon: "cil-speedometer",
            },
            {
              _name: "CSidebarNavTitle",
              _children: ["Pages"],
            },
            {
              _name: "CSidebarNavItem",
              _attrs: {
                hidden:
                  !this.$store.state.auth.userPermissions.includes(
                    "View Dealerships"
                  ),
              },
              name: "Dealerships",
              to: "/dealerships",
              icon: "cil-user",
              ...(!this.$store.state.auth.createDealershipCompleted ||
              !this.$store.state.auth.createUserCompleted
                ? {
                    badge: {
                      color: "danger",
                      text: "NEW!",
                    },
                  }
                : null),
            },
            {
              _name: "CSidebarNavItem",
              name: "Inventory",
              to: "/inventory",
              icon: "cil-spreadsheet",
            },
            {
              _name: "CSidebarNavItem",
              name: "Vehicle Lists",
              to: "/vehicle-lists",
              icon: "cil-list",
            },
            // {
            //   _name: 'CSidebarNavDropdown',
            //   name: 'Vehicle Lists',
            //   route: '/vehicle-lists',
            //   icon: 'cil-list',
            //   items: [
            //     {
            //       name: 'View Vehicle Lists',
            //       to: '/vehicle-lists',
            //       icon: {
            //         name: 'cil-arrow-thick-right'
            //       }
            //     },
            //     {
            //       name: 'Breadcrumbs',
            //       to: '/vehicle-lists/vehicleListId',
            //       icon: {
            //         name: 'cil-star',
            //         class: 'text-warning'
            //       }
            //     },
            //     {
            //       name: 'Cards',
            //       to: '/vehicle-lists/vehicleListId',
            //       icon: {
            //         name: 'cil-star',
            //         class: 'text-warning'
            //       }
            //     },
            //   ]
            // },
          ],
        },
      ];
    },
  },
};
</script>

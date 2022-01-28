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
              icon: "cil-industry",
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
              icon: "cil-car-alt",
            },
            {
              _name: "CSidebarNavItem",
              name: "Transactions",
              to: "/transactions",
              icon: "cil-chart-line",
            },
          ],
        },
      ];
    },
  },
};
</script>

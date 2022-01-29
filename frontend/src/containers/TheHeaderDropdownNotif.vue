<template>
  <CDropdown
    placement="bottom-end"
    :caret="false"
    in-nav
    class="c-header-nav-item d-md-down-none mx-2"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink
      @click.native="notifRead()">
        <CIcon name="cil-bell"/>
        <CBadge v-if="unRead" shape="pill" color="danger">{{ itemsCount }}</CBadge>
      </CHeaderNavLink>
    </template>
    <CDropdownHeader tag="div" class="text-center bg-light">
      <strong>You have {{ notifications.length }} notifications</strong>
    </CDropdownHeader>
    <CDropdownItem v-for="notif in notifications"
    :key="notif._id"
    > {{notif.title}}
    </CDropdownItem>
  </CDropdown>
</template>
<script>
export default {
  name: "TheHeaderDropdownNotif",
  data() {
    return { 
      itemsCount: 0,
      notifications: [],
      unRead: false 
    };
  },
  methods: {
    fetchNotifications() {
      // fetch new events
    },
    notifRead() {
      this.itemsCount = 0;
      this.unRead = false;
    }
  },
  mounted() {
    //Events that we need to listen to: 
    //['vehicle_sale_pending', 'vehicle_sold', 'vehicle_delivered', 'vehicle_missing', 'vehicle_moved', 'vehicle_found'],
    // do a first time api call to the server for new events
    // create the socket
    // when the socket get pinged, fetch new events
    this.$store.state.auth.userEventsSubscriptions.forEach(element => {
      this.$store.state.events.socket.on(element, (arg) => {
        const notif = {'item': arg.description};
        this.notifications.push(arg);
        this.itemsCount = this.itemsCount + 1;
        this.unRead = true;
      })
    });
  },
};
</script>

<style scoped>
.c-icon {
  margin-right: 0.3rem;
}
</style>
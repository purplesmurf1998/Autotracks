<template>
  <CDropdown
    placement="bottom-end"
    :caret="false"
    in-nav
    class="c-header-nav-item mx-2"
    add-menu-classes="pt-0"
    id="notif_dd"
  >
    <template #toggler>
      <CHeaderNavLink
      @click.native="fetchNotifications">
        <CIcon name="cil-bell"/>
        <CBadge v-if="itemsCount!=0" shape="pill" color="info">{{ itemsCount }}</CBadge>
      </CHeaderNavLink>
    </template>
    <CDropdownHeader tag="div" class="text-center bg-light">
      <strong>You have {{ unReadNotif.length }} notifications</strong>
    </CDropdownHeader>
    <CDropdownItem v-for="notif in top5Notif"
    :key="notif._id"
    :class="notif.className"
    >
      <div class="message">
        <div>
          <small class="blueTxt">{{notif.user}}</small>
          <small class="float-right mt-1 blueTxt">{{notif.timestamp}}</small>
        </div>
        <div class="text-truncate font-weight-bold">{{notif.title}}</div>
        <div class="small text-muted text-truncate">{{notif.description}}</div>
      </div>
      <!-- <CIcon name="cib-discover" class="notif-unread small"/> -->
    </CDropdownItem>
    <CDropdownItem 
      @click="setNotifModal" 
      class="border-top text-center blueTxt"
    >
      <strong>View all notifications</strong>
    </CDropdownItem>
  </CDropdown>
</template>

<script>
const axios = require('axios');

export default {
  name: "TheHeaderDropdownNotif",
  data() {
    return {
      itemsCount: 0, 
      notifications: [],
      subscribedEvents: null,
      top5Notif: [],
      unReadNotif: [],
    };
  },
  methods: {
    setNotifModal () {
      this.$emit('notifModal');
    },
    fetchNotifications() {
      this.notifications = [];
      this.top5Notif = [];
      // fetch new events
      axios({
        methods: "GET",
        url: `${this.$store.state.api}/events/dealership/${this.$store.state.auth.dealership}?eventType=${this.subscribedEvents}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          var ctr = 0;
          response.data.payload.forEach((notif) => {
            var currentDateObj = new Date(notif.timestamp);
            notif.timestamp = currentDateObj.toString().split('GMT')[0];
            this.notifications.push(notif);
            if (ctr < 5) {
              notif.className = notif.viewers.includes(this.$store.state.auth.userId) ? "none" : "background-unread"
              this.top5Notif.push(notif);
            }
            ctr = ctr + 1;
          });
        }
      })
      .catch((error) => {
        console.log(error);
      })
    },
    fetchUnReadNotif() {
      // fetch new Unread events
      this.unReadNotif= [];
      axios({
        methods: "GET",
        url: `${this.$store.state.api}/events/dealership/${this.$store.state.auth.dealership}/user/${this.$store.state.auth.userId}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
      .then((response) => {
        if (response.data.success) { 
          response.data.payload.forEach((notif) => {
            var currentDateObj = new Date(notif.timestamp);
            notif.timestamp = currentDateObj.toString().split('GMT')[0];
            this.unReadNotif.push(notif);
          })
          this.itemsCount = this.unReadNotif.length;
        }
      })
      .catch((error) => {
        console.log(error);
      })
    },
  },
  mounted() {
    //Events that we need to listen to: 
    //['vehicle_sale_pending', 'vehicle_sold', 'vehicle_delivered', 'vehicle_missing', 'vehicle_moved', 'vehicle_found'],
    // do a first time api call to the server for new events
    // create the socket
    // when the socket get pinged, fetch new events
    this.fetchUnReadNotif();
    this.$store.state.auth.userEventsSubscriptions.forEach(element => {
      this.$store.state.events.socket.on(element, (arg) => {
        // if the user didn't view this notification yet, then increment the notif count
        if (!arg.viewers.includes(this.$store.state.auth.userId))
          this.itemsCount = this.itemsCount + 1;
      })
    });
    this.subscribedEvents = this.$store.state.auth.userEventsSubscriptions.join(',');
  },
};
</script>

<style scoped>
.c-icon {
  margin-right: 0.3rem;
}

.blueTxt {
  color: #39f;
}

.background-unread {
  background-color: rgb(228, 237, 247);
}

</style>
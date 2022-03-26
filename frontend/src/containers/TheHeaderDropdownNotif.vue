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
    @click="redirectAndMarkRead(notif)"
    >
      <div class="message" style="width: 100%">
        <div>
          <small class="blueTxt">{{notif.user}}</small>
          <small class="float-right mt-1 blueTxt">{{notif.timestamp}}</small>
        </div>
        <div class="text-truncate font-weight-bold">{{notif.title}}</div>
        <div class="small text-muted text-truncate">{{notif.description}}</div>
      </div>
    </CDropdownItem>
    <CDropdownItem 
      @click="setNotifModal" 
      class="border-top text-center blueTxt"
    >
      <strong v-if="itemsCount > 0">View all notifications ({{itemsCount}})</strong>
      <strong v-if="itemsCount == 0">View all notifications</strong>
    </CDropdownItem>
  </CDropdown>
</template>

<script>
const axios = require('axios');
const { containsRoles, formattedDate } = require("../utils/index");

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
    userHasRoles(...roles) {
      return containsRoles(roles);
    },
    setNotifModal () {
      this.$emit('notifModal');
    },
    fetchNotifications() {
      this.notifications = [];
      this.top5Notif = [];
      this.fetchUnReadNotif();
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
            notif.timestamp = formattedDate(notif.timestamp)
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
            notif.timestamp = formattedDate(notif.timestamp);
            this.unReadNotif.push(notif);
          })
          this.itemsCount = this.unReadNotif.length;
        }
      })
      .catch((error) => {
        console.log(error);
      })
    },
    redirect(notif) {
      //if the redirect should happen to the transaction page, make sure that the user has the allowed roles to view
      if (notif.title.indexOf('Vehicle') == -1 && this.userHasRoles('Reception'))
        return;
      localStorage.setItem('vehicle', notif.vehicle);
      var redirect = notif.title.indexOf('Vehicle') == -1 ? '/transactions' : '/inventory'
      if ((this.$route.path == '/transactions' && redirect == '/transactions') || (this.$route.path == '/inventory' && redirect == '/inventory'))
        this.$router.go();
      else
        this.$router.push(redirect);
    },
    redirectAndMarkRead(notif) {
      //if the clicked notification is unread (i.e. className = background-unread), then mark it read and redirect. if it's read, then only redirect
      if (notif.className == 'background-unread')
      {
        axios({
          method: "PUT",
          url: `${this.$store.state.api}/events/${notif._id}/user/${this.$store.state.auth.userId}`,
          headers: {
            Authorization: `Bearer ${this.$store.state.auth.token}`,
          },
        })
        .then((response) => {
          if (response.data.success) {
            console.log("success");
          }
        })
        .catch((error) => {
          console.log(error);
        })
        this.itemsCount = this.itemsCount - 1;
        this.redirect(notif);
      }
      else {
        this.redirect(notif);
      }
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
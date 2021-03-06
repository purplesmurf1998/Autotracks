<template>
  <div class="scroll">
    <CNav fill variant="pills" class="mb-3">
      <CNavItem :active="tab == 0" @click.native="setTab(0)">
        All Notifications ({{notifications.length}})
      </CNavItem>
      <CNavItem :active="tab == 1" @click.native="setTab(1)">
        Unread Notifications ({{unReadNotif.length}})
      </CNavItem>
    </CNav>
    <hr />
    <CCard v-if="tab == 0">
          <CCardBody v-for="notif in notifications"
          :key="notif._id"
          class='cursor-pointer'
          @click="redirectAndMarkRead(notif, true)">
              <div class="message">
                  <div>
                      <small class="blueTxt">{{notif.user}}</small>
                      <small class="float-right mt-1 blueTxt">{{notif.timestamp}}</small>
                  </div>
                  <div class="text-truncate font-weight-bold">{{notif.title}}</div>
                  <div class="small text-muted text-truncate">{{notif.description}}</div>
              </div>
          </CCardBody>
    </CCard>
    <CCard v-if="tab == 1">
        <CCardBody v-for="notif in unReadNotif"
        :key="notif._id"
        class='cursor-pointer'
        @click="redirectAndMarkRead(notif, false)">
            <div class="message">
                <div>
                    <small class="blueTxt">{{notif.user}}</small>
                    <small class="float-right mt-1 blueTxt">{{notif.timestamp}}</small>
                </div>
                <div class="text-truncate font-weight-bold">{{notif.title}}</div>
                <div class="small text-muted text-truncate">{{notif.description}}</div>
            </div>
        </CCardBody>
    </CCard>

  </div>
</template>

<script>
const axios = require("axios");
const { containsRoles, formattedDate } = require("../utils/index");

export default {
  props: ["setNotifModal"],
  name: "NotifModal",
  data() {
    return {
      tab: 0,
      notifications: [],
      unReadNotif: [],
      subscribedEvents: null,
    };
  },
  methods: {
    userHasRoles(...roles) {
      return containsRoles(roles);
    },
    setTab(tab) {
      this.tab = tab;
    },
    fetchNotif() {
        this.notifications = [];
        axios({
            methods: "GET",
            url: `${this.$store.state.api}/events/dealership/${this.$store.state.auth.dealership}?eventType=${this.subscribedEvents}`,
            headers: {
            Authorization: `Bearer ${this.$store.state.auth.token}`,
            },
        })
        .then((response) => {
            if (response.data.success) {
                response.data.payload.forEach((notif) => {
                    notif.timestamp = formattedDate(notif.timestamp);
                    this.notifications.push(notif);
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    },
    getUnReadNotif() {
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
          this.itemsCount = 0;
          response.data.payload.forEach((notif) => {
            notif.timestamp = formattedDate(notif.timestamp);
            this.unReadNotif.push(notif);
          })
        }
      })
      .catch((error) => {
        console.log(error);
      })
    },
    redirectPage(notif) {
      //if the redirect should happen to the transaction page, make sure that the user has the allowed roles to view
      if (notif.title.indexOf('Vehicle') == -1 && this.userHasRoles('Reception'))
        return;
      localStorage.setItem('vehicle', notif.vehicle)
      var redirect = notif.title.indexOf('Vehicle') == -1 ? '/transactions' : '/inventory'
      if ((this.$route.path == '/transactions' && redirect == '/transactions') || (this.$route.path == '/inventory' && redirect == '/inventory'))
        this.$router.go();
      else
        this.$router.push(redirect);
    },
    redirectAndMarkRead(notif, redirectOnly) {
      if (!redirectOnly) {
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
        this.setNotifModal(false);
        this.redirectPage(notif);
      }
      else {
        this.redirectPage(notif);
      } 
    },
  },
  mounted() {
      this.subscribedEvents = this.$store.state.auth.userEventsSubscriptions.join(',');
      this.fetchNotif();
      this.getUnReadNotif();
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

.scroll {
  height: 300px;
  overflow: auto;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
<template>
  <div>
    <CDropdown
      inNav
      class="c-header-nav-items"
      placement="bottom-end"
      add-menu-classes="pt-0"
      id = "nav-dropdown"
    >
      <template #toggler>
        <CHeaderNavLink>
          <strong>{{ $store.state.auth.firstName }} {{ $store.state.auth.lastName }}</strong>
        </CHeaderNavLink>
      </template>
      <CDropdownHeader
        tag="div"
        class="text-center"
        color="light"
      >
        <strong>Settings</strong>
      </CDropdownHeader>
      <CDropdownItem @click="subscriptionModal = true">
        <CIcon name="cil-task" /> Subscriptions
      </CDropdownItem>
      <CDropdownItem @click="logoutUser"
      id = "log-out"
      >
        <CIcon name="cil-account-logout" /> Logout
      </CDropdownItem>
    </CDropdown>
    <CModal
      :show.sync="subscriptionModal"
      :centered="true"
    >
      <account-subscriptions
        v-if="subscriptionModal"
        :setSubscriptionModal="setSubscriptionModal"
      />
    <template #header>
        <h6 class="modal-title">Account Subscriptions</h6>
        <CButtonClose @click="subscriptionModal = false" />
      </template>
      <template #footer>
        <span></span>
      </template>
    </CModal>
  </div>
</template>

<script>
import AccountSubscriptions from "./AccountSubscriptions.vue"

export default {
  name: 'TheHeaderDropdownAccnt',
  components: {
    "account-subscriptions": AccountSubscriptions,
  },
  data () {
    return { 
      subscriptionModal: false
    }
  },
  methods: {
    logoutUser() {
      this.$store.dispatch('logout');
      this.$router.push('/pages/login');
    },
    setSubscriptionModal(value){
      this.subscriptionModal = value;
    }
  }
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>

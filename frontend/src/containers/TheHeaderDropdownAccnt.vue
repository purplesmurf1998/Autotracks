<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
    id = "nav-dropdown"
  >
    <template #toggler>
      <CHeaderNavLink>
        <!-- <div class="c-avatar">
          <img
            src="img/avatars/6.jpg"
            class="c-avatar-img "
          />
        </div> -->
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
    <CDropdownItem>
      <CIcon name="cil-task" /> Subscriptions
    </CDropdownItem>
    <CDropdownItem @click="logoutUser"
    id = "log-out"
    >
      <CIcon name="cil-account-logout" /> Logout
    </CDropdownItem>
  </CDropdown>
</template>

<script>
export default {
  name: 'TheHeaderDropdownAccnt',
  data () {
    return { 
      itemsCount: 42
    }
  },
  methods: {
    logoutUser() {
      this.$store.dispatch('logout');
      this.$router.push('/pages/login');
    }
  }
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>

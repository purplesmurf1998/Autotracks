<template>
  <div>
    <CRow>
      <edit-dealerships :dealershipAccount="dealership"/>
      <edit-users :users="users"/>
    </CRow>
  </div>
</template>

<script>
import EditDealership from "../../../modules/EditDealership.vue"
import EditUsers from "../../../modules/EditUsers.vue"

export default {

  name: "NewDealership",
  data() {
    return {
      dealership: {
        dealershipName: '',
        dealershipDescription: '',
        admin: '' // get the currently logged in user id if admin
      },
      users: []
    }
  },
  components: {
    'edit-dealerships': EditDealership,
    'edit-users': EditUsers
  },
  methods: {
    test () {

    }
  }
}
</script>
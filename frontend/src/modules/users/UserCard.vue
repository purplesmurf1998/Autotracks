<template>
  <CCard>
    <CCardBody class="p-3">
      <view-user
        v-if="!editingUser"
        :user="user"
        :setEditingUser="setEditingUser"
      />
      <edit-user
        v-if="editingUser"
        :setEditingUser="setEditingUser"
        :user="user"
        :index="index"
        :updateUser="updateUser"
      />
    </CCardBody>
  </CCard>
</template>

<script>
import ViewUser from "./ViewUser.vue";
import EditUser from "./EditUsers.vue";

export default {
  data() {
    return {};
  },
  props: ["user", "editingUser", "setEditingUser", 'index', 'updateUser'],
  components: {
    "view-user": ViewUser,
    "edit-user": EditUser,
  },
  methods: {
    removeUser() {
      console.log("remove user" + user._id);
    },
  },
};
</script>

<style scoped>
</style>
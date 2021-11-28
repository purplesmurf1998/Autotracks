<template>
  <div>
    <CCard class="mt-2">
      <CCardBody>
        <CRow>
          <CCol>
            <h3>List of staff accounts</h3>
            <CListGroup class="mt-3" v-if="staff.length > 0">
              <CListGroupItem
                tag="button"
                v-for="(user, index) in staff"
                :key="user._id"
                :id="user._id"
                :active="
                  selectedStaffAccount && user._id == selectedStaffAccount._id
                "
                @click="setActiveStaff(user, index)"
              >
                {{ user.first_name }} {{ user.last_name }}
              </CListGroupItem>
            </CListGroup>
            <CButton
              color="secondary"
              class="mt-3"
              id="create-staff-acc"
              @click="
                () => {
                  editingUser = false;
                  addingStaffAccount = true;
                }
              "
              v-if="userHasPermissions('Add Staff Users')"
            >
              Create a staff account
            </CButton>
          </CCol>
          <CCol>
            <h3>Selected staff account details</h3>
            <user-card
              class="mt-2"
              :user="selectedStaffAccount"
              :editingUser="editingUser"
              :setEditingUser="setEditingUser"
              :updateUser="updateUser"
              :index="selectedStaffIndex"
              v-if="!!selectedStaffAccount"
            />
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    <CModal :show.sync="addingStaffAccount" :centered="true" size="lg">
      <staff-account-add
        v-if="addingStaffAccount"
        :setAddingStaffAccount="setAddingStaffAccount"
        :addNewStaffAccount="addNewStaffAccount"
      />
      <template #header>
        <h6 class="modal-title">Add a staff account to your dealership!</h6>
        <CButtonClose @click="addingStaffAccount = false" />
      </template>
      <template #footer>
        <span></span>
      </template>
    </CModal>
  </div>
</template>

<script>
import StaffAccountAdd from "../users/StaffAccountAdd.vue";
import UserCard from "../users/UserCard.vue";
const axios = require("axios");
const { containsPermissions } = require("../../utils/index");

export default {
  name: "DealershipAccounts",
  data() {
    return {
      staff: [],
      selectedStaffAccount: null,
      selectedStaffIndex: null,
      addingStaffAccount: false,
      editingUser: false,
    };
  },
  methods: {
    userHasPermissions(...permissions) {
      // console.log(permissions);
      // console.log(containsPermissions(permissions));
      return containsPermissions(permissions);
    },
    setActiveStaff(user, index) {
      this.selectedStaffAccount = user;
      this.selectedStaffIndex = index;
      this.setEditingUser(false);
    },
    setEditingUser(value) {
      this.editingUser = value;
    },
    setAddingStaffAccount(value) {
      this.addingStaffAccount = value;
    },
    updateUser(newUser, index) {
      let newStaff = this.staff;
      newStaff[index] = newUser;
      this.staff = newStaff;
      this.selectedStaffAccount = newUser;
    },
    addNewStaffAccount(user) {
      let newStaff = this.staff;
      newStaff.push(user);
      this.staff = newStaff;
    },
  },
  beforeCreate() {
    // fetch dealership staff users
    axios({
      method: "GET",
      url: `${this.$store.state.api}/users/?dealership=${this.$route.params.dealershipId}&role[ne]=Administration`,
      headers: {
        Authorization: `Bearer ${this.$store.state.auth.token}`,
      },
    })
      .then((response) => {
        if (response.data.success) {
          this.staff = response.data.data;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  components: {
    "staff-account-add": StaffAccountAdd,
    "user-card": UserCard,
  },
};
</script>
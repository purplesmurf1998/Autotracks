<template>
  <div>
    <CCol>
      <CCard>
        <!--        <CCardImg-->
        <!--          variant="top"-->
        <!--          width="5%"-->
        <!--          src="https://www.fireglass.com/resources/design-ideas/case-studies/2018/audi-dealership/img/Audi.jpg"-->
        <!--        />-->
        <CCardBody>
          <div v-if="!editingDealership">
            <h1>{{ dealership.name }}</h1>
            <h2 v-if="dealership.admin">
              {{ dealership.admin.first_name }}'s dealership
            </h2>
            <p>{{ dealership.description }}</p>
            <router-link to="/dealerships">
              <CButton color="primary"> Back to list </CButton>
            </router-link>
            <br />
            <CButton
              id="edit-dealership"
              v-if="!editingDealership"
              color="secondary"
              class="mt-2"
              @click="setEditingDealership(true)"
              >Edit dealership details</CButton
            >
          </div>
          <edit-dealership
            v-if="editingDealership"
            :dealership="dealership"
            :setEditingDealership="setEditingDealership"
          />
        </CCardBody>
        <CCardFooter>
          <small class="text-muted">
            {{ dealership.created_at }}
          </small>
        </CCardFooter>
      </CCard>
      <CRow>
        <div class="col-md-4">
          <CAlert v-if="!$store.state.auth.createUserCompleted" color="success">Begin by creating your staff by clicking the <b>"Create a staff account"</b> button below.</CAlert>
        </div>
      </CRow>
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
                    selectedStaffAccount && user._id == selectedStaffAccount
                  "
                  @click="setActiveStaff(user, index)"
                >
                  {{ user.first_name }} {{ user.last_name }}
                </CListGroupItem>
              </CListGroup>
              <CButton
                color="primary"
                class="mt-2"
                id="create-staff-acc"
                @click="
                  () => {
                    addingStaffAccount = false;
                    editingUser = false;
                    addingStaffAccount = true;
                  }
                "
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
    </CCol>
    <CModal :show.sync="addingStaffAccount" :centered="true" size="lg">
      <staff-account-add
        v-if="addingStaffAccount"
        :setAddingStaffAccount="setAddingStaffAccount"
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
import StaffAccountAdd from "./StaffAccountAdd.vue";
import UserCard from "../../../modules/UserCard.vue";
import ViewUser from "../../../modules/ViewUser.vue";
import EditDealership from "./EditDealership.vue";

const axios = require("axios");

export default {
  name: "Dealership",
  data() {
    return {
      dealership: {},
      staff: [],
      selectedStaffAccount: null,
      selectedStaffIndex: null,
      addingStaffAccount: false,
      editingUser: false,
      editingDealership: false,
    };
  },
  methods: {
    setActiveStaff(user, index) {
      this.selectedStaffAccount = user;
      this.selectedStaffIndex = index;
    },
    setEditingUser(value) {
      this.editingUser = value;
    },
    setAddingStaffAccount(value) {
      this.addingStaffAccount = value;
    },
    setEditingDealership(value) {
      this.editingDealership = value;
    },
    updateUser(newUser, index) {
      let newStaff = this.staff;
      newStaff[index] = newUser;
      this.staff = newStaff;
      this.selectedStaffAccount = newUser;
    }
  },
  beforeCreate() {
    // fetch dealership details
    axios({
      method: "GET",
      url: `http://localhost:5000/api/v1/dealerships/${this.$route.params.dealershipId}/?populate=admin`,
      headers: {
        Authorization: `Bearer ${this.$store.state.auth.token}`,
      },
    })
      .then((response) => {
        if (response.data.success) {
          this.dealership = response.data.data;
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // fetch dealership staff users
    axios({
      method: "GET",
      url: `http://localhost:5000/api/v1/users/?dealership=${this.$route.params.dealershipId}`,
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
    "edit-dealership": EditDealership,
    ViewUser,
  },
};
</script>

<style>
</style>

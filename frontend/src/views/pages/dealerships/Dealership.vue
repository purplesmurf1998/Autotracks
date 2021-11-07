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
          <h1>{{ dealership.name }}</h1>
          <h2 v-if="dealership.admin">
            {{ dealership.admin.first_name }}'s dealership
          </h2>
          <p>{{ dealership.description }}</p>
          <router-link to="/dealerships"
            ><CButton color="primary"> Back to list </CButton></router-link
          >
        </CCardBody>
        <CCardFooter>
          <small class="text-muted">
            {{ dealership.created_at }}
          </small>
        </CCardFooter>
      </CCard>
      <CCard class="mt-2">
        <CCardBody>
          <CRow>
            <CCol>
              <h3>List of staff accounts</h3>
              <CButton
                color="primary"
                class="mt-2"
                @click="
                  () => {
                    addingStaffAccount = true;
                  }
                "
                >Create a staff account</CButton
              >
              <CListGroup class="mt-2" v-if="staff.length > 0">
                <CListGroupItem
                  component="button"
                  v-for="user in staff"
                  :key="user._id"
                  :active="
                    selectedStaffAccount && user._id == selectedStaffAccount
                  "
                >
                  {{ user.first_name }} {{ user.last_name }}
                </CListGroupItem>
              </CListGroup>
            </CCol>
            <CCol>
              <h3>Selected staff account details</h3>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
    <CModal :show.sync="addingStaffAccount" :centered="true">
      <staff-account-add v-if="addingStaffAccount" />
      <template #header>
        <h6 class="modal-title">Add a staff account to your dealership!</h6>
        <CButtonClose @click="addingStaffAccount = false" />
      </template>
      <template #footer>
        <!-- <CRow class="justify-content-center">
        </CRow>
        <CButton @click="addingDealership = false" color="danger">Discard</CButton>
        <CButton @click="addingDealership = false" color="success">Accept</CButton> -->
        <span></span>
      </template>
    </CModal>
  </div>
</template>

<script>
import StaffAccountAdd from "./StaffAccountAdd.vue";

const axios = require("axios");

export default {
  name: "Dealership",
  data() {
    return {
      dealership: {},
      staff: [],
      selectedStaffAccount: null,
      addingStaffAccount: false,
    };
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
  },
  components: {
    "staff-account-add": StaffAccountAdd,
  },
};
</script>

<style>
</style>

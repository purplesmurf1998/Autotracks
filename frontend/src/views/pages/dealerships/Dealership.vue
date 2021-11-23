<template>
  <div>
    <CCol>
      <CCard>
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
          <CAlert v-if="!$store.state.auth.createUserCompleted" color="success"
            >Begin by creating your staff by clicking the
            <b>"Create a staff account"</b> button below.</CAlert
          >
        </div>
      </CRow>
      <dealership-accounts />
    </CCol>
    
  </div>
</template>

<script>
import EditDealership from "./EditDealership.vue";
import DealershipAccounts from "../../../modules/DealershipAccounts.vue"

const axios = require("axios");

export default {
  name: "Dealership",
  data() {
    return {
      dealership: {},
      editingDealership: false,
    };
  },
  methods: {
    setEditingDealership(value) {
      this.editingDealership = value;
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
  },
  components: {
    "edit-dealership": EditDealership,
    "dealership-accounts": DealershipAccounts
  },
};
</script>

<style>
</style>

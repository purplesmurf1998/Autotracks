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
              <CButton color="secondary"> Back to list </CButton>
            </router-link>
            <br />
            <CButton
              id="edit-dealership"
              v-if="!editingDealership && userHasRoles('Administration')"
              color="primary"
              class="mt-2"
              @click="setEditingDealership(true)"
              >Edit dealership details</CButton
            >
          </div>
          <edit-dealership
            v-if="editingDealership && userHasRoles('Administration')"
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
            <strong>"Create a staff account"</strong> button below.
          </CAlert>
        </div>
      </CRow>
      <dealership-accounts 
        v-if="userHasRoles('Administration', 'Management')" 
      />
      <dealership-vehicle-properties
        v-if="userHasRoles('Administration', 'Management')"
      />
      <dealership-locations 
        v-if="userHasRoles('Administration', 'Management')"
      />
    </CCol>
  </div>
</template>

<script>
import EditDealership from "./EditDealership.vue";
import DealershipAccounts from "../../../modules/users/DealershipAccounts.vue";
import DealershipVehicleProperties from "../../../modules/vehicleProperties/DealershipVehicleProperties.vue";
import DealershipLocations from "../../../modules/dealerships/DealershipLocations.vue";

const axios = require("axios");
const { containsRoles } = require("../../../utils/index");

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
    },
    userHasRoles(...roles) {
      return containsRoles(roles);
    },
  },
  beforeCreate() {
    // fetch dealership details
    axios({
      method: "GET",
      url: `${this.$store.state.api}/dealerships/${this.$route.params.dealershipId}/?populate=admin`,
      headers: {
        Authorization: `Bearer ${this.$store.state.auth.token}`,
      },
    })
      .then((response) => {
        if (response.data.success) {
          this.dealership = response.data.payload;
        }
      })
      .catch((err) => {
        console.log(err);
        this.$router.replace("/pages/404");
      });
  },
  components: {
    "edit-dealership": EditDealership,
    "dealership-accounts": DealershipAccounts,
    "dealership-vehicle-properties": DealershipVehicleProperties,
    "dealership-locations": DealershipLocations,
  },
};
</script>

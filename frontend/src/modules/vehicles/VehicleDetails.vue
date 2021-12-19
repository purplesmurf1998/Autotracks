<template>
  <div>
    <CCard>
      <CCardBody>
        <CRow class="justify-content-between ml-0 mr-0">
          <h4>Vehicle Details<CBadge color="danger" class="ml-3" v-if="vehicle.missing">Missing / Misplaced</CBadge></h4>
          <CDropdown
            color="secondary"
            :offset="[0, 5]"
            toggler-text="Select an action"
          >
            <CDropdownItem @click.native="showingDepositModal = true" v-if="userHasPermissions('Edit Vehicles')">Add a deposit</CDropdownItem>
            <CDropdownItem @click.native="showingSoldModal = true" v-if="userHasPermissions('Edit Vehicles')">Sell vehicle</CDropdownItem>
            <CDropdownItem v-if="userHasPermissions('Edit Vehicle')">Mark as delivered</CDropdownItem>
            <CDropdownDivider/>
            <CDropdownItem @click.native="toggleVehicleMissing" v-if="!vehicle.missing && userHasPermissions('Edit Vehicles')">Missing / Misplaced</CDropdownItem>
            <CDropdownItem @click.native="toggleVehicleMissing" class="present" v-if="vehicle.missing && userHasPermissions('Edit Vehicles')">Present / Located</CDropdownItem>
            <CDropdownItem>Subscribe to vehicle</CDropdownItem>
            <CDropdownItem>Add to list</CDropdownItem>
            <CDropdownDivider/>
            <CDropdownItem class="delete" @click.native="showingDeleteModal = true" v-if="userHasPermissions('Delete Vehicles')">Delete vehicle</CDropdownItem>
          </CDropdown>
        </CRow>
        <hr />
        <CRow>
          <CCol>
            <CRow class="justify-content-between ml-0 mr-0">
              <h6>Deposit Status</h6>
              <p class="mb-0">$0.00</p>
            </CRow>
            <CRow class="justify-content-between ml-0 mr-0">
              <h6>Sale Status</h6>
              <p class="mb-0">Not Sold</p>
            </CRow>
            <CRow class="justify-content-between ml-0 mr-0">
              <h6>Delivery Status</h6>
              <p class="mb-0">Not Delivered</p>
            </CRow>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    <CModal
      :show.sync="showingDepositModal"
      :centered="true"
    >
      
      <template #header>
        <h6 class="modal-title">Add a deposit</h6>
        <CButtonClose @click="showingDepositModal = false" />
      </template>
        <CForm>
          <CInput
              placeholder="ex. $500"
              label="Deposit Amount"
            >
              <template #prepend-content><CIcon name="cil-dollar"/></template>
            </CInput>
        </CForm>
      <template #footer>
        <CButton @click="showingDepositModal = false" color="danger">Cancel</CButton>
        <CButton @click="showingDepositModal = false" color="success">Save</CButton>
        
      </template>
    </CModal>
    <CModal
      :show.sync="showingSoldModal"
      :centered="true"
    >
      
      <template #header>
        <h6 class="modal-title">Mark the vehicle as sold</h6>
        <CButtonClose @click="showingSoldModal = false" />
      </template>
        <CForm>
          <CSelect
            label="Sales Representative"
            :options="['Cedrik Dubois', 'Nadine Collette']"
            placehoder="Select a sales rep"
          />
        </CForm>
      <template #footer>
        <CButton @click="showingSoldModal = false" color="danger">Cancel</CButton>
        <CButton @click="showingSoldModal = false" color="success">Save</CButton>
        
      </template>
    </CModal>
    <CModal
      :show.sync="showingDeleteModal"
      :centered="true"
    >
      
      <template #header>
        <h6 class="modal-title">Delete vehicle</h6>
        <CButtonClose @click="showingDeleteModal = false" />
      </template>
        <p>Are you sure you want to delete this vehicle from the inventory completely? This will erase all logs, subscriptions and history of this vehicle.</p>
      <template #footer>
        <CButton @click="showingDeleteModal = false" color="danger">Cancel</CButton>
        <CButton @click="deleteVehicle" color="success">Confirm</CButton>
        
      </template>
    </CModal>
  </div>
</template>

<script>
const axios = require("axios");
const { containsPermissions } = require("../../utils/index");

export default {
  name: "VehicleDetails",
  props: ["vehicle", "setNewVehicle"],
  data() {
    return {
      showingSoldModal: false,
      showingDeliveredModal: false,
      showingDepositModal: false,
      showingDeleteModal: false
    };
  },
  methods: {
    userHasPermissions(...permissions) {
      return containsPermissions(permissions);
    },
    deleteVehicle() {
      axios({
        method: "DELETE",
        url: `${this.$store.state.api}/inventory/vehicle/${this.vehicle._id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          if (response.data.success) {
            this.showingDeleteModal = false;
            this.$router.replace('/inventory')
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    toggleVehicleMissing() {
      let body = this.vehicle;
      body.missing = !this.vehicle.missing;
      axios({
        method: "PUT",
        url: `${this.$store.state.api}/inventory/vehicle/${this.vehicle._id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data: body
      })
        .then((response) => {
          if (response.data.success) {
            this.setNewVehicle(response.data.payload);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  mounted() {},
};
</script>

<style>
h4 {
  margin: 0;
  display: flex;
  align-items: center;
}
.delete {
  color: red;
}
.present {
  color: rgb(0, 190, 0);
}
</style>
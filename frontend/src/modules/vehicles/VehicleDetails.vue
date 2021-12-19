<template>
  <div>
    <CCard>
      <CCardBody>
        <CRow class="justify-content-between ml-0 mr-0">
          <h4>
            Vehicle Details<CBadge
              color="danger"
              class="ml-3"
              v-if="vehicle.missing"
              >Missing / Misplaced</CBadge
            >
          </h4>
          <CDropdown
            color="secondary"
            :offset="[0, 5]"
            toggler-text="Select an action"
          >
            <CDropdownItem
              @click.native="showingDepositModal = true"
              v-if="userHasPermissions('Edit Vehicles')"
              >Add a deposit</CDropdownItem
            >
            <CDropdownItem
              @click.native="showingSoldModal = true"
              v-if="userHasPermissions('Edit Vehicles') && !vehicle.soldBy"
              >Sell vehicle</CDropdownItem
            >
            <CDropdownItem
              @click.native="setVehicleSoldPending(false)"
              v-if="userHasPermissions('Edit Vehicles') && !!vehicle.soldBy"
              class="delete"
              >Cancel sale</CDropdownItem
            >
            <CDropdownItem v-if="userHasPermissions('Edit Vehicle')"
              >Mark as delivered</CDropdownItem
            >
            <CDropdownDivider />
            <CDropdownItem
              @click.native="toggleVehicleMissing"
              v-if="!vehicle.missing && userHasPermissions('Edit Vehicles')"
              >Missing / Misplaced</CDropdownItem
            >
            <CDropdownItem
              @click.native="toggleVehicleMissing"
              class="present"
              v-if="vehicle.missing && userHasPermissions('Edit Vehicles')"
              >Present / Located</CDropdownItem
            >
            <CDropdownItem>Subscribe to vehicle</CDropdownItem>
            <CDropdownItem>Add to list</CDropdownItem>
            <CDropdownDivider />
            <CDropdownItem
              class="delete"
              @click.native="showingDeleteModal = true"
              v-if="userHasPermissions('Delete Vehicles')"
              >Delete vehicle</CDropdownItem
            >
          </CDropdown>
        </CRow>
        <hr />
        <CRow>
          <CCol>
            <CRow class="justify-content-between ml-0 mr-0">
              <CCol><h6 class="mb-2">Deposit Status</h6></CCol>
              <CCol class="d-flex align-items-end flex-column"
                ><p class="mb-2 property-field">$0.00</p></CCol
              >
            </CRow>
            <CRow class="justify-content-between ml-0 mr-0">
              <CCol><h6 class="mb-2">Sale Status</h6></CCol>
              <CCol class="d-flex align-items-end flex-column">
                <p class="mb-2 property-field" v-if="!vehicle.soldBy">
                  {{ soldByUser }}
                </p>
                <p class="mb-2 property-field warning" v-if="!!vehicle.soldBy">
                  {{ soldByUser }}
                </p>
              </CCol>
            </CRow>
            <CRow class="justify-content-between ml-0 mr-0">
              <CCol><h6 class="mb-2">Delivery Status</h6></CCol>
              <CCol class="d-flex align-items-end flex-column"
                ><p class="mb-2 property-field">Not Delivered</p></CCol
              >
            </CRow>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    <CModal :show.sync="showingDepositModal" :centered="true">
      <template #header>
        <h6 class="modal-title">Add a deposit</h6>
        <CButtonClose @click="showingDepositModal = false" />
      </template>
      <CForm>
        <CInput placeholder="ex. $500" label="Deposit Amount">
          <template #prepend-content><CIcon name="cil-dollar" /></template>
        </CInput>
      </CForm>
      <template #footer>
        <CButton @click="showingDepositModal = false" color="danger"
          >Cancel</CButton
        >
        <CButton @click="showingDepositModal = false" color="success"
          >Save</CButton
        >
      </template>
    </CModal>
    <CModal :show.sync="showingSoldModal" :centered="true">
      <template #header>
        <h6 class="modal-title">Mark the vehicle as sold</h6>
        <CButtonClose @click="showingSoldModal = false" />
      </template>
      <CForm>
        <CSelect
          label="Sales Representative"
          :options="dealershipStaff"
          :value.sync="selectedStaffAccount"
          placehoder="Select a sales rep"
        />
      </CForm>
      <template #footer>
        <CButton @click="showingSoldModal = false" color="danger"
          >Cancel</CButton
        >
        <CButton @click="setVehicleSoldPending(true)" color="success"
          >Save</CButton
        >
      </template>
    </CModal>
    <CModal :show.sync="showingDeleteModal" :centered="true">
      <template #header>
        <h6 class="modal-title">Delete vehicle</h6>
        <CButtonClose @click="showingDeleteModal = false" />
      </template>
      <p>
        Are you sure you want to delete this vehicle from the inventory
        completely? This will erase all logs, subscriptions and history of this
        vehicle.
      </p>
      <template #footer>
        <CButton @click="showingDeleteModal = false" color="danger"
          >Cancel</CButton
        >
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
      showingDeleteModal: false,
      dealershipStaff: null,
      selectedStaffAccount: this.$store.state.auth.userId,
    };
  },
  methods: {
    userHasPermissions(...permissions) {
      return containsPermissions(permissions);
    },
    setVehicleSoldPending(state) {
      let body = {
        soldBy: state ? this.selectedStaffAccount : null,
      };
      console.log(body);
      axios({
        method: "PUT",
        url: `${this.$store.state.api}/inventory/vehicle/${this.vehicle._id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data: body,
      })
        .then((response) => {
          if (response.data.success) {
            this.setNewVehicle(response.data.payload);
            this.showingSoldModal = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
            this.$router.replace("/inventory");
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
        data: body,
      })
        .then((response) => {
          if (response.data.success) {
            this.setNewVehicle(response.data.payload);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchDealershipUsers() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/users/?dealership=${this.vehicle.dealership}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          if (response.data.success) {
            let dealershipStaff = [];
            console.log(response.data);
            response.data.data.forEach((user) => {
              dealershipStaff.push({
                value: user._id,
                label: user.first_name + " " + user.last_name,
              });
            });
            console.log(dealershipStaff);
            this.dealershipStaff = dealershipStaff;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    soldByUser() {
      if (!this.vehicle.soldBy) {
        return "Not Sold";
      } else {
        return "Pending sale authorization";
      }
    },
  },
  mounted() {
    this.fetchDealershipUsers();
  },
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
h6 {
  display: flex;
  align-items: center;
}
.property-field {
  text-align: right;
}
.warning {
  color: rgb(255, 106, 20);
}
</style>
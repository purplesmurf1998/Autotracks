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
              >Add a Deposit</CDropdownItem
            >
            <CDropdownItem
              @click.native="showingSoldModal = true"
              v-if="userHasPermissions('Edit Vehicles') && !saleStatus"
              >Sell Vehicle</CDropdownItem
            >
            <CDropdownItem
              @click.native="updateSale()"
              v-if="userHasPermissions('Edit Vehicles') && !!saleStatus"
              >Edit Sale </CDropdownItem
            >
            <CDropdownItem
              @click.native="showingCancelSaleModal = true"
              v-if="userHasPermissions('Edit Vehicles') && !!saleStatus"
              class="delete"
              >Cancel Sale </CDropdownItem
            >
            <CDropdownItem v-if="userHasPermissions('Edit Vehicle')"
              >Mark as Delivered</CDropdownItem
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
              >Delete Vehicle</CDropdownItem
            >
          </CDropdown>
        </CRow>
        <hr />
        <CRow>
          <CCol>
            <CRow class="justify-content-between ml-0 mr-0">
              <CCol><h6 class="mb-2">VIN</h6></CCol>
              <CCol class="d-flex align-items-end flex-column"
                ><p 
                class="mb-2 property-field"
                v-text="vehicle.vin"/></CCol
              >
            </CRow>
            <CRow class="justify-content-between ml-0 mr-0">
              <CCol><h6 class="mb-2">Deposit Status</h6></CCol>
              <CCol class="d-flex align-items-end flex-column">
                <p class="mb-2 property-field" v-if="!sale">$0.00</p>
                <p class="mb-2 property-field" v-if="!!sale">${{sale.deposit_amount}}</p>
              </CCol>
            </CRow>
            <CRow class="justify-content-between ml-0 mr-0">
              <CCol><h6 class="mb-2">Sale Status</h6></CCol>
              <CCol class="d-flex align-items-end flex-column">
                <p class="mb-2 property-field" v-if="!saleStatus">
                  {{ soldByUser }}
                </p>
                <p class="mb-2 property-field warning" v-if="!!saleStatus">
                  {{ soldByUser }}
                </p>
              </CCol>
            </CRow>
            <CRow class="justify-content-between ml-0 mr-0">
              <CCol><h6 class="mb-2">Delivery Status</h6></CCol>
              <CCol class="d-flex align-items-end flex-column">
                <p class="mb-2 property-field" v-if="vehicle.delivered">Delivered</p>
                <p class="mb-2 property-field" v-if="!vehicle.delivered">Not Delivered</p>
              </CCol>
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
    <CModal
      :show.sync="showingSoldModal"
      :centered="true"
      title="Modal title 2"
    >
      <vehicle-sell 
        v-if="showingSoldModal"
        :showingSoldModal="showingSoldModal"
        :dealershipStaff="dealershipStaff"
        :selectedStaffAccount="selectedStaffAccount"
        :setVehicleModal="setVehicleModal"
        :vehicle="vehicle"
        :setSaleStatus="setSaleStatus"
        :showMessage="showMessage"
        :updateSaleStatus="updateSaleStatus"
        :sale_id="sale_id"
      />
      <template #header>
        <h6 class="modal-title">Mark the vehicle as sold</h6>
        <CButtonClose @click="showingSoldModal = false" />
      </template>
      <template #footer>
        <span></span>
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
    <CModal :show.sync="showingCancelSaleModal" :centered="true">
      <template #header>
        <h6 class="modal-title">Cancel Sale Request</h6>
        <CButtonClose @click="showingCancelSaleModal = false" />
      </template>
      <p>
        Are you sure you want to cancel this sale request?
      </p>
      <template #footer>
        <CButton @click="showingCancelSaleModal = false" color="danger"
          >Cancel</CButton
        >
        <CButton @click="cancelSale" color="success">Confirm</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
const axios = require("axios");
const { containsPermissions } = require("../../utils/index");
import VehicleSell from "./SellVehicle.vue";

export default {
  name: "VehicleDetails",
  components: {
    "vehicle-sell": VehicleSell,
  },
  props: ["vehicle", "setNewVehicle", "showMessage"],
  data() {
    return {
      showingSoldModal: false,
      showingDeliveredModal: false,
      showingDepositModal: false,
      showingDeleteModal: false,
      showingCancelSaleModal: false,
      dealershipStaff: null,
      selectedStaffAccount: this.$store.state.auth.userId,
      saleStatus: !!this.vehicle.sale ? true : false,
      updateSaleStatus: false,
      sale_id: this.vehicle.sale,
      sale: null,
      deposit: "",
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
            this.$router.replace("/inventory");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$router.replace("/pages/404");
        });
    },
    fetchSale() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/inventory/details/sale/${this.sale_id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          if (response.data.success) {
            console.log("Success");
            this.sale = response.data.payload;
            console.log(this.sale);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    cancelSale() {
      axios({
        method: "DELETE",
        url: `${this.$store.state.api}/inventory/details/sale/${this.sale_id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          if (response.data.success) {
            this.saleStatus = false;
            this.showingCancelSaleModal = false;
            this.showMessage("The sale requesthas been canceled.", "success");
          }
        })
        .catch((err) => {
          console.log(err);
          this.showMessage("An error occured while canceling the sale request.", "danger");
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
            this.showMessage("Vehicle location has been updated successfully", "success");
          }
        })
        .catch((err) => {
          console.log(err);
          this.showMessage("Error occured while updating vehicle location", "danger");
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
            response.data.payload.forEach((user) => {
              dealershipStaff.push({
                value: user._id,
                label: user.first_name + " " + user.last_name,
              });
            });
            this.dealershipStaff = dealershipStaff;
          }
        })
        .catch((err) => {
          console.log(err);
          this.$router.replace("/pages/404");
        });
    },
    setSaleStatus(value, sale) {
      this.sale = sale
      this.sale_id = sale._id;
      this.saleStatus = value;
    },
    setVehicleModal(value){
      this.showingSoldModal = value;
    },
    updateSale() {
      console.log("Update Sale");
      this.updateSaleStatus = true;
      this.showingSoldModal = true;
    }
  },
  computed: {
    soldByUser() {
      if (!this.saleStatus) {
        return "Not Sold";
      } else {
        return "Pending sale authorization";
      }
    },
  },
  beforeMount() {
    this.fetchDealershipUsers();
  },
  mounted() {
    if (!!this.sale_id) {
      this.fetchSale();
    }
  }
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
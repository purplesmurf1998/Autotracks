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
            v-if="!vehicle.delivered"
            color="primary"
            :offset="[0, 5]"
            toggler-text="Select an action"
          >
            <CDropdownItem
              @click.native="showingSoldModal = true"
              v-if="userHasRoles('Administration', 'Management', 'Sales Rep') && !saleStatus && !approved"
              >Sell Vehicle</CDropdownItem
            >
            <CDropdownItem
              @click.native="updateSale()"
              v-if="userHasRoles('Administration', 'Management', 'Sales Rep') && !!saleStatus && !approved"
              >Edit Sale </CDropdownItem
            >
            <CDropdownItem
              @click.native="showingCancelSaleModal = true"
              v-if="userHasRoles('Administration', 'Management', 'Sales Rep') && !!saleStatus && !approved"
              class="delete"
              >Cancel Sale
            </CDropdownItem>
            <CDropdownItem
            v-if="!vehicle.delivered && !!saleStatus && approved"
            @click="markDelivered"
              >Mark as Delivered</CDropdownItem
            >
            <CDropdownDivider />
            <CDropdownItem
              @click.native="toggleVehicleMissing"
              v-if="!vehicle.missing"
              >Missing / Misplaced</CDropdownItem
            >
            <CDropdownItem
              @click.native="toggleVehicleMissing"
              class="present"
              v-if="vehicle.missing"
              >Present / Located</CDropdownItem
            >
            <CDropdownItem
              @click.native="showingAddToListModal = true"
              v-if="!vehicle.delivered && userHasRoles('Administration', 'Management', 'Sales Rep')"
            >Add to list</CDropdownItem>
            <CDropdownItem
              @click.native="showingAddToZoneModel = true"
              v-if="!vehicle.delivered"
              >Add to zone</CDropdownItem
            >
            <CDropdownItem
              @click.native="downloadQrCode"
            >Download QR code</CDropdownItem>
            <CDropdownDivider />
            <CDropdownItem
              class="delete"
              @click.native="showingDeleteModal = true"
              v-if="userHasRoles('Administration', 'Management')"
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
                ><p class="mb-2 property-field" v-text="vehicle.vin"
              /></CCol>
            </CRow>
            <CRow class="justify-content-between ml-0 mr-0">
              <CCol><h6 class="mb-2">Deposit Status</h6></CCol>
              <CCol class="d-flex align-items-end flex-column">
                <p class="mb-2 property-field" v-if="!sale">$0.00</p>
                <p class="mb-2 property-field" v-if="!!sale">
                  ${{ sale.deposit_amount }}
                </p>
              </CCol>
            </CRow>
            <CRow class="justify-content-between ml-0 mr-0">
              <CCol><h6 class="mb-2">Sale Status</h6></CCol>
              <CCol class="d-flex align-items-end flex-column">
                <p class="mb-2 property-field" v-if="approved">
                  {{ soldByUser }}
                </p>
                <p class="mb-2 property-field" v-if="!saleStatus && !approved">
                  {{ soldByUser }}
                </p>
                <p
                  class="mb-2 property-field warning"
                  v-if="!!saleStatus && !approved"
                >
                  {{ soldByUser }}
                </p>
              </CCol>
            </CRow>
            <CRow class="justify-content-between ml-0 mr-0">
              <CCol><h6 class="mb-2">Delivery Status</h6></CCol>
              <CCol class="d-flex align-items-end flex-column">
                <p class="mb-2 property-field" v-if="vehicle.delivered">
                  Delivered
                </p>
                <p class="mb-2 property-field" v-if="!vehicle.delivered">
                  Not Delivered
                </p>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
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
        :updateSaleStatus="updateSaleStatus"
        :sale_id="sale_id"
        :messageObj="messageObj"
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
      <p>Are you sure you want to cancel this sale request?</p>
      <template #footer>
        <CButton @click="showingCancelSaleModal = false" color="danger"
          >Cancel</CButton
        >
        <CButton @click="cancelSale" color="success">Confirm</CButton>
      </template>
    </CModal>
    <CModal :show.sync="showingAddToListModal" :centered="true">
      <template #header>
        <h6 class="modal-title">Add vehicle to custom list</h6>
        <CButtonClose @click="showingAddToListModal = false" />
      </template>
      <add-to-vehicle-list
        :vehicleId="vehicle._id"
        :closeModal="closeAddToListModal"
        :messageObj="messageObj"
        v-if="showingAddToListModal"
      />
      <template #footer>
        <span></span>
      </template>
    </CModal>
    <CModal :show.sync="showingAddToZoneModel" :centered="true">
      <template #header>
        <h6 class="modal-title">Add vehicle to zone</h6>
        <CButtonClose @click="showingAddToZoneModel = false" />
      </template>
      <add-to-zone
        :vehicleId="vehicle._id"
        :closeAddToZoneModal="closeAddToZoneModal"
        :messageObj="messageObj"
        v-if="showingAddToZoneModel"
        @vehicle-location-updated="vehicleLocationUpdated"
      />
      <template #footer>
        <span></span>
      </template>
    </CModal>
  </div>
</template>

<script>
const axios = require("axios");
const { containsRoles, showMessage } = require("../../utils/index");
const QRCode = require("qrcode")
import VehicleSell from "./SellVehicle.vue";
import AddToVehicleList from "./AddToVehicleList.vue";
import AddToZone from "./AddToZone.vue";

export default {
  name: "VehicleDetails",
  components: {
    "vehicle-sell": VehicleSell,
    "add-to-vehicle-list": AddToVehicleList,
    AddToZone,
  },
  props: ["vehicle", "setNewVehicle", "refreshTable", "messageObj"],
  data() {
    return {
      showingSoldModal: false,
      showingDeliveredModal: false,
      showingDeleteModal: false,
      showingCancelSaleModal: false,
      showingAddToListModal: false,
      showingAddToZoneModel: false,
      dealershipStaff: null,
      selectedStaffAccount: this.$store.state.auth.userId,
      saleStatus: this.vehicle.sale ? true : false,
      updateSaleStatus: false,
      sale_id: this.vehicle.sale,
      sale: null,
      deposit: "",
      approved: false,
    };
  },
  methods: {
    userHasRoles(...roles) {
      return containsRoles(roles);
    },
    vehicleLocationUpdated(vehicle) {
      this.setNewVehicle(vehicle);
      this.showingAddToZoneModel = false;
    },
    closeAddToListModal() {
      this.showingAddToListModal = false;
    },
    closeAddToZoneModal() {
      this.showingAddToZoneModel = false;
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
            this.closeModal();
            this.refreshTable();
          }
        })
        .catch((err) => {
          console.log(err);
          this.$router.replace("/pages/404");
        });
    },
    closeModal() {
      const queries = {};
      this.$router.replace({ query: queries });
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
            this.approved = !this.sale.date_approved ? false : true
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
            this.sale = null;
            this.approved = false;
            this.showingCancelSaleModal = false;
            showMessage("The sale request has been canceled.", "success", this.messageObj);
          }
        })
        .catch((err) => {
          console.log(err);
          showMessage("An error occured while canceling the sale request.", "danger", this.messageObj);
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
            showMessage("Vehicle location has been updated successfully", "success", this.messageObj);
            this.refreshTable();
          }
        })
        .catch((err) => {
          console.log(err);
          showMessage("Error occured while updating vehicle location", "danger", this.messageObj);
        });
    },
    async downloadQrCode() {
      const url1 = "http://localhost:8080/#/inventory?vehicleSelected=" + this.vehicle._id
      var src_qr = await QRCode.toDataURL(url1)
      axios({
        url: src_qr,
        method:'GET',
        responseType: 'blob'
      }).then((response) => {
        var fileUrl = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileUrl

        fileLink.setAttribute('download', 'qr_code.jpg')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    },
    fetchDealershipUsers() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/users/?dealership=${this.vehicle.dealership}&role=Management`,
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
      this.sale = sale;
      this.approved = !this.sale.date_approved ? false : true;
      this.sale_id = sale._id;
      this.saleStatus = value;
    },
    setVehicleModal(value) {
      this.showingSoldModal = value;
    },
    updateSale() {
      this.updateSaleStatus = true;
      this.showingSoldModal = true;
    },
    markDelivered() {
      let body = this.vehicle;
      body.delivered = true;
      body.date_delivered = Date.now();
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
            showMessage("Vehicle has been marked as delivered", "success", this.messageObj);
            this.setNewVehicle(response.data.payload);
            this.refreshTable();
          }
        })
        .catch((err) => {
          console.log(err);
          showMessage("Error occured while updating vehicle delivery status", "danger", this.messageObj);
        });
    },
  },
  computed: {
    soldByUser() {
      if (this.approved) {
        return "Sale Approved";
      } else if (!this.saleStatus && !this.approved) {
        return "Not Sold";
      } else {
        return "Pending Sale Authorization";
      }
    },
  },
  mounted() {
    if (this.userHasRoles('Administration', 'Management', 'Sales Rep'))
      this.fetchDealershipUsers();

    if (this.sale_id)
      this.fetchSale();
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

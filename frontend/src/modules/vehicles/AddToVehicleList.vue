<template>
  <div>
    <CCol>
      <CAlert v-if="!!errorMessage" color="danger">{{ errorMessage }}</CAlert>
      <CSelect 
        v-if="!!userVehicleLists"
        :value.sync="selectedIndex"
        placeholder="Select a vehicle list"
        :options="options"
      />
      <CRow class="d-flex justify-content-center">
        <CButton color="primary" class="mr-2" :disabled="addBtnDisabled" @click="validateList">Add</CButton>
        <CButton color="danger" @click="closeModal">Cancel</CButton>
      </CRow>
    </CCol>
  </div>
</template>

<script>
const axios = require('axios');
const { showMessage } = require("../../utils/index");

export default {
  props: ['vehicleId', 'closeModal', 'messageObj'],
  data() {
    return {
      userVehicleLists: null,
      selectedIndex: -1,
      options: null,
      addBtnDisabled: false,
      errorMessage: null
    }
  },
  methods: {
    validateList() {
      console.log(this.selectedIndex);
      if (this.selectedIndex < 0) {
        this.showErrorMessage('You must select a vehicle list to add the vehicle to.');
      } else if (this.userVehicleLists[this.selectedIndex].vehicles.includes(this.vehicleId)) {
        this.showErrorMessage('This vehicle already exists in this list.');
      } else {
        this.addVehicleToList(this.userVehicleLists[this.selectedIndex]._id);
      }
    },
    showErrorMessage(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000);
    },
    addVehicleToList(vehicleListId) {
      axios({
        method: "POST",
        url: `${this.$store.state.api}/vehicle-list/${vehicleListId}/add`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data: {
          vehicles: [this.vehicleId]
        }
      }).then((response) => {
        showMessage(`The vehicle has been added to the list "${response.data.payload.title}"`, "success", this.messageObj);
        this.closeModal();
      }).catch((error) => {
        console.log(error);
      });
    },
    fetchUserVehicleLists() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/vehicle-list/user/${this.$store.state.auth.userId}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      }).then((response) => {
        this.userVehicleLists = response.data.payload;
        let options = [];
        this.userVehicleLists.forEach((list, index) => {
          options.push({
            value: index,
            label: list.title
          });
        });
        this.options = options;
      }).catch((error) => {
        console.log(error);
      });
    }
  },
  beforeMount() {
    this.fetchUserVehicleLists();
  }
}
</script>

<style>

</style>
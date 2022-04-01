<template>
  <div class="c-app flex-row align-items-center">
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCard class="mx-4 mb-0" v-if="!loading">
          <CCardBody class="p-4">
            <CRow class="m-0">
              <h1 class="mb-3">Confirm Location</h1>
            </CRow>
            <CRow class="align-items-center p-1 m-0 justify-content-between">
              <h5 class="m-0">VIN:</h5>
              <p class="m-0">{{ vehicle.vin }}</p>
            </CRow>
            <CRow class="align-items-center p-1 m-0 justify-content-between">
              <h5 class="m-0">Zone:</h5>
              <p class="m-0">{{ zone ? zone.name : 'N/A' }}</p>
            </CRow>
            <CRow class="align-items-center p-1 m-0 justify-content-between">
              <h5 class="m-0">Latitude:</h5>
              <p class="m-0">{{ lat }}</p>
            </CRow>
            <CRow class="align-items-center p-1 m-0 justify-content-between">
              <h5 class="m-0">Longitude:</h5>
              <p class="m-0">{{ lng }}</p>
            </CRow>
            <CRow class="align-items-center p-1 m-0 justify-content-between">
              <h5 class="m-0">Date:</h5>
              <p class="m-0">{{ getDate }}</p>
            </CRow>
            <CRow class="align-items-center pt-2 m-0 justify-content-center">
              <CButton color="primary" @click="confirmVehicleLocation">Confirm</CButton>
            </CRow>
          </CCardBody>
        </CCard>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    lat: null,
    lng: null,
    zone: null,
    timestamp: null,
    vehicle: null,
    error: null,
    loading: true,
  }),
  methods: {
    getPosition(position) {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      console.log(position.coords.latitude);
      this.timestamp = new Date(position.timestamp);
      this.locateVehicle();
    },
    showError(error) {
      this.error = error;
    },
    confirmVehicleLocation() {
      axios({
        method: "PUT",
        url: `${this.$store.state.api}/inventory/vehicle/${this.vehicle._id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data: {
          zone: this.zone ? this.zone._id : null,
          lat: this.lat,
          lng: this.lng
        },
      })
        .then(() => {
          this.$router.push('/dashboard');
        })
        .catch((err) => {
          console.log(err);
        });
    },
    locateVehicle() {
      axios
        .post(
          `${this.$store.state.api}/locations/zones/locate-vehicle`,
          {
            latitude: this.lat,
            longitude: this.lng,
            vehicleId: this.vehicle._id
          },
          {
            headers: {
              'Authorization': `Bearer ${this.$store.state.auth.token}`
            }
          }
        )
        .then((response) => {
          this.zone = response.data.payload;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchVehicle() {
      axios
        .get(
          `${this.$store.state.api}/inventory/vehicle/${this.$route.params.vehicleId}`,
          {
            headers: {
              'Authorization': `Bearer ${this.$store.state.auth.token}`
            }
          }
        )
        .then((response) => {
          this.vehicle = response.data.payload;
          // get the user's device's location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              this.getPosition,
              this.showError
            );
          } else {
            this.error = "The browser does not support geolocation";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  computed: {
    getDate() {
      if (!this.timestamp) return null;

      let day = "";
      let month = "";
      let year = "";
      let hour = "";
      let minute = "";
      let second = "";

      day =
        this.timestamp.getDate() >= 10
          ? this.timestamp.getDate()
          : "0" + this.timestamp.getDate();
      month =
        this.timestamp.getMonth() + 1 >= 10
          ? this.timestamp.getMonth() + 1
          : "0" + (this.timestamp.getMonth() + 1);
      year = this.timestamp.getFullYear();
      hour =
        this.timestamp.getHours() >= 10
          ? this.timestamp.getDate()
          : "0" + this.timestamp.getHours();
      minute =
        this.timestamp.getMinutes() >= 10
          ? this.timestamp.getMinutes()
          : "0" + this.timestamp.getMinutes();
      second =
        this.timestamp.getSeconds() >= 10
          ? this.timestamp.getSeconds()
          : "0" + this.timestamp.getSeconds();

      return (
        day +
        "/" +
        month +
        "/" +
        year +
        " at " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    },
  },
  mounted() {
    this.fetchVehicle();
  }
}
</script>

<style scoped>
.container {
  height: 100%;
}
</style>
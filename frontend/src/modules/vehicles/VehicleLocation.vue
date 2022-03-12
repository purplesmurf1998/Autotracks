<template>
  <div>
    <CCard>
      <CCardBody>
        <CRow class="m-0 d-flex justify-content-between align-items-center"
          ><h4>Location</h4>
          <p class="m-0">{{ vehicle.zone.name }}</p></CRow
        >
        <hr />
        <GmapMap :center="center" :zoom="17" style="height: 400px">
          <GmapMarker
            v-if="marker.position.lat && marker.position.lng"
            :key="vehicle._id"
            :position="marker.position"
            :title="marker.title"
            :clickable="true"
          />
        </GmapMap>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import * as VueGoogleMaps from "vue2-google-maps";
import Vue from "vue";

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyASyYRBZmULmrmw_P9kgr7_266OhFNinPA",
    // key: ''
    // To use the Google Maps JavaScript API, you must register your app project on the Google API Console and get a Google API key which you can add to your app
    // v: 'OPTIONAL VERSION NUMBER',
    // libraries: 'places', //// If you need to use place input
  },
});

export default {
  props: ["vehicle"],
  data() {
    return {
      center: { lat: null, lng: null },
      marker: {
        position: { lat: null, lng: null },
        label: "S",
        draggable: false,
        title: "Stanford",
        www: "https://www.stanford.edu/",
      },
    };
  },
  watch: {
    vehicle(newVehicle) {
      this.center.lat = newVehicle.lat || 37.431489;
      this.center.lng = newVehicle.lng || -122.163719;
      this.marker.position.lat = newVehicle.lat;
      this.marker.position.lng = newVehicle.lng;
    },
  },
  methods: {},
  mounted() {
    this.center.lat = this.vehicle.lat || 37.431489;
    this.center.lng = this.vehicle.lng || -122.163719;
    this.marker.position.lat = this.vehicle.lat;
    this.marker.position.lng = this.vehicle.lng;
  },
};
</script>

<style>
</style>
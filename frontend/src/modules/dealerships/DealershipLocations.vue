<template>
  <div>
    <CCard class="mt-2">
      <CCardBody>
        <CRow>
          <h3 class="mb-3">Dealership Zones</h3>
          <CButton color="primary" @click="editPerimeters = true">Edit zone perimeters</CButton>
        </CRow>
        
        <CRow>
          <CCol v-if="addingNewZone">
            <CForm @submit.prevent="submitNewZone" v-if="addingNewZone">
              <CInput
                label="Name"
                placeholder="Unique name for the zone"
                v-model="newZoneName"
                required
              />
              <CTextarea
                label="Description (optional)"
                placeholder="Enter the zone's description"
                rows="5"
                v-model="newZoneDescription"
              />
              <CButton
                color="secondary"
                @click="
                  () => {
                    newPath = [];
                    addingNewZone = false;
                  }
                "
                >Cancel</CButton
              >
              <CButton color="primary" type="submit">Add Zone</CButton>
              <CButton color="danger" @click="undoLastPoint">Undo</CButton>
            </CForm>
          </CCol>
          <CCol>
            <GmapMap
              :center="center"
              :zoom="17"
              ref="mapRef"
              map-type-id="satellite"
              style="height: 500px"
              :options="{
                streetViewControl: false,
                fullscreenControl: true,
                rotateControl: false,
              }"
              @click="mapClick"
            >
              <gmap-polygon
                v-if="newPath.length > 0"
                ref="polygonRef"
                :path="newPath"
                :editable="false"
                :visible="true"
                :options="{ fillColor: 'red', fillOpacity: 0.5 }"
                @click="mapClick"
              />
              <gmap-polygon
                v-for="zone in zones"
                :key="zone._id"
                :path="zone.path"
                :editable="editPerimeters"
                :visible="true"
                :draggable="true"
                :options="{
                  fillColor: zone.fillColor,
                  fillOpacity: 0.5,
                  strokeWeight: 0
                }"
              />
              <GmapMarker
                :key="index"
                v-for="(zone, index) in zones"
                :position="zone.center"
                :clickable="true"
                :visible="selectedZone == zone._id"
              />
            </GmapMap>
          </CCol>
        </CRow>
        
        <CDataTable
          :items="zones"
          :fields="fields"
          class="mt-3"
          clickable-rows
          @row-clicked="setSelectedZone"
          :items-per-page="5"
          pagination
        >
          <template #details="{ item }">
            <CCollapse :show="item._id == selectedZone" :duration="200">
              <location-details :zone="item" @close="closeExpanded" @closeAndSave="closeExpandedAndSave"/>
            </CCollapse>
          </template>
        </CDataTable>
        <CButton color="primary" @click="addingNewZone = true">Add a location zone</CButton>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import * as VueGoogleMaps from "vue2-google-maps";
import Vue from "vue";
import LocationDetails from "./LocationDetails.vue";

const axios = require("axios");

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyDnzuP55GknIhhOh5L1pJbpPc5DBkc_2pM",
  },
});

export default {
  props: ["vehicle"],
  data() {
    return {
      center: { lat: 45.431311, lng: -73.479005 },
      zones: [],
      fields: [
        {
          key: "name",
          label: "Name",
        },
        {
          key: "description",
          label: "Description",
        },
        {
          key: "vehicleCount",
          label: "Vehicle Count",
        },
      ],
      selectedZone: null,
      selectedIndex: -1,
      closeDetails: false,
      addingZone: false,
      editPerimeters: false,
      newPath: [],
      newZoneName: "",
      newZoneDescription: "",
      addingNewZone: false,
      infoContent: "",
      infoLink: "",
      infoWindowPos: {
        lat: 0,
        lng: 0,
      },
      infoWinOpen: false,
      currentMidx: null,
      // optional: offset infowindow so it visually sits nicely on top of our marker
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
    };
  },
  methods: {
    setSelectedZone(zone, index) {
      console.log("runs second")
      if (this.closeDetails) {
        this.selectedZone = null;
        this.selectedIndex = -1;
        this.closeDetails = false;
      } else {
        this.selectedZone = zone._id;
        this.selectedIndex = index;
        if (this.selectedZone) this.panToZone(zone.center);
      }
    },
    closeExpanded() {
      this.closeDetails = true;
    },
    closeExpandedAndSave(newZone) {
      console.log("runs first")
      this.fetchLocationZones();
      this.selectedZone = null;
      this.selectedIndex = -1;
      this.closeDetails = false;
    },
    mapClick(event) {
      if (!this.addingNewZone) return;
      // if (this.newPath.length >= 4) return;

      const path = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      this.newPath.push(path);
      console.log(this.newPath);
    },
    showRectangleInfo(event) {
      console.log(event);
    },
    undoLastPoint() {
      if (!this.newPath.length > 0 || !this.addingNewZone) return;

      this.newPath.pop();
    },
    submitNewZone() {
      const newZone = {
        path: this.newPath,
        fillColor: "blue",
        name: this.newZoneName,
        description: this.newZoneDescription,
        dealership: this.$route.params.dealershipId,
      };
      this.postNewZoneToApi(newZone);
    },
    postNewZoneToApi(zone) {
      axios({
        method: "POST",
        url: `${this.$store.state.api}/locations/zones`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data: zone,
      })
        .then((response) => {
          console.log(response.data.payload);

          this.zones.push(response.data.payload);
          this.newPath = [];
          this.addingNewZone = false;
        })
        .catch((error) => {
          console.log(error);
          this.showErrorMessage("Unable to create the vehicle property.");
        });
    },
    fetchLocationZones() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/locations/zones/dealership/${this.$route.params.dealershipId}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          this.zones = response.data.payload;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    panToZone(zoneCenter) {
      this.$refs.mapRef.$mapPromise.then((map) => {
        map.panTo(zoneCenter);
      });
    },
  },
  mounted() {
    this.fetchLocationZones();
  },
  components: {
    LocationDetails,
  },
};
</script>

<style>
</style>
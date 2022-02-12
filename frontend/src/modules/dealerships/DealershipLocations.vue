<template>
  <div>
    <CCard class="mt-2">
      <CCardBody>
        <h3 class="mb-2">Dealership Zones</h3>
        <GmapMap
          :center="center"
          :zoom="17"
          ref="mapRef"
          map-type-id="satellite"
          style="height: 500px"
          :options="{
            streetViewControl: false,
            fullscreenControl: false,
            rotateControl: false,
          }"
          @click="mapClick"
        >
          <!-- <gmap-polyline
            v-if="newPath.length > 1 && newPath.length < 4"
            ref="polylineRef"
            :path="newPath"
            :editable="false"
            :visible="true"
            :options="{ fillColor: 'red', fillOpacity: 0.5 }"
          /> -->
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
            :editable="false"
            :visible="true"
            :draggable="true"
            :options="{
              fillColor: zone.fillColor,
              fillOpacity: 0.5,
              strokeWeight: 0,
              strokeColor: 'blue',
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
              <location-details :zone="item" />
            </CCollapse>
          </template>
        </CDataTable>
        <!-- <CRow>
          <CCol>
            

            <CListGroup
              class="mt-3 mb-3"
              v-if="zones.length > 0 && !addingNewZone"
            >
              <div v-for="(zone, index) in zones" :key="zone._id">
                <CListGroupItem
                  tag="button"
                  :id="zone._id"
                  :active="selectedZone && zone._id == selectedZone._id"
                  @click="setSelectedZone(zone, index)"
                >
                  {{ zone.name }}
                </CListGroupItem>
              </div>
            </CListGroup>
            <CButton
              color="primary"
              @click="addingNewZone = true"
              v-if="!addingNewZone"
              >Add New Zone</CButton
            >
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
                    path = [];
                    addingNewZone = false;
                  }
                "
                >Cancel</CButton
              >
              <CButton color="primary" type="submit">Add Zone</CButton>
              <CButton color="danger" @click="undoLastPoint">Undo</CButton>
            </CForm>
          </CCol>
        </CRow> -->
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
    setSelectedZone(zone) {
      this.selectedZone = this.selectedZone == zone._id ? null : zone._id;
      if (this.selectedZone) this.panToZone(zone.center);
    },
    toggleInfoWindow(marker, idx) {
      console.log(marker.position);
      this.infoWindowPos = marker.position;
      this.infoContent = marker.title;
      this.infoLink = marker.www;
      // check if its the same marker that was selected if yes toggle
      if (this.currentMidx === idx) {
        this.infoWinOpen = !this.infoWinOpen;
      } else {
        // if different marker set infowindow to open and reset current marker index
        this.currentMidx = idx;
        this.infoWinOpen = true;
      }
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
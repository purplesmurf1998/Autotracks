<template>
  <div>
    <CCard class="mt-2">
      <CCardBody>
        <CRow>
          <CCol>
            <h3>Dealership Zones</h3>
            <CListGroup class="mt-3 mb-3" v-if="zones.length > 0 && !addingNewZone">
              <CListGroupItem
                tag="button"
                v-for="(zone, index) in zones"
                :key="zone._id"
                :id="zone._id"
                :active="
                  selectedZone && zone._id == selectedZone._id
                "
                @click="setSelectedZone(zone, index)"
              >
                {{ zone.fillColor }}
              </CListGroupItem>
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
              <CButton color="secondary" @click="() => {path = []; addingNewZone = false;}">Cancel</CButton>
              <CButton color="primary" type="submit">Add Zone</CButton>
              <CButton color="danger" @click="undoLastPoint">Undo</CButton>
            </CForm>
          </CCol>
          <CCol>
            <GmapMap
              :center="center"
              :zoom="15"
              map-type-id="satellite"
              style="height: 500px"
              :options="{
                streetViewControl: false,
                fullscreenControl: false,
                rotateControl: false
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
                :options="{ fillColor: zone.fillColor, fillOpacity: 0.5 }"
              />
            </GmapMap>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import * as VueGoogleMaps from "vue2-google-maps";
import Vue from "vue";

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
      center: { lat: 37.431489, lng: -122.163719 },
      zones: [],
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
    setSelectedZone(zone, index) {
      this.selectedZone = zone._id;
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
        fillColor: 'red',
        name: this.newZoneName,
        description: this.newZoneDescription,
        dealership: this.$route.params.dealershipId
      };

      console.log(newZone);
      this.newPath = [];
      this.addingNewZone = false;
    },
  }
};
</script>

<style>
</style>
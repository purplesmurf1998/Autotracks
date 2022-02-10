<template>
  <div>
    <CCard class="mt-2">
      <CBody>
        <CRow>
          <CCol>
            <CButton
              color="primary"
              @click="addingNewZone = true"
              v-if="!addingNewZone"
              >Add New Zone</CButton
            >
            <CForm @submit.prevent="submitNewZone" v-if="addingNewZone">
              <CInput
                label="Zone Color"
                horizontal
                v-model="newZoneColor"
                required
              />
              <CButton color="secondary" @click="path = []">Cancel</CButton>
              <CButton color="primary" type="submit">Add Zone</CButton>
              <CButton color="danger" @click="undoLastPoint">Undo</CButton>
            </CForm>
          </CCol>
          <CCol>
            <GmapMap
              :center="center"
              :zoom="11"
              style="height: 400px"
              @click="mapClick"
            >
              <!-- <GmapMarker
                :key="index"
                v-for="(m, index) in markers"
                :position="m.position"
                :label="m.label"
                :title="m.title"
                :clickable="true"
                :draggable="m.draggable"
                @click="toggleInfoWindow(m, index)"
              /> -->
              <gmap-rectangle
                ref="rectangleRef"
                :bounds="{
                  north: 37.394694,
                  east: -122.09022,
                  south: 37.363188,
                  west: -122.150333,
                }"
                :editable="false"
                :visible="true"
                :options="{ fillColor: 'blue', fillOpacity: 0.2 }"
                @click="showRectangleInfo"
              />
              <gmap-rectangle
                ref="rectangleRef"
                :bounds="{
                  north: 37.394694,
                  east: -122.0301,
                  south: 37.363188,
                  west: -122.09022,
                }"
                :editable="false"
                :visible="true"
                :options="{ fillColor: 'yellow', fillOpacity: 0.2 }"
                @click="showRectangleInfo"
              />
              <gmap-rectangle
                ref="rectangleRef"
                :bounds="{
                  north: 37.363188,
                  east: -122.0301,
                  south: 37.331681,
                  west: -122.150333,
                }"
                :editable="false"
                :visible="true"
                :options="{ fillColor: 'red', fillOpacity: 0.2 }"
                @click="showRectangleInfo"
              />
              <gmap-polyline
                v-if="newPath.length > 1 && newPath.length < 4"
                ref="polylineRef"
                :path="newPath"
                :editable="false"
                :visible="true"
                :options="{ fillColor: 'red', fillOpacity: 0.5 }"
              />
              <gmap-polygon
                v-if="newPath.length == 4"
                ref="polygonRef"
                :path="newPath"
                :editable="false"
                :visible="true"
                :options="{ fillColor: 'red', fillOpacity: 0.5 }"
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
      </CBody>
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
      newPath: [],
      newZoneColor: "",
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
      if (this.newPath.length >= 4) return;

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
        _id: Date.now().toString(),
        path: this.newPath,
        fillColor: this.newZoneColor,
      };

      this.zones.push(newZone);
      this.newPath = [];
      this.addingNewZone = false;
    },
  },
};
</script>

<style>
</style>
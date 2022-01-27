<template>
  <div>
    <CCol v-if="!!vehicleList">
      <CRow class="mb-3 ml-0">
        <h1 class="mb-0 d-flex align-items-center">{{ vehicleList.title }}</h1>
        <CButton variant="outline" color="primary" class="m-3" size="sm">Edit</CButton>
      </CRow>
      <quill-editor v-model="notes"/>
      <CButton 
        color="success" 
        @click="saveChanges" 
        class="mt-2" 
        v-if="notes != vehicleList.notes"
      >
        Save changes to notes
      </CButton>
      <hr>
      <h3>List of vehicles</h3>
      <CDataTable
        id="vehicle-list-datatable"
        :fields="tableFields"
        :items="tableItems"
        :items-per-page="10"
        :fixed="true"
        :clickable-rows="true"
        @row-clicked="rowClicked"
        sorter
        size="sm"
        hover
        column-filter
      >
        <template v-for="field in tableFields" v-slot:[field.key]="item">
          <inventory-slot :key="field.key" :item="item" :field="field"/>
        </template>
      </CDataTable>
    </CCol>
  </div>
</template>

<script>
const axios = require('axios');
import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

export default {
  props: ['vehicleListId'],
  data() {
    return {
      vehicleList: null,
      notes: null,
      title: null,
      tableFields: null,
      tableItems: null
    }
  },
  methods: {
    rowClicked() {

    },
    fetchVehicleListDetails() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/vehicle-list/${this.vehicleListId}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      }).then((response) => {
        this.vehicleList = response.data.payload;
        this.notes = this.vehicleList.notes;
        this.title = this.vehicleList.title;
        this.tableItems = this.vehicleList.vehicles;
        this.fetchVehicleProperties();
      }).catch((error) => {
        console.log(error);
      });
    },
    fetchVehicleProperties() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/dealerships/${this.vehicleList.dealership}/vehicles/properties`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      }).then((response) => {
        const payload = response.data.payload;
        const fields = [];
        fields.push({key: "vin", label: "VIN"});
        payload.forEach((property) => {
          if (property.visible) {
            fields.push(property);
          }
        });
        this.tableFields = fields;
      }).catch((error) => {
        console.log(error);
        //this.$router.replace("/pages/404");
      });
    },
    saveChanges() {
      if (!this.title || this.title == '') {
        // show error message
      } else {
        axios({
          method: "PUT",
          url: `${this.$store.state.api}/vehicle-list/${this.vehicleListId}`,
          headers: {
            Authorization: `Bearer ${this.$store.state.auth.token}`,
          },
          data: {
            title: this.title,
            notes: this.notes
          }
        }).then((response) => {
          this.vehicleList = response.data.payload;
          this.notes = this.vehicleList.notes;
          this.title = this.vehicleList.title;
        }).catch((error) => {
          console.log(error);
        });
      }
    }
  },
  mounted() {
    this.fetchVehicleListDetails();
  }
}
</script>

<style>
#vehicle-list-datatable {
  white-space: nowrap;
}
</style>
<template>
  <div>
    <CCol v-if="!!vehicleList">
      <CRow class="mb-3 ml-0">
        <h1 class="mb-0 d-flex align-items-center" v-if="!editingTitle">{{ vehicleList.title }}</h1>
        <CButton 
          variant="outline" 
          color="primary" 
          class="m-3" 
          size="sm" 
          v-if="!editingTitle"
          @click="editingTitle = true"
        >
          Edit
        </CButton>
        <CInput 
          v-model="title"
          size="lg"
          v-if="editingTitle"
          class="mb-0 d-flex align-items-center"
        />
        <CButton 
          variant="outline" 
          color="success" 
          class="mt-3 mb-3 mr-2 ml-2" 
          size="sm" 
          v-if="editingTitle"
          @click="saveTitle"
        >
          Save
        </CButton>
        <CButton 
          variant="outline" 
          color="secondary" 
          class="mt-3 mb-3" 
          size="sm" 
          v-if="editingTitle"
          @click="() => {editingTitle = false; title = vehicleList.title}"
        >
          Cancel
        </CButton>
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
      <CRow class="ml-0 mr-0 d-flex justify-content-between">
        <CRow class="m-0">
          <h3 class="mb-0 d-flex align-items-center">List of vehicles</h3>
          <router-link to="/inventory">
            <CButton color="primary" variant="outline" class="m-3" size="sm">Add vehicles to list</CButton>
          </router-link>
        </CRow>
        <CRow class="m-0">
          <CButton 
            v-if="removingVehicles"
            color="danger" 
            variant="outline" 
            class="mt-3 mb-3 mr-1" 
            size="sm"
            @click="removeVehicles"
          >
            Confirm
          </CButton>
          <CButton 
            v-if="removingVehicles"
            color="secondary" 
            variant="outline" 
            class="mt-3 mb-3" 
            size="sm" 
            @click="setRemoveVehicles(false)"
          >
            Cancel
          </CButton>
          <CButton 
            v-if="!removingVehicles"
            color="danger" 
            variant="outline" 
            class="mt-3 mb-3" 
            size="sm" 
            @click="setRemoveVehicles(true)"
          >
            Remove vehicles from list
          </CButton>
        </CRow>
      </CRow>
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
        <template #select="{item}">
          <td>
            <CInputCheckbox
              :checked="item._selected"
              @update:checked="() => check(item)"
              custom
            />
          </td>
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
import InventorySlot from "../inventory/InventorySlot.vue"

Vue.use(VueQuillEditor)

export default {
  props: ['vehicleListId', 'updateTitle'],
  data() {
    return {
      vehicleList: null,
      notes: null,
      title: null,
      tableFields: null,
      tableItems: null,
      removingVehicles: false,
      editingTitle: false,
      editedTitle: null,
    }
  },
  methods: {
    check (item) {
      const val = Boolean(this.tableItems[item.index]._selected)
      this.$set(this.tableItems[item.index], '_selected', !val)
    },
    setRemoveVehicles(val) {
      if (val) {
        this.removingVehicles = true;
        this.tableFields.unshift({
          key: 'select',
          label: '',
          _style: 'width:1%', 
          sorter: false,
          filter: false
        });
      } else {
        for (let i = 0; i < this.tableItems.length; i++) {
          this.$set(this.tableItems[i], '_selected', false);
        }
        this.removingVehicles = false;
        this.tableFields.splice(0, 1);
      }
    },
    removeVehicles() {
      let vehicles = [];
      this.tableItems.forEach(item => {
        if (item._selected) {
          vehicles.push(item._id);
        }
      })
      
      axios({
        method: "POST",
        url: `${this.$store.state.api}/vehicle-list/${this.vehicleList._id}/delete`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data: {
          vehicles
        }
      }).then((response) => {
        this.fetchVehicleListDetails(response.data.payload._id);
      }).catch((error) => {
        console.log(error);
        //this.$router.replace("/pages/404");
      });
    },
    rowClicked(vehicle, index, column, e) {
      if (!this.removingVehicles) {
        let routeData = this.$router.resolve({name: 'Vehicle Inventory', query: {vehicleSelected: vehicle._id}});
        window.open(routeData.href, '_blank');
      } else {
        if (!['INPUT', 'LABEL'].includes(e.target.tagName)) {
          this.check(vehicle)
        }
      }
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
        this.editedTitle = this.title;

        let tableItems = [];
        this.vehicleList.vehicles.forEach((vehicle, index) => {
          //Check if vehicle has properties
          if (!this.delivered_bool) {
            if (!vehicle.delivered) {
              if (vehicle.properties != null)
              { 
                let properties = vehicle.properties;
                properties._id = vehicle._id;
                properties.vin = vehicle.vin;
                properties.index = index;
                if (vehicle.missing) {
                  properties._classes = 'table-warning';
                }
                tableItems.push(properties);
              }
            }
          }
          if (this.delivered_bool) {
            if (vehicle.delivered) {
              if (vehicle.properties != null)
              { 
                let properties = vehicle.properties;
                properties._id = vehicle._id;
                properties.vin = vehicle.vin;
                properties.index = index;
                if (vehicle.missing) {
                  properties._classes = 'table-warning';
                }
                tableItems.push(properties);
              }
            }
          }
        });
        this.tableItems = tableItems;
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
    saveTitle() {
      this.saveChanges();
      this.updateTitle();
      this.editingTitle = false;
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
  components: {
    InventorySlot
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
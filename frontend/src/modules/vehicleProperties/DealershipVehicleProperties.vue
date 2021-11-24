<template>
  <div>
    <CCard class="mt-2">
      <CCardBody>
        <CRow>
          <CCol>
            <CRow class="m-0">
              <h3>List of custom vehicle properties</h3>
              <CButton color="success" class="ml-3" v-if="showSavePositions" @click="savePositions">Save Positions</CButton>
            </CRow>
            <draggable 
              class="list-group mt-3"
              :list="vehicleProperties" 
              group="properties" 
              @start="onDragStart" 
              @end="onDragEnd">             
              <CListGroupItem 
                v-for="(element, index) in vehicleProperties" 
                :key="element._id" 
                :id="index" 
                @click="onChoose(index)" 
                tag="button"
                :active="
                  selectedVehicleProperty && element._id == selectedVehicleProperty._id
                "
                class="d-flex justify-content-between align-items-center"
                >
                  {{ element.headerName }}
                  <CBadge :color="element.visible ? 'success' : 'secondary'" shape="pill"><b>{{ element.position }}</b></CBadge>
              </CListGroupItem>
            </draggable>
            <CButton
              color="secondary"
              class="mt-3"
              id="create-vehicle-property"
              @click="
                () => {
                  editingVehicleProperty = false;
                  addingVehicleProperty = true;
                }
              "
            >
              Create a custom vehicle property
            </CButton>
          </CCol>
          <CCol>
            <h3>Selected vehicle property details</h3>
            <vehicle-property-card
              class="mt-2"
              :property="selectedVehicleProperty"
              :editingProperty="editingVehicleProperty"
              :setEditingProperty="setEditingVehicleProperty"
              :updateProperty="updateVehicleProperty"
              :index="selectedVehiclePropertyIndex"
              v-if="!!selectedVehicleProperty"
            />
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    <CModal :show.sync="addingVehicleProperty" :centered="true">
      <vehicle-property-add
        v-if="addingVehicleProperty"
        :setAddingVehicleProperty="setAddingVehicleProperty"
        :addNewVehicleProperty="addNewVehicleProperty"
      />
      <template #header>
        <h6 class="modal-title">Add a new custom property for your vehicles!</h6>
        <CButtonClose @click="addingVehicleProperty = false" />
      </template>
      <template #footer>
        <span></span>
      </template>
    </CModal>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import VehiclePropertyCard from '../vehicleProperties/VehiclePropertyCard.vue'
import VehiclePropertyAdd from './VehiclePropertyAdd.vue'
const axios = require('axios');

export default {
  name: 'DealershipVehicleProperties',
  data() {
    return {
      vehicleProperties: [],
      drag: false,
      selectedVehicleProperty: null,
      showSavePositions: false,
      editingVehicleProperty: false,
      addingVehicleProperty: false
    }
  },
  computed: {
    selectedVehiclePropertyIndex() {
      return this.vehicleProperties.map(prop => { return prop._id}).indexOf(this.selectedVehicleProperty._id);
    }
  },
  methods: {
    onDragStart(element) {
      const property = this.vehicleProperties[element.item.id];
      this.selectedVehicleProperty = property;
      this.drag = true;
    },
    onDragEnd() {
      this.showSavePositions = this.savePositionsChanged();
      this.drag = false;
    },
    onChoose(index) {
      const property = this.vehicleProperties[index];
      this.selectedVehicleProperty = property;
    },
    savePositionsChanged() {
      let positionChanged = false;
      this.vehicleProperties.forEach((prop, index) => {
        if ((prop.position - 1) != index) {
          positionChanged = true;
        }
      })
      return positionChanged;
    },
    setEditingVehicleProperty(value) {
      this.editingVehicleProperty = value;
    },
    setAddingVehicleProperty(value) {
      this.addingVehicleProperty = value;
    },
    addNewVehicleProperty(property) {
      let newProperties = this.vehicleProperties;
      newProperties.push(property);
      this.vehicleProperties = newProperties;
    },
    updateVehicleProperty(newProperty, index) {
      let newVehicleProperties = this.vehicleProperties;
      newVehicleProperties[index] = newProperty;
      this.vehicleProperties = newVehicleProperties;
      this.selectedVehicleProperty = newProperty;
    },
    savePositions() {
      // update vehicle positions in the backend
      axios({
        method: "PUT",
        url: `http://localhost:5000/api/v1/dealerships/${this.$route.params.dealershipId}/vehicles/properties`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data: {
          properties: this.vehicleProperties
        }
      })
      .then((response) => {
        if (response.data.success) {
          this.vehicleProperties = response.data.payload;
          this.showSavePositions = false;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }
  },
  beforeCreate() {
    // get the list of vehicle properties for the dealership
    axios({
      method: "GET",
      url: `http://localhost:5000/api/v1/dealerships/${this.$route.params.dealershipId}/vehicles/properties`,
      headers: {
        Authorization: `Bearer ${this.$store.state.auth.token}`,
      },
    })
    .then((response) => {
      if (response.data.success) {
        console.log(response.data.payload);
        this.vehicleProperties = response.data.payload;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  },
  components: {
    'draggable': draggable,
    'vehicle-property-card': VehiclePropertyCard,
    'vehicle-property-add': VehiclePropertyAdd
  }
}
</script>

<style>

</style>
<template>
  <div>
    <CCard v-if="!editingProperties">
      <CCardBody>
        <CRow class="ml-0 mr-0">
          <h4 class="mr-3">Vehicle Properties</h4>
          <CButton
            color="primary"
            @click="setEditingProperties(true)"
            v-if="!editingProperties && userHasPermissions('Edit Vehicles') && !vehicle.delivered"
            :disabled="!!vehicle.soldBy"
          >
            Edit
          </CButton>
        </CRow>
        <hr />
        <CRow>
          <CCol>
            <CRow
              v-for="property in leftProperties"
              :key="property._id"
              class="justify-content-between ml-0 mr-0"
            >
              <CCol>
                <h6>{{ property.label }}</h6>
              </CCol>
              <CCol class="d-flex align-items-end flex-column">
                <p class="mb-0 property-field">
                  {{
                    !vehicle.properties[property.key]
                      ? "N/A"
                      : getFormattedProperty(property)
                  }}
                </p>
              </CCol>
            </CRow>
          </CCol>
          <CCol>
            <CRow
              v-for="property in rightProperties"
              :key="property._id"
              class="justify-content-between ml-0 mr-0"
            >
              <CCol>
                <h6>{{ property.label }}</h6>
              </CCol>
              <CCol class="d-flex align-items-end flex-column">
                <p class="mb-0 property-field">
                  {{
                    !vehicle.properties[property.key]
                      ? "N/A"
                      : getFormattedProperty(property)
                  }}
                </p>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    <edit-properties
      v-if="editingProperties"
      :vehicle="vehicle"
      :leftProperties="leftProperties"
      :rightProperties="rightProperties"
      :setEditingProperties="setEditingProperties"
      :setNewVehicle="setNewVehicle"
    />
  </div>
</template>

<script>
const axios = require("axios");
const { containsPermissions } = require("../../utils/index");

import EditVehicleProperties from "./EditVehicleProperties.vue";

export default {
  name: "VehicleProperties",
  props: ["vehicle", "setNewVehicle"],
  data() {
    return {
      vehicleProperties: null,
      leftProperties: null,
      rightProperties: null,
      editingProperties: false,
    };
  },
  methods: {
    userHasPermissions(...permissions) {
      return containsPermissions(permissions);
    },
    setEditingProperties(value) {
      this.editingProperties = value;
    },
    setNewProperties(properties) {
      this.vehicle.properties = properties;
    },
    getFormattedProperty(property) {
      switch (property.inputType) {
        case "Text":
          {
            return this.vehicle.properties[property.key];
          }
          break;
        case "Number":
          {
            return this.vehicle.properties[property.key];
          }
          break;
        case "Currency":
          {
            let num = this.vehicle.properties[property.key];
            return num.toFixed(2) + "$";
          }
          break;
        case "Date":
          {
            return this.vehicle.properties[property.key];
          }
          break;
        case "Options":
          {
            return this.vehicle.properties[property.key];
          }
          break;
        case "List":
          {
            let items = this.vehicle.properties[property.key];
            let output = "";
            items.forEach((item, index) => {
              if (index < items.length - 1) {
                output += item + ", ";
              } else {
                output += item;
              }
            });
            return output.trim();
          }
          break;
      }
    },
    fetchDealershipProperties() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/dealerships/${this.vehicle.dealership}/vehicles/properties`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          if (response.data.success) {
            this.vehicleProperties = response.data.payload;
            this.splitVehicleProperties();
          }
        })
        .catch((err) => {
          console.log(err);
          this.$router.replace("/pages/404");
        });
    },
    splitVehicleProperties() {
      let leftProperties = [];
      let rightProperties = [];
      this.vehicleProperties.forEach((property, index) => {
        if (index % 2 == 0) {
          // leftProperties
          leftProperties.push(property);
        } else {
          // rightProperties
          rightProperties.push(property);
        }
      });
      this.leftProperties = leftProperties;
      this.rightProperties = rightProperties;
    },
  },
  beforeMount() {
    this.fetchDealershipProperties();
  },
  components: {
    "edit-properties": EditVehicleProperties,
  },
};
</script>

<style>
.property-field {
  text-align: right;
}
h4 {
  margin: 0;
  display: flex;
  align-items: center;
}
</style>
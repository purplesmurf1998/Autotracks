<template>
  <div>
    <CCard v-if="!editingProperties">
      <CCardBody>
        <CRow class="ml-0 mr-0 d-flex justify-content-between">
          <h4 class="mr-3">Vehicle Properties</h4>
          <CButton
            color="primary"
            @click="setEditingProperties(true)"
            v-if="!editingProperties && userHasRoles('Administration', 'Management') && !vehicle.delivered"
            :disabled="!!vehicle.soldBy"
          >
            <CIcon name="cil-pen"/>&nbsp;&nbsp;Edit vehicle properties
          </CButton>
        </CRow>
        <hr />
        <CCol>
          <CRow
            v-for="property in vehicleProperties"
            :key="property._id"
            class="justify-content-between ml-0 mr-0"
          >
            <CCol class="pl-0">
              <h6>{{ property.label }}</h6>
            </CCol>
            <CCol class="d-flex align-items-end flex-column pr-0">
              <p class="mb-2 property-field">
                {{
                  !vehicle.properties[property.key]
                    ? "N/A"
                    : getFormattedProperty(property)
                }}
              </p>
            </CCol>
          </CRow>
        </CCol>
      </CCardBody>
    </CCard>
    <edit-properties
      v-if="editingProperties"
      :vehicle="vehicle"
      :vehicleProperties="vehicleProperties"
      :setEditingProperties="setEditingProperties"
      :setNewVehicle="setNewVehicle"
    />
  </div>
</template>

<script>
const axios = require("axios");
const { containsRoles } = require("../../utils/index");

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
    userHasRoles(...roles) {
      return containsRoles(roles);
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
        case "Number":
          {
            return this.vehicle.properties[property.key];
          }
        case "Currency":
          {
            let num = this.vehicle.properties[property.key];
            return num.toFixed(2) + "$";
          }
        case "Date":
          {
            return this.vehicle.properties[property.key];
          }
        case "Options":
          {
            return this.vehicle.properties[property.key];
          }
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
          }
        })
        .catch((err) => {
          console.log(err);
          this.$router.replace("/pages/404");
        });
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
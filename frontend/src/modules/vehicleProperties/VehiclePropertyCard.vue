<template>
  <CCard>
    <CCardBody class="p-3">
      <view-property
        v-if="!editingProperty"
        :property="property"
        :setEditingProperty="setEditingProperty"
      />
      <edit-property 
        v-if="editingProperty"
        :setEditingProperty="setEditingProperty"
        :property="property"
        :index="index"
        :updateProperty="updateProperty"
      />
    </CCardBody>
  </CCard>
</template>

<script>
import ViewVehicleProperty from "./ViewVehicleProperty.vue";
import EditVehicleProperty from "./EditVehicleProperty.vue"

export default {
  name: 'VehiclePropertyCard',
  data() {
    return {};
  },
  props: ["property", "editingProperty", "setEditingProperty", 'index', 'updateProperty'],
  components: {
    "view-property": ViewVehicleProperty,
    "edit-property": EditVehicleProperty
  }
};
</script>

<style scoped>
</style>
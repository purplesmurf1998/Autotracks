<template>
  <CCard>
    <CCardBody class="p-3">
      <view-property
        v-if="!editingProperty"
        :property="property"
        :setEditingProperty="setEditingProperty"
      />
    </CCardBody>
  </CCard>
</template>

<script>
import ViewVehicleProperty from "./ViewVehicleProperty.vue";

export default {
  data() {
    return {};
  },
  props: ["property", "editingProperty", "setEditingProperty", 'index', 'updateProperty'],
  components: {
    "view-property": ViewVehicleProperty,
  }
};
</script>

<style scoped>
</style>
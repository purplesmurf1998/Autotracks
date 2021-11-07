<template>
  <div>
    <CForm>
      <CRow>
        <CCol>
          <CInput
            label="First Name"
            placeholder="User first name"
            :value.sync="first_name"
          />
        </CCol>
        <CCol>
          <CInput
            label="Last Name"
            placeholder="User last name"
            :value.sync="last_name"
          />
        </CCol>
      </CRow>
      <CInput label="Email" placeholder="User email address" />
      <CSelect
        label="Account Role"
        :options="roles"
        :value.sync="role"
        placeholder="Please select a role"
      />
      <CMultiSelect
        label="Account Permissions"
        :options="getPermissionsList"
        :selected="[]"
        search
        searchPlaceholder="Select"
        selectionType="tags"
      />
    </CForm>
  </div>
</template>

<script>
export default {
  name: "StaffAccountAdd",
  data() {
    return {
      roles: [
        "Management",
        "Sales Rep",
        "Sales Rep + Showroom",
        "Sales Rep + Demoline",
        "Sales Rep + Benefits",
        "Reception",
      ],
      first_name: "",
      last_name: "",
      email: "",
      role: "",
      permissions: [],
    };
  },
  methods: {
    isSelected(roleValue) {
      if (!roleValue) {
        return true;
      } else {
        return this.role == roleValue;
      }
    },
  },
  computed: {
    getPermissionsList() {
      console.log(`User role: ${this.role}`);
      return [
        {
          value: "Add Dealerships",
          text: "Add Dealerships",
        },
        {
          value: "View Dealerships",
          text: "View Dealerships",
        },
        {
          value: "Edit Dealerships",
          text: "Edit Dealerships",
        },
        {
          value: "Delete Dealerships",
          text: "Delete Dealerships",
        },
        {
          value: "Add Staff Users",
          text: "Add Staff Users",
        },
        {
          value: "View Staff Users",
          text: "View Staff Users",
        },
        {
          value: "Edit Staff Users",
          text: "Edit Staff Users",
        },
        {
          value: "Delete Staff Users",
          text: "Delete Staff Users",
        },
        {
          value: "Add Vehicles",
          text: "Add Vehicles",
        },
        {
          value: "View Vehicles",
          text: "View Vehicles",
        },
        {
          value: "Edit Vehicle Properties",
          text: "Edit Vehicle Properties",
        },
        {
          value: "Edit Vehicle Locations",
          text: "Edit Vehicle Locations",
        },
        {
          value: "Sell Vehicles",
          text: "Sell Vehicles",
        },
        {
          value: "Delete Vehicles",
          text: "Delete Vehicles",
        },
      ];
    },
  },
};
</script>

<style>
</style>
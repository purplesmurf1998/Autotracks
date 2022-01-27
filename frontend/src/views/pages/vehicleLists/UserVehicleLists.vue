<template>
  <div>
    <CCard>
      <CCardHeader>
        <slot name="header">Table of custom vehicle lists</slot>
      </CCardHeader>
      <CCardBody>
        <CRow class="d-flex justify-content-between pl-3 pr-3">
          <CButton color="primary mb-3" @click="addingVehicleList = true">Create a custom vehicle list</CButton>
        </CRow>
        <CDataTable
          :fields="tableFields"
          :items="tableItems"
          :items-per-page="10"
          :fixed="true"
          :sorter="true"
          :hover="true"
          :clickable-rows="true"
          @row-clicked="clickRow"
        >
          <template #date_created="{item}">
            <td>
              {{ getFormattedDate(item.date_created) }}
            </td>
          </template>
          <template #last_modified="{item}">
            <td>
              {{ !!item.last_modified ? getFormattedDate(item.last_modified) : "" }}
            </td>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>
    <CModal
      :show.sync="addingVehicleList"
      :centered="true"
      size="lg"
    >
      <add-vehicle-list :finishAddingVehicleList="finishAddingVehicleList" />
      <template #header>
        <h6 class="modal-title">Creating a custom vehicle list!</h6>
        <CButtonClose @click="addingVehicleList = false" />
      </template>
      <template #footer>
        <span></span>
      </template>
    </CModal>
  </div>
</template>

<script>
const axios = require('axios');
import AddVehicleList from "./AddVehicleList.vue"

export default {
  data() {
    return {
      tableFields: [
        {
          key: "title",
          label: "Title"
        },
        {
          key: "date_created",
          label: "Date Created"
        },
        {
          key: "last_modified",
          label: "Last Modified"
        }
      ],
      tableItems: [],
      addingVehicleList: false
    }
  },
  methods: {
    getFormattedDate(date) {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ]

      const formattedDate = months[parseInt(date.substring(5, 7)) - 1] + " " + date.substring(8, 10) + ", " + date.substring(0, 4);
      return formattedDate;
    },
    finishAddingVehicleList(vehicleList) {
      this.addingVehicleList = false;
      this.fetchUserVehicleLists();
    },
    fetchUserVehicleLists() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/vehicle-list/user/${this.$store.state.auth.userId}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      }).then((response) => {
        this.tableItems = response.data.payload;
      }).catch((error) => {
        console.log(error);
      });
    },
    clickRow(vehicleList) {
      console.log(vehicleList);
    }
  },
  mounted() {
    this.fetchUserVehicleLists();
  },
  components: {
    AddVehicleList
  }
}
</script>

<style>
</style>
<template>
  <div>
    <CAlert show :color="messageObj.messageType" v-if="messageObj.content" class="mb-2">{{
      messageObj.content
    }}</CAlert>
    <CCard v-if="userHasRoles('Administration', 'Management', 'Sales Rep')">
      <CCardHeader>
        <slot name="header">Table of custom vehicle lists</slot>
      </CCardHeader>
      <CCardBody>
        <CRow class="d-flex justify-content-between pl-3 pr-3">
          <CButton color="primary mb-3" @click="addingVehicleList = true"
            >Create a custom vehicle list</CButton
          >
          <CRow class="m-0" v-if="tableItems.length > 0">
            <CButton
              color="success"
              class="mb-3 mr-2"
              @click="applyAction"
              v-if="deletingVehicleLists"
              >Apply</CButton
            >
            <CButton
              color="secondary"
              class="mb-3 mr-2"
              @click="setDeletingList(false)"
              v-if="deletingVehicleLists"
              >Cancel</CButton
            >
            <CButton
              v-if="!deletingVehicleLists"
              class="mb-3"
              color="danger"
              variant="outline"
              @click="setDeletingList(true)"
            >
              Delete
            </CButton>
          </CRow>
        </CRow>
        <CDataTable
          :fields="tableFields"
          :items="tableItems"
          :sorter="true"
          :hover="true"
          :clickable-rows="true"
          :column-filter="true"
          @row-clicked="clickRow"
          v-if="tableItems.length > 0"
        >
          <template #select="{ item }">
            <td>
              <CInputCheckbox
                :checked="item._selected"
                @update:checked="() => check(item)"
                custom
              />
            </td>
          </template>
          <template #date_created="{ item }">
            <td>
              {{ getFormattedDate(item.date_created) }}
            </td>
          </template>
          <template #last_modified="{ item }">
            <td>
              {{
                !!item.last_modified ? getFormattedDate(item.last_modified) : ""
              }}
            </td>
          </template>
          <template
            #dealership="{ item }"
            v-if="$store.state.auth.role == 'Administration'"
          >
            <td>
              {{ item.dealership.name }}
            </td>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>
    <CModal :show.sync="addingVehicleList" :centered="true" size="lg">
      <add-vehicle-list :finishAddingVehicleList="finishAddingVehicleList" />
      <template #header>
        <h6 class="modal-title">Creating a custom vehicle list!</h6>
        <CButtonClose @click="addingVehicleList = false" />
      </template>
      <template #footer>
        <span></span>
      </template>
    </CModal>
    <CModal :show.sync="addingVehicleList" :centered="true" size="lg">
      <add-vehicle-list 
      :finishAddingVehicleList="finishAddingVehicleList" 
      :closeAddListModal="closeAddListModal"
      :messageObj="messageObj" 
      v-if="addingVehicleList"/>
      <template #header>
        <h6 class="modal-title">Creating a custom vehicle list!</h6>
        <CButtonClose @click="addingVehicleList = false" />
      </template>
      <template #footer>
        <span></span>
      </template>
    </CModal>
    <CModal :show.sync="viewVehicleList" :centered="false" size="xl">
      <vehicle-list
        v-if="!!$route.query.vehicleListSelected"
        :vehicleListId="$route.query.vehicleListSelected"
        :updateTitle="updateTitle"
      />
      <template #header>
        <h6 class="modal-title">Vehicle Information Page</h6>
        <CButtonClose @click="closeModal" />
      </template>
      <template #footer>
        <span></span>
      </template>
    </CModal>
  </div>
</template>

<script>
const axios = require("axios");
const { containsRoles } = require("../../../utils/index");

import AddVehicleList from "./AddVehicleList.vue";
import VehicleList from "./VehicleList.vue";

export default {
  data() {
    return {
      tableFields: [
        {
          key: "title",
          label: "Title",
        },
        {
          key: "date_created",
          label: "Date Created",
        },
        {
          key: "last_modified",
          label: "Last Modified",
        },
      ],
      tableItems: [],
      deletingVehicleLists: false,
      addingVehicleList: false,
      messageObj: {
        content: null,
        messageType: null,
      },
    };
  },
  computed: {
    viewVehicleList() {
      return !!this.$route.query.vehicleListSelected;
    },
  },
  methods: {
    userHasRoles(...roles) {
      return containsRoles(roles);
    },
    updateTitle() {
      this.fetchUserVehicleLists();
    },
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
      ];

      return months[parseInt(date.substring(5, 7)) - 1] +
        " " +
        date.substring(8, 10) +
        ", " +
        date.substring(0, 4);
    },
    finishAddingVehicleList() {
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
      })
        .then((response) => {
          let lists = response.data.payload;
          this.tableItems = lists.map((list, index) => {
            return {
              ...list,
              index,
            };
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    clickRow(vehicleList, _index, _column, e) {
      if (this.deletingVehicleLists) {
        if (!["INPUT", "LABEL"].includes(e.target.tagName)) {
          this.check(vehicleList);
        }
      } else {
        let queries = JSON.parse(JSON.stringify(this.$route.query));
        queries.vehicleListSelected = vehicleList._id;
        this.$router.replace({ query: queries });
      }
    },
    check(item) {
      const val = Boolean(this.tableItems[item.index]._selected);
      this.$set(this.tableItems[item.index], "_selected", !val);
    },
    setDeletingList(val) {
      if (!val) {
        // clear the selected lists
        for (const item of this.tableItems) {
          this.$set(item, "_selected", false);
        }
        // remove the checkbox column
        this.tableFields.splice(0, 1);
      } else {
        // add the checkbox column
        this.tableFields.unshift({
          key: "select",
          label: "",
          _style: "width:1%",
          sorter: false,
          filter: false,
        });
      }

      this.deletingVehicleLists = val;
    },
    applyAction() {
      // get the selected items
      const selectedItems = this.tableItems.filter(
        (item) => item._selected
      );
      // map just to get the vehicle list ids
      const selectedIds = selectedItems.map((item) => {
        return item._id;
      });
      // axios call to delete the items
      axios({
        method: "POST",
        url: `${this.$store.state.api}/vehicle-list/user/${this.$store.state.auth.userId}/delete`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data: {
          vehicleLists: selectedIds,
        },
      })
        .then((response) => {
          let lists = response.data.payload;
          this.tableItems = lists.map((list, index) => {
            return {
              ...list,
              index,
            };
          });
          this.deletingVehicleLists = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    closeModal() {
      const queries = {};
      this.$router.replace({ query: queries });
    },
    closeAddListModal() {
      this.addingVehicleList = false;
    }
  },
  beforeMount() {
    if (this.$store.state.auth.role == "Administration") {
      this.tableFields.push({
        key: "dealership",
        label: "Dealership",
      });
    }
  },
  mounted() {
    this.fetchUserVehicleLists();
  },
  components: {
    AddVehicleList,
    VehicleList,
  },
};
</script>

<style>
</style>
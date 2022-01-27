<template>
  <div>
    <CCard>
      <CCardHeader>
        <slot name="header">Table of custom vehicle lists</slot>
      </CCardHeader>
      <CCardBody>
        <CRow class="d-flex justify-content-between pl-3 pr-3">
          <CButton color="primary mb-3" @click="addingVehicleList = true">Create a custom vehicle list</CButton>
          <CRow class="m-0">
            <CButton color="success mb-3 mr-2" @click="applyAction" v-if="selectedBulkAction != 'Bulk Action'">Apply</CButton>
            <CButton color="secondary mb-3 mr-2" @click="cancelAction" v-if="selectedBulkAction != 'Bulk Action'">Cancel</CButton>
            <CSelect 
              :options="bulkActions"
              :value.sync="selectedBulkAction"
              :disabled="selectedBulkAction != 'Bulk Action'"
            />
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
          v-if="selectedBulkAction == 'Bulk Action'"
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
          <template #dealership="{item}" v-if="$store.state.auth.role == 'Administration'">
            <td>
              {{ item.dealership.name }}
            </td>
          </template>
        </CDataTable>
        <CDataTable
          :items="tableItems"
          :fields="bulkTableFields"
          :sorter="true"
          :hover="true"
          :clickable-rows="true"
          :column-filter="true"
          @row-clicked="selectRow"
          v-if="selectedBulkAction != 'Bulk Action'"
        >
          <template #select="{item}">
            <td>
              <CInputCheckbox
                :checked="item._selected"
                @update:checked="() => check(item)"
                custom
              />
            </td>
          </template>
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
          <template #dealership="{item}" v-if="$store.state.auth.role == 'Administration'">
            <td>
              {{ item.dealership.name }}
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
    <CModal
      :show.sync="viewVehicleList"
      :centered="false"
      size="xl"
    >
      <vehicle-list v-if="!!$route.query.vehicleListSelected" :vehicleListId="$route.query.vehicleListSelected"/>
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
const axios = require('axios');
import AddVehicleList from "./AddVehicleList.vue";
import VehicleList from "./VehicleList.vue";
import DealershipDD from "../inventory/DealershipDropdown.vue"

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
      bulkTableFields: [
        {
          key: 'select',
          label: '',
          _style: 'width:1%', 
          sorter: false,
          filter: false
        },
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
      bulkActions: ['Bulk Action', 'Delete'],
      selectedBulkAction: 'Bulk Action',
      addingVehicleList: false
    }
  },
  computed: {
    items() {
      return this.tableItems.map(item => {
        return {
          ...item,
          _classes: [
            item._classes,
            user._selected ? 'table-selected' : ''
          ]
        };
      });
    },
    viewVehicleList() {
      return !!this.$route.query.vehicleListSelected;
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
        let lists = response.data.payload;
        this.tableItems = lists.map((list, index) => {
          return {
            ...list,
            index
          };
        });
      }).catch((error) => {
        console.log(error);
      });
    },
    clickRow(vehicleList) {
      let queries = JSON.parse(JSON.stringify(this.$route.query));
      queries.vehicleListSelected = vehicleList._id;
      this.$router.replace({query: queries});
    },
    selectRow(vehicleList, index, column, e) {
      if (!['INPUT', 'LABEL'].includes(e.target.tagName)) {
        this.check(vehicleList)
      }
    },
    check (item) {
      const val = Boolean(this.tableItems[item.index]._selected)
      this.$set(this.tableItems[item.index], '_selected', !val)
    },
    cancelAction() {
      for (let i = 0; i < this.tableItems.length; i++) {
        this.$set(this.tableItems[i], '_selected', false);
      }
      this.selectedBulkAction = 'Bulk Action';
    },
    applyAction() {
      // get the selected items
      const selectedItems = this.tableItems.filter(item => item._selected == true);
      // map just to get the vehicle list ids
      const selectedIds = selectedItems.map(item => {
        return item._id;
      })
      // axios call to delete the items
      axios({
        method: "POST",
        url: `${this.$store.state.api}/vehicle-list/user/${this.$store.state.auth.userId}/delete`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data: {
          vehicleLists: selectedIds
        }
      }).then((response) => {
        let lists = response.data.payload;
        this.tableItems = lists.map((list, index) => {
          return {
            ...list,
            index
          };
        });
        this.selectedBulkAction = 'Bulk Action';
      }).catch((error) => {
        console.log(error);
      });
    },
    closeModal() {
      let queries = JSON.parse(JSON.stringify(this.$route.query));
      queries = {};
      this.$router.replace({query: queries});
    }
  },
  beforeMount() {
    if (this.$store.state.auth.role == "Administration") {
      this.tableFields.push({
        key: "dealership",
        label: "Dealership"
      });
      this.bulkTableFields.push({
        key: "dealership",
        label: "Dealership"
      })
    }
  },
  mounted() {
    this.fetchUserVehicleLists();
  },
  components: {
    AddVehicleList,
    VehicleList,
    'dealership-dropdown': DealershipDD
  }
}
</script>

<style>
</style>
<template>
  <CRow>
    <CCol sm="6" lg="3">
<!--      <CWidgetDropdown-->
<!--       color="gradient-primary" header="Vehicles Sold" :text="inventoryCount"  id="total-sales">-->
<!--        <template #default>-->
<!--          <CDropdown-->
<!--            color="transparent p-0"-->
<!--            placement="bottom-end"-->
<!--          >-->
<!--            <template #toggler-content>-->
<!--              <CIcon name="cil-settings"/>-->
<!--            </template>-->
<!--            <CDropdownItem>Action</CDropdownItem>-->
<!--            <CDropdownItem>Another action</CDropdownItem>-->
<!--            <CDropdownItem>Something else here...</CDropdownItem>-->
<!--            <CDropdownItem disabled>Disabled actionss</CDropdownItem>-->
<!--          </CDropdown>-->
<!--        </template>-->
<!--        <template #footer>-->
<!--          <CChartLineSimple-->
<!--            pointed-->
<!--            class="mt-3 mx-3"-->
<!--            style="height:70px"-->
<!--            point-hover-background-color="primary"-->
<!--            label="Members"-->
<!--            labels="months"-->
<!--          />-->
<!--        </template>-->
<!--      </CWidgetDropdown>-->
      <CCard class="text-center" color="gradient-primary" textColor="white" style="height:160px">
        <CCardBody class="d-flex align-items-center">
          <CCol>
            <CCardTitle class="display-3" color="gradient-secondary">{{inventoryCount}}</CCardTitle>
            <CCardSubtitle>Vehicles Sold</CCardSubtitle>
          </CCol>
        </CCardBody>
      </CCard>
    </CCol>
    <CCol sm="6" lg="3">
      <CWidgetDropdown color="gradient-info" header="9.823" title="Test" text="Members online">
        <template #default>
          <CDropdown
            color="transparent p-0"
            placement="bottom-end"
            :caret="false"
          >
            <template #toggler-content>
              <CIcon name="cil-location-pin"/>
            </template>
            <CDropdownItem>Action</CDropdownItem>
            <CDropdownItem>Another action</CDropdownItem>
            <CDropdownItem>Something else here...</CDropdownItem>
            <CDropdownItem disabled>Disabled action</CDropdownItem>
          </CDropdown>
        </template>
        <template #footer>
          <CChartLineSimple
            pointed
            class="mt-3 mx-3"
            style="height:70px"
            :data-points="[1, 18, 9, 17, 34, 22, 11]"
            point-hover-background-color="info"
            :options="{ elements: { line: { tension: 0.00001 }}}"
            label="Members"
            labels="months"
          />
        </template>
      </CWidgetDropdown>
    </CCol>
    <CCol sm="6" lg="3">
      <CWidgetDropdown
        color="gradient-warning"
        header="9.823"
        text="Members online"
      >
        <template #default>
          <CDropdown
            color="transparent p-0"
            placement="bottom-end"
          >
            <template #toggler-content>
              <CIcon name="cil-settings"/>
            </template>
            <CDropdownItem>Action</CDropdownItem>
            <CDropdownItem>Another action</CDropdownItem>
            <CDropdownItem>Something else here...</CDropdownItem>
            <CDropdownItem disabled>Disabled action</CDropdownItem>
          </CDropdown>
        </template>
        <template #footer>
          <CChartLineSimple
            class="mt-3"
            style="height:70px"
            background-color="rgba(255,255,255,.2)"
            :data-points="[78, 81, 80, 45, 34, 12, 40]"
            :options="{ elements: { line: { borderWidth: 2.5 }}}"
            point-hover-background-color="warning"
            label="Members"
            labels="months"
          />
        </template>
      </CWidgetDropdown>
    </CCol>
    <CCol sm="6" lg="3">
      <CWidgetDropdown
        color="gradient-danger"
        header="9.823"
        text="Members online"
      >
        <template #default>
          <CDropdown
            color="transparent p-0"
            placement="bottom-end"
          >
            <template #toggler-content>
             <CIcon name="cil-settings"/>
            </template>
            <CDropdownItem>Action</CDropdownItem>
            <CDropdownItem>Another action</CDropdownItem>
            <CDropdownItem>Something else here...</CDropdownItem>
            <CDropdownItem disabled>Disabled action</CDropdownItem>
          </CDropdown>
        </template>
        <template #footer>
          <CChartBarSimple
            class="mt-3 mx-3"
            style="height:70px"
            background-color="rgb(250, 152, 152)"
            label="Members"
            labels="months"
          />
        </template>
      </CWidgetDropdown>
    </CCol>
  </CRow>
</template>

<script>
const axios = require("axios");
import { CChartLineSimple, CChartBarSimple } from '../charts/index.js'

export default {
  name: 'WidgetsDropdown',
  props: ["dealership"],
  data() {
    return {
      inventoryCount: "-1",
    };
  },
  methods: {
    fetchVehiclesInInventory(dealership) {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/inventory/dealership/${dealership}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          const inventoryCount = response.data.inventoryCount;
          this.inventoryCount = inventoryCount.toString();
        })
        .catch((error) => {
          console.log(error);
          //Show an error message instead of showing the 404 page
          this.$router.replace("/pages/404");
        });
    },
  },
  mounted() {
    this.fetchVehiclesInInventory(this.dealership);
  },
  components: { CChartLineSimple, CChartBarSimple }
}

var elem = document.getElementById('total-sales');
console.log(elem);
</script>

<template>
  <div>
    <CSelect
          v-if="$store.state.auth.role == 'Administration'"
          id="dealership-select"
          :options="adminDealerships"
          :value.sync="selectedDealership"
          placeholder="Select a dealership to view their inventory"
        />
      <!-- The following change event needs to be added later to update the visuals @change="$refs.inventoryTable.switchDealerships(selectedDealership)" -->
    <WidgetsDropdown />
    <CCard>
      <CCardBody>
        <CRow>
          <CCol sm="5">
            <h4 id="traffic" class="card-title mb-0">Traffic</h4>
            <div class="small text-muted">November 2017</div>
          </CCol>
          <CCol sm="7" class="d-none d-md-block">
            <CButton color="primary" class="float-right">
              <CIcon name="cil-cloud-download" />
            </CButton>
            <CButtonGroup class="float-right mr-3">
              <CButton
                color="outline-secondary"
                v-for="(value, key) in ['Day', 'Month', 'Year']"
                :key="key"
                class="mx-0"
                :pressed="value === selected ? true : false"
                @click="selected = value"
              >
                {{ value }}
              </CButton>
            </CButtonGroup>
          </CCol>
        </CRow>
        <MainChartExample style="height: 300px; margin-top: 40px" />
      </CCardBody>
      <CCardFooter>
        <CRow class="text-center">
          <CCol md sm="12" class="mb-sm-2 mb-0">
            <div class="text-muted">Visits</div>
            <strong>29.703 Users (40%)</strong>
            <CProgress
              class="progress-xs mt-2"
              :precision="1"
              color="success"
              :value="40"
            />
          </CCol>
          <CCol md sm="12" class="mb-sm-2 mb-0 d-md-down-none">
            <div class="text-muted">Unique</div>
            <strong>24.093 Users (20%)</strong>
            <CProgress
              class="progress-xs mt-2"
              :precision="1"
              color="info"
              :value="20"
            />
          </CCol>
          <CCol md sm="12" class="mb-sm-2 mb-0">
            <div class="text-muted">Pageviews</div>
            <strong>78.706 Views (60%)</strong>
            <CProgress
              class="progress-xs mt-2"
              :precision="1"
              color="warning"
              :value="60"
            />
          </CCol>
          <CCol md sm="12" class="mb-sm-2 mb-0">
            <div class="text-muted">New Users</div>
            <strong>22.123 Users (80%)</strong>
            <CProgress
              class="progress-xs mt-2"
              :precision="1"
              color="danger"
              :value="80"
            />
          </CCol>
          <CCol md sm="12" class="mb-sm-2 mb-0 d-md-down-none">
            <div class="text-muted">Bounce Rate</div>
            <strong>Average Rate (40.15%)</strong>
            <CProgress class="progress-xs mt-2" :precision="1" :value="40" />
          </CCol>
        </CRow>
      </CCardFooter>
    </CCard>
    <!-- This is an example of how to set a component's prop value from the outside -->
    <!-- no-charts -> makes the charts disappear -->
    <!-- !no-charts -> makes the charts appear -->
    <!-- :no-charts="false" -> using the v-bind directive to make a JS code line -->
    <WidgetsBrand :no-charts="false" />
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader> Traffic &amp; Sales </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="12" lg="6">
                <CRow>
                  <CCol sm="6">
                    <CCallout color="info">
                      <small class="text-muted">New Clients</small><br />
                      <strong class="h4">9,123</strong>
                    </CCallout>
                  </CCol>
                  <CCol sm="6">
                    <CCallout color="danger">
                      <small class="text-muted">Recurring Clients</small><br />
                      <strong class="h4">22,643</strong>
                    </CCallout>
                  </CCol>
                </CRow>
                <hr class="mt-0" />
                <div class="progress-group mb-4">
                  <div class="progress-group-prepend">
                    <span class="progress-group-text"> Monday </span>
                  </div>
                  <div class="progress-group-bars">
                    <CProgress class="progress-xs" color="info" :value="34" />
                    <CProgress class="progress-xs" color="danger" :value="78" />
                  </div>
                </div>
                <div class="progress-group mb-4">
                  <div class="progress-group-prepend">
                    <span class="progress-group-text"> Tuesday </span>
                  </div>
                  <div class="progress-group-bars">
                    <CProgress class="progress-xs" :value="56" color="info" />
                    <CProgress class="progress-xs" :value="94" color="danger" />
                  </div>
                </div>
                <div class="progress-group mb-4">
                  <div class="progress-group-prepend">
                    <span class="progress-group-text"> Wednesday </span>
                  </div>
                  <div class="progress-group-bars">
                    <CProgress class="progress-xs" :value="12" color="info" />
                    <CProgress class="progress-xs" :value="67" color="danger" />
                  </div>
                </div>
                <div class="progress-group mb-4">
                  <div class="progress-group-prepend">
                    <span class="progress-group-text"> Thursday </span>
                  </div>
                  <div class="progress-group-bars">
                    <CProgress class="progress-xs" :value="43" color="info" />
                    <CProgress class="progress-xs" :value="91" color="danger" />
                  </div>
                </div>
                <div class="progress-group mb-4">
                  <div class="progress-group-prepend">
                    <span class="progress-group-text"> Friday </span>
                  </div>
                  <div class="progress-group-bars">
                    <CProgress class="progress-xs" :value="22" color="info" />
                    <CProgress class="progress-xs" :value="73" color="danger" />
                  </div>
                </div>
                <div class="progress-group mb-4">
                  <div class="progress-group-prepend">
                    <span class="progress-group-text"> Saturday </span>
                  </div>
                  <div class="progress-group-bars">
                    <CProgress class="progress-xs" :value="53" color="info" />
                    <CProgress class="progress-xs" :value="82" color="danger" />
                  </div>
                </div>
                <div class="progress-group mb-4">
                  <div class="progress-group-prepend">
                    <span class="progress-group-text"> Sunday </span>
                  </div>
                  <div class="progress-group-bars">
                    <CProgress class="progress-xs" :value="9" color="info" />
                    <CProgress class="progress-xs" :value="69" color="danger" />
                  </div>
                </div>
                <div class="legend text-center">
                  <small>
                    <sup><CBadge shape="pill" color="info">&nbsp;</CBadge></sup>
                    New clients &nbsp;&nbsp;
                    <sup
                      ><CBadge shape="pill" color="danger">&nbsp;</CBadge></sup
                    >
                    Recurring clients
                  </small>
                </div>
              </CCol>
              <CCol sm="12" lg="6">
                <CRow>
                  <CCol sm="6">
                    <CCallout color="warning">
                      <small class="text-muted">Pageviews</small><br />
                      <strong class="h4">78,623</strong>
                    </CCallout>
                  </CCol>
                  <CCol sm="6">
                    <CCallout color="success">
                      <small class="text-muted">Organic</small><br />
                      <strong class="h4">49,123</strong>
                    </CCallout>
                  </CCol>
                </CRow>
                <hr class="mt-0" />
                <ul class="horizontal-bars type-2">
                  <div class="progress-group">
                    <div class="progress-group-header">
                      <CIcon name="cil-user" class="progress-group-icon" />
                      <span class="title">Male</span>
                      <span class="ml-auto font-weight-bold">43%</span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                        class="progress-xs"
                        :value="43"
                        color="warning"
                      />
                    </div>
                  </div>
                  <div class="progress-group mb-5">
                    <div class="progress-group-header">
                      <CIcon
                        name="cil-user-female"
                        class="progress-group-icon"
                      />
                      <span class="title">Female</span>
                      <span class="ml-auto font-weight-bold">37%</span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                        class="progress-xs"
                        :value="37"
                        color="warning"
                      />
                    </div>
                  </div>
                  <div class="progress-group">
                    <div class="progress-group-header">
                      <CIcon name="cil-globe-alt" class="progress-group-icon" />
                      <span class="title">Organic Search</span>
                      <span class="ml-auto font-weight-bold">
                        191,235<span class="text-muted small">(56%)</span>
                      </span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                        class="progress-xs"
                        :value="56"
                        color="success"
                      />
                    </div>
                  </div>
                  <div class="progress-group">
                    <div class="progress-group-header">
                      <CIcon
                        name="cib-facebook"
                        height="17"
                        class="progress-group-icon"
                      />
                      <span class="title">Facebook</span>
                      <span class="ml-auto font-weight-bold">
                        51,223 <span class="text-muted small">(15%)</span>
                      </span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                        class="progress-xs"
                        :value="15"
                        color="success"
                      />
                    </div>
                  </div>
                  <div class="progress-group">
                    <div class="progress-group-header">
                      <CIcon
                        name="cib-twitter"
                        height="17"
                        class="progress-group-icon"
                      />
                      <span class="title">Twitter</span>
                      <span class="ml-auto font-weight-bold">
                        37,564 <span class="text-muted small">(11%)</span>
                      </span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                        class="progress-xs"
                        :value="11"
                        color="success"
                      />
                    </div>
                  </div>
                  <div class="progress-group">
                    <div class="progress-group-header">
                      <CIcon
                        name="cib-linkedin"
                        height="17"
                        class="progress-group-icon"
                      />
                      <span class="title">LinkedIn</span>
                      <span class="ml-auto font-weight-bold">
                        27,319 <span class="text-muted small">&nbsp;(8%)</span>
                      </span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                        class="progress-xs"
                        :value="8"
                        color="success"
                      />
                    </div>
                  </div>
                  <div class="divider text-center">
                    <CButton color="link" size="sm" class="text-muted">
                      <CIcon name="cil-options" />
                    </CButton>
                  </div>
                </ul>
              </CCol>
            </CRow>
            <br />
            <CDataTable
              class="mb-0 table-outline"
              hover
              :items="tableItems"
              :fields="tableFields"
              head-color="light"
              no-sorting
            >
              <td slot="avatar" class="text-center" slot-scope="{ item }">
                <div class="c-avatar">
                  <img :src="item.avatar.url" class="c-avatar-img" alt="" />
                  <span
                    class="c-avatar-status"
                    :class="`bg-${item.avatar.status || 'secondary'}`"
                  ></span>
                </div>
              </td>
              <td slot="user" slot-scope="{ item }">
                <div>{{ item.user.name }}</div>
                <div class="small text-muted">
                  <span>
                    <template v-if="item.user.new">New</template>
                    <template v-else>Recurring</template>
                  </span>
                  | Registered: {{ item.user.registered }}
                </div>
              </td>
              <td slot="country" slot-scope="{ item }" class="text-center">
                <CIcon :name="item.country.flag" height="25" />
              </td>
              <td slot="usage" slot-scope="{ item }">
                <div class="clearfix">
                  <div class="float-left">
                    <strong>{{ item.usage.value }}%</strong>
                  </div>
                  <div class="float-right">
                    <small class="text-muted">{{ item.usage.period }}</small>
                  </div>
                </div>
                <CProgress
                  class="progress-xs"
                  v-model="item.usage.value"
                  :color="color(item.usage.value)"
                />
              </td>
              <td slot="payment" slot-scope="{ item }" class="text-center">
                <CIcon :name="item.payment.icon" height="25" />
              </td>
              <td slot="activity" slot-scope="{ item }">
                <div class="small text-muted">Last login</div>
                <strong>{{ item.activity }}</strong>
              </td>
            </CDataTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import MainChartExample from "../charts/MainChartExample";
import WidgetsDropdown from "../widgets/WidgetsDropdown";
import WidgetsBrand from "../widgets/WidgetsBrand";

export default {
  name: "Dashboard",
  components: {
    MainChartExample,
    WidgetsDropdown,
    WidgetsBrand,
  },
  data() {
    return {
      adminDealerships: fetchAdminDealerships(),
      selectedDealership: null,
      defaultAdminDealership: null,
    };
  },
  methods: {
    setDefaultDealership() {
      axios({
        method: "PUT",
        url: `${this.$store.state.api}/users/${this.$store.state.auth.userId}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data: {
          dealership: this.selectedDealership,
        },
      })
        .then((response) => {
          this.defaultAdminDealership = this.selectedDealership;
          this.$store.commit("setProperty", [
            "dealership",
            this.selectedDealership,
          ]);
          // find the dealership's name
          const index = this.adminDealerships.findIndex(
            (dealership) => dealership.value == this.selectedDealership
          );
          this.showMessage(
            `${this.adminDealerships[index].label} successfully set as your default dealership`
          );
        })
        .catch((error) => {
          this.showMessage(
              `An error occured while attempting to set ${this.adminDealerships[index].label} as your default dealership`
            );
        });
    },
    fetchAdminDealerships() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/dealerships`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        params: {
          admin: this.$store.state.auth.userId,
        },
      })
        .then((response) => {
          if (response.data.success) {
            // convert the payload to a propery select array
            const payload = response.data.payload;
            const dealerships = [];
            payload.forEach((dealership) => {
              dealerships.push({
                value: dealership._id,
                label: dealership.name,
              });
            });
            return dealerships;
          }
        })
        .catch((error) => {
          console.log(error);
          this.$router.replace("/pages/404");
        });
    },
  },
  mounted() {
    /* 
    Get the dealership being viewed. If the user is an administrator, offer a dropdown so they can select
    which dealership to view. If not an administrator, use the dealership associated to the account.
    */
    if (this.$store.state.auth.role != "Administration") {
      // administrators will have no dealership associated to their account
      // fetch the properties associated to the dealership
      this.selectedDealership = this.$store.state.auth.dealership;
    } else {
      // fetch the dealerships associated to the admin
      this.fetchAdminDealerships();

      //if the admin has a default dealership selected, show its inventory
      if (this.$store.state.auth.dealership) {
        this.selectedDealership = this.$store.state.auth.dealership;
      }
    }
  },
};
</script>

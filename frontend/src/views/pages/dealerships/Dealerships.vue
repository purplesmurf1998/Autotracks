<template>
  <div>
    <CRow v-if="!selectedDealership">
      <CCol>
        <CCard>
          <CCardHeader>
            <slot name="header">
              List of registered dealerships
            </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :fields="tableFields"
              :items="tableItems"
              :striped="true"
              :items-per-page="10"
              :fixed="true"
              :clickable-rows="true"
              @row-clicked="clickRow"
            >
              <template #admin="{item}">
                <td>
                  {{item.admin.first_name}}
                </td>
              </template>
            </CDataTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <!-- <CRow>
      <Dealership
        v-if="selectedDealership != null"
        :dealership="selectedDealership"
        :resetSelectedDealership="resetSelectedDealership"
      ></Dealership>
    </CRow> -->
  </div>
</template>

<script>
import Dealership from './Dealership'
const axios = require ('axios');
export default {
  name: 'Dealerships',
  components: {Dealership},
  data() {
    return {
      selectedDealership: null,
      tableItems: [
        {
          name: 'Audi Saint Viateur',
          description: 'The only one that I could come up with!',
          admin: 'Qandeel',
          created: '1989/11/14'
        },
        {
          name: 'Audi Saint Viateur',
          description: 'The only one that I could come up with!',
          admin: 'Qandeel',
          created: '1989/11/14'
        },
        {
          name: 'Audi Saint Viateur',
          description: 'The only one that I could come up with!',
          admin: 'Qandeel',
          created: '1989/11/14'
        }
      ],
      tableFields: [
        {key: 'name'},
        {key: 'description'},
        {key: 'admin.first_name'},
        {key: 'created_at'}
      ],
      dName: '[Audi Saint Viateur]',
      dDescription: '[The only one that I could come up with!]',
      dAdmin: '[Qandeel]',
      dCreated: '[1989/11/14]'
    }
  },
  mounted() {
    this.fetchDealerships()
  },
  methods: {
    clickRow(dealership) {
      //this.selectedDealership = dealership
      //console.log(dealership)
      const dealershipId = dealership._id;
      this.$router.push(`/dealerships/${dealershipId}`);
    },
    resetSelectedDealership() {
      this.selectedDealership = null
      console.log("Selected Dealership has been reset")
    },
    fetchDealerships() {
      console.log(this.$store.state.auth.userId + "\n" + this.$store.state.auth.token)

      axios({
        method: 'GET',
        url: 'http://localhost:5000/api/v1/dealerships/?admin='+this.$store.state.auth.userId+"&populate=admin",
        headers:{
          'Authorization':'Bearer '+this.$store.state.auth.token
        }
      }).then(response => {
        this.tableItems = response.data.data
        console.log(response)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style>

</style>

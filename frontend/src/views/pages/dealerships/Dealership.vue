<template>
  <div>
    <CCol>
      <CCard>
        <!--        <CCardImg-->
        <!--          variant="top"-->
        <!--          width="5%"-->
        <!--          src="https://www.fireglass.com/resources/design-ideas/case-studies/2018/audi-dealership/img/Audi.jpg"-->
        <!--        />-->
        <CCardBody>
          <h1>{{dealership.name}}</h1>
          <h2>{{dealership.admin.first_name}}'s dealership</h2>
          <p>{{dealership.description}}</p>
          <CButton
            color="primary"
            @click="resetSelectedDealership"
          >
            Hide details
          </CButton>
        </CCardBody>
        <CCardFooter>
          <small class="text-muted">
            {{dealership.created_at}}
          </small>
        </CCardFooter>
      </CCard>
    </CCol>
  </div>
</template>

<script>
export default {
  name: 'Dealership',
  data() {
      return {};
  },
  props:[
    "dealership",
    "resetSelectedDealership"
  ]

}
</script>

<style>

</style>

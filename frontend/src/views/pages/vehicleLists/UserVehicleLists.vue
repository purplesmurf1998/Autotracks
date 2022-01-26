<template>
  <div>
    <CCard>
      <CCardHeader>
        <slot name="header">Table of custom vehicle lists</slot>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          :fields="tableFields"
          :items="tableItems"
          :striped="true"
          :items-per-page="10"
          :fixed="true"
          sorter
          :clickable-rows="true"
          @row-clicked="clickRow"
        />
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
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
      tableItems: []
    }
  },
  methods: {
  },
  beforeMount() {

  }
}
</script>

<style>

</style>
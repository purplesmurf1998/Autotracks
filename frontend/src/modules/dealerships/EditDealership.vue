<template>
  <CCard class="mx-4 mb-0">
    <CCardBody class="p-4">
      <CForm>
        <h1>Step 2: Register new dealership!</h1>
        <p class="text-muted">The dealership is the account everything will be tied to. </p>
        <CLabel class="mb-2">Dealership Name</CLabel>
        <CInput
          placeholder="Name"
          autocomplete="name"
          v-model="dealershipAccount.dealershipName"
          @keyup="$emit('update:dealershipAccount.dealershipName', dealershipAccount.dealershipName);"
        />
        <CLabel class="mb-2">Dealership Description</CLabel>
        <CTextarea
          placeholder="Description"
          rows="9"
          v-model="dealershipAccount.dealershipDescription"
          @keyup="$emit('update:dealershipAccount.dealershipDescription', dealershipAccount.dealershipDescription);"
        />
      </CForm>
    </CCardBody>
  </CCard>
</template>

<script>
export default {
  props: ['dealershipAccount']
}
</script>
<template>
  <CHeader with-subheader>
    <CToggler
      in-header
      class="ml-3 d-lg-none"
      @click="$store.commit('toggleSidebarMobile')"
    />
    <CToggler
      in-header
      class="ml-3 d-md-down-none"
      @click="$store.commit('toggleSidebarDesktop')"
    />
    <CHeaderBrand class="mx-auto d-lg-none" to="/">
      <img src="../assets/autotracks_blue_crp.png" class="img-fluid header-img" alt="Responsive image">
    </CHeaderBrand>
    <CHeaderNav class="ml-auto">
      <TheHeaderDropdownNotif @notifModal="showNotifModal = true"/>
      <TheHeaderDropdownMssgs/>
      <TheHeaderDropdownAccnt class="mr-3"/>
    </CHeaderNav>

    <CSubheader class="px-3">
      <CBreadcrumbRouter class="border-0 mb-0"/>
    </CSubheader>
    <CModal :show.sync="showNotifModal" :centered="true">
      <notif-modal
        v-if="showNotifModal"
        :setNotifModal="setNotifModal"
        @notifRead="unReadNotif = $event"
      />
      <template #header>
        <h6 class="modal-title">Notifications</h6>
        <CButtonClose @click="setNotifModal(false)" />
      </template>
      <template #footer>
        <span></span>
      </template>
    </CModal>
  </CHeader>
</template>

<script>
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt'
import TheHeaderDropdownNotif from './TheHeaderDropdownNotif'
import TheHeaderDropdownTasks from './TheHeaderDropdownTasks'
import TheHeaderDropdownMssgs from './TheHeaderDropdownMssgs'
import logo from '../assets/autotracks_blue_crp.png'
import NotifModal from "./NotificationModal.vue"
const axios = require("axios");

export default {
  name: 'TheHeader',
  data(){
    return {
      logo: logo,
      showNotifModal: false,
      unReadNotif: [],
    }
  },
  components: {
    TheHeaderDropdownAccnt,
    TheHeaderDropdownNotif,
    TheHeaderDropdownTasks,
    TheHeaderDropdownMssgs,
    "notif-modal": NotifModal,
  },
  methods: {
    setNotifModal(value) {
      this.showNotifModal = value;
    },
  }
}
</script>

<style>
.header-img {
     max-height: 100px;
}
</style>

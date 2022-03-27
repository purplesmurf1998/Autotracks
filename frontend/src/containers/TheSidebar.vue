<template>
  <CSidebar
    :minimize="minimize"
    unfoldable
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
    <img src="../assets/autotracks_white_crp.png" class="img-fluid" alt="Responsive image">
      <CIcon
        class="c-sidebar-brand-minimized"
        name="logo"
        :src="logo"
        size="xl"
        :height="35"
        viewBox="0 0 110 134"
      />
    </CSidebarBrand>
    <CRenderFunction flat :contentToRender="sidebarItems"/>
  </CSidebar>
</template>

<script>
import SidebarItems from './SidebarItems'
import logo from '../assets/autotracks_white_crp.png'
export default {
  name: 'TheSidebar',
  data(){
    return {
      logo: logo
    }
  },
  extends: SidebarItems,
  computed: {
    show () {
      return this.$store.state.sidebarShow
    },
    minimize () {
      return this.$store.state.sidebarMinimize
    }
  }
}
</script>




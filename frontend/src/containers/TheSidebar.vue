<template>
  <CSidebar
    :minimize="minimize"
    unfoldable
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
    <img src="../assets/polaris2.svg" class="img-fluid" alt="Responsive image">
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
    <CSidebarMinimizer
      class="c-d-md-down-none"
      @click.native="$store.commit('toggle', 'sidebarMinimize')"
    />
  </CSidebar>
</template>

<script>
import SidebarItems from './SidebarItems'
import logo from '../assets/polaris2.svg'
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




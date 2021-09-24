<template>
  <CDropdown 
    placement="bottom-end"
    :caret="false"
    in-nav
    class="c-header-nav-item d-md-down-none mx-2"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <CIcon name="cil-bell"/>
        <CBadge shape="pill" color="danger">{{itemsCount}}</CBadge>
      </CHeaderNavLink>
    </template>
    <CDropdownHeader 
      tag="div" 
      class="text-center bg-light"
    >
      <strong>You have {{itemsCount}} notifications</strong>
    </CDropdownHeader>
    <CDropdownItem>
      <CIcon name="cil-user-follow" class="text-success"/> New user registered
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-user-unfollow" class="text-danger"/> User deleted
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-chart-pie" class="text-info"/> Sales report is ready
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-basket" class="text-primary"/> New client
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-speedometer" class="text-warning"/> Server overloaded
      </CDropdownItem>
    <CDropdownHeader tag="div" class="text-center bg-light">
      <strong>Server</strong>
    </CDropdownHeader>
    <CDropdownItem class="d-block">
      <div class="text-uppercase mb-1">
        <small><b>CPU Usage</b></small>
      </div>
      <CProgress class="progress-xs" color="info" :value="25"/>
      <small class="text-muted">348 Processes. 1/4 Cores.</small>
    </CDropdownItem>
    <CDropdownItem class="d-block">
      <div class="text-uppercase mb-1">
        <small><b>Memory Usage</b></small>
      </div>
      <CProgress class="progress-xs" color="warning" :value="70"/>
      <small class="text-muted">11444GB/16384MB</small>
    </CDropdownItem>
    <CDropdownItem class="d-block">
      <div class="text-uppercase mb-1">
        <small><b>SSD 1 Usage</b></small>
      </div>
      <CProgress class="progress-xs" color="danger" :value="90"/>
      <small class="text-muted">243GB/256GB</small>
    </CDropdownItem>
  </CDropdown>
</template>
<script>
export default {
  name: 'TheHeaderDropdownNotif',
  data () {
    return { itemsCount: 5 }
  }
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>
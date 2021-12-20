<template>
  <CDropdown 
    :caret="false"
    placement="bottom-end"
    in-nav
    class="c-header-nav-item d-md-down-none mx-2"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <CIcon name="cil-list-rich"/>
        <CBadge shape="pill" color="warning">{{itemsCount}}</CBadge>
      </CHeaderNavLink>
    </template>
    <CDropdownHeader 
      tag="div" 
      class="text-center bg-light"
    >
      <strong>You have {{itemsCount}} pending tasks</strong>
    </CDropdownHeader>

    <CDropdownItem class="d-block">
      <div class="small mb-1">
        Upgrade NPM &amp; Bower <span class="float-right"><strong>0%</strong></span>
      </div>
      <CProgress class="progress-xs" color="info"/>
    </CDropdownItem>

    <CDropdownItem class="d-block">
      <div class="small mb-1">
        ReactJS Version <span class="float-right"><strong>25%</strong></span>
      </div>
      <CProgress class="progress-xs" color="danger" :value="25"/>
    </CDropdownItem>

    <CDropdownItem class="d-block">
      <div class="small mb-1">
        VueJS Version <span class="float-right"><strong>50%</strong></span>
      </div>
      <CProgress class="progress-xs" color="warning" :value="50"/>
    </CDropdownItem>

    <CDropdownItem class="d-block">
      <div class="small mb-1">
        Add new layouts <span class="float-right"><strong>75%</strong></span>
      </div>
      <CProgress class="progress-xs" color="info" :value="75"/>
    </CDropdownItem>

    <CDropdownItem class="d-block">
      <div class="small mb-1">
        Angular 2 Cli Version <span class="float-right"><strong>100%</strong></span>
      </div>
      <CProgress class="progress-xs" color="success" :value="100"/>
    </CDropdownItem>

    <CDropdownItem class="text-center border-top">
      <strong>View all tasks</strong>
    </CDropdownItem>

  </CDropdown>
</template>
<script>
export default {
  name: 'TheHeaderDropdownTasks',
  data () {
    return { itemsCount: 15 }
  }
}
</script>

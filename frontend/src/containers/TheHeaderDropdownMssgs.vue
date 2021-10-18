<template>
  <CDropdown 
    :caret="false"
    placement="bottom-end"
    in-nav
    class="c-header-nav-item mx-2 d-md-down-none"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <CIcon name="cil-envelope-closed"/>
        <CBadge shape="pill" color="info">{{itemsCount}}</CBadge>
      </CHeaderNavLink>
    </template>
    <CDropdownHeader tag="div" class="text-center bg-light">
      <strong>You have {{itemsCount}} messages</strong>
    </CDropdownHeader>
    <CDropdownItem>
      <div class="message">
        <div class="pt-3 mr-3 float-left">
          <div class="c-avatar">
            <img src="img/avatars/7.jpg" class="c-avatar-img" alt="admin@bootstrapmaster.com">
            <span class="avatar-status bg-success"></span>
          </div>
        </div>
        <div>
          <small class="text-muted">John Doe</small>
          <small class="text-muted float-right mt-1">Just now</small>
        </div>
        <div class="text-truncate font-weight-bold">
          <CIcon name="cil-warning" class="text-danger"/> 
          Important message
        </div>
        <div class="small text-muted text-truncate">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</div>
      </div>
    </CDropdownItem>
    <CDropdownItem href="#">
      <div class="message">
        <div class="pt-3 mr-3 float-left">
          <div class="c-avatar">
            <img src="img/avatars/6.jpg" class="c-avatar-img" alt="admin@bootstrapmaster.com"/>
            <span class="avatar-status bg-warning"></span>
          </div>
        </div>
        <div>
          <small class="text-muted">Jane Doe</small>
          <small class="text-muted float-right mt-1">5 minutes ago</small>
        </div>
        <div class="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
        <div class="small text-muted text-truncate">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</div>
      </div>
    </CDropdownItem>
    <CDropdownItem href="#">
      <div class="message">
        <div class="pt-3 mr-3 float-left">
          <div class="c-avatar">
            <img src="img/avatars/5.jpg" class="c-avatar-img" alt="admin@bootstrapmaster.com"/>
            <span class="avatar-status bg-danger"></span>
          </div>
        </div>
        <div>
          <small class="text-muted">Janet Doe</small>
          <small class="text-muted float-right mt-1">1:52 PM</small>
        </div>
        <div class="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
        <div class="small text-muted text-truncate">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</div>
      </div>
    </CDropdownItem>
    <CDropdownItem href="#">
      <div class="message">
        <div class="pt-3 mr-3 float-left">
          <div class="c-avatar">
            <img src="img/avatars/4.jpg" class="c-avatar-img" alt="admin@bootstrapmaster.com"/>
            <span class="avatar-status bg-info"></span>
          </div>
        </div>
        <div>
          <small class="text-muted">Joe Doe</small>
          <small class="text-muted float-right mt-1">4:03 AM</small>
        </div>
        <div class="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
        <div class="small text-muted text-truncate">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</div>
      </div>
    </CDropdownItem>
    <CDropdownItem 
      href="#" 
      class="border-top text-center"
    >
      <strong>View all messages</strong>
    </CDropdownItem>
  </CDropdown>
</template>
<script>
export default {
  name: 'TheHeaderDropdownMssgs',
  data () {
    return { itemsCount: 7 }
  }
}
</script>

<template>
  <div class="wrapper">

    <side-bar type="sidebar" :sidebar-links="$sidebar.sidebarLinks">
      <user-menu></user-menu>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <Common-content @click.native="toggleSidebar">

      </Common-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">

</style>
<script>
  import TopNavbar from './TopNavbar.vue'
  import ContentFooter from './ContentFooter.vue'
  import CommonContent from './Content.vue'
  import UserMenu from 'src/components/UIComponents/SidebarPlugin/UserMenu.vue'

  export default {
    components: {
      TopNavbar,
      ContentFooter,
      CommonContent,
      UserMenu,
    },
    mounted() {
        FreshWidget.init("", {"queryString": "&widgetType=popup", "utf8": "✓", "widgetType": "popup",
          "buttonType": "text", "buttonText": "Support", "buttonColor": "white", "buttonBg": "#006063",
          "alignment": "2", "offset": "235px", "formHeight": "500px",
          "url": "https://freelancedevelopercoach.freshdesk.com"});
    },
    methods: {
      toggleSidebar () {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false)
        }
      }
    }
  }

</script>

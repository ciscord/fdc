<template>
  <div class="row">
    This is the dashboard page.
  </div>
</template>
<script>
  import { mapActions } from 'vuex';
  import { Auth, Analytics } from "aws-amplify";

  export default {
    async beforeCreate() {
      try {
        let account = await Auth.currentAuthenticatedUser();
        this.$store.commit('saveUser', account)
      } catch (err) {
      }
    },
    created() {
      this.setNavbarTitle('Dashboard');
    },
    methods: {
      ...mapActions('UI', ['setNavbarTitle']),
    },
    components: {

    }
  }

</script>
<style>

</style>

<template>
  <div class="row">
    This is the dashboard page.
  </div>
</template>
<script>
  import { mapActions } from 'vuex';

  export default {
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

<template>
  <div class="row">
    This is the Billing page
  </div>
</template>
<script>
  import { mapActions } from 'vuex';
 
  export default {
    created() {
      this.setNavbarTitle('Billing');
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

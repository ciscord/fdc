<template>
  <div class="row">
    This is the what to read page
  </div>
</template>
<script>
  import { mapActions } from 'vuex';
 
  export default {
    created() {
      this.setNavbarTitle('What To Read');
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

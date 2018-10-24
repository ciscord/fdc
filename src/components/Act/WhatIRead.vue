<template>
  <div class="row">
    This is the what I've read page
  </div>
</template>
<script>
  import { mapActions } from 'vuex';
 
  export default {
    created() {
      this.setNavbarTitle('What I\'ve Read');
    },
    methods: {
      ...mapActions('UI', ['setNavbarTitle'])
    },
    components: {
      
    }
  }

</script>
<style>

</style>


<template>
  <div class="row">
    This is the strengths & opportunities page
  </div>
</template>
<script>
  import { mapActions } from 'vuex';
 
  export default {
    created() {
      this.setNavbarTitle('Strengths & Opportunities');
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

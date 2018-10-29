<template>
  <div class="row">
    <p>
      If you’re growing your career, chances are you’re reading even more than a developer typically does.
      We’ll provide suggestions on what to take a look at and make it a breeze to add your choices to the Track
      Reading list.  You’ll also get a chance to see what others are reading and upvote your favorites.
    </p>
    <p>
      This feature will be available as part of the Grow release in January.
    </p>
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

<template>
  <div class="row">
    <p>
      The only thing better than personal improvement is giving your manager visibility into that process.
      You’ll be able to grant access to a custom view of your commitment to improvement where we show how long
      you’ve been at it and the length of your streaks (not your actual ratings).  When your manager sees not
      only how long you’ve been pursuing excellence, but your dedication by keeping at it consistently you’ll
      stand out from the crowd.  Not only that but, if you choose, you can allow them to tell you what they are
      interested in and you can track that as well.
    </p>
    <p>
      This feature will be available as part of the Act release in December.
    </p>
  </div>
</template>
<script>
  import { mapActions } from 'vuex';
 
  export default {
    created() {
      this.setNavbarTitle('Manager Access');
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

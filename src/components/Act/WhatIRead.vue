<template>
  <div class="row">
    <p>
      Developers read.  A lot.  Books, blog posts, Quora, and especially Stack Overflow.  When you find something
      interesting, this feature will allow you to save the URL and write a short description of why you thought it
      was valuable.  This becomes a feed on your Public Profile to show people that you’re not only a reader, you’re
      also a thinker.  When a hiring manager is comparing candidates who do you think they’ll prefer: someone
      who says, “I’m a life-long learner” (which I see A LOT in proposals) or someone who has their reading list
      along with their thoughts on the pieces sitting right there on their profile? (Hint: It’s the second one,
      which I spent a lot of time designing to make my own hiring decisions easier)
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

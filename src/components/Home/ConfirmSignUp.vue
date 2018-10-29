
<template>
  <div v-bind:class="amplifyUI.formSection">
    <div v-bind:class="amplifyUI.sectionHeader">{{options.header}}</div>
    <div v-bind:class="amplifyUI.sectionBody">
      <div v-bind:class="amplifyUI.formField">
        <div v-bind:class="amplifyUI.inputLabel">Email *</div>
        <input v-bind:class="amplifyUI.input" v-model="options.username" name="username" placeholder="Username" autofocus />
      </div>
      <div v-bind:class="amplifyUI.formField">
        <div v-bind:class="amplifyUI.inputLabel">Code *</div>
        <input v-bind:class="amplifyUI.input" v-model="code" name="code" placeholder="Code" />
        <div v-bind:class="amplifyUI.hint">
          Lost your code?
          <a v-bind:class="amplifyUI.a" v-on:click="resend">Resend Code</a>
        </div>
      </div>
    </div>
    <div v-bind:class="amplifyUI.sectionFooter">
      <span v-bind:class="amplifyUI.sectionFooterPrimaryContent">
        <button v-bind:class="amplifyUI.button" v-on:click="confirm">Confirm</button>
      </span>
      <span v-bind:class="amplifyUI.sectionFooterSecondaryContent">
        Have an Account?
        <a v-bind:class="amplifyUI.a" v-on:click="signIn">Sign In</a>
      </span>
    </div>
    <div class="error" v-if="error != 'Valid username not received.'">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { AmplifyEventBus } from "aws-amplify-vue";
import * as AmplifyUI from "@aws-amplify/ui";
import { paymentStripeAPI } from "./../../api/api";
export default {
  name: "ConfirmSignUp",
  props: ["confirmSignUpConfig"],
  data() {
    return {
      code: "",
      error: "",
      logger: {},
      amplifyUI: AmplifyUI
    };
  },
  computed: {
    options() {
      const defaults = {
        username: "",
        header: "Confirm Sign Up"
      };
      return Object.assign(defaults, this.confirmSignUpConfig || {});
    }
  },
  mounted: function() {
    this.logger = new this.$Amplify.Logger(this.$options.name);
    if (!this.options.username) {
      return this.setError("Valid username not received.");
    }
  },
  methods: {
    confirm() {
      this.$Amplify.Auth.confirmSignUp(this.options.username, this.code)
        .then(() => {
          this.logger.info("confirmSignUp success");


          let params = {}

          params.amount = "2.0"
          params.currency = "usd"
          params.source = this.$cookie.get("stripe_token")
          params.plan_level = "Plan"
          params.affiliate_id = this.$cookie.get("affiliate_id")

console.log('stripe api params'+JSON.stringify(params))
          paymentStripeAPI(params).then(data => {
            console.log('stripe api'+JSON.stringify(data))
          });

          AmplifyEventBus.$emit("authState", "signedOut");
        })
        .catch(e => this.setError(e));
    },
    resend() {
      this.$Amplify.Auth.resendSignUp(this.options.username)
        .then(() => {
          this.logger.info("resendSignUp success");
        })
        .catch(e => this.setError(e));
    },
    signIn() {
      AmplifyEventBus.$emit("authState", "signedOut");
    },
    setError(e) {
      this.error = e.message || e;
      this.logger.error(this.error);
    }
  }
};
</script>

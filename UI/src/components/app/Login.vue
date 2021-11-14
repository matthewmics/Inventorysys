<template>
  <form
    @submit="onSubmit"
    style="width: 425px; margin: auto; padding-top: 10vh"
    class="center"
  >
    <md-card>
      <md-card-content>
        <h3>LOGIN</h3>
        <form action="">
          <md-field>
            <label>Email</label>
            <md-input v-model="username"></md-input>
          </md-field>
          <md-field>
            <label>Password</label>
            <md-input v-model="password" type="password"></md-input>
          </md-field>
        </form>
      </md-card-content>
      <md-card-actions style="border: 0px">
        <md-button :disabled="authLoading" type="submit" class="md-primary"
          >Login</md-button
        >
      </md-card-actions>
    </md-card>
  </form>
</template>

<script>
import { router } from "../../main";
import { mapGetters, mapActions } from "vuex";
export default {
  data: () => {
    return {
      username: "",
      password: "",
    };
  },
  computed: mapGetters(["authLoading"]),
  methods: {
    ...mapActions(["login"]),
    onSubmit(e) {
      e.preventDefault();
      this.login({
        email: this.username,
        password: this.password,
      }).catch((err) => {
        alert("Invalid email/password");
      });
    },
  },
};
</script>

<style>
</style>
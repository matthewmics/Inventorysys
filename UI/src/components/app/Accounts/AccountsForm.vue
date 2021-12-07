<template>
  <md-dialog
    :md-active.sync="show"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    @md-opened="onOpen"
  >
    <md-dialog-title>{{
      true ? "Add New " + form.role : "Edit " + "name"
    }}</md-dialog-title>

    <md-dialog-content>
      <form id="myForm" @submit.prevent="onSubmit">
        <!-- <md-field>
          <label for="role">Role</label>
          <md-input id="role" name="role" v-model="form.role" disabled />
        </md-field> -->
        <md-field>
          <label for="name">Name</label>
          <md-input id="name" name="name" v-model="form.name" />
        </md-field>
        <md-field>
          <label for="email">Email</label>
          <md-input id="email" name="email" v-model="form.email" />
        </md-field>

        <md-field>
          <label for="password">Password</label>
          <md-input
            type="password"
            id="password"
            name="password"
            v-model="form.password"
          />
        </md-field>
      </form>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-accent" @click="$emit('form-close')"
        >Close</md-button
      >
      <md-button form="myForm" class="md-primary" type="submit">Save</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
        role: "",
        password: "",
      },
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "Admin",
    },
  },
  methods: {
    onOpen() {
      this.form.name = "";
      this.form.email = "";
      this.form.password = "";
      this.form.role = this.role;
    },
    onSubmit(e) {
      const request = {
        name: this.form.name,
        role: this.form.role,
        email: this.form.email,
        password: this.form.password,
      };
      this.$emit("form-submit", request);

      this.$emit("form-close");
    },
  },
};
</script>

<style scoped>
</style>
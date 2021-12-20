<template>
  <md-dialog
    :md-active.sync="show"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    @md-opened="onOpen"
  >
    <md-dialog-title>{{
      true ? "Add New Room/Lab" : "Edit " + "name"
    }}</md-dialog-title>

    <md-dialog-content>
      <form id="roomForm" @submit.prevent="onSubmit">
        <md-field :class="getValidationClass('name')">
          <label for="name">Name</label>
          <md-input id="name" name="name" v-model="form.name" />
          <span class="md-error" v-if="!$v.form.name.required">
            Name is required
          </span>
        </md-field>
        <md-field>
          <label for="type">Type</label>
          <md-select v-model="form.room_type" name="type">
            <md-option value="Room">Room</md-option>
            <md-option value="Lab">Lab</md-option>
          </md-select>
        </md-field>
      </form>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-accent" @click="$emit('form-close')"
        >Close</md-button
      >
      <md-button form="roomForm" class="md-primary" type="submit"
        >Save</md-button
      >
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  data() {
    return {
      form: {
        name: "",
        room_type: "Room",
      },
    };
  },
  validations: {
    form: {
      name: {
        required,
      },
    },
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty,
        };
      }
    },
    onSubmit(e) {
      this.$v.$touch();

      if (this.$v.$invalid) return;

      const request = {
        name: this.form.name,
        room_type: this.form.room_type,
      };
      this.$emit("form-submit", request);
      this.$emit("form-close");
    },
    onOpen() {
      this.form.name = "";
      this.form.room_type = "Room";
    },
  },
};
</script>

<style scoped>
</style>
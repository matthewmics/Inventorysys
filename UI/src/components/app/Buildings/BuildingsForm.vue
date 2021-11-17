<template>
  <md-dialog
    :md-active.sync="show"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    @md-opened="onOpen"
  >
    <md-dialog-title>{{
      !building ? "Add New Building" : "Edit " + building.name
    }}</md-dialog-title>
    <md-dialog-content>
      <form
        id="buildingsForm"
        novalidate
        class="md-layout"
        @submit.prevent="validateUser"
      >
        <md-field :class="getValidationClass('name')">
          <label for="name">Name</label>
          <md-input
            id="name"
            name="name"
            v-model="form.name"
            :disabled="sending"
          />
          <span class="md-error" v-if="!$v.form.name.required"
            >Name is required</span
          >
        </md-field>
      </form>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-accent" @click="$emit('form-close')"
        >Close</md-button
      >
      <md-button form="buildingsForm" class="md-primary" type="submit"
        >Save</md-button
      >
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
export default {
  name: "BuildingsForm",
  mixins: [validationMixin],
  data() {
    return {
      form: {
        name: "",
      },
      sending: false,
    };
  },
  validations: {
    form: {
      name: {
        required,
      },
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
    onOpen() {
      this.$v.$reset();
      this.form.name = "";

      if (this.building) {
        this.form.name = this.building.name;
      }
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        var request = {
          name: this.form.name,
        };

        if (this.building) {
          request = { ...request, id: this.building.id };
        }

        this.$emit("on-form-submit", request);
        this.$emit("form-close");
      }
    },
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    building: {
      type: Object,
      default() {
        return null;
      },
    },
  },
};
</script>

<style scoped>
</style>
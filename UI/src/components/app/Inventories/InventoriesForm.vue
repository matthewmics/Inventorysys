<template>
  <md-dialog
    :md-active.sync="show"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    @md-opened="onOpen"
  >
    <md-dialog-title>{{
      true ? "Add New Item" : "Edit " + "name"
    }}</md-dialog-title>

    <md-dialog-content>
      <form id="inventoryForm" @submit.prevent="onSubmit">
        <md-field :class="getValidationClass('name')">
          <label for="name">Name</label>
          <md-input id="name" name="name" v-model="form.name" />
          <span class="md-error" v-if="!$v.form.name.required">
            Name is required
          </span>
        </md-field>
        <md-field>
          <label for="item_type">Type</label>
          <md-select v-model="form.item_type" name="item_type" id="item_type">
            <md-option value="PC">PC</md-option>
            <md-option value="Fixture">Fixture</md-option>
          </md-select>
        </md-field>
        <md-field :class="getValidationClass('serial_number')">
          <label>Serial Number</label>
          <md-input v-model="form.serial_number"></md-input>
          <span class="md-error" v-if="!$v.form.serial_number.required">
            Serial Number is required
          </span>
        </md-field>
      </form>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-accent" @click="$emit('form-close')"
        >Close</md-button
      >
      <md-button form="inventoryForm" class="md-primary" type="submit"
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

  validations: {
    form: {
      name: {
        required,
      },
      serial_number: {
        required,
      },
    },
  },
  data() {
    return {
      form: {
        name: "",
        item_type: "",
        serial_number: "",
      },
    };
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
    onOpen() {
      this.form.name = "";
      this.form.item_type = "PC";
      this.form.status = "";
    },
    onSubmit(e) {
      this.$v.$touch();

      if (this.$v.$invalid) return;

      const request = {
        name: this.form.name,
        item_type: this.form.item_type,
        serial_number: this.form.serial_number,
        status: "Stock",
      };
      this.$emit("form-submit", request);

      this.$emit("form-close");
    },
  },
};
</script>

<style scoped>
</style>
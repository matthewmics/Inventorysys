<template>
  <md-dialog
    :md-active.sync="show"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    @md-opened="onOpen"
  >
    <md-dialog-title> Request Transfer </md-dialog-title>

    <md-dialog-content v-if="loading">
      <div class="center-parent">
        <md-progress-spinner
          :md-diameter="30"
          md-mode="indeterminate"
        ></md-progress-spinner>
      </div>
    </md-dialog-content>
    <md-dialog-content v-if="!loading && item">
      <form
        id="myForm"
        novalidate
        class="md-layout"
        @submit.prevent="validateUser"
      >
        <md-field>
          <label for="itemName">Item</label>
          <md-input :value="item.name" disabled />
        </md-field>
        <md-field>
          <label for="Serial Number">Serial Number</label>
          <md-input :value="item.serial_number" disabled />
        </md-field>
        <md-field :class="getValidationClass('room_id')">
          <label for="room">Transfer To</label>
          <md-select v-model="form.room_id" name="room" id="room">
            <md-option v-for="room in rooms" :key="room.id" :value="room.id">{{
              room.name
            }}</md-option>
          </md-select>
          <span class="md-error" v-if="!$v.form.room_id.required">
            Room is required
          </span>
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
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import agent from "../../../agent";
export default {
  mixins: [validationMixin],
  data() {
    return {
      form: {
        room_id: "",
      },
      sending: false,
      loading: false,
      rooms: [],
    };
  },
  validations: {
    form: {
      room_id: {
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
    async onOpen() {
      this.$v.$reset();
      this.form.room_id = null;

      this.loading = true;
      try {
        const response = await agent.Custodian.listRooms(this.item.room_id);
        this.rooms = response;
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        var request = {
          room_id: this.form.room_id,
          inventory_id: this.item.id,
          item_type: this.item.item_type,
        };

        this.$emit("form-submit", request);
        this.$emit("form-close");
      }
    },
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    item: {
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
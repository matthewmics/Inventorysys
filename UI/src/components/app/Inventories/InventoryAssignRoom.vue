<template>
  <md-dialog
    :md-active.sync="show"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    @md-opened="onOpen"
  >
    <md-dialog-title>
      {{ inventoryItem ? inventoryItem.name : "" }}
    </md-dialog-title>
    <md-dialog-content v-if="loading">
      <div class="center-parent">
        <md-progress-spinner
          :md-diameter="30"
          md-mode="indeterminate"
        ></md-progress-spinner>
      </div>
    </md-dialog-content>
    <md-dialog-content v-if="!loading">
      <form
        id="myForm"
        novalidate
        class="md-layout"
        @submit.prevent="validateUser"
      >
        <!-- <md-field :class="getValidationClass('name')">
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
        </md-field> -->
        <md-field :class="getValidationClass('room_id')">
          <label for="room">Room</label>
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
    <md-dialog-actions v-if="!loading">
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
        name: "",
        room_id: null,
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
        const response = await agent.Room.listAll();
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
    inventoryItem: {
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
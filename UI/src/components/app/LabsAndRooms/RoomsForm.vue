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
        <md-field>
          <label for="name">Name</label>
          <md-input id="name" name="name" v-model="form.name" />
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
export default {
  data() {
    return {
      form: {
        name: "",
        room_type: "Room",
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
    onSubmit(e) {
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
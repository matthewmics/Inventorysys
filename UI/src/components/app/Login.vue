<template>
  <div style="width: 300px; margin: 0 auto; padding-top: 5em">
    <h3>LOGIN</h3>
    <md-field>
      <label>Username</label>
      <md-input v-model="initial"></md-input>
    </md-field>
    <md-field>
      <label>Password</label>
      <md-input v-model="initial" type="password"></md-input>
    </md-field>

    <md-button class="md-primary">Login</md-button>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
</style>
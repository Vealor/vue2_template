<template>
  <v-app id="app">
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'App',

  components: {
  },
  data: () => ({
  }),
})
</script>

<style lang="scss">
:root {
  --navbar-background: #2938c2;
  --navbar-background-hover: #0fb163;
}
</style>

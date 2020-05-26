<template>
  <v-container fluid fill-height class="login-page">
    <v-row v-if="isAPILive === true && isAPILive !== null" justify="center">
      <v-col>

        <v-row>
          <v-col class="login-header">
            <span class="login-title">Vue.js JWT Auth Template</span>
            <h2>Login</h2>
            <p class="versions">APP v{{ appVersion }} <strong>|</strong> API v{{ apiVersion }}</p>
          </v-col>
        </v-row>

        <v-row class="login-container" no-gutters align="center" justify="center">
          <v-col cols="4">
            <v-text-field
              class="log-in-input"
              name="username"
              id="username"
              v-model="username"
              placeholder="username"
              required
              @keydown.enter.prevent="login"/>
          </v-col>
        </v-row>

        <v-row class="login-container" no-gutters align="center" justify="center">
          <v-col cols="4">
            <v-text-field
              class="log-in-input"
              type="password"
              name="password"
              id="password"
              v-model="password"
              placeholder="password"
              required
              @keydown.enter.prevent="login"/>
          </v-col>
        </v-row>

        <v-row class="login-container" no-gutters align="center" justify="center">
          <v-col cols="4">
            <v-btn class="success block bordered login-button" @click.prevent="login">
              Login
            </v-btn>
          </v-col>
        </v-row>

        <v-row class="login-container" no-gutters align="center" justify="center">
          <v-col cols="4">
            <br><br>
            <ForgotPasswordDialog class="forgot-password"/>
          </v-col>
        </v-row>

        <v-row class="login-alerts">
          <v-col>
            <v-alert dense tile :icon="false" type="warning" transition="v-expand-x-transition" :value="missingFields" class="login-alert">
              Please make sure you fill in both fields
            </v-alert>
            <v-alert dense tile :icon="false" type="error" transition="v-expand-x-transition" :value="incorrectFields" class="login-alert">
              Your username and/or password is incorrect
            </v-alert>
          </v-col>
        </v-row>

      </v-col>
    </v-row>

    <v-row v-else-if="isAPILive === false && isAPILive !== null" no-gutters align="center" justify="center">
      <v-col cols="4">
        <h1 style="text-align:center">Server Error</h1>
        <br>
        <p style="text-align:center">
        API Server is currently down.
        </p>
        <br>
        <p class="versions">APP v{{ appVersion }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ForgotPasswordDialog from '../components/Dialogs/ForgotPasswordDialog.vue'

export default {
  name: 'login',
  components: {
    ForgotPasswordDialog,
  },
  data() {
    return {
      username: '',
      password: '',
      appVersion: '',
      apiVersion: '',
      isAPILive: null,
      missingFields: false,
      incorrectFields: false,
      specialName: false,
      shift: false,
      control: false,
    }
  },
  async created() {
    if (this.$store.getters.isLoggedIn) {
      this.$router.push('home')
    }
    await this.axios.get('/')
      .then((response) => {
        this.appVersion = `${process.env.VUE_APP_VERSION}`
        this.apiVersion = `${response.data.VERSION}`
        this.isAPILive = true
      })
      .catch(() => {
        this.appVersion = `${process.env.VUE_APP_VERSION}`
        this.apiVersion = ' UNDEFINED'
        this.isAPILive = false
      })
  },
  mounted() {
    window.addEventListener('keyup', (e) => {
      if (e.key === 'F' && e.shiftKey && e.ctrlKey) {
        this.specialName = !this.specialName
      }
    })
  },
  methods: {
    async login() {
      this.incorrectFields = false
      this.missingFields = false
      if (this.username !== '' && this.password !== '') {
        await this.$store.dispatch('jwtGenerate', {
          username: this.username,
          password: this.password,
        })
          .then(() => {
            this.$router.push('/')
          })
          .catch(() => {
            this.incorrectFields = true
          })
      } else {
        this.missingFields = true
      }
    },
  },
}
</script>

<style lang="scss" scoped>

.login-header {
  text-align: center;
}
.login-title {
  margin-top: calc((100vh - 450px)/2);
  margin-bottom: 50px;
  font-size: 50px;
  font-weight: bold;
}
.versions {
  text-align: center;
  margin: 0;
  margin-top: 5px;
}

.login-container {
   text-align: center;
}
.log-in-input {
  display: inline-block;
  width: 350px;
}
.log-in-label {
  display: inline-block;
  margin-right: 15px;
}

.forgot-password {
  display: block;
  padding-top: 3px;
}

.login-alerts {
  min-height: 120px;
}
.login-alert {
  text-align: center;
  margin-top: 10px;
}
</style>

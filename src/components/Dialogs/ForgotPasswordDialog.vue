<template>
  <v-row justify="center">
    <v-dialog :blur="close" v-model="dialog" max-width="600px" transition="fade-transition">
      <template v-slot:activator="{ on }">
        <a class="activator" v-on="on">Forgot your password?</a>
      </template>
      <v-card>
        <v-card-title class="justify-center">
          <span class="headline">Password Recovery</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="username*"
                  required
                  name="username"
                  id="username"
                  v-model="username"
                  />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="email*"
                  required
                  name="email"
                  id="email"
                  v-model="email"
                  />
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn align="center" color="blue darken-1 bordered" @click.prevent="recover">Send Recovery E-mail</v-btn>
        </v-card-actions>
        <v-col class="forgot-password-alert">
          <v-alert dense tile
            :icon="false"
            :type="alertType"
            transition="v-expand-x-transition"
            :value="error"
            class="recover-alert">
            {{ alertMessage }}
          </v-alert>
          <v-alert dense tile
            :icon="false"
            type="success"
            transition="v-expand-x-transition"
            :value="success"
            class="recover-alert">
            {{ successMessage }}
            <br>
          </v-alert>
        </v-col>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      username: '',
      email: '',
      error: false,
      success: false,
      successMessage: '',
      alertType: 'success',
      alertMessage: '',
    }
  },
  watch: {
    dialog(value) {
      if (!value) {
        this.close()
      }
    },
  },
  methods: {
    async recover() {
      this.error = false
      this.success = false
      if (this.username !== '' && this.email !== '') {
        const payload = {
          username: this.username,
          email: this.email,
        }
        this.axios.post('/auth/reset', payload)
          .then((response) => {
            if (response.data.status === 'error') {
              this.alertType = 'error'
              this.alertMessage = response.data.message
              this.error = true
            } else {
              this.successMessage = response.data.message
              this.success = true
            }
            this.close()
          })
          .catch((response) => {
            this.alertType = 'error'
            if (!response.data) {
              this.alertMessage = 'Network Error.  Unable to process.'
            } else {
              this.alertMessage = response.data.message
            }
            this.error = true
          })
      } else {
        this.alertType = 'warning'
        this.alertMessage = 'Fill in both fields.'
        this.error = true
      }
    },
    close() {
      this.dialog = false
      this.username = ''
      this.email = ''
      this.success = false
      this.alert = false
      this.error = false
    },
  },
}
</script>

<style lang="scss" scoped>
.activator {
  color: #000000;
}
</style>

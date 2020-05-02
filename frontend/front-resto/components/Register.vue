<template>
  <v-container>
    <img src="/resLogo.png" class="center" width="100em"/>
    <v-card-title>
      Resto - UTN
    </v-card-title>
    <v-form submit="console.log('Submit')">
      <v-container>
        <v-text-field
          v-model="credentials.user"
          label="Usuario"
          placeholder="Username"
          outlined
          class="wider-field white-text"
        />
        <v-text-field
          v-model="credentials.password"
          label="Contrasenia"
          placeholder="Password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show1 ? 'text' : 'password'"
          class="wider-field white-text"
          outlined
          @click:append="show1 = !show1"
        />
      </v-container>
      <v-row>
        <v-col>
          <v-btn class="full-width white-text" color="primary">
            Iniciar sesion
          </v-btn>
        </v-col>
        <v-col>
          <v-btn class="full-width white-text" color="secondary">
            Registrarse
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
<style>
.theme--dark.v-label{
  color:white!important;
}
.center{
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.wider-field{
  width: 25em;
}
.full-width{
  width: 100%;
}
.white-text{
  color:white;
}
</style>
<script>
export default {
  data: () => ({
    credentials: {},
    show1: false,
    rules: {
      required: value => !!value || 'Required.',
      min: v => v.length >= 8 || 'Min 8 characters'
    }
  })
}
</script>

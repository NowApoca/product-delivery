<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <v-container>
        <Login />
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import Login from '~/components/Login.vue'
export default {
  components: {
    Login
  },
  layout: 'login'
}
</script>

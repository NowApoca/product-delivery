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
        <Register />
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import Register from '~/components/Resgister.vue'
export default {
  components: {
    Register
  },
  layout: 'login'
}
</script>

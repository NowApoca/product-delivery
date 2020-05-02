<template>
  <v-app dark :class="[backLight ? 'back-light' : 'back-dark']">
    <v-app-bar
      :clipped-left="true"
      :fixed="false"
      app
    >
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-switch
        v-model="$vuetify.theme.dark"
        hide-details
        inset
        label="Cambiar tema"
      />
    </v-app-bar>
    <v-content>
      <v-container class="login">
        <nuxt :class="['card-page ' + (backLight ? 'nuxt-light-component' : 'nuxt-dark-component')]" />
      </v-container>
    </v-content>
  </v-app>
</template>
<style scoped>
.back-light{
  background: url("/backLight.jpg");
}
.back-dark{
  background: url("/backDark.png");
}
.nuxt-light-component{
  background: rgba(245,245,245,0.8);;
}
.nuxt-dark-component{
  background: rgba(174,174,174,0.90);
}
.login{
  max-width: 35em;
}
.card-page{
  box-shadow: 0px 0px 10px 2px rgba(0,0,0,0.75);
  border-radius: 0.2em;
}
</style>
<script>
export default {
  data () {
    return {
      title: 'Resto - UTN',
      initialDark: this.$vuetify
        ? this.$vuetify.theme.dark
        : false
    }
  },
  computed: {
    backLight () {
      return !(this.$vuetify && this.$vuetify.theme.dark)
    }
  }
}
</script>

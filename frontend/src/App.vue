<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {radixUniverse, RadixUniverse, RadixIdentityManager, RadixRemoteIdentity} from 'radixdlt'
import { mapState } from 'vuex';

export default Vue.extend({
  name: 'movie-list',
  computed: mapState(['identity']),
  created() {
    radixUniverse.bootstrap(RadixUniverse.LOCALHOST_SINGLENODE)

    RadixRemoteIdentity.createNew('Radflix', 'Watch movies, the Radix way').then((identity) => {
      identity.account.openNodeConnection()
      this.$store.commit('setIdentity', identity)
    })
  },
});
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

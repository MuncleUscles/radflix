import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    identity: null,
  },
  mutations: {
    setIdentity(state, newIdentity) {
      state.identity = newIdentity
    },
  },
  actions: {

  },
});

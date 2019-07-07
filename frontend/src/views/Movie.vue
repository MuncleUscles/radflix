<template>
  <div v-if="!loaded">
    Loading...
  </div>
  <div v-else-if="error">
    {{error}}
  </div>
  <div v-else class="home">
    <h1>{{movie.name}}</h1>
    <video :src="movie.contentUrl" controls autoplay loop></video>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { RadixTransactionBuilder, RadixSerializer } from 'radixdlt';

export default Vue.extend({
  data() {
    return {
      loaded: false,
      error: '',
      movie: null,
    }
  },
  name: 'movie',
  computed: mapState(['identity']),
  created() {
  },
  watch: {
    identity(newValue, oldValue) {
      this.loadMovie()
    }
  },
  mounted() {
    this.loadMovie()
  },
  methods: {
    loadMovie() {
      if (this.identity) {
        this.$http.get('http://localhost:3001/request-access').then((response) => {
          const challenge = response.body

          // Construct and sign the atom
          const data = {challenge}

          const atom = RadixTransactionBuilder.createPayloadAtom(
            this.identity.account, 
            [this.identity.account], 
            'radflix', 
            JSON.stringify(data), 
            false).buildAtom()
          this.identity.signAtom(atom).then((signedAtom) => {
            this.$http.post('http://localhost:3001/movie', {
              movieTokenUri: this.$route.params.id,
              atom: atom.toJSON(),
            }).then((response) => {
              this.loaded = true
              this.movie = response.body
            }, (error) => {
              console.log(error)
              this.loaded = true
              this.error = error.body
            })
          })
        })
      }
    }
  }
});
</script>

<template>
  <div v-if="!loaded">
    Loading...
  </div>
  <div v-else-if="error">
    {{error}}
  </div>
  <div v-else class="home">
    <h1>{{movie.name}}</h1>

    <video v-if="movie.contentUrl.includes('.mp4')" 
      :src="movie.contentUrl" controls autoplay loop>
    </video>
    <div v-else class="videoWrapper">
      <iframe 
        width="560" 
        height="315" 
        :src="movie.contentUrl + '?&autoplay=1'" 
        frameborder="0" 
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>

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

<style>
.videoWrapper {
	position: relative;
	padding-bottom: 56.25%; /* 16:9 */
	padding-top: 25px;
	height: 0;
}
.videoWrapper iframe {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
</style>

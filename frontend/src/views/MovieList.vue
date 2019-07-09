<template>
  <div class="home">
    <h1 class="title">Welcome to Radflix</h1>
<center>    
  <table class="table is-responsive">
    <thead>
      <tr>
        <th width="200"></th>
        <th width="300">Title</th>
        <th>Description</th>
        <th width="50"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="movie in movies" :key="movie.tokenUri">
        <td><img :src="movie.posterUrl"></td>
        <td>{{movie.name}}</td>
        <td>{{movie.description}}</td>
        <td v-if="movie.tokenUri in myMovies">
          <router-link :to="{name: 'Movie', params: {id: movie.tokenUri}}">
            <button class="button"> Watch</button>
          </router-link>
        </td>
        <td v-else>
          <button @click="buy(movie.tokenUri)" class="button">Buy</button>
          <div class="is-size-7"><router-link :to="{name: 'Movie', params: {id: movie.tokenUri}}">Try watching</router-link></div>
        </td>
      </tr>
    </tbody>
  </table>
</center>      
  </div>  
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import Decimal from 'decimal.js';

export default Vue.extend({
  data() {
    return {
      movies: [],
      myMovies: {} as {[tokenUri: string]: string},

      tokenSubscription: null,
    }
  },
  name: 'movie-list',
  computed: mapState(['identity']),
  created() {
    this.updateSubscription()
  },
  watch: {
    identity(newValue, oldValue) {
      this.updateSubscription()
    }
  },
  mounted() {
    this.loadAllMovies()
  },
  methods: {
    loadAllMovies() {
      this.$http.get('http://localhost:3001/movies').then((response) => {
        this.movies = response.body
      })
    },
    updateSubscription() {
      if(this.tokenSubscription) {
        this.tokenSubscription.unsubscribe()
      }

      if(this.identity) {
        this.tokenSubscription = this.identity.account.transferSystem
        .getTokenUnitsBalanceUpdates().subscribe((balance: {[tokenUri: string]: Decimal}) => {
          this.myMovies = {}
          for (const tokenUri in balance) {
            if (balance[tokenUri].greaterThan(0)) {
              this.myMovies[tokenUri] = tokenUri
            }
          }
        })
      }
      
    },
    buy(tokenUri: string) {
      this.$http.post('http://localhost:3001/admin/buy-movie',{
        tokenUri,
        address: this.identity.address.toString(),
      }).then((response) => {
        console.log(response)
      })
    }
  }
});
</script>

<template>
  <div class="home">
    <h1>Welcome to Radflix</h1>
    <img alt="Vue logo" src="https://media.giphy.com/media/rYUqpVdSirXMI/giphy.gif" width="350">
<center>    
  <table class="table is-responsive">
    <thead>
      <tr>
        <th></th>
        <th>Title</th>
        <th>Year</th>
        <th>Rating</th>
        <th width="400">Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><router-link to="/movie/1"><img src="https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_UY209_CR0,0,140,209_AL_.jpg"></router-link></td>
        <td><router-link to="/movie/1">Avengers: Infinity War</router-link></td>
        <td>2018</td>
        <td>⭐⭐⭐⭐️</td>
        <td>The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation and ruin puts an end to the universe.</td>
      </tr>
      <tr>
        <td><router-link to="/movie/1"><img src="https://m.media-amazon.com/images/M/MV5BOTM2NTI3NTc3Nl5BMl5BanBnXkFtZTgwNzM1OTQyNTM@._V1_UY209_CR0,0,140,209_AL_.jpg"></router-link></td>
        <td><router-link to="/movie/1">Solo: A Star Wars Story</router-link></td>
        <td>2018</td>
        <td>⭐⭐⭐️</td>
        <td>During an adventure into the criminal underworld, Han Solo meets his future co-pilot Chewbacca and encounters Lando Calrissian years before joining the Rebellion.</td>
      </tr>
      <tr>
        <td><router-link to="/movie/1"><img src="https://m.media-amazon.com/images/M/MV5BNzIxMjYwNDEwN15BMl5BanBnXkFtZTgwMzk5MDI3NTM@._V1_UY209_CR0,0,140,209_AL_.jpg"></router-link></td>
        <td><router-link to="/movie/1">Jurassic World: Fallen Kingdom</router-link></td>
        <td>2018</td>
        <td>⭐⭐⭐️</td>
        <td>When the island's dormant volcano begins roaring to life, Owen and Claire mount a campaign to rescue the remaining dinosaurs from this extinction-level event.</td>
      </tr>
      <tr>
        <td><router-link to="/movie/1"><img src="https://m.media-amazon.com/images/M/MV5BOTY4NDcyZGQtYmVlNy00ODgwLTljYTMtYzQ2OTE3NDhjODMwXkEyXkFqcGdeQXVyNzYzODM3Mzg@._V1_UY209_CR0,0,140,209_AL_.jpg"></router-link></td>
        <td><router-link to="/movie/1">Tomb Raider</router-link></td>
        <td>2018</td>
        <td>⭐⭐⭐️⭐</td>
        <td>Lara Croft, the fiercely independent daughter of a missing adventurer, must push herself beyond her limits when she discovers the island where her father disappeared.</td>
      </tr>
      <tr>
        <td><router-link to="/movie/1"><img src="https://m.media-amazon.com/images/M/MV5BNjk1Njk3YjctMmMyYS00Y2I4LThhMzktN2U0MTMyZTFlYWQ5XkEyXkFqcGdeQXVyODM2ODEzMDA@._V1_UY209_CR34,0,140,209_AL_.jpg"></router-link></td>
        <td><router-link to="/movie/1">Deadpool 2</router-link></td>
        <td>2018</td>
        <td>⭐⭐⭐⭐⭐️</td>
        <td>Foul-mouthed mutant mercenary Wade Wilson (AKA. Deadpool), brings together a team of fellow mutant rogues to protect a young boy with supernatural abilities from the brutal, time-traveling cyborg, Cable.</td>
      </tr>
    </tbody>
  </table>
</center>      
  </div>  
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'movie-list',
  components: {
  },
});
</script>

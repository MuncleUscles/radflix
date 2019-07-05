import Vue from 'vue';
import Router from 'vue-router';
import MovieList from './views/MovieList.vue';
import Movie from './views/Movie.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Movie List',
      component: MovieList,
    },
    {
      path: '/movie/:id',
      name: 'Movie',
      component: Movie,
    },
  ],
});

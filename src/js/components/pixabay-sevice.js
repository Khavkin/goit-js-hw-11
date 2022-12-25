import axios from 'axios';
const API_KEY = '32167466-eca24bf310fd62d926b174c37';
const BASE_URL = 'https://pixabay.com/api/';

const pixabayParams = {
  key: API_KEY,
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: 40,
  page: 1,
};

export default class PixabayService {
  constructor({ searchQuery = '', currentPage = 1, resultsPerPage = 10 }) {
    this.searchQuery = searchQuery;
    this.currentPage = currentPage;
    this.resultsPerPage = resultsPerPage;
    this.totalHits = 0;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
    pixabayParams.q = newQuery;
  }

  async fetch() {
    // this.currentPage = 1;
    // pixabayParams.page = 1;
    console.log(pixabayParams);
    const config = {
      params: pixabayParams,
    };
    const responce = await axios.get(BASE_URL, config);
    this.totalHits = parseInt(responce.data.totalHits);
    return responce;
  }

  async fetchNext() {
    //console.log('currentPage=', this.currentPage);
    pixabayParams.page = this.currentPage + 1;
    //console.log(pixabayParams);
    const responce = await this.fetch();
    this.totalHits = parseInt(responce.data.totalHits);
    //console.dir(responce);

    if (responce.status === 200) {
      this.currentPage += 1;
    }
    return responce;
  }

  resetPage() {
    this.currentPage = 1;
    pixabayParams.page = 1;
  }
}

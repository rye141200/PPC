/*eslint-disable*/
import { APIRequest } from '../utils/APIRequest.mjs';

const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');

searchBtn.addEventListener('click', async () => {
  const queryString = searchInput.value.trim();
  window.location.href = `/search?name=${queryString}&page=1`;
});

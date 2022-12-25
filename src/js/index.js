//TODO
//1. Сделать сохранение истории поиска и параметровж
//2. Сделать бесконечный скролл
//3. Сделать спиннер
//4. Сделать номралное управление кнопкой loadmore
//5. Сделать форму настроек в модалке
//6. Сделать кнопку вверх .

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import PixabayService from './components/pixabay-sevice';
import galleryCardTpl from '../templates/gallery-card.hbs';

const refs = {
  gallery: document.querySelector('.gallery'),
  searchForm: document.getElementById('search-form'),
  btnLoadMore: document.querySelector('.load-more'),
};

const pixabayService = new PixabayService({});
const simpleLightBox = new SimpleLightbox('.gallery .photo-card');

refs.searchForm.addEventListener('submit', handlerSubmit);
refs.btnLoadMore.addEventListener('click', handlerLoadMore);

window.addEventListener('wheel', debounce(smoothScroll, 100), {
  passive: false,
});
window.addEventListener('keydown', smoothScroll, {
  passive: false,
});

function handlerSubmit(event) {
  event.preventDefault();

  console.dir(event.target.elements.searchQuery);
  searchPicture(event.target.elements.searchQuery.value);
}

function handlerLoadMore(event) {
  event.preventDefault();

  pixabayService
    .fetchNext()
    .then(responce => {
      showResult(responce.data.hits);
      checkBtnLoadMoreStatus();
    })
    .catch(error => {
      console.log(error);
    });
}

function searchPicture(searchQuery) {
  pixabayService.query = searchQuery;
  pixabayService.resetPage();

  const markup = pixabayService
    .fetch()
    .then(responce => {
      console.dir(responce.data);
      refs.gallery.innerHTML = '';
      showResult(responce.data.hits);
      checkBtnLoadMoreStatus();

      console.dir(refs.gallery);
      return markup;
    })
    .catch(error => {
      console.log(error);
    });
}

function prepareGalleryMarkup(data) {
  return data
    .map(
      ({
        webformatURL,
        tags,
        largeImageURL,
        likes,
        views,
        comments,
        downloads,
      }) => {
        const tmp = galleryCardTpl({
          webformatURL,
          tags,
          largeImageURL,
          likes,
          views,
          comments,
          downloads,
        });
        //console.log(tmp);
        return tmp; //galleryCardTpl({ webformatURL, tags });
      }
    )
    .join('');
}

function showResult(data) {
  const markup = prepareGalleryMarkup(data);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  simpleLightBox.refresh();
}

function checkBtnLoadMoreStatus() {
  console.log(pixabayService.totalHits, refs.gallery.children.length);
  if (pixabayService.totalHits > refs.gallery.children.length)
    refs.btnLoadMore.disabled = false;
  else refs.btnLoadMore.disabled = true;
}

function smoothScroll(event) {
  if (refs.gallery.children.length === 0) return;

  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();
  let direction = 1;
  console.dir(event);

  switch (event.type) {
    case 'keydown':
      switch (event.key) {
        case 'ArrowDown':
        case 'PageDown':
          console.log(event.key);
          direction = 1;
          break;
        case 'ArrowUp':
        case 'PageUp':
          console.log(event.key);
          direction = -1;
          break;
        case 'Home':
          console.log(event.key);
          direction = -1000;
          break;
        case 'End':
          console.log(event.key);
          direction = 1000;
          break;

        default:
          return;
      }
      break;
    case 'wheel':
      direction = event.deltaY > 0 ? 1 : -1;
      break;
  }

  event.preventDefault();
  window.scrollBy({
    top: cardHeight * 2 * direction,
    behavior: 'smooth',
  });
}

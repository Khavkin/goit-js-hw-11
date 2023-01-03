//TODO
//1. Сделать сохранение истории поиска и параметров
//2. Сделать бесконечный скролл
//3. Сделать спиннер +
//4. Сделать нормальное управление кнопкой loadmore
//5. Сделать форму настроек в модалке
//6. Сделать кнопку вверх .

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import PixabayService from './components/pixabay-sevice';
import galleryCardTpl from '../templates/gallery-card.hbs';
import Spinner from './components/spinner/spinner';

const refs = {
  gallery: document.querySelector('.gallery'),
  searchForm: document.getElementById('search-form'),
  btnLoadMore: document.querySelector('.load-more'),
};

const params = {
  infinityScroll: false,
};

const status = {
  isLoading: false,
  shouldLoad() {
    return pixabayService.totalHits > refs.gallery.children.length
      ? true
      : false;
  },
};

const pixabayService = new PixabayService({ resultsPerPage: 20 });
const simpleLightBox = new SimpleLightbox('.gallery .photo-card');

const spinner = new Spinner();

refs.searchForm.addEventListener('submit', handlerSubmit);
refs.btnLoadMore.addEventListener('click', handlerLoadMore);

window.addEventListener('wheel', smoothScroll, {
  passive: false,
});

window.addEventListener('keydown', smoothScroll, {
  passive: false,
});

function handlerSubmit(event) {
  event.preventDefault();

  console.dir(event.target.elements.searchQuery);
  spinner.showSpinner();

  searchPicture(event.target.elements.searchQuery.value);
}

function handlerLoadMore(event) {
  event.preventDefault();
  loadMore();
}

function loadMore() {
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
  refs.gallery.innerHTML = '';
  window.scroll({
    top: 0,
    left: 0,
    // behavior: 'smooth',
  });

  // const markup =
  pixabayService
    .fetch()
    .then(responce => {
      console.dir(responce.data);
      // refs.gallery.innerHTML = '';

      if (pixabayService.totalHits === 0) {
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        //spinner.hideSpinner();
        return;
      }
      Notify.success(`Hooray! We found ${pixabayService.totalHits} images.`);
      showResult(responce.data.hits);
      checkBtnLoadMoreStatus();
      //spinner.hideSpinner();

      console.dir(refs.gallery);
      // return markup;
    })
    .catch(error => {
      Notify.failure(error.message);
      console.dir(error);
    })
    .finally(() => spinner.hideSpinner());
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

  //refs.btnLoadMore.disabled = status.shouldLoad();
  if (status.shouldLoad()) showBtnLoadMore();
  else hideBtnLoadMore();
}

function getCardHeight() {
  return refs.gallery.firstElementChild
    ? refs.gallery.firstElementChild.getBoundingClientRect().height
    : 0;
}

function smoothScroll(event) {
  if (refs.gallery.children.length === 0) return;

  const cardHeight = getCardHeight();
  console.log(cardHeight);

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
  console.log(
    window.scrollY,
    document.body.offsetHeight,
    window.innerHeight,
    cardHeight
  );

  console.log('scroll+', cardHeight * 2 * direction);

  window.scrollBy({
    top: cardHeight * 2 * direction,
    behavior: 'smooth',
  });

  console.log(
    window.scrollY,
    document.body.offsetHeight,
    window.innerHeight,
    cardHeight
  );

  if (
    document.body.offsetHeight -
      (window.scrollY + cardHeight * 2 * direction + window.innerHeight) <
      cardHeight * 1.5 &&
    params.infinityScroll &&
    status.shouldLoad()
  ) {
    console.log('loadMore');
    loadMore();
  }
}

function showBtnLoadMore() {
  console.log('show button');
  refs.btnLoadMore.classList.remove('is-hidden');
}

function hideBtnLoadMore() {
  console.log('hide button');
  refs.btnLoadMore.classList.add('is-hidden');
}

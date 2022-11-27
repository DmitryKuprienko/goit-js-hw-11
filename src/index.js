import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  inputField: document.querySelector('input'),
 
};

refs.form.addEventListener('submit', onFormSubmit);

let alreadyShown = 0;


function onFormSubmit(e) {
  e.preventDefault();
  alreadyShown = 0;
  refs.gallery.innerHTML = '';

  const name = refs.inputField.value.trim();

  if (name !== '') {
    loadFromAPI(name);
  } else {
       return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}


async function loadFromAPI(name, page) {
  const BASE_URL = 'https://pixabay.com/api/';

  const options = {
    params: {
      key: '31605839-858af090e8e0e31dbfed95a6b',
      q: name,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: page,
      per_page: 10,
    },
  };

  try {
    const response = await axios.get(BASE_URL, options);
    alreadyShown += response.data.hits.length;

    message(
      response.data.hits.length,
      alreadyShown,
      options.params.per_page,
      response.data.total
    );

    renderGallery(response.data);
  } catch (error) {
    console.error();
  }
}


function renderGallery(picture) {
  const markup = picture.hits
    .map(
      hit => `<a class="gallery__link" href="${hit.largeImageURL}">
        <div class="photo-card">
    <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${hit.likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${hit.views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${hit.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${hit.downloads}
      </p>
    </div>
  </div>
  </a>`
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  simpleLightBox.refresh();
}

window.addEventListener("scroll", ()=>{
  const {scrollHeight,scrollTop,clientHeight} = document.documentElement;
 if(scrollHeight-clientHeight ===scrollTop){
  loadFromAPI()
 }
})



const simpleLightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});


function message(length, alreadyShown, per_page, total) {
  if (!length) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  if (length >= alreadyShown) {
       Notify.info(`Hooray! We found ${total} images.`);
  }
  if (alreadyShown >= total) {
      Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

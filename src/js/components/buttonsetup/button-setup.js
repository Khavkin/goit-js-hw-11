import './button-setup.css';

export default class ButtonSetup {
  #button;
  #backDrop;
  #color;
  #form;
  #parentButton;

  constructor(parentButton = '', setupObject = {}) {
    //console.log(setupObject);
    this.setupObject = { ...setupObject };
    this.#parentButton = parentButton;

    this.onSubmit = null;

    this.create();
  }

  create() {
    this.createButton();
    this.createBackDrop();
    this.#form = document.querySelector('.bts-modal__form');
    this.#form.addEventListener('submit', this.handlerOnSubmit.bind(this));
    document
      .getElementById('cancel')
      .addEventListener('click', () => this.hideBackDrop.call(this));
  }

  createButton() {
    this.#button = document.createElement('button');
    const button = this.#button;
    button.innerHTML =
      '<svg class="bts-button-setup__img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="16" height="16" ><path d="M308.5 135.3c7.1-6.3 9.9-16.2 6.2-25c-2.3-5.3-4.8-10.5-7.6-15.5L304 89.4c-3-5-6.3-9.9-9.8-14.6c-5.7-7.6-15.7-10.1-24.7-7.1l-28.2 9.3c-10.7-8.8-23-16-36.2-20.9L199 27.1c-1.9-9.3-9.1-16.7-18.5-17.8C173.7 8.4 166.9 8 160 8s-13.7 .4-20.4 1.2c-9.4 1.1-16.6 8.6-18.5 17.8L115 56.1c-13.3 5-25.5 12.1-36.2 20.9L50.5 67.8c-9-3-19-.5-24.7 7.1c-3.5 4.7-6.8 9.6-9.9 14.6l-3 5.3c-2.8 5-5.3 10.2-7.6 15.6c-3.7 8.7-.9 18.6 6.2 25l22.2 19.8C32.6 161.9 32 168.9 32 176s.6 14.1 1.7 20.9L11.5 216.7c-7.1 6.3-9.9 16.2-6.2 25c2.3 5.3 4.8 10.5 7.6 15.6l3 5.2c3 5.1 6.3 9.9 9.9 14.6c5.7 7.6 15.7 10.1 24.7 7.1l28.2-9.3c10.7 8.8 23 16 36.2 20.9l6.1 29.1c1.9 9.3 9.1 16.7 18.5 17.8c6.7 .8 13.5 1.2 20.4 1.2s13.7-.4 20.4-1.2c9.4-1.1 16.6-8.6 18.5-17.8l6.1-29.1c13.3-5 25.5-12.1 36.2-20.9l28.2 9.3c9 3 19 .5 24.7-7.1c3.5-4.7 6.8-9.5 9.8-14.6l3.1-5.4c2.8-5 5.3-10.2 7.6-15.5c3.7-8.7 .9-18.6-6.2-25l-22.2-19.8c1.1-6.8 1.7-13.8 1.7-20.9s-.6-14.1-1.7-20.9l22.2-19.8zM208 176c0 26.5-21.5 48-48 48s-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48zM504.7 500.5c6.3 7.1 16.2 9.9 25 6.2c5.3-2.3 10.5-4.8 15.5-7.6l5.4-3.1c5-3 9.9-6.3 14.6-9.8c7.6-5.7 10.1-15.7 7.1-24.7l-9.3-28.2c8.8-10.7 16-23 20.9-36.2l29.1-6.1c9.3-1.9 16.7-9.1 17.8-18.5c.8-6.7 1.2-13.5 1.2-20.4s-.4-13.7-1.2-20.4c-1.1-9.4-8.6-16.6-17.8-18.5L583.9 307c-5-13.3-12.1-25.5-20.9-36.2l9.3-28.2c3-9 .5-19-7.1-24.7c-4.7-3.5-9.6-6.8-14.6-9.9l-5.3-3c-5-2.8-10.2-5.3-15.6-7.6c-8.7-3.7-18.6-.9-25 6.2l-19.8 22.2c-6.8-1.1-13.8-1.7-20.9-1.7s-14.1 .6-20.9 1.7l-19.8-22.2c-6.3-7.1-16.2-9.9-25-6.2c-5.3 2.3-10.5 4.8-15.6 7.6l-5.2 3c-5.1 3-9.9 6.3-14.6 9.9c-7.6 5.7-10.1 15.7-7.1 24.7l9.3 28.2c-8.8 10.7-16 23-20.9 36.2L315.1 313c-9.3 1.9-16.7 9.1-17.8 18.5c-.8 6.7-1.2 13.5-1.2 20.4s.4 13.7 1.2 20.4c1.1 9.4 8.6 16.6 17.8 18.5l29.1 6.1c5 13.3 12.1 25.5 20.9 36.2l-9.3 28.2c-3 9-.5 19 7.1 24.7c4.7 3.5 9.5 6.8 14.6 9.8l5.4 3.1c5 2.8 10.2 5.3 15.5 7.6c8.7 3.7 18.6 .9 25-6.2l19.8-22.2c6.8 1.1 13.8 1.7 20.9 1.7s14.1-.6 20.9-1.7l19.8 22.2zM464 400c-26.5 0-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48s-21.5 48-48 48z"/></svg>';
    button.type = 'button';
    button.classList.add('bts-button-setup');
    button.addEventListener('click', this.handlerOnClick.bind(this));

    const parentButton = document.querySelector(this.#parentButton);

    //console.dir(parentButton);
    // const clRect = parentButton.getBoundingClientRect();
    const compStyle = window.getComputedStyle(parentButton);

    //console.log(compStyle);

    // console.log(clRect);

    button.style.width = compStyle.width;
    button.style.height = compStyle.height;
    button.style.backgroundColor = compStyle.backgroundColor;
    button.style.color = compStyle.color;
    this.#color = compStyle.color;
    button.style.cursor = compStyle.cursor;
    button.style.marginLeft = compStyle.marginLeft;
    button.style.fontWeight = compStyle.fontWeight;
    button.style.border = compStyle.border;
    button.style.padding = compStyle.padding;
    button.style.borderRadius = compStyle.borderRadius;
    button.style.boxShadow = compStyle.boxShadow;
    button.style.display = 'flex';
    button.style.alingItems = 'center';
    button.style.justifyContent = 'center';

    button.setAttribute('title', 'Setup');
    button.firstChild.style.fill = 'currentColor';

    //console.log(button);
    //console.dir(button);
    button.addEventListener(
      'mouseover',
      this.handlerOnMouseOverorOut.bind(this)
    );
    button.addEventListener(
      'mouseout',
      this.handlerOnMouseOverorOut.bind(this)
    );
    parentButton.after(button);
  }

  createBackDrop() {
    this.#backDrop = document.createElement('div');
    const backDrop = this.#backDrop;
    backDrop.classList.add('bts-back-drop');
    backDrop.classList.add('bts-is-hidden');
    //console.log(this.setupObject);
    backDrop.insertAdjacentHTML(
      'beforeend',
      `<div class="bts-modal">
      <form class="bts-modal__form" action="">
        <label class="bts-modal__label" for="countOfImages">
          Количество картинок в запросе
          <input
            type="number"
            name="countOfImages"
            min="10"
            max="100"
            step="10"
            value="${this.setupObject.countOfImages}"
          />
        </label>
        <label class="bts-modal__label" for="infinityScroll" >
          <input type="checkbox" id="infinityScroll" name="infinityScroll" ${
            this.setupObject.infinityScroll ? 'checked' : ''
          } "
 />
          Бесконечный скролл
        </label>
        
        <div class="bts-modal__buttons-wrap">
          <button class="bts-modal__button" type="button" id="cancel">
            Отменить
          </button>
          <button class="bts-modal__button" type="submit" id="submit">
            Применить
          </button>
        </div>
      </form>
    </div>`
    );
    document.body.append(backDrop);
  }

  handlerOnClick() {
    this.#backDrop.classList.remove('bts-is-hidden');
    document.body.classList.add('bts-no-scroll');
  }

  hideBackDrop() {
    this.#backDrop.classList.add('bts-is-hidden');
    document.body.classList.remove('bts-no-scroll');
  }

  handlerOnSubmit(event) {
    event.preventDefault();

    const { countOfImages, infinityScroll } = event.currentTarget.elements;

    this.setupObject.countOfImages = parseInt(countOfImages.value);
    // this.setupObject.saveHistory = saveHistory.checked;
    this.setupObject.infinityScroll = infinityScroll.checked;

    this.hideBackDrop();
    // console.log('Setup onSubmit', this.setupObject);
    if (this.onSubmit) this.onSubmit({ ...this.setupObject });
  }

  handlerOnMouseOverorOut(event) {
    //console.dir(event);
    if (event.type === 'mouseover') {
      this.#button.style.color = '#ffc107';
    } else this.#button.style.color = this.#color;
  }
}

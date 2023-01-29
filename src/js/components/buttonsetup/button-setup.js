import './button-setup.css';

export default class ButtonSetup {
  #button;
  #backDrop;

  #form;
  #parentButton;
  // setupObject = {};

  constructor(parentButton = '', setupObject = {}) {
    console.log(setupObject);
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
    button.innerText = 'Setup';
    button.type = 'button';
    button.classList.add('bts-button-setup');
    button.addEventListener('click', this.handlerOnClick.bind(this));

    const parentButton = document.querySelector(this.#parentButton);
    console.dir(parentButton);
    // const clRect = parentButton.getBoundingClientRect();
    const compStyle = window.getComputedStyle(parentButton);
    console.log(compStyle);
    // console.log(clRect);

    button.style.width = compStyle.width;
    button.style.height = compStyle.height;
    button.style.backgroundColor = compStyle.backgroundColor;
    button.style.color = compStyle.color;
    button.style.cursor = compStyle.cursor;
    button.style.marginLeft = compStyle.marginLeft;
    button.style.fontWeight = compStyle.fontWeight;
    button.style.border = compStyle.border;
    button.style.padding = compStyle.padding;
    button.style.borderRadius = compStyle.borderRadius;
    button.style.boxShadow = compStyle.boxShadow;

    //console.log(button);
    console.dir(button);

    parentButton.after(button);
  }

  createBackDrop() {
    this.#backDrop = document.createElement('div');
    const backDrop = this.#backDrop;
    backDrop.classList.add('bts-back-drop');
    backDrop.classList.add('bts-is-hidden');
    console.log(this.setupObject);
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
        <label class="bts-modal__label" for="saveHistory">
          <input type="checkbox" name="saveHistory" id="saveHistory" ${
            this.setupObject.saveHistory ? 'checked' : ''
          }/>
          Сохранять историю поиска
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

    const { countOfImages, saveHistory, infinityScroll } =
      event.currentTarget.elements;

    this.setupObject.countOfImages = parseInt(countOfImages.value);
    this.setupObject.saveHistory = saveHistory.checked;
    this.setupObject.infinityScroll = infinityScroll.checked;

    this.hideBackDrop();
    console.log('Setup onSubmit', this.setupObject);
    if (this.onSubmit) this.onSubmit({ ...this.setupObject });
  }
}

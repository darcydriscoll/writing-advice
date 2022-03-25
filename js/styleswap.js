/*
  StyleSwap

  A class controlling the logic for swapping the style of the index page.
*/
class StyleSwap {
  constructor() {
    this.isStyleAlt = false;
    this.head = document.querySelector('head');
    let swapButton = document.querySelector('aside button');
    // when button is clicked, swap style
    swapButton.addEventListener('click', this.swapStyle);
  }

  /*
    swapStyle()

    Swap the stylesheets between the main stylesheets and the alternate
      stylesheets.
  */
  swapStyle() {
    if (this.styleAlt) {
        document.querySelector('#colours-css').setAttribute('href', 'css/colours.css');
        document.querySelector('#main-css').setAttribute('href', 'css/main.css');
        document.querySelector('#index-css').setAttribute('href', 'css/index.css');
    } else {
        document.querySelector('#colours-css').setAttribute('href', 'css/colours-alt.css');
        document.querySelector('#main-css').setAttribute('href', 'css/main-alt.css');
        document.querySelector('#index-css').setAttribute('href', 'css/index-alt.css');
    }
    this.styleAlt = !this.styleAlt;
  }
}

let styleSwap = new StyleSwap();

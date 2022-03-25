/*
  GalleryImage

  A class representing an image and its title + caption in an ImageGallery.
*/
class GalleryImage {
  constructor(src, alt, title, caption) {
    this.src = src;
    this.alt = alt;
    this.title = title;
    this.caption = caption;
  }
}

/*
  ImageGallery

  Controls the logic for an image gallery with a 'next' button and a 'previous'
    button.
*/
class ImageGallery {

  /*
    galleryImages: [GalleryImage]
  */
  constructor(galleryImages) {
    this.images = galleryImages;
    // find relevant gallery elements
    this.imageEl = document.getElementById('gallery-image');
    let gallery = document.getElementById('gallery');
    this.titleEl = gallery.getElementsByTagName('h2')[0];
    this.captionEl = gallery.getElementsByTagName('p')[0];
    // indices
    this.index = 0;
    this.maxIndex = this.images.length-1;
    // set listeners
    document.getElementById('gallery-next').addEventListener('click', () => {
      this.switchImage(true);
    });
    document.getElementById('gallery-previous').addEventListener('click', () => {
      this.switchImage(false);
    });
    // update gallery for the first time
    this.updateGallery();
  }

  /*
    updateGallery()

    Updates the image, title, and caption elements in the gallery to the details
      specified by the current index.
  */
  updateGallery() {
    this.imageEl.setAttribute('src', this.images[this.index].src);
    this.imageEl.setAttribute('alt', this.images[this.index].alt);
    this.titleEl.innerHTML = this.images[this.index].title;
    this.captionEl.innerHTML = this.images[this.index].caption;
  }

  /*
    switchImage()
    next: Boolean

    Based on direction of switch, changes the src attribute on imageEl +
      title and caption.
  */
  switchImage(next) {
    // image next in array?
    if (next) {
      this.index += 1;
      if (this.index > this.maxIndex) {
        this.index = 0;
      }
    // image previous in array?
    } else {
      this.index -= 1;
      if (this.index < 0) {
        this.index = this.maxIndex;
      }
    }
    // update new image display
    this.updateGallery();
  }
}

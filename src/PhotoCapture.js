import Quagga from 'quagga';
import baseQuaggaConfig from './baseQuaggaConfig';

class PhotoCapture {
  constructor() {
    this.inputField;
    this.processingCallback = null;
    this.doneCallback = null;
  }

  init(opts) {
    if (!opts.input || opts.input.nodeName !== 'INPUT') {
      throw new Error('Bad Input element passed to PhotoCapture.init()');
    }
    this.inputField = opts.input;
    this.outputDiv = opts.outputDiv;
    if (typeof opts.doneCallback === 'function') {
      this.doneCallback = opts.doneCallback;
    }
    this.processingCallback = typeof opts.processingCallback === 'function' ? opts.processingCallback : null;

    this.inputField.addEventListener('change', (e) => {
      this.processPhoto(e).then(this.renderAndProcessPhoto.bind(this));
    });
  }

  processPhoto() {
    if (typeof this.processingCallback === 'function') {
      this.processingCallback();
    }
    return new Promise((resolve, reject) => {
      if (this.inputField.files.length === 0) {
        reject('at least one photo should be selected.');
      }
      const file = this.inputField.files[0];
      const reader = new FileReader();

      reader.onloadend = (evt) => {
        if (evt.target.readyState === FileReader.DONE) { // DONE == 2
          resolve(evt.target.result);
        }

        // reset input field.
        this.inputField.value = '';
      };

      reader.readAsDataURL(file);
    });
  }

  renderAndProcessPhoto(dataUrl) {
    Quagga.decodeSingle(Object.assign({}, baseQuaggaConfig, {
      src: dataUrl // or 'data:image/jpg;base64,' + data
    }), (result) => {
      if (result && result.codeResult) {
        this.doneCallback(result.codeResult.code, dataUrl);
      } else {
        this.doneCallback(null, dataUrl);
      }
    });
  }
}

export default PhotoCapture;

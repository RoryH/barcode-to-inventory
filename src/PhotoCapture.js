import Quagga from 'quagga';
import baseQuaggaConfig from './base-quagga-config';

class PhotoCapture {
  constructor() {
    this.inputField;
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

    this.inputField.addEventListener('change', (e) => {
      this.processPhoto(e).then(this.renderAndProcessPhoto.bind(this));
    });
  }

  processPhoto() {
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
        console.log(result || 'Failed to identify Barcode.');
      }
    });
  }
}

export default PhotoCapture;

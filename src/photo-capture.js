import Quagga from 'quagga';
import baseQuaggaConfig from './base-quagga-config';

class PhotoCapture {
  constructor() {
    this.inputField;
  }

  init(opts) {
    if (!opts.input || opts.input.nodeName !== 'INPUT') {
      throw new Error('Bad Input element passed to PhotoCapture.init()');
    }
    this.inputField = opts.input;
    this.outputDiv = opts.outputDiv;

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
        console.log('read done');
        if (evt.target.readyState === FileReader.DONE) { // DONE == 2
          resolve(evt.target.result);
        }

        // reset input field.
        this.inputField.value = '';
      };

      reader.readAsDataURL(file);
      console.log('reading');
    });
  }

  renderAndProcessPhoto(dataUrl) {
    console.log('here');

    this.outputDiv.querySelectorAll('img').forEach(img => img.remove());
    const img = document.createElement('img');
    const dumpDiv = document.querySelector('#result .result-dump');

    img.src = dataUrl;
    this.outputDiv.appendChild(img);

    Quagga.decodeSingle(Object.assign({}, baseQuaggaConfig, {
      src: dataUrl // or 'data:image/jpg;base64,' + data
    }), (result) => {
      if (result && result.codeResult) {
        const json = JSON.stringify(result, null, 2);
        dumpDiv.innerHTML = `Code: ${result.codeResult.code}<br /><br /><pre>${json}</pre>`;
      } else {
        console.log(result || 'Nothing happened here!');
      }
    });
  }
}

export default PhotoCapture;

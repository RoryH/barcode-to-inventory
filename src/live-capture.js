import Quagga from 'quagga';
import { merge } from 'lodash';

class LiveCapture {
  constructor() {
    this.started = false;
  }

  static begin(opts) {
    this.stopCapture();
    const options = {
      numOfWorkers: navigator.hardwareConcurrency || 4,
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: document.querySelector('#cameraOutput')    // Or '#yourElement' (optional)
      },
      decoder: {
        readers: [
          'upc_reader',
          'upc_e_reader'
        ]
      }
    };

    Quagga.init(merge(options, opts), (err) => {
      const dumpDiv = document.querySelector('#result .result-dump');
      if (err) {
        console.log(err);
        return;
      }
      console.log('Initialization finished. Ready to start');
      Quagga.onDetected((result) => {
        const json = JSON.stringify(result, null, 2);
        dumpDiv.innerHTML = `Code: ${result.codeResult.code}<br /><br /><pre>${json}</pre>`;
        this.stopCapture();
      });
      Quagga.start();
      this.started = true;
    });
  }

  static getVideoInputDeviceIds() {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        resolve(devices.filter(dev => dev.kind === 'videoinput'));
      }).catch(() => {
        reject();
      });
    });
  }

  static stopCapture() {
    if (this.started) {
      Quagga.stop();
    }
  }
}


export default LiveCapture;

import Quagga from 'quagga';
import { merge } from 'lodash';

class LiveCapture {
  static begin(opts) {
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
        Quagga.stop();
      });
      Quagga.start();
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
    Quagga.stop();
  }
}


export default LiveCapture;

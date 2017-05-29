import Quagga from 'quagga';
import { merge } from 'lodash';
import baseQuaggaConfig from './base-quagga-config';

class LiveCapture {
  constructor() {
    this.started = false;
  }

  begin(opts) {
    this.stopCapture();
    const options = Object.assign({}, baseQuaggaConfig, {
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: document.querySelector('#cameraOutput')    // Or '#yourElement' (optional)
      }
    });

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

    Quagga.onProcessed((result) => {
      const drawingCtx = Quagga.canvas.ctx.overlay;
      const drawingCanvas = Quagga.canvas.dom.overlay;
      const cWidth = parseInt(drawingCanvas.getAttribute('width'), 10);
      const cHeight = parseInt(drawingCanvas.getAttribute('height'), 10);

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(0, 0, cWidth, cHeight);
          result.boxes.filter(box => box !== result.box).forEach((box) => {
            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: 'green', lineWidth: 2 });
          });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: '#00F', lineWidth: 2 });
        }

        if (result.codeResult && result.codeResult.code) {
          console.log(result);
          drawingCtx.drawImage(document.querySelector('video'), 0, 0, cWidth, cHeight);
          Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
        }
      }
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

  stopCapture() {
    if (this.started) {
      Quagga.stop();
    }
  }
}


export default LiveCapture;

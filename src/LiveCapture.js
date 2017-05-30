import Quagga from 'quagga';
import { countBy, identity, merge, pickBy, without } from 'lodash';
import baseQuaggaConfig from './base-quagga-config';

export const MIN_RESULTS_THRESHOLD = 5;
let instance;

class LiveCapture {
  constructor(opts) {
    this.started = false;
    this.doneCallback = null;
    this.resultCollector = null;
    this.el = opts.el;
    instance = this;
  }

  static getInstance() {
    return instance;
  }

  static clearCanvas() {
    const drawingCanvas = Quagga.canvas.dom.overlay;
    if (drawingCanvas) {
      const drawingCtx = Quagga.canvas.ctx.overlay;
      const cWidth = parseInt(drawingCanvas.getAttribute('width'), 10);
      const cHeight = parseInt(drawingCanvas.getAttribute('height'), 10);
      drawingCtx.clearRect(0, 0, cWidth, cHeight);
    }
  }

  begin(cameraDeviceId, cb) {
    this.doneCallback = cb;
    this.stopCapture();
    LiveCapture.clearCanvas();
    const processedHandler = ((...args) => LiveCapture.getInstance().processedHandler(...args));
    const options = merge({}, baseQuaggaConfig, {
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: this.el    // Or '#yourElement' (optional)
      }
    });

    const mergedOpts = merge(options, {
      inputStream: {
        constraints: {
          deviceId: cameraDeviceId
        }
      }
    });

    Quagga.offProcessed(processedHandler);

    Quagga.init(mergedOpts, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      this.resultCollector = Quagga.ResultCollector.create({
        capture: true, // keep track of the image producing this result
        capacity: 20
      });
      Quagga.registerResultCollector(this.resultCollector);
      console.log('Initialization finished. Ready to start');
      Quagga.onProcessed(processedHandler);
      Quagga.start();
      this.started = true;
    });
  }

  processedHandler(result) {
    if (!this.started) return false;
    const drawingCtx = Quagga.canvas.ctx.overlay;
    const drawingCanvas = Quagga.canvas.dom.overlay;
    const cWidth = parseInt(drawingCanvas.getAttribute('width'), 10);
    const cHeight = parseInt(drawingCanvas.getAttribute('height'), 10);

    if (result) {
      if (result.box || (result.codeResult && result.codeResult.code)) {
        drawingCtx.drawImage(this.el.querySelector('video'), 0, 0, cWidth, cHeight);

      }
      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: '#00F', lineWidth: 2 });
      }
      if (result.codeResult && result.codeResult.code) {
        Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
        const scanResult = this.hasVerifiedResult();
        if (scanResult) {
          const dataUri = drawingCanvas.toDataURL('image/jpeg');
          this.stopCapture();
          if (typeof this.doneCallback === 'function') {
            this.doneCallback(scanResult, dataUri);
            this.doneCallback = null;
          }
        }
      }
    }
  }

  hasVerifiedResult() {
    const results = this.resultCollector.getResults();
    if (results.length < MIN_RESULTS_THRESHOLD) {
      return false;
    }
    const codesCount = countBy(results.map(result => result.codeResult.code), identity);
    console.log(codesCount);
    const highestCount = Math.max.apply(null, Object.values(codesCount));
    const highestCountCode = Object.keys(pickBy(codesCount, val => val === highestCount))[0];

    const isResultGood = without(Object.keys(codesCount), highestCountCode)
      .every(key => (codesCount[key] + MIN_RESULTS_THRESHOLD) < highestCountCode);

    return isResultGood ? highestCountCode : false;
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
      this.started = false;
      Quagga.stop();
    }
  }
}


export default LiveCapture;

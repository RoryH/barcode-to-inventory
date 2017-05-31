import './scss/barcode-to-inventory.scss';
import LiveCapture from './LiveCapture';
import PhotoCapture from './PhotoCapture';


class BarcodeToInventory {
  constructor() {
    this.canSupportLive = navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function';
    this.videoDevices = [];
    this.domElements = {
      liveCaptureContainer: document.querySelector('.live-capture-container'),
      switchCameraButton: document.querySelector('button.switch-camera'),
      scanBarcodeButton: document.querySelector('button.scan-barcode')
    };
    this.currentDeviceIdIndex = 0;
    this.liveCapture = null;
    this.photoCapture = null;
  }

  init() {
    if (this.canSupportLive) {
      LiveCapture.getVideoInputDeviceIds().then((devices) => {
        if (devices.length === 0) {
          // no video devices detected
          this.canSupportLive = false;
        } else if (devices.length > 1) {
          document.body.classList.add('live-support');
          this.multipleCameras = true;
        }
        devices.forEach(d => this.videoDevices.push(d));

        if (this.canSupportLive) {
          document.body.classList.remove('loading');
        }
        this.addEvents();
      });
    }
    if (!this.canSupportLive) {
      this.photoCapture = new PhotoCapture();
      this.photoCapture.init({
        input: document.querySelector('.psuedo-photo-input input'),
        doneCallback: BarcodeToInventory.photoScanCallback
      });
      document.body.classList.remove('loading');
    }
  }

  scan() {
    this.liveCapture = new LiveCapture({
      el: document.querySelector('#cameraOutput')
    });
    this.liveCapture.begin(
      this.videoDevices[this.currentDeviceIdIndex].deviceId,
      this.liveScanCallback.bind(this)
    );
    if (this.multipleCameras) {
      this.domElements.switchCameraButton.style.display = 'block';
    }
    this.domElements.scanBarcodeButton.style.display = 'none';
  }

  static deleteNodeChildren(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  liveScanCallback(code, dataUrl) {
    this.domElements.scanBarcodeButton.style.display = '';
    this.domElements.switchCameraButton.style.display = 'none';

    const outputDiv = document.querySelector('.camera-output');
    BarcodeToInventory.deleteNodeChildren(outputDiv);
    const img = document.createElement('img');
    img.src = dataUrl;
    outputDiv.appendChild(img);
    BarcodeToInventory.handleResult(code);
  }

  static photoScanCallback(code, dataUrl) {
    const outputDiv = document.querySelector('.photo-output');
    BarcodeToInventory.deleteNodeChildren(outputDiv);
    const img = document.createElement('img');
    img.src = dataUrl;
    outputDiv.appendChild(img);
    BarcodeToInventory.handleResult(code);
  }

  static handleResult(code) {
    const resultDump = document.querySelector('.result-dump');
    if (code === null) {
      resultDump.appendChild(document.createTextNode('Failed to scan Barcode.\n'));
    } else {
      resultDump.appendChild(document.createTextNode(`${code}\n`));
    }

  }

  addEvents() {
    if (this.canSupportLive && this.multipleCameras) {
      this.domElements.switchCameraButton.addEventListener('click', () => {
        this.currentDeviceIdIndex = this.currentDeviceIdIndex + 1 >= this.videoDevices.length ?
          0 : this.currentDeviceIdIndex + 1;

        this.liveCapture.begin(
          this.videoDevices[this.currentDeviceIdIndex].deviceId,
          this.liveScanCallback.bind(this)
        );
      });
    }
    if (this.canSupportLive) {
      this.domElements.scanBarcodeButton.addEventListener('click', () => {
        BarcodeToInventory.deleteNodeChildren(document.querySelector('.camera-output'));
        this.scan();
      });
    }
  }
}

const btoi = new BarcodeToInventory();
btoi.init();

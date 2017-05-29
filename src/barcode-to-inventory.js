import './scss/barcode-to-inventory.scss';
import LiveCapture from './live-capture';

const canSupportLive = navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function';
const videoDevices = {};
// const barcodeOutput = document.querySelector('#barcodeOutput');

const liveCaptureButton = document.querySelector('button.live-capture-button');
const liveCaptureContainer = document.querySelector('.live-capture-container');
const capturePhotoButton = document.querySelector('button.capture-photo-button');
const switchCameraButton = document.querySelector('button.switch-camera');
let currentDeviceIdIndex = 0;

if (canSupportLive) {
  document.body.classList.add('live-support');

  LiveCapture.getVideoInputDeviceIds().then((devices) => {
    Object.assign(videoDevices, devices);

    liveCaptureButton.addEventListener('click', () => {
      liveCaptureContainer.style.display = 'block';
      LiveCapture.begin();
    });

    switchCameraButton.addEventListener('click', () => {
      liveCaptureContainer.style.display = 'block';
      LiveCapture.getVideoInputDeviceIds().then((ids) => {
        currentDeviceIdIndex = currentDeviceIdIndex + 1 >= ids.length ?
          0 : currentDeviceIdIndex + 1;

        console.log(`switching to camera: ${ids[currentDeviceIdIndex].label}`);
        LiveCapture.begin({
          constraints: {
            facing: 'environment',
            deviceId: ids[currentDeviceIdIndex].deviceId
          }
        });
      });
    });

    document.querySelector('button.stop-capture').addEventListener('click', () => {
      LiveCapture.stopCapture();
    });

    document.body.classList.remove('loading');
  });
} else {
  console.log('No live support');
  document.querySelector('#cameraOutput').innerHTML = 'Sorry, your browser is not supported.';

  capturePhotoButton.addEventListener('click', () => {
    liveCaptureContainer.style.display = 'block';
    // liveCapture.begin();
  });
  document.body.classList.remove('loading');
}

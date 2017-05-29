import './scss/barcode-to-inventory.scss';
import LiveCapture from './live-capture';
import PhotoCapture from './photo-capture';

const canSupportLive = navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function';
const videoDevices = [];

const liveCaptureContainer = document.querySelector('.live-capture-container');
const switchCameraButton = document.querySelector('button.switch-camera');
let currentDeviceIdIndex = 0;

if (canSupportLive) {
  document.body.classList.add('live-support');
  const liveCapture = new LiveCapture();
  LiveCapture.getVideoInputDeviceIds().then((devices) => {
    devices.forEach(d => videoDevices.push(d));
    liveCapture.begin();

    switchCameraButton.addEventListener('click', () => {
      liveCaptureContainer.style.display = 'block';
      currentDeviceIdIndex = currentDeviceIdIndex + 1 >= videoDevices.length ?
        0 : currentDeviceIdIndex + 1;

      console.log(`switching to camera: ${videoDevices[currentDeviceIdIndex].deviceId}`);
      liveCapture.begin({
        constraints: {
          deviceId: videoDevices[currentDeviceIdIndex].deviceId
        }
      });
    });

    document.querySelector('button.stop-capture').addEventListener('click', () => {
      liveCapture.stopCapture();
    });

    document.body.classList.remove('loading');
  });
} else {
  const photoCapture = new PhotoCapture();
  photoCapture.init({
    input: document.querySelector('.psuedo-photo-input input'),
    outputDiv: document.querySelector('.photo-output')
  });
  console.log('No live support');
  document.body.classList.remove('loading');
}

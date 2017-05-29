import './scss/barcode-to-inventory.scss';
import LiveCapture from './live-capture';

const canSupportLive = navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function';
const videoDevices = [];

const liveCaptureContainer = document.querySelector('.live-capture-container');
const switchCameraButton = document.querySelector('button.switch-camera');
let currentDeviceIdIndex = 0;

if (canSupportLive) {
  document.body.classList.add('live-support');

  LiveCapture.getVideoInputDeviceIds().then((devices) => {
    devices.forEach(d => videoDevices.push(d));
    LiveCapture.begin();

    switchCameraButton.addEventListener('click', () => {
      liveCaptureContainer.style.display = 'block';
      currentDeviceIdIndex = currentDeviceIdIndex + 1 >= videoDevices.length ?
        0 : currentDeviceIdIndex + 1;

      console.log(`switching to camera: ${videoDevices[currentDeviceIdIndex].label} = ${videoDevices[currentDeviceIdIndex].deviceId}`);
      LiveCapture.begin({
        constraints: {
          deviceId: videoDevices[currentDeviceIdIndex].deviceId
        }
      });
    });

    document.querySelector('button.stop-capture').addEventListener('click', () => {
      LiveCapture.stopCapture();
    });

    document.body.classList.remove('loading');
  });
} else {
  console.log('No live support');
  document.body.classList.remove('loading');
}
'l';

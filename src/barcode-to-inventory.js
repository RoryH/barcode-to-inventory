import './barcode-to-inventory.scss';
import liveCapture from './live-capture';

const canSupportLive = navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function';
const barcodeOutput = document.querySelector('#barcodeOutput');

const liveCaptureButton = document.querySelector('button.live-capture-button');
const liveCaptureContainer = document.querySelector('.live-capture-container');
const capturePhotoButton = document.querySelector('button.capture-photo-button');


if (canSupportLive) {
  document.body.classList.add('live-support');
} else {
  document.querySelector('#cameraOutput').innerHTML = 'Sorry, your browser is not supported.';
}

liveCaptureButton.addEventListener('click', () => {
  liveCaptureContainer.style.display = 'block';
  liveCapture.begin();
});

capturePhotoButton.addEventListener('click', () => {
  liveCaptureContainer.style.display = 'block';
  liveCapture.begin();
});

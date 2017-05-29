export default {
  locator: {
    halfSample: true,
    patchSize: 'medium',
    debug: {
      showCanvas: true,
      showPatches: true,
      showFoundPatches: true,
      showSkeleton: true,
      showLabels: true,
      showPatchLabels: true,
      showRemainingPatchLabels: true,
      boxFromPatches: {
        showTransformed: true,
        showTransformedBox: true,
        showBB: true
      }
    }
  },
  decoder: {
    readers: [
      'upc_reader',
      'ean_reader'
    ],
    debug: {
      drawBoundingBox: true,
      showFrequency: true,
      drawScanline: true,
      showPattern: true
    }
  },
  numOfWorkers: navigator.hardwareConcurrency || 4
};

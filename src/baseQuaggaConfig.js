export default {
  locator: {
    halfSample: false,
    patchSize: 'medium'
  },
  decoder: {
    readers: [
      'upc_reader',
      'ean_reader'
    ]
  },
  numOfWorkers: navigator.hardwareConcurrency || 4
};

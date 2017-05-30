export default {
  locator: {
    halfSample: true,
    patchSize: 'large'
  },
  decoder: {
    readers: [
      'upc_reader',
      'ean_reader'
    ]
  },
  numOfWorkers: navigator.hardwareConcurrency || 4
};

import Quagga from 'quagga';

export default {
  begin: () => {
    Quagga.init({
      numOfWorkers: navigator.hardwareConcurrency || 4,
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: document.querySelector('#cameraOutput')    // Or '#yourElement' (optional)
      },
      decoder: {
        readers: [
          'upc_reader',
          'upc_e_reader'
        ]
      }
    }, (err) => {
      const dumpDiv = document.querySelector('#result .result-dump');
      if (err) {
        console.log(err);
        return;
      }
      console.log('Initialization finished. Ready to start');
      Quagga.onDetected((result) => {
        const json = JSON.stringify(result, null, 2);
        dumpDiv.innerHTML = `Code: ${result.codeResult.code}<br /><br /><pre>${json}</pre>`;
        Quagga.stop();
      });
      Quagga.start();
    });
  }
};
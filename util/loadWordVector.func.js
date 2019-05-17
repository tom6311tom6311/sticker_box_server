import fs from 'fs';
import readline from 'readline';
import ProgressBar from 'progress';

const loadWordVector = (modelPath, callback = () => {}) => {
  const wordLib = {};
  let libSize = 0;
  let dim = 0;
  let bar = null;

  const modelStream = fs.createReadStream(modelPath);
  const lineReader = readline.createInterface(modelStream);

  lineReader.on('line', (line) => {
    const items = line.split(' ');
    if (items.length === 2) {
      [libSize, dim] = items;
      libSize = parseInt(libSize, 10);
      dim = parseInt(dim, 10);
      bar = new ProgressBar('Loading word vectors: [:bar] :percent :etas', { total: libSize });
    } else if (items.length === dim + 2) {
      const w = items.shift();
      wordLib[w] = items.slice(0, dim).map(s => parseFloat(s));
      bar.tick();
    }
  });

  lineReader.on('close', () => {
    callback(wordLib);
  });
};

export default loadWordVector;

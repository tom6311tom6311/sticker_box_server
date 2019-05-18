import math from 'mathjs';
import nodejieba from 'nodejieba';
import AppConfig from '../const/AppConfig.const';
import randomChoice from './randomChoice.func';
import loadWordVector from './loadWordVector.func';

const similarity = (vecList1, vecList2) => {
  let accumSim = 0;
  vecList1.forEach((vec1) => {
    vecList2.forEach((vec2) => {
      accumSim += math.dot(vec1, vec2);
    });
  });
  return accumSim / (vecList1.length * vecList2.length);
};

class TermMatcher {
  constructor() {
    this.wordLib = {};
    this.termLib = [];
  }

  loadWordLib(callback = () => {}) {
    loadWordVector(AppConfig.WORD2VEC_MODEL_PATH, (wordLib) => {
      this.wordLib = wordLib;
      callback();
    });
  }

  termExists(term) {
    return this.termLib.findIndex(({ term: t, fileType }) => `${t}${fileType}` === term) !== -1;
  }

  updateTerms(fileNames) {
    fileNames.forEach((fileName) => {
      if (this.termExists(fileName)) {
        console.log(`INFO [TermMatcher]: term already exits: ${fileName}`);
        return;
      }
      const term = fileName.slice(0, fileName.lastIndexOf('.'));
      const fileType = fileName.slice(fileName.lastIndexOf('.'));
      this.termLib.push({
        term,
        fileType,
        vecList: nodejieba.cut(term)
          .map(w => this.wordLib[w])
          .filter(v => v !== undefined),
      });
    });
    // console.log(this.termLib);
  }

  match(term, num) {
    const vecList = nodejieba.cut(term)
      .map(w => this.wordLib[w])
      .filter(v => v !== undefined);
    if (term === '' || vecList.length === 0) {
      return randomChoice(
        this.termLib.map(({ term: t, fileType }) => `${t}${fileType}`),
        num,
      );
    }
    return this.termLib
      .sort((a, b) => similarity(vecList, b.vecList) - similarity(vecList, a.vecList))
      .map(({ term: t, fileType }) => `${t}${fileType}`)
      .slice(0, num);
  }
}

export default new TermMatcher();

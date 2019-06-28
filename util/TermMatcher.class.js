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
    this.termLibs = {};
  }

  loadWordLib(callback = () => {}) {
    loadWordVector(AppConfig.WORD2VEC_MODEL_PATH, (wordLib) => {
      this.wordLib = wordLib;
      callback();
    });
  }

  termExists(termLib, id) {
    if (this.termLibs[termLib] === undefined) return false;
    return this.termLibs[termLib].findIndex(({ id: i }) => i === id) !== -1;
  }

  updateTerms(termLib, terms) {
    terms.forEach(({ id, term }) => {
      if (this.termExists(termLib, id)) {
        console.log(`INFO [TermMatcher]: term already exits: ${id}`);
        return;
      }
      if (this.termLibs[termLib] === undefined) {
        this.termLibs[termLib] = [];
      }
      this.termLibs[termLib].push({
        id,
        term,
        vecList: nodejieba.cut(term)
          .map(w => this.wordLib[w])
          .filter(v => v !== undefined),
      });
    });
  }

  deleteTerm(termLib, id) {
    if (this.termLibs[termLib] === undefined) return;
    const idx = this.termLibs[termLib].findIndex(({ id: i }) => i === id);
    if (idx !== -1) {
      this.termLibs[termLib].splice(idx, 1);
    }
  }

  match(termLib, term, num) {
    if (this.termLibs[termLib] === undefined) return [];
    const vecList = nodejieba.cut(term)
      .map(w => this.wordLib[w])
      .filter(v => v !== undefined);
    if (term === '' || vecList.length === 0) {
      return randomChoice(
        this.termLibs[termLib].map(({ id }) => id),
        num,
      );
    }
    return this.termLibs[termLib]
      .sort((a, b) => similarity(vecList, b.vecList) - similarity(vecList, a.vecList))
      .map(({ id }) => id)
      .slice(0, num);
  }
}

export default new TermMatcher();

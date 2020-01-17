/** @format */

import { observable } from 'mobx';
import { resetAsync } from '../utils/Common';

export default class ImpactAnalysisStore {
  @observable impactAnalysisFetchAsync = {};

  @observable impactAnalysis = [];

  constructor() {
    resetAsync(this.impactAnalysisFetchAsync);
  }

}

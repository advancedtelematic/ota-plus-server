/** @format */

import { observable } from 'mobx';
import axios from 'axios';
import { API_IMPACT_ANALYSIS_FETCH } from '../config';
import { resetAsync, handleAsyncSuccess, handleAsyncError } from '../utils/Common';

export default class ImpactAnalysisStore {
  @observable impactAnalysisFetchAsync = {};

  @observable impactAnalysis = [];

  constructor() {
    resetAsync(this.impactAnalysisFetchAsync);
  }

  fetchImpactAnalysis() {
    resetAsync(this.impactAnalysisFetchAsync, true);
    return axios
      .get(API_IMPACT_ANALYSIS_FETCH)
      .then(
        (response) => {
          this.impactAnalysis = response.data;
          this.impactAnalysisFetchAsync = handleAsyncSuccess(response);
        },
      )
      .catch(
        (error) => {
          this.impactAnalysisFetchAsync = handleAsyncError(error);
        },
      );
  }
}

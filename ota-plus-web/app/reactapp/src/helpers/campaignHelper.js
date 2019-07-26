const LESS_THAN_ONE = '< 1';

export const getOverallCampaignStatistics = (statistics) => {
  const stats = {
    processed: 0,
    affected: 0,
    finished: 0,
    queued: 0,
    successful: 0,
    notImpacted: 0,
    failed: 0,
    cancelled: 0,
  };
  const { affected, processed, cancelled, failed, successful, finished } = statistics;
  stats.affected = affected;
  stats.processed = processed;
  stats.notImpacted = processed - affected;
  stats.finished = finished;
  stats.cancelled = cancelled;
  stats.queued = affected - (finished + cancelled);
  stats.failed = failed;
  stats.successful = successful;
  return stats;
};

const calcRateForStatType = (count, processedCount, percentageFactor) => {
  if (count === 0) {
    return 0;
  }
  const lessThanOnePercent = count / processedCount * 100 < 1;
  return lessThanOnePercent
    ? LESS_THAN_ONE
    : Math.round(
      (count / Math.max(processedCount, 1)) * 100 * percentageFactor
    ) / percentageFactor;
};

// campaignSummaryData: summary or statistics data
export const getCampaignSummaryData = (campaignSummaryData, percentageFactor = 1) => {
  // TODO: notProcessed is supposed to count batches, but the BE doesn’t send any batch info to display
  const notProcessed = 0;

  const {
    processed,
    failed,
    successful,
    queued,
    notImpacted,
    cancelled,
    affected
  } = getOverallCampaignStatistics(campaignSummaryData);

  // failed
  const failedRate = calcRateForStatType(failed, processed, percentageFactor);

  // success
  const successRate = calcRateForStatType(successful, processed, percentageFactor);

  // installing
  const installingCount = queued + notProcessed;
  const installingRate = calcRateForStatType(installingCount, processed, percentageFactor);

  // not applicable
  const notApplicableCount = notImpacted + cancelled;
  const notApplicableRate = calcRateForStatType(notApplicableCount, processed, percentageFactor);

  return {
    affectedCount: affected,
    failedCount: failed,
    failedRate,
    installingCount,
    installingRate,
    notApplicableCount,
    notApplicableRate,
    notProcessedCount: notProcessed,
    successRate,
    processedCount: processed,
    successCount: successful
  };
};

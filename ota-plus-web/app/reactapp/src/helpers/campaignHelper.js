
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

// campaignSummaryData: summary or statistics data
export const getCampaignSummaryData = (campaignSummaryData, percentageFactor = 1) => {
  // TODO: notProcessed is supposed to count batches, but the BE doesn’t send any batch info to display
  const notProcessed = 0;

  const stats = getOverallCampaignStatistics(campaignSummaryData);

  // failed
  const failedRate = Math.round(
    (stats.failed / Math.max(stats.processed, 1)) * 100 * percentageFactor
  ) / percentageFactor;

  // success
  const successRate = Math.round(
    (stats.successful / Math.max(stats.processed, 1)) * 100 * percentageFactor
  ) / percentageFactor;

  // installing
  const installingCount = stats.queued + notProcessed;
  const installingRate = Math.round(
    (installingCount / Math.max(stats.processed, 1)) * 100 * percentageFactor
  ) / percentageFactor;

  // not applicable
  const notApplicableCount = stats.notImpacted + stats.cancelled;
  const notApplicableRate = Math.round(
    (notApplicableCount / Math.max(stats.processed, 1)) * 100 * percentageFactor
  ) / percentageFactor;

  return {
    affectedCount: stats.affected,
    failedCount: stats.failed,
    failedRate,
    installingCount,
    installingRate,
    notApplicableCount,
    notApplicableRate,
    notProcessedCount: notProcessed,
    successRate,
    processedCount: stats.processed,
    successCount: stats.successful
  };
};

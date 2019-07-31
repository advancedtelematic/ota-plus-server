import { useTranslation } from 'react-i18next';

// eslint-disable-next-line import/prefer-default-export
export const getTimeLeft = (seconds) => {
  const { t } = useTranslation();
  return seconds <= 60
    ? t('time.second_count', { count: Math.round(seconds) })
    : seconds <= 3600
      ? t('time.minute_count', { count: Math.round(seconds / 60) })
      : t('time.hour_count', { count: Math.round(seconds / 3600) });
};

/* eslint-disable import/prefer-default-export */
import moment from 'moment';
import { LANGUAGE_SYMBOL_ENGLISH } from '../config';
import { getLanguage } from './languageHelper';
import { AM_PM_TOKEN, CLOCK_12_HOUR_TOKEN, CLOCK_24_HOUR_TOKEN } from '../constants/datesTimesConstants';

const CLOCK_24_HOUR_REGEXP = new RegExp(CLOCK_24_HOUR_TOKEN, 'g');

export const getFormattedDateTime = (dateTime, format) => {
  let formatUpdated;
  switch (getLanguage()) {
    default:
      formatUpdated = format;
      break;
    case LANGUAGE_SYMBOL_ENGLISH:
      formatUpdated = `${format.replace(CLOCK_24_HOUR_REGEXP, CLOCK_12_HOUR_TOKEN)} ${AM_PM_TOKEN}`;
      break;
  }
  return moment(dateTime).format(formatUpdated);
};

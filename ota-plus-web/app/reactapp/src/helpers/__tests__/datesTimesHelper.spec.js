import moment from 'moment';
import { LANGUAGE_SYMBOL_CHINESE, LANGUAGE_SYMBOL_ENGLISH } from '../../config';
import { getFormattedDateTime } from '../datesTimesHelper';
import * as languageHelper from '../languageHelper';
import { AM_PM_TOKEN } from '../../constants/datesTimesConstants';

const NO_MERIDIEM_TIME_FORMAT = 'ddd MMM D YYYY HH:mm';
const MERIDIEM_TIME_FORMAT = 'ddd MMM D YYYY hh:mm A';

describe('datesTimesHelper', () => {
  it('should return proper date time, without AM/PM', () => {
    languageHelper.getLanguage = jest.fn(() => LANGUAGE_SYMBOL_CHINESE);
    const date = '2020-03-02T12:28:42Z';
    const dateTime = getFormattedDateTime(date, NO_MERIDIEM_TIME_FORMAT);
    expect(dateTime).toEqual(moment(date).format(NO_MERIDIEM_TIME_FORMAT));
    expect(dateTime).toEqual(expect.not.stringContaining('AM'));
    expect(dateTime).toEqual(expect.not.stringContaining('PM'));
  });

  it('should return proper date time, with AM/PM', () => {
    languageHelper.getLanguage = jest.fn(() => LANGUAGE_SYMBOL_ENGLISH);
    const date = '2020-03-02T12:28:42Z';
    const dateTime = getFormattedDateTime(date, NO_MERIDIEM_TIME_FORMAT);
    expect(dateTime).toEqual(moment(date).format(MERIDIEM_TIME_FORMAT));
    expect(dateTime).toEqual(expect.stringContaining(moment(date).format(AM_PM_TOKEN)));
  });
});

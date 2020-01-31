import { getTruncatedURL, sendAction, setAnalyticsView } from '../analyticsHelper';
import { OTA_NAV_HOMEPAGE } from '../../constants/analyticsActions';
import { ANALYTICS_LINK_EVENT_URL_TRUNCATED } from '../../constants/analyticsLinkEvents';
import { ANALYTICS_VIEW_DEVICE_DETAIL_VIEW, ANALYTICS_VIEW_HOMEPAGE } from '../../constants/analyticsViews';

describe('analyticsHelper', () => {
  beforeEach(() => {
    window.utag = {
      link: jest.fn(),
      view: jest.fn()
    };
  });

  it('getTruncatedURL should return window location href url', () => {
    expect(getTruncatedURL(ANALYTICS_VIEW_HOMEPAGE)).toEqual(window.location.href);
  });

  it('getTruncatedURL should return window location href url without "/" char at the end', () => {
    const URL = getTruncatedURL(ANALYTICS_VIEW_DEVICE_DETAIL_VIEW);
    expect(URL.charAt(URL.length - 1)).not.toBe('/');
  });

  it('sendAction should be called with proper action name', () => {
    sendAction(OTA_NAV_HOMEPAGE);
    expect(window.utag.link).toHaveBeenCalledTimes(1);
    expect(window.utag.link).toBeCalledWith({
      link_id: this,
      link_text: OTA_NAV_HOMEPAGE,
      linkEvent: OTA_NAV_HOMEPAGE,
      actionTrack: OTA_NAV_HOMEPAGE
    });
  });

  it('sendAction should not be called', () => {
    window.utag = {
      link: jest.fn()
    };
    sendAction(OTA_NAV_HOMEPAGE);
    expect(window.utag.link).toHaveBeenCalledTimes(0);
  });

  it('setAnalyticsView should be called with proper view name', () => {
    setAnalyticsView(ANALYTICS_VIEW_HOMEPAGE);
    expect(window.utag.view).toHaveBeenCalledTimes(1);
    expect(window.utag.view).toBeCalledWith({ pName: ANALYTICS_VIEW_HOMEPAGE });
  });

  it('setAnalyticsView should not be called', () => {
    window.utag = {
      view: jest.fn()
    };
    setAnalyticsView(ANALYTICS_VIEW_HOMEPAGE);
    expect(window.utag.view).toHaveBeenCalledTimes(0);
  });

  it('setAnalyticsView should be called with proper Device Detail View params', () => {
    setAnalyticsView(ANALYTICS_VIEW_DEVICE_DETAIL_VIEW);
    expect(window.utag.view).toHaveBeenCalledTimes(1);
    expect(window.utag.view).toBeCalledWith({
      pName: ANALYTICS_VIEW_DEVICE_DETAIL_VIEW,
      linkEvent: ANALYTICS_LINK_EVENT_URL_TRUNCATED,
      sURLTrunc: getTruncatedURL(ANALYTICS_VIEW_DEVICE_DETAIL_VIEW)
    });
  });
});

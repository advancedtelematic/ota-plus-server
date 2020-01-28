import { sendAction, setAnalyticsView } from '../analyticsHelper';
import { OTA_NAV_HOMEPAGE } from '../../constants/analyticsActions';
import { ANALYTICS_VIEW_HOMEPAGE } from '../../constants/analyticsViews';

describe('analyticsHelper', () => {
  beforeEach(() => {
    window.utag = {
      link: jest.fn(),
      view: jest.fn()
    };
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
});

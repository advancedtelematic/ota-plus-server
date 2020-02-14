import { changeUserEnvironment } from '../environmentHelper';

describe('environmentHelper', () => {
  beforeEach(() => {
    window.location.replace = jest.fn();
  });
  it('should not call window.location.replace', () => {
    changeUserEnvironment();
    expect(window.location.replace).toHaveBeenCalledTimes(0);
  });
  it('should call window.location.replace', () => {
    changeUserEnvironment('test_namespace');
    expect(window.location.replace).toHaveBeenCalledTimes(1);
  });
  it('should call window.location.replace with namespace in it', () => {
    const testNamespace = 'test_namespace';
    changeUserEnvironment(testNamespace);
    expect(window.location.replace).toBeCalledWith(
      expect.stringContaining(testNamespace),
    );
  });
  it('should call window.location.replace with encoding url', () => {
    const testNamespace = 'test namespace';
    changeUserEnvironment(testNamespace);
    expect(window.location.replace).toBeCalledWith(
      expect.not.stringContaining(testNamespace),
    );
  });
});

import { copyToClipboard } from '../clipboardHelper';

describe('clipboardHelper', () => {
  it('should call execCommand', () => {
    document.execCommand = jest.fn();
    copyToClipboard('abcde');
    expect(document.execCommand).toHaveBeenCalled();
  });
});

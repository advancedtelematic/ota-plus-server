import { SOFTWARE_VERSION_FILE_LIMIT } from '../../config';
import { isFileTooLarge } from '../fileHelper';


describe('fileHelper', () => {
  it('should return file size is not too large', () => {
    expect(isFileTooLarge(0, SOFTWARE_VERSION_FILE_LIMIT)).toBeFalsy();
    expect(isFileTooLarge(1, SOFTWARE_VERSION_FILE_LIMIT)).toBeFalsy();
    expect(isFileTooLarge(1024, SOFTWARE_VERSION_FILE_LIMIT)).toBeFalsy();
    expect(isFileTooLarge(SOFTWARE_VERSION_FILE_LIMIT, SOFTWARE_VERSION_FILE_LIMIT)).toBeFalsy();
  });

  it('should return fiel size is too large', () => {
    expect(isFileTooLarge(1024 * 1024 * 1024 + 1, SOFTWARE_VERSION_FILE_LIMIT)).toBeTruthy();
  });
});

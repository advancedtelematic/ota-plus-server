/**
 * /* this function simply replaces the first '$' character of sass variables with '@'
 *
 * @format
 */

module.exports = function(source) {
  return source.replace(/\$/gi, '@');
}; // eslint-disable-line func-names

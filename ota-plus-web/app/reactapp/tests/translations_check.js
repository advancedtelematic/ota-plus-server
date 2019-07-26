/* eslint-disable */

const _ = require('lodash');
const fs = require('fs')
const walk = require('walk');

const TRANSLATION_BEGIN = "t('";
const APOSTROPHE = "'"
const DOT = '.';
const MIN_KEY_LENGTH = 5;
const IGNORE_IN_LINE_1 = 'moment(';

const files = [];

const language = 'en';
const translationFilePath = `./../assets/locales/${language}/translation.json`;

const walker = walk.walk('./src', { followLinks: false });

walker.on('file', (root, stat, next) => {
  files.push(`${root}/${stat.name}`);
  next();
});

const getJsonDataByKey = (data, key) => {
  return data[key];
};

const checkKeyExists = (jsonData, mainKey) => {
  const keys = mainKey.split(DOT);
  let data = jsonData;
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    data = getJsonDataByKey(data, key);
    if (!data) {
      return false;
    }
  }
  return data && (_.isString(data) || _.isArray(data)) ? true : false;
};

let translationFileJson;
fs.readFile(translationFilePath, 'utf8', (errorReading, jsonString) => {
  if (errorReading) {
    console.error('Error reading file from disk: ', errorReading)
    return;
  }
  try {
    translationFileJson = JSON.parse(jsonString);
  } catch (errorParsing) {
    console.error('Error parsing JSON string:', errorParsing);
  }
});

walker.on('end', () => {
  if (!translationFileJson) {
    return;
  }
  let success = true;
  console.log(`Checking translations keys for language: ${language.toUpperCase()}...`);
  let keysCount = 0;
  files.forEach((file) => {
    const lines = fs.readFileSync(file, 'utf-8').split('\n');
    lines.forEach((line, lineNumber) => {
      const begin = line.indexOf(TRANSLATION_BEGIN);
      if (begin > -1) {
        const array = line.split(TRANSLATION_BEGIN);
        const key = array[1].substring(0, array[1].indexOf(APOSTROPHE));
        if (key.indexOf(DOT) > -1 && key.length > MIN_KEY_LENGTH && line.indexOf(IGNORE_IN_LINE_1) === -1) {
          keysCount = keysCount + 1;
          const keyExists = checkKeyExists(translationFileJson, key);
          if (!keyExists) {
            console.error(`${file}:${lineNumber} - checking key: ${key} - error`);
            success = false;
          }
        }
      }
    });
  });
  console.log(`Checked ${files.length} files with ${keysCount} keys - status: ${success ? 'SUCCESS' : 'ERROR'}`);
});

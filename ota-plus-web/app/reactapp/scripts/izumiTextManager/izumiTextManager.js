
const crypto = require('crypto')
const fs = require('fs-extra');
const https = require('https');
const unzip = require('unzipper');

const SCRIPT_WORK_TYPE_CHECK_NEW = 'check';
const SCRIPT_WORK_TYPE_UPDATE = 'update';

const APP_LOCALIZATIONS_DIRECTORY = '../assets/locales';
const APP_LOCALIZATION_FILE_NAME = 'translation.json';
const FILE_ENCODING = 'utf-8';
const IZUMI_KEY_PREFIX = 'otaconnect.';
const IZUMI_FILE_MIN_SIZE = 1024; // minimum size of downloaded file from Izumi
const IZUMI_RELEASE_APP_FILE_PATH = './scripts/izumiTextManager/data/release-app.zip'; // file for frontend application
const IZUMI_RELEASE_IZUMI_FILE_PATH = './scripts/izumiTextManager/data/release-izumi.zip'; // file downloaded from Izumi
const IZUMI_RELEASE_URL = 'https://releases.izumi.ext.here.com/otaconnect/4080fc61b8967948191c04bc7866f79f/release.zip';
const IZUMI_RESOURCES_SUBFOLDER = '/resources';
const WORKING_DIRECTORY = './tmp';

const FILES_TRANSLATED_MAPPING = [
  { izumiFile: 'en-US.json', appSubdirectory: 'en', defaultLanguage: true }, // English
  { izumiFile: 'ja-JP.json', appSubdirectory: 'ja' }, // Japanese
  { izumiFile: 'zh-CN.json', appSubdirectory: 'zh' }, // Chinese
  { izumiFile: 'zz-ZZ.json', appSubdirectory: 'zz' }, // Pseudo
];

const fileExists = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      return true;
    }
  } catch (err) {
    return false;
  }
  return false;
};

const copyFile = (sourcePath, destinationPath) => {
  if (fileExists(sourcePath)) {
    fs.copyFileSync(sourcePath, destinationPath);
  }
};

const deleteDirectory = (directoryPath) => {
  if (fileExists(directoryPath)) {
    fs.removeSync(directoryPath, { recursive: true });
  }
};

const deleteFile = (filePath) => {
  if (fileExists(filePath)) {
    fs.removeSync(filePath);
  }
};

const downloadFile = (url, savePath, resultCallback) => {
  console.log('Downloading the file from: ', url);
  const file = fs.createWriteStream(savePath);
  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close(resultCallback(true));
    });
  }).on('error', () => {
    fs.unlink(savePath);
    resultCallback(false);
  });
};

const getFileSize = (filePath) => {
  if (fileExists(filePath)) {
    const stats = fs.statSync(filePath);
    return stats.size;
  }
  return -1;
};

const readFile = filePath => fs.readFileSync(filePath, FILE_ENCODING);

const openFile = (filePath) => {
  const fileData = readFile(filePath);
  const languageData = JSON.parse(fileData);
  return JSON.stringify(languageData, null, 2);
};

const getFileChecksum = (filePath) => {
  if (fileExists(filePath)) {
    const fileData = readFile(filePath);
    return crypto.createHash('md5')
      .update(fileData, 'utf8')
      .digest('hex');
  }
  return -1;
};

const getLanguageFileData = (filePath) => {
  const fileData = fs.readFileSync(filePath, FILE_ENCODING);
  const languageData = JSON.parse(fileData).data;
  return JSON.stringify(languageData, null, 2);
};

const getLanguageFilePath = izumiFile => `${WORKING_DIRECTORY}${IZUMI_RESOURCES_SUBFOLDER}/${izumiFile}`;

const saveFile = (directoryPath, fileName, data) => {
  if (!fileExists(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }
  const filePath = `${directoryPath}/${fileName}`;
  fs.writeFileSync(filePath, data, FILE_ENCODING);
};

const transformKeys = (fileLanguageData) => {
  const regexp = new RegExp(IZUMI_KEY_PREFIX, 'g');
  return fileLanguageData.replace(regexp, '');
};

const unzipFile = (filePath, outputDirectoryPath, callbackFunction) => {
  if (fileExists(filePath)) {
    fs.createReadStream(filePath)
      .pipe(unzip.Extract({ path: outputDirectoryPath }))
      .on('error', () => {
        callbackFunction(false);
      })
      .on('close', () => {
        callbackFunction(true);
      });
  }
};

const updateTexts = (izumiReleaseIzumiFilePath, izumiReleaseAppFilePath, workingDirectory) => {
  console.log('Updating texts...');
  // Check existing of Izumi release.zip
  if (fileExists(izumiReleaseIzumiFilePath)) {
    console.log(`File ${izumiReleaseIzumiFilePath} exists. Unzipping...`);
    // Unzip file
    unzipFile(izumiReleaseIzumiFilePath, workingDirectory, (result) => {
      if (result) {
        FILES_TRANSLATED_MAPPING.forEach((languageFileData) => {
          // Check existing file
          const filePath = getLanguageFilePath(languageFileData.izumiFile);
          console.log('Processing file:', languageFileData.izumiFile);
          if (fileExists(filePath)) {
            // Open file
            const fileLanguageData = getLanguageFileData(filePath);

            // Transform text keys
            const izumiLanguageData = transformKeys(fileLanguageData);
            const appSubdirectory = `${APP_LOCALIZATIONS_DIRECTORY}/${languageFileData.appSubdirectory}`;
            if (languageFileData.defaultLanguage) { // there are additional operations needed on default (English) file
              const appFilePath = `${appSubdirectory}/${APP_LOCALIZATION_FILE_NAME}`;
              const appFileLanguageData = openFile(appFilePath);

              // Replace each ID from Izumi to project file
              const mergedLanguageFileData = {
                ...JSON.parse(appFileLanguageData),
                ...JSON.parse(izumiLanguageData),
              };

              // Sort alphabetically by keys
              const mergedLanguageFileDataSorted = Object.keys(mergedLanguageFileData)
                .sort()
                .reduce((acc, key) => ({
                  ...acc, [key]: mergedLanguageFileData[key]
                }), {});

              // Copy data to application
              saveFile(
                appSubdirectory,
                APP_LOCALIZATION_FILE_NAME,
                JSON.stringify(mergedLanguageFileDataSorted, null, 4)
              );
            } else {
              // Copy data to application
              saveFile(appSubdirectory, APP_LOCALIZATION_FILE_NAME, izumiLanguageData);
            }
          }
        });

        // Delete tmp directory
        console.log('Cleaning working directory.');
        deleteDirectory(workingDirectory);
        copyFile(IZUMI_RELEASE_IZUMI_FILE_PATH, IZUMI_RELEASE_APP_FILE_PATH);
        deleteFile(IZUMI_RELEASE_IZUMI_FILE_PATH);
        console.log('Finished sucessfully.');
      } else {
        console.log('Cannot unzip file.');
      }
    });
  } else {
    console.log(`File ${izumiReleaseIzumiFilePath} does not exist.`);
  }
};

const run = () => {
  const args = process.argv;
  console.log('Running script with args: ', args);
  if (args.length > 2) {
    const workType = args[2];
    console.log('Running script with type: ', workType);
    switch (workType) {
      case SCRIPT_WORK_TYPE_CHECK_NEW:
        downloadFile(IZUMI_RELEASE_URL, IZUMI_RELEASE_IZUMI_FILE_PATH, (result) => {
          if (result) {
            const izumiFileSize = getFileSize(IZUMI_RELEASE_IZUMI_FILE_PATH);
            console.log('Downloaded Izumi file size: ', izumiFileSize);
            if (izumiFileSize >= IZUMI_FILE_MIN_SIZE) {
              const appFileSize = getFileSize(IZUMI_RELEASE_APP_FILE_PATH);
              console.log('App file size: ', appFileSize);
              const izumiFileChecksum = getFileChecksum(IZUMI_RELEASE_IZUMI_FILE_PATH);
              const appFileChecksum = getFileChecksum(IZUMI_RELEASE_APP_FILE_PATH);
              console.log('Izumi file checksum: ', izumiFileChecksum);
              console.log('App file appFileChecksum: ', appFileChecksum);
              if (izumiFileChecksum !== appFileChecksum) {
                console.log('');
                console.log('\x1b[31m', 'New strings found in Izumi');
                console.log('');
                process.exit(-1);
              } else {
                console.log('');
                console.log('\x1b[32m', 'No new strings found in Izumi');
                console.log('');
              }
            } else {
              console.log(false, 'Error: file is probably corrupted');
              process.exit(-1);
            }
            deleteFile(IZUMI_RELEASE_IZUMI_FILE_PATH);
          } else {
            console.log(false, 'Error: file downloaded failed');
            process.exit(-1);
          }
        });
        break;
      case SCRIPT_WORK_TYPE_UPDATE:
        downloadFile(IZUMI_RELEASE_URL, IZUMI_RELEASE_IZUMI_FILE_PATH, (result) => {
          if (result) {
            updateTexts(IZUMI_RELEASE_IZUMI_FILE_PATH, IZUMI_RELEASE_APP_FILE_PATH, WORKING_DIRECTORY);
          } else {
            console.log('File downloaded failed');
          }
        });
        break;
      default:
        console.error('Wrong argument');
        break;
    }
  } else {
    console.error('No arguments');
  }
};

run();

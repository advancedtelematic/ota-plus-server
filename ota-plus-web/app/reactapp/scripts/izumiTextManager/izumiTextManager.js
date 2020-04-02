
const fs = require('fs-extra');
const unzip = require('unzipper');

const APP_LOCALIZATIONS_DIRECTORY = '../assets/locales';
const APP_LOCALIZATION_FILE_NAME = 'translation.json';
const FILE_ENCODING = 'utf-8';
const IZUMI_KEY_PREFIX = 'otaconnect.';
const IZUMI_RELEASE_FILE_PATH = './scripts/izumiTextManager/data/release.zip';
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

const deleteDirectory = (directoryPath) => {
  if (fileExists(directoryPath)) {
    fs.removeSync(directoryPath, { recursive: true });
  }
};

const openFile = (filePath) => {
  const fileData = fs.readFileSync(filePath, FILE_ENCODING);
  const languageData = JSON.parse(fileData);
  return JSON.stringify(languageData, null, 2);
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
      .on('close', () => {
        callbackFunction();
      });
  }
};

const run = (izumiReleaseFilePath, workingDirectory) => {
  console.log('Running script...');
  // Check existing of Izumi release.zip
  if (fileExists(izumiReleaseFilePath)) {
    console.log(`File ${izumiReleaseFilePath} exists. Unzipping...`);
    // Unzip file
    unzipFile(izumiReleaseFilePath, workingDirectory, () => {
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
      console.log('Finished sucessfully.');
    });
  } else {
    console.log(`File ${izumiReleaseFilePath} does not exist.`);
  }
};

run(IZUMI_RELEASE_FILE_PATH, WORKING_DIRECTORY);

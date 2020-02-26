
const fs = require('fs-extra');
const unzip = require('unzip');

const APP_LOCALIZATIONS_DIRECTORY = '../../../assets/locales';
const APP_LOCALIZATION_FILE_NAME = 'translation.json';
const FILE_ENCODING = 'utf-8';
const IZUMI_KEY_PREFIX = 'otaconnect.';
const IZUMI_RELEASE_FILE_PATH = './data/release.zip';
const IZUMI_RESOURCES_SUBFOLDER = '/resources';
const WORKING_DIRECTORY = './tmp';

const FILES_TRANSLATED_MAPPING = [
  { izumiFile: 'en-US.json', appSubdirectory: 'en', defaultLanguage: true },
  { izumiFile: 'ja-JP.json', appSubdirectory: 'ja' },
  { izumiFile: 'zh-CN.json', appSubdirectory: 'zh' },
  { izumiFile: 'zz-ZZ.json', appSubdirectory: 'zz', pseudo: true },
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
  console.log('Deleting directory:', directoryPath);
  if (fileExists(directoryPath)) {
    fs.removeSync(directoryPath, { recursive: true });
  }
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
        console.log('Processing language file:', languageFileData.izumiFile);
        // EN: check existing file
        const filePath = getLanguageFilePath(languageFileData.izumiFile);
        if (fileExists(filePath)) {
          // console.log('Processing language exists: ', filePath);
          if (languageFileData.defaultLanguage) {
            // EN: transform texts
            // EN: replace each ID from Izumi to project file
            // EN: sort alphabetically
          } else {
            // Open file
            const fileLanguageData = getLanguageFileData(filePath);
            // Transform text keys
            // console.log('fileLanguageData: ', fileLanguageData);
            const i18Data = transformKeys(fileLanguageData);
            // Copy data to application
            // console.log('i18Data: ', i18Data);
            const appSubdirectory = `${APP_LOCALIZATIONS_DIRECTORY}/${languageFileData.appSubdirectory}`;
            saveFile(appSubdirectory, APP_LOCALIZATION_FILE_NAME, i18Data);
          }
        }
      });
      // Delete tmp directory
      deleteDirectory(workingDirectory);
      console.log('Finished sucessfully.');
    });
  } else {
    console.log(`File ${izumiReleaseFilePath} does not exist.`);
  }
};

run(IZUMI_RELEASE_FILE_PATH, WORKING_DIRECTORY);

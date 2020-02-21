const copydir = require('copy-dir');
const fs = require('fs');
const moment = require('moment');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const DEVICES_COUNT = 50;

const CONFIGURATION_FILE_NAME = 'sota_local.toml';
const DEVICE_TEMPLATE_DIR = 'device_template';

const states = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New_Hampshire',
  'New_Jersey',
  'New_Mexico',
  'New_York',
  'North_Carolina',
  'North_Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode_Island',
  'South_Carolina',
  'South_Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West_Virginia',
  'Wisconsin',
  'Wyoming',
];

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const runAktualizr = async (deviceName) => {
  const command = 'sudo aktualizr -c . once';

  try {
    const { stdout, stderr } = await exec(`cd ${deviceName}/ && ${command}`);
    // console.log(`${deviceName}: ${stdout}`);
    // console.log(`${deviceName}: ${stderr}`);
    await exec('cd ..');
  } catch (error) {
      console.error('error: ', error);
    }
};

const updateConfigFile = (deviceName) => {
  const fileName = `./${deviceName}/${CONFIGURATION_FILE_NAME}`
  const fileData = fs.readFileSync(fileName, 'utf-8');
  const newFileData = fileData.replace('$device_name_tmp', deviceName);
  fs.writeFileSync(fileName, newFileData, 'utf-8');
};

const run = () => {
  console.log('Running script...');
  for (let i = 0; i < DEVICES_COUNT; i++ ) {
    const randomNumber = getRandomInt(0, states.length - 1);
    const ms = moment().format('SSS');
    const deviceName = `${states[randomNumber]}_${ms}${getRandomInt(0, 100000)}`;
    console.log('Creating device: ', deviceName);
    copydir.sync(DEVICE_TEMPLATE_DIR, deviceName);
    updateConfigFile(deviceName);
    runAktualizr(deviceName);
  }
};

run();

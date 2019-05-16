/** @format */

const assets = '/assets/img/whats-new/';

//when you want to add the new notifications just add v2(ot the next number) as the last!! object ob the whatsNew

//name the first slide introduction if you do not want see it in what's new Page

export const getStarted = {
  v1: {
    total: 6,
    slides: {
      introduction: {
        feature: {
          title: '',
          message: 'The workflows for grouping devices and creating campaigns has changed. Would you like to see a short walkthrough of the changes?',
          url: undefined,
          image: undefined,
        },
      },
      provisionDevices: {
        feature: {
          title: 'Step 1: Provision Some Devices',
          message: {
            __html:
              'Before you connect a device to OTA Connect, the device needs some temporary authentication credentials.' +
              '<p>You can download these credentials in the form of a <strong>Provisioning Key</strong>.</p>You install the key on the device and the device can use provisioning key to get more permanent credentials from the OTA Connect server.</p> ' +
              '<p><strong>To download a provisioning key, follow these steps:</strong></p> ' +
              '<ol><li>Open the OTA Connect Portal, open the menu for your user profile and click <strong>Provisioning Keys</strong></li> ' +
              '<li>On the page that appears, click <strong>Add Key</strong>, give the key a name and click <strong>Add key</strong> again.</li> ' +
              '<li>Click the download button <img src="/assets/img/icons/download.svg" alt="Icon"> next to your new key and save the zip file on your computer.</li></ol>' +
              '<p>You‘ll need to copy the zip file to the file system of your device.</p> ' +
              '<p>The next step is to build and run the OTA Client software on your device. </p> ' +
              '<p>There’s two ways to do this:</p>' +
              '<ul><li>The <a href="https://docs.ota.here.com/quickstarts/install-a-client-locally-with-fake-secondaries.html" target="_blank">quick and dirty way </a>which is fine for trying out OTA Connect features</li> ' +
              '<li>The <a href="https://docs.ota.here.com/quickstarts/start-intro.html" target="_blank">“proper” way</a> which can take a while, but is more accurate for testing and production</li></ul>  ' +
              '<p>Either way, you’ll need to leave the comfort of this user interface for a while and get your hands dirty in the Linux command line.</p>' +
              '<p>If your computer doesn’t run a Linux-based operating system, you can download a Linux-based software image and install it in on a virtual machine by using a free tool such as Oracle VM VirtualBox.</p>' +
              '<p>We recommend that you provision more that one test device so that you can practice grouping them.</p>',
          },
          blogImage: {
            src: assets + 'v1/blog/' + 's1-prov.svg',
          },
        },
      },
      findDevices: {
        feature: {
          title: 'Step 2: Find Your Newly Provisioned Devices',
          message: {
            __html:
              'Once you have provisioned your devices, you should see them show up in the OTA Connect user interface.' +
              '<p><strong>To check if your devices have been provisioned properly, follow this step:</strong></p>' +
              '<ul><li>Navigate to the <strong>Devices</strong> page and select the <strong>All Devices</strong> or <strong>Ungrouped Devices</strong> menu items.</li></ul>' +
              '<p>Because we haven‘t created any device groups yet, all your provisioned devices should show up as "ungrouped".</p> ' +
              '<p>Click the name of a device in the main list to see more details for that device</p>' +
              '<p>You‘ll need to copy the zip file to the file system of your device.</p>',
          },
          blogImage: {
            src: assets + 'v1/blog/' + 's2-find.svg',
          },
        },
      },
      groupDevices: {
        feature: {
          title: 'Step 3: Group Your Devices ',
          message: {
            __html:
              'Hopefully you‘ve managed to provision a few devices which should now show up in the OTA Connect user interface.' +
              '<p>You should practice organizing them into groups, because this is how you‘ll organize your vehicle fleet which you move to production.</p>' +
              '<p>There have two types of group, but the <strong>smart group</strong> type is better for organizing large fleets that are constantly changing.</p>' +
              '<p><strong>To create a smart group, follow these steps:</strong></p>' +
              '<ol><li>Open the <strong>Devices</strong> tab and click <strong>+Add group</strong>.</li>' +
              '<li>Select <strong>Smart Group</strong> and click Next.</li>' +
              '<li>In the next window, enter a group name and define a filter for your devices.' +
              '<p>A filter helps OTA Connect assign each vehicle to a fleet. Currently, OTA Connect can filter based on characters in the Device ID — this is usually the VIN number of the connected vehicle.</p> ' +
              '<ul><li>To create a filter, select <strong>Device ID</strong> from the <strong>Data</strong> dropdown.</li>' +
              '<li>In the Filter dropdown, select your filter criteria.' +
              '<p>Since every character in the VIN number has a meaning, we could select <strong>Has character equal to</strong>, enter the letter <strong>M</strong>, and select <strong>in position 10</strong> (the 10th character in a VIN number is usually the model).</p></li>' +
              '<li>OTA Connect will tell you how many devices match this criteria. </li></ul></li>' +
              '<li>Assuming you have devices that match, click <strong>Create</strong> to create your smart group.' +
              '<p>The smart group is „smart“ because any new vehicles that register with OTA Connect will be filtered into this group as long as they also match the filter criteria.</p></li></ol>',
          },
          blogImage: {
            src: assets + 'v1/blog/' + 's3-group.svg',
          },
        },
      },
      uploadSoftare: {
        feature: {
          title: 'Step 4: Upload Some Software Versions',
          message: {
            __html:
              'Now, let‘s upload some software. As with many things in life, there‘s a hard way and an easy way.' +
              '<ul><li>The <strong>easy way</strong> is to upload software files in the OTA Connect user interface.' +
              '<p>This method is fine if you just want to try out the OTA Connection functionality.</p></li>' +
              '<li>The <strong>hard way</strong> is to locally build a filesystem image that is OTA-enabled and already has your software installed.' +
              '<p>During the build process, the filesystem image (with your new software) is automatically uploaded to the software repository on your OTA Connect server. This method is closer to how software gets installed in production.<p>' +
              '<ul><li>For more information about this method, see the <a href="https://docs.ota.here.com/quickstarts/start-intro.html" target="_blank">developer documentation</a>.</li></ul></ul>  ' +
              '<p>However, since this is a Get Started guide, we‘re going to describe the easy way.</p>' +
              '<ol><li>To upload some software, follow these steps:</li>' +
              '<li>In the main menu, click <strong>Software Repository</strong> (this is the OTAConnect software repository).</li>' +
              '<li>Click the <strong>+Add software</strong> button on the top right.</li>' +
              '<li>In the window that appears, enter a <strong>name</strong> for your software, the software<strong> version</strong>, and in the <strong>Hardware id </strong>dropdown, select the type of ECU that your software is intended for.</li>' +
              '<li>Click <strong>Choose File</strong>, browse forthe software file, and click <strong>Add</strong> to upload the software.</li></ol>' +
              '<p>If you want to practice updating software, you might want to repeat this process and upload another version of the file and enter a newer <strong>software version</strong>.</p>' +
              '<p>This way, you have two sets of software. The current version, and the version that you want to upgrade to.</p>',
          },
          blogImage: {
            src: assets + 'v1/blog/' + 's4-software_upload.svg',
          },
        },
      },
      installFirst: {
        feature: {
          title: 'Step 5: Install The First Version of Your Software',
          message: {
            __html:
              'Now that you‘ve uploaded some software, you should install it on a test device.' +
              '<ul><li><strong>Installing</strong> the first version of software is a different process from <strong>updating</strong><span> software. </li>' +
              '<li>However, we can‘t show you how to update software unless the device is already running that software.</li></ul>' +
              '<p>To install the first version of your software on a test device, follow these steps:</p>' +
              '<ol><li>Open the device details that we first looked at in Step 3 </ul>  <li>Navigate to </strong><strong>Devices</strong><span>, select a device group, and select a test device within that group.</li>' +
              '<li>Click the <strong>primary ECU</strong>, and in the <strong>SOFTWARE</strong> section, locate the software that you uploaded in the previous step.' +
              '<ul><li>If you uploaded two versions of the same software, you should see a row for each version that you uploaded.</li></ul></li>' +
              '<li>Click the <strong>first version</strong> that you uploaded.' +
              '<ul><li>In the right-hand <strong>PROPERTIES</strong> panel, you‘ll see more details about the selected software version — the status should be <strong>Not Installed</strong></li></ul>.</li>' +
              '<li>Click the <strong>Install</strong> button at the bottom of the <strong>PROPERTIES</strong> section.' +
              '<ul> <li><span>OTA Connect will remotely install the software on your test device.</li> </ul></li></ol>' +
              '<p>Note that this isn‘t the standard way to install new software in production, but it‘s a simple way to show you how OTA Connect works.</p>' +
              '<p>To learn about installing new software in production, see our <a href="https://docs.ota.here.com/quickstarts/start-intro.html" target="_blank"><strong>developer documentation</strong></a></p>',
          },
          blogImage: {
            src: assets + 'v1/blog/' + 's5-install_device.svg',
          },
        },
      },
      createUpdate: {
        feature: {
          title: 'Step 6: Create a Software Update Unit',
          message: {
            __html:
              'When you create a software update, you need to define two basic „assignment criteria“.' +
              '<ul><li>The <strong>type of ECU</strong> that the software applies to.</li>' +
              '<li>The <strong>current version</strong> of the software that you want update.</li></ul>' +
              '<p><strong>To create a software update, follow these steps:</strong></p>' +
              '<ol><li>Click <strong>Updates</strong>, and in the top right, click <strong>Create Update</strong>.</li>' +
              '<li>In the window that appears, give your update a name and add a brief description.</li>' +
              '<li>In the section <strong>Select Hardware ids</strong>, select the types of ECU that the update should apply to and click <strong>Continue</strong>.</li>  ' +
              '<li>In the next window, define the software version that you want to upgrade <strong>from</strong> and the version that you want to upgrade <strong>to</strong>.' +
              '<ul><li>In the <strong>From</strong> section, open the <strong>Software</strong> dropdown and select the name of your software.' +
              '<ul><li>In the <strong>From</strong> section, open the <strong>Version</strong><span> dropdown and select the software version to upgrade from.</li>' +
              '<li>In the <strong>To</strong> section, open the <strong>Software</strong> dropdown and again select the name of your software.</li>' +
              '<li>In the <strong>To</strong> section, open the <strong>Version</strong> dropdown and select the software version to upgrade to.</li></ul></li></ul></li>' +
              '<li>Click <strong>Save</strong>.</li></ol>' +
              '<p>You might be wondering how to select the vehicle fleet that is supposed to receive this update. </p>' +
              '<p>That step is covered when you create a <strong>Campaign</strong> which we‘ll get to next...</p>',
          },
          blogImage: {
            src: assets + 'v1/blog/' + 's6-create_update.svg',
          },
        },
      },
      createCampaign: {
        feature: {
          title: 'Step 7: Create a Campaign',
          message: {
            __html:
              'When you create a campaign, you select the update that you want to deploy and define how you want to deploy it.' +
              '<p><strong>To create a campaign, follow these steps:</strong></p>' +
              '<ol><li>Click <strong>Campaigns</strong> and click <strong>Create Campaign</strong>.</li>' +
              '<li>In the wizard that appears, enter a campaign name and click <strong>Next</strong>.</li> ' +
              '<li>Select the device groups that you want to deploy the update to.' +
              '<ul><li>In the second step of our Getting Started guide, we showed you how to create a smart group.</li>' +
              '<li>If you created a smart group for a test vehicle fleet, you can select it here.</li>' +
              '<li>Click <strong>Next</strong>.</li></ul></li>' +
              '<li>Select the software update that you created previously and click <strong>Next</strong>. ' +
              '<ul><li>The next few steps are optional for now, so we‘re going to leave them at their default settings. Here‘s a brief explanation of those steps:' +
              '<ul><li><strong>Distribution settings</strong> – Configure the campaign so that end users must consent to the update. You can define your own notification text for the end user to read.</li>' +
              '<li><strong>Dependencies Management</strong> – Configure the campaign to check for required software dependencies before installing the update.</li>' +
              '<li><strong>Programming Sequencer</strong> – Configure the sequence in which each piece of software is installed. You can also configure some rollback behavior in case any piece of software failed to install.</li></ul></li></ul></li>' +
              '<li>Click <strong>Next</strong> until you get to the <strong>Summary</strong> step, then click <strong>Launch</strong>.</li></ol>',
          },
          blogImage: {
            src: assets + 'v1/blog/' + 's7-create_campaign.svg',
          },
        },
      },
      campaignMonitor: {
        feature: {
          title: 'Step 8: Monitor Your Campaign',
          message: {
            __html:
              'After you launch a campaign you can open the <strong>Campaign Details</strong> to monitor the progress of the campaign and look for any installation issues.' +
              '<p><strong>To see the Campaign Details, follow these steps:</strong></p>' +
              '<ol><li>Click </span><strong>Campaigns</strong> and click a status tab.' +
              '<ul><li>Assuming your campaign is still running you would click the <strong>Running</strong> tab.</li>' +
              '<li>If your campaign is a test campaign, it might finish quickly, in which case, you‘ll find it on the <strong> Finished</strong> tab</li></ul></li>' +
              '<li>In the campaign list, click your campaign.' +
              '<p>You should see the progress details for your campaign.</p>' +
              '<p>You‘ll see a summary of all the update attempts for each device grouped by status:</p>' +
              '<ul><li><strong>Success</strong> indicates the number of devices where the software was successfully updated.</li>' +
              '<li><strong>Queued </strong>indicates the number of devices that are still waiting to be updated.' +
              '<ul><li>These devices might be offline or the OTA Connect server is waiting until a previous batch of updates has completed.</li></ul></li>' +
              '<li><strong>Failure</strong> indicates the number of devices where the update attempt failed.' +
              '<ul><li>If there are update failures, the campaign details include a breakdown by individual failure code.</li>' +
              '<li>To get a list of individual devices affected by the failure code, click the Export <img src="/assets/img/icons/download.svg" alt="Icon"> button next to the relevant failure code.</li></ul></li>' +
              '<li><strong>Not Processed </strong>indicates devices that weren‘t processed by the OTA Connect server for some strange reason.</li>' +
              '<li><strong>Not Impacted </strong>indicates devices that were targeted by the campaign by were ignored because they did not match the criteria of the selected update.</li>' +
              '<ul><li>A common cause for this status is when the device is not running the same version of the software that is defined in the <strong>From</strong> criteria of the update.</li></ul>' +
              '<li><strong>Canceled</strong> indicates updates that were canceled either on the device itself or from the device details page of an individual device.</li></ul>',
          },
          blogImage: {
            src: assets + 'v1/blog/' + 's8-monitor_campaign.svg',
          },
        },
      },
      deviceHistory: {
        feature: {
          title: 'Step 9: Review the Update History on an Individual Device ',
          message: {
            __html:
              'At some point you might need to assist a specific customer who is having trouble with the software on their vehicle.' +
              '<p>In this case, your customer support team can use the VIN number of the vehicle to find the device in OTA Connect. Then, they can inspect an individual device to get more details about the problem.</p>' +
              '<p><strong>To see the update history for an individual device, follow these steps:</strong></p>' +
              '<ol><li>Open the device details:' +
              '<ul><li>Navigate to the <strong>Devices</strong> page.</li>' +
              '<li>Search for the affected device by entering the VIN number in the search box.</li>' +
              '<li>Click the device name to open the device details.</li></ul></li>' +
              '<li>If it isn‘t open already, click the <strong>History</strong> tab.' +
              '<p>On this tab, you can see all the updates that were performed on the device. If applicable, you also see the campaign that the update was associated with. Note that it‘s possible to update a single device, so updates don‘t always have an associated campaign.</p>' +
              '<p>Failed updates are indicated in red with the failure code that the device reported.</p></li></ol>',
          },
          blogImage: {
            src: assets + 'v1/blog/' + 's9-device_history.svg',
          },
        },
      },
      impactAnalysis: {
        feature: {
          title: 'Troubleshooting: Impact Analysis',
          message: {
            __html:
              '<p>After you upload and deploy software, you might receive reports that a particular software version has a defect. Eventually, you‘ll need to deploy a recall campaign to update the affected devices.</p>' +
              '<p>In the short term, you‘ll want to prevent anyone else from installing the defective software in another software update. You do this by blacklisting the software.</p>' +
              '<p>If you‘ve blacklisted some software, you can see how many devices or vehicles are impacted by the defective software.</p>' +
              '<p><strong>To blacklist a piece of software, follow these steps:</strong></p>' +
              '<ol><li>Navigate to the <strong>Devices</strong> page.</li>' +
              '<li>Search for a device that you know is running the defective software and open the device details for that device</li>' +
              '<li>In the HARDWARE section, locate the primary ECU and click the info icon <img src="/assets/img/icons/black/info.svg" alt="Icon">.</li>' +
              '<li>In the window that appears, click the <strong>Packages</strong> tab and use the search box to filter for the defective software version.</li>' +
              '<li>Click the blacklist icon <img src="/assets/img/icons/ban_grey.png" alt="Icon"> next to the version number.</li></ol>' +
              '<p><strong>To see the impact of blacklisted software, open the Impact analysis page:</strong><p>' +
              '<ul><li>In the left-hand pane, you can see the total number of devices that are running the defective software package.</li>' +
              '<li>The main graph shows you the proportion of devices running the blacklisted software package in relation to all devices running any kind of blacklisted software.</li>' +
              '<li>For example:<ul><li>Suppose that you have 18 devices running the blacklisted software "IVI-Bluetooth_V2-1". </li>' +
              '<li>In total, you have 33 devices running some kind of blacklisted software.</li>' +
              '<li>That means, out of ll the devices that are running blacklisted software, 54% are running the blacklisted software "IVI-Bluetooth_V2-1".</li></ul></li></ul>',
          },
          blogImage: {
            src: assets + 'v1/blog/' + 's10-impact_analysis.svg',
          },
        },
      },
    },
  },
};

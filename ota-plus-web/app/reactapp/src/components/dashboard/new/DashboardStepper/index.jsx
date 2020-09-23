import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useObserver } from 'mobx-react';
import { useStores } from '../../../../stores/hooks';
import DashboardStepperCard from './DashboardStepperCard';
import { CardsWrapper, Step, StepperWrapper, Stepper } from './styled';
import { ICON_PATHS, isFeatureEnabled, UI_FEATURES } from '../../../../config';
import { ANT_STEP_STATUS, STEP_STATUS, STEP_TYPES } from '../../../../constants';
import {
  URL_STEPPER_CAMPAIGNS_CTA,
  URL_STEPPER_CAMPAIGNS_DOCS,
  URL_STEPPER_DEVICES_CTA_BUTTON,
  URL_STEPPER_DEVICES_CTA_LINK,
  URL_STEPPER_DEVICES_DOCS,
  URL_STEPPER_GROUPS_CTA,
  URL_STEPPER_GROUPS_DOCS,
  URL_STEPPER_SOFTWARE_CTA,
  URL_STEPPER_SOFTWARE_DOCS,
  URL_STEPPER_UPDATES_CTA,
  URL_STEPPER_UPDATES_DOCS
} from '../../../../constants/urlConstants';
import {
  OTA_HOME_PROVISION_DEVICES,
  OTA_HOME_UPLOAD_SOFTWARE,
  OTA_HOME_CREATE_GROUP,
  OTA_HOME_CREATE_UPDATE,
  OTA_HOME_CREATE_CAMPAIGN,
  OTA_HOME_ALL_DEVICES,
  OTA_HOME_ALL_SOFTWARE,
  OTA_HOME_ALL_GROUPS,
  OTA_HOME_ALL_UPDATES,
  OTA_HOME_ALL_CAMPAIGNS,
  OTA_HOME_READ_MORE_DEVICE,
  OTA_HOME_READ_MORE_SOFTWARE,
  OTA_HOME_READ_MORE_GROUP,
  OTA_HOME_READ_MORE_UPDATE,
  OTA_HOME_READ_MORE_CAMPAIGN,
} from '../../../../constants/analyticsActions';

export const getStepStatus = (activeCondition, doneCondition) => {
  if (doneCondition) {
    return STEP_STATUS.DONE;
  }
  if (activeCondition) {
    return STEP_STATUS.ACTIVE;
  }
  return STEP_STATUS.INACTIVE;
};

export const calcStepIconStatus = (status) => {
  switch (status) {
    case STEP_STATUS.ACTIVE:
      return ANT_STEP_STATUS.PROCESS;
    case STEP_STATUS.DONE:
      return ANT_STEP_STATUS.DONE;
    default:
      return ANT_STEP_STATUS.WAIT;
  }
};

function useStoreData() {
  const { stores } = useStores();
  return useObserver(() => ({
    campaignsTotal: stores.campaignsStore.campaignsTotal,
    campaignsWithErrorsTotal: stores.campaignsStore.campaignsWithErrorsTotal,
    devicesTotalCount: stores.devicesStore.devicesTotalCount,
    notSeenRecentlyDevicesTotal: stores.devicesStore.notSeenRecentlyDevicesTotal,
    ungroupedDevicesTotal: stores.devicesStore.ungroupedDevicesTotal,
    groupsTotal: stores.groupsStore.groupsTotal,
    versionsTotal: stores.softwareStore.versionsTotal,
    uiFeatures: stores.userStore.uiFeatures,
    updatesTotalCount: stores.updatesStore.updatesTotalCount,
  }));
}

const DashboardStepper = () => {
  const { t } = useTranslation();
  const {
    devicesTotalCount,
    notSeenRecentlyDevicesTotal,
    ungroupedDevicesTotal,
    versionsTotal,
    groupsTotal,
    updatesTotalCount,
    campaignsTotal,
    campaignsWithErrorsTotal,
    uiFeatures
  } = useStoreData();

  const LINKS_DATA = [
    {
      ctaButton: URL_STEPPER_DEVICES_CTA_BUTTON,
      ctaLink: URL_STEPPER_DEVICES_CTA_LINK,
      docs: URL_STEPPER_DEVICES_DOCS,
      ctaButtonActionType: OTA_HOME_PROVISION_DEVICES,
      ctaLinkActionType: OTA_HOME_ALL_DEVICES,
      docsActionType: OTA_HOME_READ_MORE_DEVICE
    },
    {
      ctaButton: URL_STEPPER_SOFTWARE_CTA,
      ctaLink: URL_STEPPER_SOFTWARE_CTA,
      docs: URL_STEPPER_SOFTWARE_DOCS,
      tooltip: t('dashboard.stepper.tooltip-1'),
      ctaButtonActionType: OTA_HOME_UPLOAD_SOFTWARE,
      ctaLinkActionType: OTA_HOME_ALL_SOFTWARE,
      docsActionType: OTA_HOME_READ_MORE_SOFTWARE
    },
    {
      ctaButton: URL_STEPPER_GROUPS_CTA,
      ctaLink: URL_STEPPER_GROUPS_CTA,
      docs: URL_STEPPER_GROUPS_DOCS,
      tooltip: t('dashboard.stepper.tooltip-1'),
      ctaButtonActionType: OTA_HOME_CREATE_GROUP,
      ctaLinkActionType: OTA_HOME_ALL_GROUPS,
      docsActionType: OTA_HOME_READ_MORE_GROUP
    },
    {
      ctaButton: URL_STEPPER_UPDATES_CTA,
      ctaLink: URL_STEPPER_UPDATES_CTA,
      docs: URL_STEPPER_UPDATES_DOCS,
      tooltip: t('dashboard.stepper.tooltip-2'),
      ctaButtonActionType: OTA_HOME_CREATE_UPDATE,
      ctaLinkActionType: OTA_HOME_ALL_UPDATES,
      docsActionType: OTA_HOME_READ_MORE_UPDATE
    },
    {
      ctaButton: URL_STEPPER_CAMPAIGNS_CTA,
      ctaLink: URL_STEPPER_CAMPAIGNS_CTA,
      docs: URL_STEPPER_CAMPAIGNS_DOCS,
      tooltip: t('dashboard.stepper.tooltip-3'),
      ctaButtonActionType: OTA_HOME_CREATE_CAMPAIGN,
      ctaLinkActionType: OTA_HOME_ALL_CAMPAIGNS,
      docsActionType: OTA_HOME_READ_MORE_CAMPAIGN
    }
  ];

  const generateStepData = (index, primaryStatValue, secondaryStatValue) => ({
    buttonTitle: t(`dashboard.stepper.step-${index}.action`),
    description: t(`dashboard.stepper.step-${index}.desc`),
    descriptionDone: secondaryStatValue !== null
      ? <Trans i18nKey={`dashboard.stepper.step-${index}.desc-done`} count={secondaryStatValue} />
      : '',
    iconPath: ICON_PATHS[index],
    id: `${STEP_TYPES[index]}-card`,
    links: LINKS_DATA[index],
    statValue: primaryStatValue,
    title: t(`dashboard.stepper.step-${index}.title`),
  });

  const devicesStepStatus = devicesTotalCount ? STEP_STATUS.DONE : STEP_STATUS.ACTIVE;
  const softwareStepStatus = getStepStatus(devicesStepStatus === STEP_STATUS.DONE, versionsTotal);
  const groupsStepStatus = getStepStatus(devicesStepStatus === STEP_STATUS.DONE, groupsTotal);
  const updatesStepStatus = getStepStatus(softwareStepStatus === STEP_STATUS.DONE, updatesTotalCount);
  const campaignsStepStatus = getStepStatus(
    devicesStepStatus === STEP_STATUS.DONE
    && softwareStepStatus === STEP_STATUS.DONE
    && groupsStepStatus === STEP_STATUS.DONE
    && updatesStepStatus === STEP_STATUS.DONE,
    campaignsTotal
  );

  const steps = [
    {
      primaryStatValue: devicesTotalCount,
      secondaryStatValue: notSeenRecentlyDevicesTotal,
      status: devicesStepStatus,
      isActionEnabled: isFeatureEnabled(uiFeatures, UI_FEATURES.ACCESS_CREDS)
    },
    {
      primaryStatValue: versionsTotal,
      secondaryStatValue: null,
      status: softwareStepStatus,
      isActionEnabled: isFeatureEnabled(uiFeatures, UI_FEATURES.UPLOAD_SOFTWARE)
    },
    {
      primaryStatValue: groupsTotal,
      secondaryStatValue: ungroupedDevicesTotal,
      status: groupsStepStatus,
      isActionEnabled: isFeatureEnabled(uiFeatures, UI_FEATURES.CREATE_DEVICE_GROUP)
    },
    {
      primaryStatValue: updatesTotalCount,
      secondaryStatValue: null,
      status: updatesStepStatus,
      isActionEnabled: isFeatureEnabled(uiFeatures, UI_FEATURES.CREATE_SOFTWARE_UPDATE)
    },
    {
      primaryStatValue: campaignsTotal,
      secondaryStatValue: campaignsWithErrorsTotal,
      status: campaignsStepStatus,
      isActionEnabled: isFeatureEnabled(uiFeatures, UI_FEATURES.CREATE_CAMPAIGN)
    }
  ];

  return (
    <StepperWrapper id="stepper-wrapper">
      <Stepper>
        {steps.map((step, index) => (
          <Step
            key={`step-${index}`}
            status={calcStepIconStatus(step.status)}
          />
        ))}
      </Stepper>
      <CardsWrapper>
        {steps.map(({ primaryStatValue, secondaryStatValue, status, isActionEnabled }, index) => {
          const {
            id,
            iconPath,
            description,
            descriptionDone,
            ...rest
          } = generateStepData(index, primaryStatValue, secondaryStatValue);

          return (
            <DashboardStepperCard
              key={id}
              id={id}
              iconPath={iconPath}
              showActionBtn={isActionEnabled}
              status={status}
              description={status === STEP_STATUS.DONE ? descriptionDone : description}
              {...rest}
            />
          );
        })}
      </CardsWrapper>
    </StepperWrapper>
  );
};

export default DashboardStepper;

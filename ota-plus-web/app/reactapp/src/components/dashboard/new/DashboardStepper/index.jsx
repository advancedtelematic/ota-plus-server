import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useObserver } from 'mobx-react';
import { useStores } from '../../../../stores/hooks';
import DashboardStepperCard from './DashboardStepperCard';
import { CardsWrapper, Step, StepperWrapper, Stepper } from './styled';
import { ICON_PATHS } from '../../../../config';
import { ANT_STEP_STATUS, STEP_STATUS, STEP_TYPES } from '../../../../constants';
import {
  URL_STEPPER_CAMPAIGNS_CTA,
  URL_STEPPER_CAMPAIGNS_DOCS,
  URL_STEPPER_DEVICES_CTA,
  URL_STEPPER_DEVICES_DOCS,
  URL_STEPPER_GROUPS_CTA,
  URL_STEPPER_GROUPS_DOCS,
  URL_STEPPER_SOFTWARE_CTA,
  URL_STEPPER_SOFTWARE_DOCS,
  URL_STEPPER_UPDATES_CTA,
  URL_STEPPER_UPDATES_DOCS
} from '../../../../constants/urlConstants';
import {
  OTA_HOME_ADD_SHARED_CREDENTIALS,
  OTA_HOME_ADD_SOFTWARE,
  OTA_HOME_CREATE_GROUP,
  OTA_HOME_CREATE_UPDATE,
  OTA_HOME_CREATE_CAMPAIGN,
  OTA_HOME_READ_DEVICE,
  OTA_HOME_READ_SOFTWARE,
  OTA_HOME_READ_GROUP,
  OTA_HOME_READ_UPDATE,
  OTA_HOME_READ_CAMPAIGN,
} from '../../../../constants/analyticsActions';

export const getStepStatus = (activeCondition, doneCondition) => {
  if (activeCondition) {
    if (doneCondition) {
      return STEP_STATUS.DONE;
    }
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
    campaignsWithErrorsTotal
  } = useStoreData();

  const LINKS_DATA = [
    {
      cta: URL_STEPPER_DEVICES_CTA,
      docs: URL_STEPPER_DEVICES_DOCS,
      ctaActionType: OTA_HOME_ADD_SHARED_CREDENTIALS,
      docsActionType: OTA_HOME_READ_DEVICE
    },
    {
      cta: URL_STEPPER_SOFTWARE_CTA,
      docs: URL_STEPPER_SOFTWARE_DOCS,
      tooltip: t('dashboard.stepper.tooltip-1'),
      ctaActionType: OTA_HOME_ADD_SOFTWARE,
      docsActionType: OTA_HOME_READ_SOFTWARE
    },
    {
      cta: URL_STEPPER_GROUPS_CTA,
      docs: URL_STEPPER_GROUPS_DOCS,
      tooltip: t('dashboard.stepper.tooltip-1'),
      ctaActionType: OTA_HOME_CREATE_GROUP,
      docsActionType: OTA_HOME_READ_GROUP
    },
    {
      cta: URL_STEPPER_UPDATES_CTA,
      docs: URL_STEPPER_UPDATES_DOCS,
      tooltip: t('dashboard.stepper.tooltip-2'),
      ctaActionType: OTA_HOME_CREATE_UPDATE,
      docsActionType: OTA_HOME_READ_UPDATE
    },
    {
      cta: URL_STEPPER_CAMPAIGNS_CTA,
      docs: URL_STEPPER_CAMPAIGNS_DOCS,
      tooltip: t('dashboard.stepper.tooltip-3'),
      ctaActionType: OTA_HOME_CREATE_CAMPAIGN,
      docsActionType: OTA_HOME_READ_CAMPAIGN
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
    groupsStepStatus === STEP_STATUS.DONE && updatesStepStatus === STEP_STATUS.DONE,
    campaignsTotal
  );

  const steps = [
    {
      primaryStatValue: devicesTotalCount,
      secondaryStatValue: notSeenRecentlyDevicesTotal,
      status: devicesStepStatus
    },
    {
      primaryStatValue: versionsTotal,
      secondaryStatValue: null,
      status: softwareStepStatus
    },
    {
      primaryStatValue: groupsTotal,
      secondaryStatValue: ungroupedDevicesTotal,
      status: groupsStepStatus
    },
    {
      primaryStatValue: updatesTotalCount,
      secondaryStatValue: null,
      status: updatesStepStatus
    },
    {
      primaryStatValue: campaignsTotal,
      secondaryStatValue: campaignsWithErrorsTotal,
      status: campaignsStepStatus
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
        {steps.map(({ primaryStatValue, secondaryStatValue, status }, index) => {
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

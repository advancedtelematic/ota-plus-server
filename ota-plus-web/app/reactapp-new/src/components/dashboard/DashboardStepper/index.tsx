import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  AppState,
  ICampaignsState,
  IDevicesState,
  ISoftwareState,
  IUpdatesState,
  CampaignsActions,
  DevicesActions,
  SoftwareActions,
  UpdatesActions
} from '../../../store';

import DashboardStepperCard, { CardType, Props as StepProps, StepStatus } from './DashboardStepperCard';
import { CardsWrapper, Step, StepperWrapper, Stepper } from './styled';

type CardData = {
  primaryStatValue: number,
  secondaryStatValue?: number
};

type Props = {
  campaigns: ICampaignsState,
  devices: IDevicesState,
  software: ISoftwareState,
  updates: IUpdatesState,
  setAllCampaignsRequest: typeof CampaignsActions.setAllCampaignsRequest,
  setAllDevicesRequest: typeof DevicesActions.setAllDevicesRequest,
  setAllSoftwareRequest: typeof SoftwareActions.setAllSoftwareRequest,
  setAllUpdatesRequest: typeof UpdatesActions.setAllUpdatesRequest
};

const StepIcons = ['devices', 'softwareVersion', 'deviceGroup', 'softwareUpdates', 'campaigns'];

const calculateCurrentStep = (totals: number[]): number => totals.indexOf(0) !== -1 ? totals.indexOf(0) : totals.length;

const calculateStatus = (currentStep: number, statValue: number, index: number): StepStatus => {
  if (currentStep > index) {
    return 'done';
  }
  if (currentStep === index) {
    return 'active';
  }
  return statValue === 0 ? 'inactive' : 'done';
};

export const DashboardStepper = ({
  setAllCampaignsRequest,
  setAllDevicesRequest,
  setAllSoftwareRequest,
  setAllUpdatesRequest,
  campaigns,
  devices,
  software,
  updates
}: Props) => {
  const { t } = useTranslation();

  useEffect(
    () => {
      setAllCampaignsRequest();
      setAllDevicesRequest();
      setAllSoftwareRequest();
      setAllUpdatesRequest();
    },
    []
  );

  const generateStepData = (index: number, primaryStatValue: number, secondaryStatValue?: number): StepProps => ({
    id: `${StepIcons[index]}-card`,
    status: primaryStatValue === 0 ? 'inactive' : 'done',
    type: StepIcons[index] as CardType,
    title: t(`dashboard.stepper.step-${index}.title`),
    description: t(`dashboard.stepper.step-${index}.desc`),
    descriptionDone: t(`dashboard.stepper.step-${index}.desc-done`, { count: secondaryStatValue }),
    statValue: primaryStatValue,
    buttonTitle: t(`dashboard.stepper.step-${index}.action`),
  });

  const steps: CardData[] = [
    {
      primaryStatValue: devices.total,
      secondaryStatValue: devices.totalUnconnected
    },
    {
      primaryStatValue: software.versionsTotal,
      secondaryStatValue: 0
    },
    {
      primaryStatValue: devices.deviceGroupsTotal,
      secondaryStatValue: devices.totalUngrouped
    },
    {
      primaryStatValue: updates.total,
      secondaryStatValue: 0
    },
    {
      primaryStatValue: campaigns.total,
      secondaryStatValue: campaigns.totalWithError
    }
  ];

  /*
   *  The order of supplied data is important!
   */

  const currentStep = calculateCurrentStep([
    devices.total,
    software.versionsTotal,
    devices.deviceGroupsTotal,
    updates.total,
    campaigns.total
  ]);

  return (
    <StepperWrapper id="stepper-wrapper">
      <Stepper>
        {steps.map((step, index) => (
          <Step key={`step-${index}`} status={currentStep === index ? 'process' : 'wait'} />
        ))}
      </Stepper>
      <CardsWrapper>
        {steps.map(({ primaryStatValue, secondaryStatValue }, index) => {
          const {
            id,
            status,
            description,
            descriptionDone,
            ...rest
          } = generateStepData(index, primaryStatValue, secondaryStatValue);

          return (
            <DashboardStepperCard
              key={id}
              id={id}
              status={calculateStatus(currentStep, primaryStatValue, index)}
              description={
                status === 'done'
                  ? descriptionDone
                  : description
              }
              {...rest}
            />
          );
        })}
      </CardsWrapper>
    </StepperWrapper>
  );
};

const mapStateToProps = (state: AppState) => ({
  campaigns: state.campaigns,
  devices: state.devices,
  software: state.software,
  updates: state.updates
});

const mapDispatchToProps = {
  setAllCampaignsRequest: CampaignsActions.setAllCampaignsRequest,
  setAllDevicesRequest: DevicesActions.setAllDevicesRequest,
  setAllSoftwareRequest: SoftwareActions.setAllSoftwareRequest,
  setAllUpdatesRequest: UpdatesActions.setAllUpdatesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardStepper);

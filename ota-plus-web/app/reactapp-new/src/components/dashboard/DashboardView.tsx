import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Title } from '../common';
import DashboardStepper from './DashboardStepper';
import DocsLinks from './DocsLinks';
import BuildTeam from './BuildTeam';
import RecentlyCreated from './RecentlyCreated';

const Dashboard = styled.div`
  max-width: 1440px;
  margin: 0 auto;
`;

const HelpSectionWrapper = styled.div`
  flex: 28.5%;
  & > div:not(:last-of-type) {
    margin-bottom: 20px;
  }
`;

const RecentlyCreatedWrapper = styled.div`
  flex: 69%;
  margin-right: 20px;
`;

const SplitWrapper = styled.div`
  display: flex;
  margin-top: 20px;
`;

export const DashboardView = () => {
  const { t } = useTranslation();

  return (
    <Dashboard id="dashboard-view">
      <Title size="large">{t('dashboard.title')}</Title>
      <DashboardStepper />
      <SplitWrapper>
        <RecentlyCreatedWrapper>
          <RecentlyCreated />
        </RecentlyCreatedWrapper>
        <HelpSectionWrapper>
          <DocsLinks />
          <BuildTeam />
        </HelpSectionWrapper>
      </SplitWrapper>
    </Dashboard>
  );
};

export default DashboardView;

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { useTranslation, UseTranslationResponse } from 'react-i18next';
import { Container, Title, List, Icon, IconTheme, Select } from '../../common';
import { Actions } from '../../../store/feed/actions';
import { AppState } from '../../../store';
import { FeedData } from '../../../store/feed/types';
import { getFeeds } from '../../../store/feed/selectors';
import {
  StyledIcon, StyledSelectIcon, DataHeader, DataDesc, DateElement, SelectElement,
  ShowElement, EmptyList, SelectedElements, SelectedItem, SelectedCloseItem
} from './styled';

type Props = {
  feed: FeedData[];
  getFeedData: typeof Actions.getFeedData
};

const iconMappings: Record<string, string> = {
  campaign: 'campaigns',
  device: 'devices',
  device_group: 'deviceGroup',
  software: 'softwareVersion',
  update: 'softwareUpdates'
};

const RecentlyCreated = (props: Props) => {
  const { t }: UseTranslationResponse = useTranslation();
  const [state, setState] = useState<{ selected: string[] }>({ selected: [] });
  const { feed, getFeedData } = props;

  useEffect(
    () => {
      getFeedData(state.selected);
    },
    []
  );

  const columns = [
    {
      title: '',
      row: ({ type }: FeedData) => (<><StyledIcon type={iconMappings[type]} /></>),
      width: 30,
      textPosition: 'centered'
    },
    {
      title: 'NAME',
      row: ({ name, supplementaryText }: FeedData) => (
        <>
          <DataHeader>{name}</DataHeader>
          <DataDesc>{supplementaryText || name}</DataDesc>
        </>
      ),
      width: 200,
      textPosition: 'top'
    },
    {
      title: 'DATE',
      row: ({ createdAt }: FeedData) => (
        <>
          <DateElement>{moment(createdAt).format('DD MMMM YYYY   h:mm')}</DateElement>
        </>
      ),
      width: 150,
      textPosition: 'top'
    }
  ];

  const selectOptions = [
    {
      value: 'device',
      row: () => (
        <span><StyledSelectIcon type="devices" />{t('dashboard.recently-created.select-list.devices')}</span>
      )
    },
    {
      value: 'device_group',
      row: () => (
        <span><StyledSelectIcon type="deviceGroup" />{t('dashboard.recently-created.select-list.device-groups')}</span>
      )
    },
    {
      value: 'software',
      row: () => (
        <span><StyledSelectIcon type="softwareVersion" />{t('dashboard.recently-created.select-list.software')}</span>
      )
    },
    {
      value: 'update',
      row: () => (
        <span><StyledSelectIcon type="softwareUpdates" />{t('dashboard.recently-created.select-list.updates')}</span>
      )
    },
    {
      value: 'campaign',
      row: () => (
        <span><StyledSelectIcon type="campaigns" />{t('dashboard.recently-created.select-list.campaigns')}</span>
      )
    }
  ];

  const handleOnSelect = (selected: string[]) => {
    getFeedData(selected);
    setState({ selected });
  };

  const handleOnRemove = (type: string) => () => {
    const { selected } = state;
    const property = selected.indexOf(type);
    if (property !== -1) {
      selected.splice(property, 1);
    }
    getFeedData(selected);
    setState({ selected });
  };

  return (
    <Container>
      <Title>{t('dashboard.recently-created.title')}</Title>
      <SelectElement>
        <ShowElement disabled={!feed.length}>{t('dashboard.recently-created.show')}</ShowElement>
        <Select
          disabled={!feed.length}
          dropdownWidth="250px"
          multiple={true}
          options={selectOptions}
          onSelect={handleOnSelect}
          placeholder={t('dashboard.recently-created.select-list.placeholder')}
          selected={state.selected}
          width="200px"
        />
      </SelectElement>
      {state.selected.length !== 0 && (
        <SelectedElements>
          {state.selected.map((selection: string, index) => (
            <SelectedItem key={`selected-item-${index}`}>
              {t(`dashboard.recently-created.${selection}`)}
              <SelectedCloseItem type="close" colorTheme={IconTheme.aqua} onClick={handleOnRemove(selection)} />
            </SelectedItem>
          ))}
        </SelectedElements>
      )}
      {feed.length
        ? <List<FeedData> columns={columns} items={feed} headerTheme="dark" />
        : <EmptyList>{t('dashboard.recently-created.empty')}</EmptyList>
      }
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  feed: getFeeds(state),
});

const mapDispatchToProps = {
  getFeedData: Actions.getFeedData
};

export default connect(mapStateToProps, mapDispatchToProps)(RecentlyCreated);

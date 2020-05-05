import React, { useEffect, useState } from 'react';
import { Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';
import { useObserver } from 'mobx-react';
import {
  ButtonStyled,
  ButtonText,
  DropdownIcon,
  FilterTitle,
  ListDate,
  ListDescription,
  ListIcon,
  ListItem,
  ListNoDataContainer,
  ListNoDataDescription,
  ListNoDataIcon,
  ListNoDataWrapper,
  ListStyled,
  ListTitle,
  MenuCheckbox,
  MenuItemStyled,
  MenuSelectedLength,
  MenuStyled,
  RecentActivityWrapper,
  RightContainer,
  Title,
  TopContainer
} from './styled';
import { NO_ITEMS_ICON } from '../../../../config';
import {
  getDeviceGroupListIcon,
  getListDescription,
  getListIcon,
  sendFilterLatestAction
} from '../../../../helpers/recentActivityHelper';
import { ACTIVITIES_TYPE } from '../../../../constants';
import { useStores } from '../../../../stores/hooks';
import { Loader } from '../../../../partials';
import { getLanguage } from '../../../../helpers/languageHelper';
import UnderlinedLink from '../../../../partials/UnderlinedLink';
import { URL_PROVISIONING_CREDS } from '../../../../constants/urlConstants';

const MENU_ITEMS = [
  { type: ACTIVITIES_TYPE.DEVICE, title: 'dashboard.recent-activity.filter-menu.item-devices' },
  { type: ACTIVITIES_TYPE.SOFTWARE_VERSION, title: 'dashboard.recent-activity.filter-menu.item-software-versions' },
  { type: ACTIVITIES_TYPE.DEVICE_GROUP, title: 'dashboard.recent-activity.filter-menu.item-device-groups' },
  { type: ACTIVITIES_TYPE.SOFTWARE_UPDATE, title: 'dashboard.recent-activity.filter-menu.item-software-updates' },
  { type: ACTIVITIES_TYPE.CAMPAIGN, title: 'dashboard.recent-activity.filter-menu.item-campaigns' }
];

const filterMenu = (t, menuItemsSelected, handleMenuChange) => (
  <MenuStyled id="recent-activity-filter-menu" onClick={handleMenuChange}>
    {MENU_ITEMS.map((item, index) => (
      <MenuItemStyled id={`recent-activity-filter-menu-item-${index}`} key={`${index}`}>
        <MenuCheckbox id={`recent-activity-filter-menu-item-checkbox-${index}`} checked={menuItemsSelected[index]} />
        {t(MENU_ITEMS[index].title)}
      </MenuItemStyled>
    ))}
  </MenuStyled>
);

function useStoreData() {
  const { stores } = useStores();
  return useObserver(() => ({
    isFetching: stores.recentlyCreatedStore.recentlyCreatedFetchAsync.isFetching,
    itemsTotalCount: stores.devicesStore.devicesTotalCount + stores.softwareStore.versionsTotal,
    recentlyCreatedItems: stores.recentlyCreatedStore.recentlyCreatedItems
  }));
}

const RecentActivity = () => {
  const [menuItemsSelected, setMenuItemsSelected] = useState(MENU_ITEMS.map(() => true));
  const [menuSelectedLength, setMenuSelectedLength] = useState(MENU_ITEMS.length);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const { isFetching, itemsTotalCount, recentlyCreatedItems } = useStoreData();
  const { t } = useTranslation();
  const { stores } = useStores();
  const handleMenuChange = (event) => {
    const key = parseInt(event.key, 10);
    menuItemsSelected[key] = !menuItemsSelected[key];
    const menuItemType = MENU_ITEMS[key].type;
    sendFilterLatestAction(menuItemType, menuItemsSelected[key]);
    setMenuItemsSelected(menuItemsSelected);
    const selectedLength = menuItemsSelected.filter(item => item).length;
    setMenuSelectedLength(selectedLength);
    const selectedItems = MENU_ITEMS.filter((item, index) => menuItemsSelected[index]);
    const params = selectedItems.map(item => item.type);
    stores.recentlyCreatedStore.fetchRecentlyCreated(params);
  };

  useEffect(() => {
    stores.recentlyCreatedStore.updateRecentlyCreatedItems();
  }, [getLanguage()]);

  return (
    <RecentActivityWrapper id="recent-activity-wrapper" empty={recentlyCreatedItems.length === 0}>
      <TopContainer id="recent-activity-top-container">
        <Title id="docs-links-title">{t('dashboard.recent-activity.title')}</Title>
        {itemsTotalCount > 0 && (
          <RightContainer>
            <FilterTitle id="recent-activity-filter-title">
              {t('dashboard.recent-activity.filter-menu.title')}
            </FilterTitle>
            <Dropdown
              id="recent-activity-filter-dropdown"
              onVisibleChange={(visible) => {
                setFilterMenuVisible(visible);
              }}
              overlay={filterMenu(t, menuItemsSelected, handleMenuChange)}
            >
              <ButtonStyled id="recent-activity-filter-button">
                <ButtonText>{t('dashboard.recent-activity.filter-menu.type')}</ButtonText>
                <MenuSelectedLength>{menuSelectedLength}</MenuSelectedLength>
                <DropdownIcon type={filterMenuVisible ? 'up' : 'down'} />
              </ButtonStyled>
            </Dropdown>
          </RightContainer>
        )}
      </TopContainer>
      {recentlyCreatedItems.length && itemsTotalCount > 0 && !isFetching ? (
        <ListStyled
          id="recent-activity-list"
          dataSource={recentlyCreatedItems}
          renderItem={({ date, title, type, groupType }, index) => (
            <ListItem id={`recent-activity-list-item-${index}`} key={index}>
              <ListIcon
                src={type === ACTIVITIES_TYPE.DEVICE_GROUP
                  ? getDeviceGroupListIcon(groupType)
                  : getListIcon(type)
                }
              />
              <div>
                <ListTitle>{title}</ListTitle>
                <ListDescription>{getListDescription(t, type)}</ListDescription>
              </div>
              <ListDate>{date}</ListDate>
            </ListItem>
          )}
        />
      ) : (
        <ListNoDataWrapper id="recent-activity-no-data-wrapper">
          <ListNoDataContainer id="recent-activity-no-data-container">
            {isFetching ? <Loader id="recent-activity-no-data-loader" /> : (
              <div>
                <ListNoDataIcon src={NO_ITEMS_ICON} />
                <ListNoDataDescription id="recent-activity-no-data-description">
                  { itemsTotalCount === 0
                    ? (
                      <>
                        <span>{t('dashboard.recent-activity.no-data.nothing-created-1')}</span>
                        <span>
                          {t('dashboard.recent-activity.no-data.nothing-created-2')}
                          <UnderlinedLink url={URL_PROVISIONING_CREDS}>{t('miscellaneous.read-more')}</UnderlinedLink>
                        </span>
                      </>
                    )
                    : t('dashboard.recent-activity.no-data.empty')
                  }
                </ListNoDataDescription>
              </div>
            )}
          </ListNoDataContainer>
        </ListNoDataWrapper>
      )}
    </RecentActivityWrapper>
  );
};

export default RecentActivity;

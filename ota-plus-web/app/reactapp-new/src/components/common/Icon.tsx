import React from 'react';

enum Theme {
  light = 'light',
  dark = 'dark'
}

type Props = {
  className?: string
  type: string,
  alt?: string,
  theme?: Theme
};

const Icon = ({ className, type, alt = type, theme = Theme.dark }: Props) => {
  const types: Record<string, Record<string, string>> = {
    [Theme.dark]: {
      campaigns: '/assets/img/newapp/icons/campaigns_dark.svg',
      devices: '/assets/img/newapp/icons/devices_dark.svg',
      deviceGroup: '/assets/img/newapp/icons/device_group_dark.svg',
      softwareVersion: '/assets/img/newapp/icons/software_versions_dark.svg',
      softwareUpdates: '/assets/img/newapp/icons/software_updates_dark.svg',
      signOut: '/assets/img/newapp/icons/software_updates_dark.svg',
    },
    [Theme.light]: {

    }
  };
  const iconType = types[theme][type] || '';
  return (
    iconType
    ? <img className={className} alt={alt} src={iconType} />
    : <img />
  );
};

export default Icon;

import React from 'react';

export enum Theme {
  light = 'light',
  dark = 'dark',
  aqua = 'aqua'
}

type Props = {
  className?: string
  type: string,
  alt?: string,
  colorTheme?: Theme,
  onClick?: () => void
};

const Icon = ({ className, type, alt = type, colorTheme = Theme.dark, onClick }: Props) => {
  const types: Record<string, Record<string, string>> = {
    [Theme.dark]: {
      campaigns: '/assets/img/new-app/24/campaigns-active-solid-24.svg',
      devices: '/assets/img/new-app/24/devices-active-outline-24.svg',
      deviceGroup: '/assets/img/new-app/24/device-group-active-outline-24.svg',
      people: '/assets/img/new-app/24/people-active-outline-24.svg',
      softwareVersion: '/assets/img/new-app/24/software-versions-active-outline-24.svg',
      softwareUpdates: '/assets/img/new-app/24/software-updates-active-outline-24.svg',
      signOut: '/assets/img/new-app/24/software-updates-active-outline-24.svg'
    },
    [Theme.light]: {},
    [Theme.aqua]: {
      plus: '/assets/img/new-app/24/icon-plus-aqua-24x24.svg',
      close: '/assets/img/new-app/24/close_aqua.svg'
    }
  } as const;
  const iconType = types[colorTheme][type] || '';
  return (
    iconType
      ? <img className={className} alt={alt} src={iconType} onClick={onClick} />
      : <img />
  );
};

export default Icon;

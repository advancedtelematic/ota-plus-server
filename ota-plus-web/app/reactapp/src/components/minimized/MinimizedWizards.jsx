/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import MinimizedBox from './MinimizedBox';
import { map } from 'lodash';
import { observer } from 'mobx-react';

const MinimizedWizards = observer(({ minimizedWizards, toggleWizard }) => {
  return (
    <span>
      {map(minimizedWizards, wizard => {
        const name = wizard.name ? wizard.name : 'Choose name';
        const actions = (
          <a href='#' id='maximize-wizard' title='Maximize wizard' onClick={toggleWizard.bind(this, wizard.id, wizard.name)}>
            <img src='/assets/img/icons/reopen.svg' alt='Icon' />
          </a>
        );
        return <MinimizedBox key={wizard.id} name={name} actions={actions} />;
      })}
    </span>
  );
});

export default MinimizedWizards;

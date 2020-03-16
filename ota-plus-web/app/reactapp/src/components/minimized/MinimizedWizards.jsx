/** @format */

import React from 'react';
import { map } from 'lodash';
import { observer } from 'mobx-react';
import MinimizedBox from './MinimizedBox';
import { REOPEN_ICON } from '../../config';

const MinimizedWizards = observer(({ minimizedWizards, toggleWizard }) => (
  <span>
    {map(minimizedWizards, (wizard) => {
      const name = wizard.name ? wizard.name : 'Choose name';
      const actions = (
        <a
          href="#"
          id="maximize-wizard"
          title="Maximize wizard"
          onClick={toggleWizard.bind(this, wizard.id, wizard.name)}
        >
          <img src={REOPEN_ICON} alt="Icon" />
        </a>
      );
      return <MinimizedBox key={wizard.id} name={name} actions={actions} />;
    })}
  </span>
));

export default MinimizedWizards;

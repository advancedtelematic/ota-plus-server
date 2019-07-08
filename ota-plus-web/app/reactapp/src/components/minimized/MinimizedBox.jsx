/** @format */

import React from 'react';
import { observer } from 'mobx-react';

const MinimizedBox = observer(({ name, actions }) => (
  <div className="minimized__box">
    <div className="minimized__name">{name}</div>
    <div className="minimized__actions">{actions}</div>
  </div>
));

export default MinimizedBox;

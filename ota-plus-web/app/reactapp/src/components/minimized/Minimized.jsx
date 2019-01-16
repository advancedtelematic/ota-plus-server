/** @format */

import React, { Component, PropTypes } from 'react';
import MinimizedUploadBox from './MinimizedUploadBox';
import MinimizedWizards from './MinimizedWizards';
import { observer } from 'mobx-react';

const Minimized = observer(({ uploadBoxMinimized, toggleUploadBoxMode, minimizedWizards, toggleWizard, stores }) => {
  return (
    <div className='minimized'>
      <MinimizedUploadBox uploadBoxMinimized={uploadBoxMinimized} toggleUploadBoxMode={toggleUploadBoxMode} />
      <MinimizedWizards minimizedWizards={minimizedWizards} toggleWizard={toggleWizard} />
    </div>
  );
});

export default Minimized;

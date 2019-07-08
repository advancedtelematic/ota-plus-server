/** @format */

import React from 'react';
import { observer } from 'mobx-react';
import MinimizedUploadBox from './MinimizedUploadBox';
import MinimizedWizards from './MinimizedWizards';

const Minimized = observer(({ uploadBoxMinimized, toggleUploadBoxMode, minimizedWizards, toggleWizard }) => (
  <div className="minimized">
    <MinimizedUploadBox uploadBoxMinimized={uploadBoxMinimized} toggleUploadBoxMode={toggleUploadBoxMode} />
    <MinimizedWizards minimizedWizards={minimizedWizards} toggleWizard={toggleWizard} />
  </div>
));

export default Minimized;

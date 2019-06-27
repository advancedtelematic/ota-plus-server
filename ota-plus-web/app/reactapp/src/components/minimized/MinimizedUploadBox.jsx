/** @format */

import React from 'react';
import { inject, observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';

import MinimizedBox from './MinimizedBox';

const MinimizedUploadBox = inject('stores')(
  observer(({ t, uploadBoxMinimized, toggleUploadBoxMode, stores }) => {
    const { softwareStore } = stores;
    const name = (
      <span>
        {t('software.uploading.uploading_software', { count: softwareStore.packagesUploading.length })}
      </span>
    );
    const actions = (
      <a
        href="#"
        id="maximize-upload-box"
        title={t('software.uploading.maximize_upload_box')}
        onClick={toggleUploadBoxMode.bind(this)}
      >
        <img src="/assets/img/icons/reopen.svg" alt="Icon" />
      </a>
    );
    return uploadBoxMinimized ? <MinimizedBox name={name} actions={actions} /> : null;
  }),
);

export default withTranslation()(MinimizedUploadBox);

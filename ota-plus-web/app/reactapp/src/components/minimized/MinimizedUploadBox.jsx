import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react';
import MinimizedBox from './MinimizedBox';
import { translate } from 'react-i18next';

const MinimizedUploadBox = inject("stores")(observer(({ t, uploadBoxMinimized, toggleUploadBoxMode, stores }) => {
    const { packagesStore } = stores;
    const name = (
        <span>
            Uploading {t('common.packageWithCount', {count: packagesStore.packagesUploading.length})}
        </span>
    );
    const actions = (
        <a href="#" id="maximize-upload-box" title="Maximize upload box" onClick={toggleUploadBoxMode.bind(this)}>
            <img src="/assets/img/icons/reopen.svg" alt="Icon" />
        </a>
    );
    return (
        uploadBoxMinimized ?
            <MinimizedBox 
                name={name}
                actions={actions}
            />
        :
            null
    );
}))

export default translate()(MinimizedUploadBox);
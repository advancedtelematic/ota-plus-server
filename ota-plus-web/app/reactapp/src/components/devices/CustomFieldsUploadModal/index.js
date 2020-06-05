import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useStores } from '../../../stores/hooks';
import {
  BackgroundMask,
  ButtonsWrapper,
  CloseIcon,
  Description,
  InfoStatusBarContainer,
  ModalContainer,
  Pill,
  StyledButton,
  Title,
  UploadButton,
  UploadFileSection,
  UploadIputFileSection
} from './styled';
import { CLOSE_MODAL_ICON, UPLOAD_ICON } from '../../../config';
import { sendAction } from '../../../helpers/analyticsHelper';
import {
  OTA_DEVICES_CUSTOM_CANCEL,
  OTA_DEVICES_CUSTOM_FAILED,
  OTA_DEVICES_CUSTOM_READ_MORE,
  OTA_DEVICES_CUSTOM_UPLOAD
} from '../../../constants/analyticsActions';
import { INFO_STATUS_BAR_TYPE, UPLOADING_STATUS } from '../../../constants';
import { InfoStatusBar } from '../../../partials/InfoStatusBar';
import { ExternalLink } from '../../../partials';
import { URL_DEVICES_CUSTOM_FIELDS } from '../../../constants/urlConstants';

const Tag = ({ children, id, onClose, status }) => (
  <Pill id={id}>
    {children}
    {status !== UPLOADING_STATUS.IN_PROGRESS
    && status !== UPLOADING_STATUS.SUCCESS
    && (<i className="fa fa-times" onClick={onClose} />)}
  </Pill>
);

Tag.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  id: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  status: PropTypes.oneOf([
    UPLOADING_STATUS.ERROR,
    UPLOADING_STATUS.IDLE,
    UPLOADING_STATUS.IN_PROGRESS,
    UPLOADING_STATUS.MALFORMED,
    UPLOADING_STATUS.SUCCESS
  ]),
};

const CustomFieldsUploadModal = ({ hide }) => {
  const { t } = useTranslation();
  const { stores } = useStores();
  const fileUploadRef = useRef(null);

  const [uploadStatus, setUploadStatus] = useState(
    UPLOADING_STATUS.IDLE
  );

  const [fileInfo, setFileInfo] = useState({
    fileName: null,
    fileUploadedAt: undefined,
  });

  useEffect(() => {

  }, []);

  const removeFile = () => {
    fileUploadRef.current.value = '';
    setFileInfo({
      fileName: null,
      fileUploadedAt: undefined,
    });
  };

  const onFinished = (status) => {
    setUploadStatus(status);
    if (status !== UPLOADING_STATUS.SUCCESS) {
      sendAction(OTA_DEVICES_CUSTOM_FAILED);
      removeFile();
    }
  };

  const uploadFile = () => {
    sendAction(OTA_DEVICES_CUSTOM_UPLOAD);
    const customFieldsData = new FormData();
    customFieldsData.append('custom-device-fields', fileUploadRef.current.files[0]);
    customFieldsData.append('name', 'custom-device-fields');
    customFieldsData.append('type', 'file');
    stores.devicesStore.uploadCustomFields(customFieldsData, onFinished);
  };

  const onFileUploadClick = (e) => {
    if (e) e.preventDefault();
    const fileUploadDom = fileUploadRef.current;
    fileUploadDom.click();
  };

  const onFileChange = (event) => {
    /* toDo: split based of `\` only affects windows paths */
    const name = event.target.value.split('\\').pop();
    setFileInfo({
      fileName: name,
      fileUploadedAt: moment().format(),
    });
  };

  const getInfoStatusBarText = (status) => {
    switch (status) {
      case UPLOADING_STATUS.MALFORMED:
        return t('devices.custom-fields.uploading.uploading-status-malformed');
      case UPLOADING_STATUS.ERROR:
        return t('devices.custom-fields.uploading.uploading-status-error');
      case UPLOADING_STATUS.SUCCESS:
        return t('devices.custom-fields.uploading.uploading-status-success');
      default:
        return '';
    }
  };

  const closeInfoStatusBar = () => {
    setUploadStatus(UPLOADING_STATUS.IDLE);
  };

  const getUploadButton = (status) => {
    switch (status) {
      case UPLOADING_STATUS.IN_PROGRESS:
        return null;
      case UPLOADING_STATUS.MALFORMED:
      case UPLOADING_STATUS.IDLE:
      case UPLOADING_STATUS.ERROR:
      default:
        return (
          <StyledButton
            id="devices-custom-fields-confirm-button"
            type="primary"
            light="true"
            onClick={uploadFile}
            disabled={!fileInfo.fileName}
          >
            {t('devices.custom-fields.uploading.upload')}
          </StyledButton>
        );
      case UPLOADING_STATUS.SUCCESS:
        return (
          <StyledButton id="devices-custom-fields-done-button" type="primary" light="true" onClick={hide}>
            {t('devices.custom-fields.uploading.done')}
          </StyledButton>
        );
    }
  };

  return (
    <>
      <BackgroundMask onClick={hide} />
      <ModalContainer id="devices-custom-fields-upload-modal">
        {(uploadStatus !== UPLOADING_STATUS.IN_PROGRESS)
        && (<CloseIcon src={CLOSE_MODAL_ICON} onClick={hide} id="devices-custom-fields-close-icon" />)}
        <Title>{t('devices.custom-fields.uploading.title')}</Title>
        <Description>
          {t('devices.custom-fields.uploading.description')}
          {' '}
          <ExternalLink
            key={'groups-creating-custom-fields-read-more'}
            onClick={() => sendAction(OTA_DEVICES_CUSTOM_READ_MORE)}
            url={URL_DEVICES_CUSTOM_FIELDS}
            weight="medium"
          >
            {t('devices.custom-fields.uploading.read-more')}
          </ExternalLink>
        </Description>
        { (uploadStatus === UPLOADING_STATUS.MALFORMED
          || uploadStatus === UPLOADING_STATUS.ERROR
          || uploadStatus === UPLOADING_STATUS.SUCCESS) && (
            <InfoStatusBarContainer id="devices-custom-fields-modal-info-status-bar-container">
              <InfoStatusBar
                id="devices-custom-fields-modal-info-status-bar"
                onClose={uploadStatus === UPLOADING_STATUS.MALFORMED
                || uploadStatus === UPLOADING_STATUS.ERROR ? closeInfoStatusBar : undefined}
                text={getInfoStatusBarText(uploadStatus)}
                type={uploadStatus === UPLOADING_STATUS.SUCCESS
                  ? INFO_STATUS_BAR_TYPE.SUCCESS : INFO_STATUS_BAR_TYPE.ERROR}
              />
            </InfoStatusBarContainer>
        )}
        <UploadFileSection>
          {fileInfo.fileName && (
            <>
              <Tag id="devices-custom-fields-attached-file-pill" onClose={removeFile} status={uploadStatus}>
                <div>{fileInfo.fileName}</div>
              </Tag>
            </>
          )}
          <UploadIputFileSection displayed={!fileInfo.fileName}>
            <input
              ref={fileUploadRef}
              name="file"
              type="file"
              id="devices-custom-fields-file-input-hidden"
              onChange={onFileChange}
            />
            <UploadButton
              light="true"
              onClick={onFileUploadClick}
              id="devices-custom-fields-choose-file-button"
              disabled={fileInfo.fileName}
            >
              {t('devices.custom-fields.uploading.choose-file')}
              <img src={UPLOAD_ICON} />
            </UploadButton>
          </UploadIputFileSection>
        </UploadFileSection>
        <ButtonsWrapper id="devices-custom-fields-buttons-wrapper">
          {uploadStatus !== UPLOADING_STATUS.SUCCESS && (
            <StyledButton
              id="devices-custom-fields-cancel-button"
              light="true"
              onClick={() => {
                if (uploadStatus !== UPLOADING_STATUS.SUCCESS) {
                  sendAction(OTA_DEVICES_CUSTOM_CANCEL);
                }
                hide();
              }}
            >
              {t('devices.custom-fields.uploading.cancel')}
            </StyledButton>
          )}
          {getUploadButton(uploadStatus)}
        </ButtonsWrapper>
      </ModalContainer>
    </>
  );
};

CustomFieldsUploadModal.propTypes = {
  hide: PropTypes.func,
};

export default CustomFieldsUploadModal;

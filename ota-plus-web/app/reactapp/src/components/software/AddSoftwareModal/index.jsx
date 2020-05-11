import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useObserver } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { Select } from 'antd';
import prettysize from 'prettysize';
import moment from 'moment';
import { useStores } from '../../../stores/hooks';
import {
  BackgroundMask,
  ButtonsWrapper,
  CloseIcon,
  Description,
  EcuSelect,
  FileInfoSection,
  Info,
  InfoStatusBarContainer,
  Input,
  InputLabel,
  ModalContainer,
  Pill,
  PillsContainer,
  ProgressBar,
  ProgressBarContainer,
  ProgressBarText,
  ProgressBarTextContainer,
  StyledButton,
  TextLabelInput,
  Title,
  UploadButton,
  UploadFileSection
} from './styled';
import { CLOSE_MODAL_ICON, SOFTWARE_VERSION_FILE_LIMIT, UPLOAD_ICON, ATTENTION_ICON } from '../../../config';
import { isFileTooLarge } from '../../../helpers/fileHelper';
import { sendAction } from '../../../helpers/analyticsHelper';
import {
  OTA_SOFTWARE_CANCEL_UPLOAD,
  OTA_SOFTWARE_FAIL_SIZE,
  OTA_SOFTWARE_FAIL_UPLOAD,
  OTA_SOFTWARE_SUCCESS_UPLOAD
} from '../../../constants/analyticsActions';
import { INFO_STATUS_BAR_TYPE, UPLOADING_STATUS, WARNING_MODAL_COLOR } from '../../../constants';
import { InfoStatusBar } from '../../../partials/InfoStatusBar';
import { WarningModal } from '../../../partials';
import { SOFTWARE_VERSION_UPLOAD_CANCEL_MESSAGE } from '../../../constants/softwareConstants';

const SelectOption = Select.Option;

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
    UPLOADING_STATUS.CANCELLED,
    UPLOADING_STATUS.ERROR,
    UPLOADING_STATUS.IDLE,
    UPLOADING_STATUS.IN_PROGRESS,
    UPLOADING_STATUS.SUCCESS
  ]),
};

function useStoreData() {
  const { stores } = useStores();
  return useObserver(() => ({
    hardwareIds: stores.hardwareStore.hardwareIds
  }));
}

// TODO: if in the future there will be possibility to upload more than 1 file at the same time
// then this index should be reorganized
const UPLOAD_INDEX = 0;

const AddSoftwareModal = ({ hide }) => {
  const { t } = useTranslation();
  const { stores } = useStores();
  const { hardwareIds } = useStoreData();
  const fileUploadRef = useRef(null);
  const [formData, setFormData] = useState({
    softwareName: '',
    softwareVersion: '',
    selectedHardwareIds: []
  });
  const [uploadProgressData, setUploadProgressData] = useState({
    loaded: 0,
    percentage: 0,
    total: 0
  });
  const [uploadStatus, setUploadStatus] = useState(
    UPLOADING_STATUS.IDLE
  );
  const [displayCancelMessage, setDisplayCancelMessage] = useState(false);
  const [ecuDropdownOpen, setEcuDropdownOpen] = useState(false);
  const [fileInfo, setFileInfo] = useState({
    fileName: null,
    fileUploadedAt: undefined,
    fileTooLarge: false,
    filePrettySize: undefined,
  });

  useEffect(() => {
    stores.hardwareStore.fetchHardwareIds();
  }, []);

  const onInputChange = key => (event) => {
    setFormData({
      ...formData,
      [key]: event.target.value
    });
  };

  const handleEcuSelect = (value) => {
    const { selectedHardwareIds } = formData;
    let selectedEcus;
    if (selectedHardwareIds.includes(value)) {
      selectedEcus = selectedHardwareIds.filter(id => id !== value);
    } else {
      selectedEcus = [...selectedHardwareIds, value];
    }
    setFormData({
      ...formData,
      selectedHardwareIds: selectedEcus
    });
  };

  const isVisible = (value) => {
    setEcuDropdownOpen(value);
  };

  const onFileUploadClick = (e) => {
    if (e) e.preventDefault();
    const fileUploadDom = fileUploadRef.current;
    fileUploadDom.click();
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    const prettySize = prettysize(file.size, { places: 2 });
    /* toDo: split based of `\` only affects windows paths */
    const name = event.target.value.split('\\')
      .pop();
    if (isFileTooLarge(file.size, SOFTWARE_VERSION_FILE_LIMIT)) {
      setFileInfo({
        fileName: name,
        fileUploadedAt: moment()
          .format(),
        fileTooLarge: true,
        filePrettySize: prettySize
      });
      sendAction(OTA_SOFTWARE_FAIL_SIZE);
    } else {
      setFileInfo({
        fileName: name,
        fileUploadedAt: moment()
          .format(),
        fileTooLarge: false,
        filePrettySize: prettySize,
      });
    }
  };

  const removeFile = () => {
    fileUploadRef.current.value = '';
    setFileInfo({
      fileName: null,
      fileUploadedAt: undefined,
      fileTooLarge: false,
      filePrettySize: undefined,
    });
  };

  const onFinished = (status) => {
    setUploadStatus(status);
    setDisplayCancelMessage(false);
    if (status === UPLOADING_STATUS.SUCCESS) {
      sendAction(OTA_SOFTWARE_SUCCESS_UPLOAD);
    } else if (status === UPLOADING_STATUS.ERROR) {
      sendAction(OTA_SOFTWARE_FAIL_UPLOAD);
    }
  };

  const onUploadProgress = (loaded, total) => {
    const percentage = Math.round((loaded / total) * 100);
    setUploadProgressData({ loaded, percentage, total });
  };

  const submitForm = () => {
    const { softwareStore } = stores;
    const newSoftwareData = new FormData();
    newSoftwareData.append('file', fileUploadRef.current.files[0]);
    const data = {
      packageName: formData.softwareName,
      version: formData.softwareVersion,
    };
    setUploadStatus(UPLOADING_STATUS.IN_PROGRESS);
    softwareStore.createPackage(
      data,
      newSoftwareData,
      formData.selectedHardwareIds.join(','),
      onUploadProgress,
      onFinished
    );
  };

  const getInfoStatusBarText = (status) => {
    switch (status) {
      case UPLOADING_STATUS.CANCELLED:
        return t('software.create-modal.uploading-status-cancelled');
      case UPLOADING_STATUS.ERROR:
        return t('software.create-modal.uploading-status-error');
      case UPLOADING_STATUS.SUCCESS:
        return t('software.create-modal.uploading-status-success');
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
      case UPLOADING_STATUS.CANCELLED:
      case UPLOADING_STATUS.IDLE:
      case UPLOADING_STATUS.ERROR:
      default:
        return (
          <StyledButton
            id="confirm-btn"
            type="primary"
            light="true"
            disabled={!(formData.softwareName
              && formData.softwareVersion
              && formData.selectedHardwareIds.length
              && !fileInfo.fileTooLarge
              && fileInfo.fileName)}
            onClick={submitForm}
          >
            {t('software.create-modal.upload')}
          </StyledButton>
        );
      case UPLOADING_STATUS.SUCCESS:
        return (
          <StyledButton id="done-btn" type="primary" light="true" onClick={hide}>
            {t('software.create-modal.done')}
          </StyledButton>
        );
    }
  };

  const cancelUpload = () => {
    const { softwareStore } = stores;
    setUploadStatus(UPLOADING_STATUS.CANCELLED);
    setDisplayCancelMessage(false);
    setUploadProgressData({ loaded: 0, percentage: 0, total: 0 });
    sendAction(OTA_SOFTWARE_CANCEL_UPLOAD);
    if (softwareStore.packagesUploading[UPLOAD_INDEX]) {
      softwareStore.packagesUploading[UPLOAD_INDEX].source.cancel(SOFTWARE_VERSION_UPLOAD_CANCEL_MESSAGE);
    }
    softwareStore.packagesUploading = [];
  };

  return (
    <>
      <BackgroundMask onClick={hide} />
      <ModalContainer id="sw-create-modal" displayed={!displayCancelMessage}>
        {(uploadStatus === UPLOADING_STATUS.IDLE || uploadStatus === UPLOADING_STATUS.SUCCESS)
        && (<CloseIcon src={CLOSE_MODAL_ICON} onClick={hide} id="close-icon" />)}
        <Title>{t('software.create-modal.title')}</Title>
        { (uploadStatus === UPLOADING_STATUS.CANCELLED
          || uploadStatus === UPLOADING_STATUS.ERROR
          || uploadStatus === UPLOADING_STATUS.SUCCESS) ? (
            <InfoStatusBarContainer id="sw-create-modal-info-status-bar-container">
              <InfoStatusBar
                id="sw-create-modal-info-status-bar"
                onClose={uploadStatus === UPLOADING_STATUS.CANCELLED
                  || uploadStatus === UPLOADING_STATUS.ERROR ? closeInfoStatusBar : undefined}
                text={getInfoStatusBarText(uploadStatus)}
                type={uploadStatus === UPLOADING_STATUS.SUCCESS
                  ? INFO_STATUS_BAR_TYPE.SUCCESS : INFO_STATUS_BAR_TYPE.ERROR}
              />
            </InfoStatusBarContainer>
          ) : (
            <Description>
              {uploadStatus === UPLOADING_STATUS.IN_PROGRESS
                ? t('software.create-modal.uploading-description') : t('software.create-modal.description')}
            </Description>
          )}
        <InputLabel>{t('software.create-modal.software-name.label')}</InputLabel>
        { (uploadStatus === UPLOADING_STATUS.SUCCESS || uploadStatus === UPLOADING_STATUS.IN_PROGRESS) ? (
          <TextLabelInput id="text-label-software-name">
            { formData.softwareName }
          </TextLabelInput>
        ) : (
          <Input
            id="add-new-software-name"
            placeholder={t('software.create-modal.software-name.placeholder')}
            name="packageName"
            onChange={onInputChange('softwareName')}
            value={formData.softwareName}
          />
        )}
        <InputLabel>{t('software.create-modal.software-version.label')}</InputLabel>
        { (uploadStatus === UPLOADING_STATUS.SUCCESS || uploadStatus === UPLOADING_STATUS.IN_PROGRESS) ? (
          <TextLabelInput id="text-label-software-version">
            { formData.softwareVersion }
          </TextLabelInput>
        ) : (
          <Input
            id="add-new-software-version"
            placeholder={t('software.create-modal.software-version.placeholder')}
            name="version"
            onChange={onInputChange('softwareVersion')}
            value={formData.softwareVersion}
          />
        )}
        <InputLabel>{t('software.create-modal.software-ecu.label')}</InputLabel>
        { (uploadStatus !== UPLOADING_STATUS.SUCCESS
          && uploadStatus !== UPLOADING_STATUS.IN_PROGRESS) && (
          <EcuSelect
            id="ecu-types-select"
            placeholder={t('software.create-modal.software-ecu.placeholder')}
            value={formData.selectedHardwareIds.length ? t('software.create-modal.software-ecu.value') : undefined}
            onSelect={handleEcuSelect}
            onDropdownVisibleChange={isVisible}
            dropdownClassName="ecu-select-list"
            suffixIcon={(
              <span>
                <span id="selected-ecus-count">{formData.selectedHardwareIds.length || null}</span>
                <i
                  className={`fa ${ecuDropdownOpen ? 'fa-angle-up' : 'fa-angle-down'}`}
                  style={{ opacity: formData.selectedHardwareIds.length ? 1 : 0.7 }}
                />
              </span>
            )}
          >
            {hardwareIds.map(id => (
              <SelectOption key={id} value={id} id={`${id}-option`}>
                {id}
                {formData.selectedHardwareIds.includes(id) && (
                  <i className="fa fa-check c-form__select-icon" />
                )}
              </SelectOption>
            ))}
          </EcuSelect>
        )}
        {formData.selectedHardwareIds.length > 0 && (
          <PillsContainer>
            {formData.selectedHardwareIds.map(id => (
              <Tag key={id} id={`${id}-pill`} onClose={() => handleEcuSelect(id)} status={uploadStatus}>
                {id}
              </Tag>
            ))}
          </PillsContainer>
        )}
        { (uploadStatus === UPLOADING_STATUS.SUCCESS || uploadStatus === UPLOADING_STATUS.IN_PROGRESS) && (
          <FileInfoSection id="file-section">
            <InputLabel>{t('software.create-modal.file-name')}</InputLabel>
            <TextLabelInput id="text-label-file-name">
              { fileInfo.fileName }
            </TextLabelInput>
          </FileInfoSection>
        )}
        <UploadFileSection
          displayed={uploadStatus !== UPLOADING_STATUS.SUCCESS && uploadStatus !== UPLOADING_STATUS.IN_PROGRESS}
        >
          <input
            ref={fileUploadRef}
            name="file"
            type="file"
            id="file-input-hidden"
            onChange={onFileChange}
          />
          <UploadButton
            light="true"
            onClick={onFileUploadClick}
            id="choose-software"
            disabled={fileInfo.fileName}
          >
            {t('software.create-modal.choose-file')}
            <img src={UPLOAD_ICON} />
          </UploadButton>
          {fileInfo.fileName
            ? (
              <>
                <Tag id="attached-file-pill" onClose={removeFile}>
                  <div>{fileInfo.fileName}</div>
                </Tag>
                <Info error={fileInfo.fileTooLarge}>
                  <span id="file-size-tip">{fileInfo.filePrettySize}</span>
                  {fileInfo.fileTooLarge && (
                    <>
                      <img src={ATTENTION_ICON} />
                      <span id="file-size-error">
                        {t('software.create-modal.file-upload-size-error')}
                      </span>
                    </>
                  )}
                </Info>
              </>
            )
            : (
              <span>{t('software.create-modal.file-information')}</span>
            )}
        </UploadFileSection>
        <ButtonsWrapper id="buttons-wrapper">
          {uploadStatus === UPLOADING_STATUS.IN_PROGRESS && (
            <ProgressBarContainer id="progress-bar-container">
              <ProgressBar id="progress-bar" widthPercentage={uploadProgressData.percentage} />
              <ProgressBarTextContainer id="progress-bar-text-container">
                <ProgressBarText id="progress-bar-text">
                  {t(
                    'software.create-modal.uploading-progress-text',
                    {
                      uploaded: prettysize(uploadProgressData.loaded, true),
                      total: prettysize(uploadProgressData.total, true)
                    }
                  )}

                </ProgressBarText>
              </ProgressBarTextContainer>
            </ProgressBarContainer>
          )}
          {uploadStatus !== UPLOADING_STATUS.SUCCESS && (
            <StyledButton
              id="cancel-btn"
              light="true"
              onClick={() => {
                if (uploadStatus === UPLOADING_STATUS.IN_PROGRESS) {
                  setDisplayCancelMessage(true);
                } else {
                  hide();
                }
              }}
            >
              {t('software.create-modal.cancel')}
            </StyledButton>
          )}
          {getUploadButton(uploadStatus)}
        </ButtonsWrapper>
      </ModalContainer>
      {displayCancelMessage && (
        <WarningModal
          id="software-uploading-cancel-message"
          type={WARNING_MODAL_COLOR.DANGER}
          title={t('software.create-modal.uploading-cancel-message.title')}
          desc={t('software.create-modal.uploading-cancel-message.description')}
          cancelButtonProps={{
            title: t('software.create-modal.uploading-cancel-message.no'),
          }}
          confirmButtonProps={{
            title: t('software.create-modal.uploading-cancel-message.yes'),
            onClick: cancelUpload
          }}
          onClose={() => {
            setDisplayCancelMessage(false);
          }}
        />
      )}
    </>
  );
};

AddSoftwareModal.propTypes = {
  hide: PropTypes.func,
};

export default AddSoftwareModal;

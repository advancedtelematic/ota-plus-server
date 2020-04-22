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
  Info,
  Input,
  InputLabel,
  ModalContainer,
  Pill,
  PillsContainer,
  StyledButton,
  Title,
  UploadButton,
  UploadFileSection
} from './styled';
import { CLOSE_MODAL_ICON, SOFTWARE_VERSION_FILE_LIMIT, UPLOAD_ICON, ATTENTION_ICON } from '../../../config';
import { isFileTooLarge } from '../../../helpers/fileHelper';
import { sendAction } from '../../../helpers/analyticsHelper';
import { OTA_SOFTWARE_FAIL_SIZE } from '../../../constants/analyticsActions';

const SelectOption = Select.Option;

const Tag = ({ children, onClose }) => (
  <Pill>
    {children}
    <i className="fa fa-times" onClick={onClose} />
  </Pill>
);

Tag.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  onClose: PropTypes.func.isRequired
};

function useStoreData() {
  const { stores } = useStores();
  return useObserver(() => ({
    hardwareIds: stores.hardwareStore.hardwareIds
  }));
}

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

  const submitForm = () => {
    const { softwareStore } = stores;
    const newSoftwareData = new FormData();
    newSoftwareData.append('file', fileUploadRef.current.files[0]);
    const data = {
      packageName: formData.softwareName,
      version: formData.softwareVersion,
    };
    softwareStore.createPackage(data, newSoftwareData, formData.selectedHardwareIds.join(','));
    hide();
  };

  return (
    <>
      <BackgroundMask onClick={hide} />
      <ModalContainer>
        <CloseIcon src={CLOSE_MODAL_ICON} onClick={hide} id="close-icon" />
        <Title>{t('software.create-modal.title')}</Title>
        <Description>{t('software.create-modal.description')}</Description>
        <InputLabel>{t('software.create-modal.software-name.label')}</InputLabel>
        <Input
          id="add-new-software-name"
          placeholder={t('software.create-modal.software-name.placeholder')}
          name="packageName"
          onChange={onInputChange('softwareName')}
        />
        <InputLabel>{t('software.create-modal.software-name.label')}</InputLabel>
        <Input
          id="add-new-software-version"
          placeholder={t('software.create-modal.software-version.placeholder')}
          name="version"
          onChange={onInputChange('softwareVersion')}
        />
        <InputLabel>{t('software.create-modal.software-ecu.label')}</InputLabel>
        <EcuSelect
          id="ecu-types-select"
          placeholder={t('software.create-modal.software-ecu.placeholder')}
          value={formData.selectedHardwareIds.length ? t('software.create-modal.software-ecu.value') : undefined}
          onSelect={handleEcuSelect}
          onDropdownVisibleChange={isVisible}
          suffixIcon={(
            <span>
              <span>{formData.selectedHardwareIds.length || null}</span>
              <i
                className={`fa ${ecuDropdownOpen ? 'fa-angle-up' : 'fa-angle-down'}`}
                style={{ opacity: formData.selectedHardwareIds.length ? 1 : 0.7 }}
              />
            </span>
          )}
        >
          {hardwareIds.map(id => (
            <SelectOption value={id} key={id} id={`${id}-option`}>
              {id}
              {formData.selectedHardwareIds.includes(id) && (
                <i className="fa fa-check c-form__select-icon" />
              )}
            </SelectOption>
          ))}
        </EcuSelect>
        {formData.selectedHardwareIds.length > 0 && (
          <PillsContainer>
            {formData.selectedHardwareIds.map(id => (
              <Tag key={`${id}-pill`} id={`${id}-pill`} onClose={() => handleEcuSelect(id)}>
                {id}
              </Tag>
            ))}
          </PillsContainer>
        )}
        <UploadFileSection>
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
                  <span>{fileInfo.filePrettySize}</span>
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
        <ButtonsWrapper>
          <StyledButton id="cancel-btn" light="true" onClick={hide}>
            {t('software.create-modal.cancel')}
          </StyledButton>
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
        </ButtonsWrapper>
      </ModalContainer>
    </>
  );
};

AddSoftwareModal.propTypes = {
  hide: PropTypes.func,
};

export default AddSoftwareModal;

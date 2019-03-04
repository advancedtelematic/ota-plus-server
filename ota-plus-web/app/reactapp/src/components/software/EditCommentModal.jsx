/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import serialize from 'form-serialize';

import { Row, Col } from 'antd';
import { OTAModal, OTAForm, FormTextarea } from '../../partials';

@inject('stores')
@observer
class EditCommentModal extends Component {
  static propTypes = {
    stores: PropTypes.object,
    filepath: PropTypes.string,
    hide: PropTypes.func,
    comment: PropTypes.string,
    shown: PropTypes.bool,
  };
  @observable submitButtonDisabled = false;
  submitForm = e => {
    const { stores, filepath, hide } = this.props;
    const { softwareStore } = stores;
    if (e) e.preventDefault();
    const data = serialize(document.querySelector('#comment-edit-form'), { hash: true });
    softwareStore.updateComment(filepath, data.comment);
    hide();
  };

  enableButton = () => {
    this.submitButtonDisabled = false;
  };

  disableButton = () => {
    this.submitButtonDisabled = true;
  };

  render() {
    const { comment, hide, shown } = this.props;
    const form = (
      <OTAForm onSubmit={this.submitForm} id='comment-edit-form'>
        <Row className='row'>
          <Col span={24}>
            <FormTextarea
              onValid={this.enableButton}
              onInvalid={this.disableButton}
              name='comment'
              className='input-wrapper'
              isEditable
              title='Comment'
              label='Comment'
              placeholder='Comment'
              defaultValue={comment}
              rows={5}
            />
          </Col>
        </Row>
        <Row className='row'>
          <Col span={24}>
            <div className='body-actions'>
              <button disabled={this.submitButtonDisabled} className='btn-primary' id='add'>
                Save Comment
              </button>
            </div>
          </Col>
        </Row>
      </OTAForm>
    );
    return (
      <OTAModal
        title='Edit comment'
        topActions={
          <div className='top-actions flex-end'>
            <div className='modal-close' onClick={hide}>
              <img src='/assets/img/icons/close.svg' alt='Icon' />
            </div>
          </div>
        }
        className='edit-comment-modal'
        content={form}
        visible={shown}
      />
    );
  }
}

export default EditCommentModal;

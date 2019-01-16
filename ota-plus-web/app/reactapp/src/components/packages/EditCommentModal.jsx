/** @format */

import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Modal, Form, FormTextarea } from '../../partials';
import serialize from 'form-serialize';

@inject('stores')
@observer
class EditCommentModal extends Component {
  @observable submitButtonDisabled = false;

  submitForm(e) {
    const { filepath, hide } = this.props;
    const { packagesStore } = this.props.stores;
    if (e) e.preventDefault();
    const data = serialize(document.querySelector('#comment-edit-form'), { hash: true });
    packagesStore.updateComment(filepath, data.comment);
    hide();
  }
  enableButton() {
    this.submitButtonDisabled = false;
  }
  disableButton() {
    this.submitButtonDisabled = true;
  }
  render() {
    const { comment, hide, shown } = this.props;
    const form = (
      <Form onSubmit={this.submitForm.bind(this)} id='comment-edit-form'>
        <div className='row'>
          <div className='col-xs-12'>
            <FormTextarea
              onValid={this.enableButton.bind(this)}
              onInvalid={this.disableButton.bind(this)}
              name='comment'
              className='input-wrapper'
              isEditable={true}
              title={'Comment'}
              label={'Comment'}
              placeholder={'Comment'}
              defaultValue={comment}
              rows={5}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-12'>
            <div className='body-actions'>
              <button disabled={this.submitButtonDisabled} className='btn-primary' id='add'>
                Save Comment
              </button>
            </div>
          </div>
        </div>
      </Form>
    );
    return (
      <Modal
        title={'Edit comment'}
        topActions={
          <div className='top-actions flex-end'>
            <div className='modal-close' onClick={hide}>
              <img src='/assets/img/icons/close.svg' alt='Icon' />
            </div>
          </div>
        }
        className='edit-comment-modal'
        content={form}
        shown={shown}
      />
    );
  }
}

export default EditCommentModal;

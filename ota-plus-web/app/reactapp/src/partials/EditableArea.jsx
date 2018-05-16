import React, {Component} from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
export default class EditableArea extends Component {
    @observable editComment = false;
    @observable value = '';
    constructor() {
        super();
        this.changeWatcher = this.changeWatcher.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
    }

    changeWatcher(e) {
        this.value = e.target.innerText;
        e.target.innerText !== this.props.initialText ? this.editComment = true : this.editComment = false;
    }

    cancelEdit(e) {
        e.preventDefault();
        this.editComment = false;
    }

    render() {
        const {initialText, saveHandler} = this.props;
        return (
            <div className="c-editable-area">
                <div contentEditable="true"
                      className={`c-editable-area__input ${this.editComment ? 'c-editable-area__input--bordered' : ''}`}
                      onInput={this.changeWatcher}>{initialText}</div>
                {this.editComment ?
                    <div className="c-editable-area__body-actions">
                        <a href="#" className="c-editable-area__button link-cancel" onClick={this.cancelEdit}>Cancel</a>
                        <button className='c-editable-area__button btn-primary' onClick={() => {
                            saveHandler(this.value);
                            this.editComment = false;
                        }}>Save</button>
                    </div>
                : ''}
            </div>
        )
    }
}
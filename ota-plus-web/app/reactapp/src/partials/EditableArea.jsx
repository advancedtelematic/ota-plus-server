import React, {Component} from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
export default class EditableArea extends Component {
    @observable editComment = false;
    @observable value = '';
    @observable tmpValue = '';
    constructor(props) {
        super(props);
        this.changeWatcher = this.changeWatcher.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.tmpValue = props.initialText;
    }

    changeWatcher(e) {
        this.value = e.target.value;
        e.target.value !== this.props.initialText ? this.editComment = true : this.editComment = false;
    }

    cancelEdit(e) {
        e.preventDefault();
        this.editComment = false;
        this.input.value = this.tmpValue;
    }

    render() {
        const {initialText, saveHandler} = this.props;
        return (
            <div className="c-editable-area">
                <textarea
                     className={`c-editable-area__input ${this.editComment ? 'c-editable-area__input--bordered' : ''}`}
                     ref={el => this.input = el}
                     defaultValue={initialText}
                     onChange={this.changeWatcher}/>
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
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
    }

    changeWatcher(e) {
        this.value = e.target.value;
        e.target.value !== this.props.initialText ? this.editComment = true : this.editComment = false;
    }

    render() {
        const {initialText, cols, rows, saveHandler} = this.props;
        return (
            <div className="c-editable-area">
                <textarea rows="2"
                          className="c-editable-area__input"
                          defaultValue={initialText}
                          onChange={this.changeWatcher}/>
                {this.editComment ?
                    <button className="btn-primary" onClick={() => {
                        saveHandler(this.value);
                        this.editComment = false;
                    }
                    }>Save changes</button>
                : ''}
            </div>
        )
    }
}
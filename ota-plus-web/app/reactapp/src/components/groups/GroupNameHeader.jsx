import React, {Component} from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { FadeAnimation } from '../../utils';

@observer
class GroupNameHeader extends Component {
    @observable renameDisabled = true;
    @observable newTitle = '';

    constructor(props){
        super(props);
        this.focusTextInput = this.focusTextInput.bind(this);
        this.renameGroup = this.renameGroup.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.renameDisabled = true;
        this.newTitle = nextProps.groupsStore.selectedGroup.name;
    }

    focusTextInput() {
        if (this.renameDisabled) {
            this.textInput.setAttribute('disabled','true');
        } else {
            this.textInput.removeAttribute('disabled');
            this.textInput.focus();
        }
    }

    renameGroup(groupsStore, e) {
        if (e) {
            if(e.key === 'Enter'){
                groupsStore.renameGroup(groupsStore.selectedGroup.id, this.textInput.value);
                groupsStore._updateGroupData(groupsStore.selectedGroup.id, {groupName: this.textInput.value});
                groupsStore.selectedGroup.name =  this.textInput.value;
                this.newTitle = groupsStore.selectedGroup.name;
                this.renameDisabled = true;
                this.focusTextInput();
            }
        } else {
            if (groupsStore.selectedGroup.id && this.textInput.value) {
                groupsStore.renameGroup(groupsStore.selectedGroup.id, this.textInput.value);
                groupsStore._updateGroupData(groupsStore.selectedGroup.id, {groupName: this.textInput.value});
                groupsStore.selectedGroup.name =  this.textInput.value;
                this.newTitle = groupsStore.selectedGroup.name;
                this.renameDisabled = true;
                this.focusTextInput();
            }
        }
    }

    render() {
        const {t, devicesStore, groupsStore} = this.props;
        return (
            <div className="selected-group-title">
                <div className="left">
                    <div className="icon"></div>
                </div>
                <div className="right">
                    <h3>
                        <input type="text"
                               tabIndex="-1"
                               size={this.newTitle.length}
                               maxLength={100}
                               ref={(input) => {this.textInput = input}}
                               disabled
                               onKeyPress={(e) => {
                                   this.renameGroup(groupsStore,e)
                               }}
                               className={groupsStore.selectedGroup.type === 'artificial' ? 'artificial' : null}
                               value={this.newTitle} onChange={(e) => {this.newTitle = e.target.value}}/>

                        {this.renameDisabled
                            ?
                            groupsStore.selectedGroup.type !== 'artificial'
                                ?
                                <i className="fa fa-pencil" aria-hidden="true" onClick={() => {
                                    this.renameDisabled = !this.renameDisabled;
                                    this.focusTextInput();
                                }} />
                                :
                                null
                            :
                            <div className="icons">
                                <i className="fa fa-check-square" aria-hidden="true" onClick={() => {
                                    this.renameGroup(groupsStore);
                                }}/>
                                <i className="fa fa-window-close" aria-hidden="true" onClick={() => {
                                    this.renameDisabled = true; this.newTitle = groupsStore.selectedGroup.name; this.focusTextInput()
                                }} />
                            </div>
                        }
                    </h3>
                    <FadeAnimation>
                        {devicesStore.devicesTotalCount === null && devicesStore.devicesFetchAsync.isFetching ?
                            <span>
                                <i className="fa fa-square-o fa-spin"></i> devices counting
                            </span>
                        :
                            <span>
                                {t('common.deviceWithCount', {count: devicesStore.devicesTotalCount})}
                            </span>
                        }
                    </FadeAnimation>
                </div>
            </div>
        )
    }
}

export default translate()(GroupNameHeader);
import React, {Component} from 'react';
import { observable, observe } from 'mobx';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { FadeAnimation, AsyncStatusCallbackHandler } from '../../utils';
import { AsyncResponse } from '../../partials';

@observer
class GroupNameHeader extends Component {
    @observable renameDisabled = true;
    @observable oldGroupName = '';
    @observable newGroupName = '';
    @observable newGroupNameLength = 0;

    constructor(props){
        super(props);
        this.enableGroupRename = this.enableGroupRename.bind(this);
        this.cancelGroupRename = this.cancelGroupRename.bind(this);
        this.renameGroup = this.renameGroup.bind(this);
        this.focusTextInput = this.focusTextInput.bind(this);
        this.userTypesName = this.userTypesName.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
        this.groupRenameHandler = observe(props.groupsStore, (change) => {
            if(change.name === 'groupsRenameAsync' && change.object[change.name].isFetching === false && change.object[change.name].status !== "error") {
                this.handleResponse();
            }
        });
    }
    componentWillUnmount() {
        this.groupRenameHandler();
    }
    componentWillReceiveProps(nextProps) {
        this.renameDisabled = true;
        this.oldGroupName = nextProps.groupsStore.selectedGroup.name;
        this.newGroupName = nextProps.groupsStore.selectedGroup.name;
        this.newGroupNameLength = nextProps.groupsStore.selectedGroup.name.length;
    }
    enableGroupRename(e) {
        if (this.renameDisabled) {
            this.renameDisabled = false;
            this.focusTextInput();
            e.target.classList.add('hide')
        }
    }
    cancelGroupRename() {
        this.renameDisabled = true; 
        this.newGroupName = this.oldGroupName;
        this.newGroupNameLength = this.oldGroupName.length;
        this.focusTextInput();
        this.clickableArea.classList.remove('hide');
    }
    userTypesName(e) {
        this.newGroupName = e.target.value;
        this.newGroupNameLength = e.target.value.length;
    }
    keyPressed(e) {
        if(e.key === 'Enter') {
            this.renameGroup();
        }
    }
    renameGroup() {
        const { groupsStore } = this.props;
        this.clickableArea.classList.remove('hide');
        groupsStore.renameGroup(groupsStore.selectedGroup.id, this.newGroupName);
    }
    handleResponse() {
        const { groupsStore } = this.props;
        groupsStore._updateGroupData(groupsStore.selectedGroup.id, {groupName: this.newGroupName});
        groupsStore._prepareGroups();
        groupsStore.selectedGroup.name =  this.newGroupName;
        this.oldGroupName = this.newGroupName;
        this.renameDisabled = true;
        this.focusTextInput();
    }
    focusTextInput() {
        if (this.renameDisabled) {
            this.groupNameInput.setAttribute('disabled','true');
        } else {
            this.groupNameInput.removeAttribute('disabled');
            this.groupNameInput.focus();
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
                    <h3 className={groupsStore.selectedGroup.type === 'artificial' ? 'artificial' : null}>

                        <div onClick={this.enableGroupRename}
                             ref={(clickableArea) => {this.clickableArea = clickableArea}}
                             className="clickable-area"
                             style={{width: '90%', height: '36px', position: 'absolute'}}/>

                        <input type="text"
                           ref={(input) => {this.groupNameInput = input}}
                           disabled
                           onKeyPress={this.keyPressed}
                           value={this.newGroupName} 
                           onChange={this.userTypesName} 
                        />

                        {this.renameDisabled ?
                            <img src="/assets/img/icons/white/Rename.svg" className="edit" alt="Icon" style={{cursor: 'auto'}} />
                        :
                            <div className="icons">
                                {this.newGroupNameLength ?
                                    <img src="/assets/img/icons/white/Tick.svg" className="rename" alt="Icon" onClick={this.renameGroup} />
                                :
                                    null
                                }
                                <img src="/assets/img/icons/white/X.svg" alt="Icon" className="cancel" onClick={this.cancelGroupRename} />
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
                <AsyncResponse 
                    handledStatus="error"
                    action={groupsStore.groupsRenameAsync}
                    errorMsg={(groupsStore.groupsRenameAsync.data ? groupsStore.groupsRenameAsync.data.description : null)}
                />
            </div>
        )
    }
}

export default translate()(GroupNameHeader);
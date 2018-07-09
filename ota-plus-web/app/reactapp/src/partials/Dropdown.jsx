import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import enhanceWithClickOutside from 'react-click-outside';

@observer
class Dropdown extends React.Component {
    @observable showSubmenu = false;
    constructor() {
        super();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }
    componentWillReceiveProps(props) {
        this.showSubmenu = props.show;
    }
    handleClickOutside() {
        this.props.hideSubmenu();
    }
    render() {
        const {children, show} = this.props;
        return this.showSubmenu ? <ul className="submenu">
            {children}
        </ul> : null
    }
};

export default enhanceWithClickOutside(Dropdown);
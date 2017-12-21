import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { SubHeader, SearchBar } from '../../partials';
import { Form } from 'formsy-react';
import { FlatButton } from 'material-ui';

@observer
class ContentPanelHeader extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { devicesSort, changeSort, devicesFilter, changeFilter } = this.props;
        return (
            <SubHeader>
                <Form>
                    <SearchBar 
                        value={devicesFilter}
                        changeAction={changeFilter}
                        id="search-devices-input"
                    />
                </Form>                
                <div className="sort-box">
                    {devicesSort == 'asc' ? 
                        <a href="#" className="font-small" onClick={changeSort.bind(this, 'desc')} id="link-sort-devices-desc">
                            <i className="fa fa-long-arrow-up" aria-hidden="true"></i> A &gt; Z
                        </a>
                    :
                        <a href="#" className="font-small" onClick={changeSort.bind(this, 'asc')} id="link-sort-devices-asc">
                            <i className="fa fa-long-arrow-down" aria-hidden="true"></i> Z &gt; A
                        </a>
                    }
                </div>
            </SubHeader>
        );
    }
}

ContentPanelHeader.propTypes = {
    devicesSort: PropTypes.string,
    changeSort: PropTypes.func.isRequired,
    devicesFilter: PropTypes.string,
    changeFilter: PropTypes.func.isRequired
}

export default ContentPanelHeader;
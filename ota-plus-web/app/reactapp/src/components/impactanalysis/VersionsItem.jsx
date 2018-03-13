import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class VersionsItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { version } = this.props;
        return (
            <li>
                <div className="column column-first" title={version.packageId.version}>
                    {version.packageId.version}
                </div>
                <div className="column column-second">
                    {version.statistics.deviceCount !== null ? 
                        version.statistics.deviceCount
                    :
                        null
                    }
                </div>
                <div className="column column-third">
                    {version.statistics.groupsIds ?
                        version.statistics.groupIds.length
                    :
                        null
                    }
                </div>
            </li>
        );
    }
}

VersionsItem.propTypes = {
    version: PropTypes.object.isRequired
}

export default VersionsItem;
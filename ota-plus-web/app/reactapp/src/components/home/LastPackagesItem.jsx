import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { observer } from 'mobx-react';

@observer
class LastPackagesItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { pack } = this.props;
        const link = 'packages/' + pack.id.name;
        const createdDate = new Date(pack.createdAt);
        return (
            <Link
                to={`${link}`} 
                className="element-box package" 
                title={pack.id.name + ' ' + pack.id.version}
                id={"link-packages-" + pack.uuid}>
                <div className="desc">
                    <div className="title">
                        {pack.id.name}
                    </div>
                    <div className="subtitle">
                        Version: {pack.id.version.length > 10 ? pack.id.version.substring(0, 10) + '...' : pack.id.version}
                    </div>
                    <div className="subtitle">
                        Created at: {createdDate.toDateString() + ' ' + createdDate.toLocaleTimeString()}
                    </div>
                </div>
            </Link>
        );
    }
}

LastPackagesItem.propTypes = {
    pack: PropTypes.object.isRequired
}

export default LastPackagesItem;
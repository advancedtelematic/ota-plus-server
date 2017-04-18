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
        return (
            <Link
                to={`${link}`} 
                className="element-box package" 
                title={pack.id.name + ' ' + pack.id.version}
                id={"link-packages-" + pack.uuid}>
                <div className="icon"></div>
                <div className="desc">
                    <div className="title">
                        {pack.id.name}
                    </div>
                    <div className="subtitle">
                        {pack.id.version}
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
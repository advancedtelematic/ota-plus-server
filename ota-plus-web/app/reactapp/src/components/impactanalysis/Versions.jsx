import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import VersionsItem from './VersionsItem';

@observer
class Versions extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { versions } = this.props;
        return (
            <div className="versions">
                <ul>
                    {_.map(versions, (version, index) => {
                        return (
                            <VersionsItem
                                version={version}
                                key={index}
                            />
                        );
                    })}
                </ul>
            </div>
        );
    }
}

Versions.propTypes = {
    versions: PropTypes.object.isRequired
}

export default Versions;
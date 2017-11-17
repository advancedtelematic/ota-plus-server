import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Loader } from '../../partials';
import _ from 'underscore';
import LastPackagesItem from './LastPackagesItem';

@observer
class LastPackages extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { packagesStore } = this.props;
        const { lastPackages } = packagesStore;
        const noPackages = 'No packages found';
        return (
            <span>
                {packagesStore.packagesFetchAsync.isFetching || packagesStore.packagesTufFetchAsync.isFetching ?
                    <div className="wrapper-center">
                        <Loader 
                            className="dark"
                        />
                    </div>
                :
                    Object.keys(lastPackages).length ? 
                        _.map(lastPackages, (pack) => {
                            return (
                                <LastPackagesItem 
                                    key={pack.uuid}
                                    pack={pack}
                                />
                            );
                        })
                    :
                        noPackages
                }
                
            </span>
        );
    }
}

LastPackages.propTypes = {
    packagesStore: PropTypes.object.isRequired,
}

export default LastPackages;
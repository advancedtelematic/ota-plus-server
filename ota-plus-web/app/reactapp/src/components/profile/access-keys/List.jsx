import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'underscore';
import ListItem from './ListItem';
import { Loader } from '../../../partials';

const minBoxWidth = 350;

@observer
class List extends Component {
    @observable boxWidth = 350;
    @observable howManyBoxesPerRow = 4;
    @observable padding = 60;

    constructor(props) {
        super(props);
        this.setBoxesWidth = this.setBoxesWidth.bind(this);
    }
    componentDidMount() {
        this.setBoxesWidth();
        window.addEventListener("resize", this.setBoxesWidth);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.setBoxesWidth);
    }
    setBoxesWidth() {
        let containerWidth = this.refs.innerContainer.getBoundingClientRect().width;
        let howManyBoxesPerRow = Math.floor(containerWidth / minBoxWidth);
        this.boxWidth = Math.floor(containerWidth / howManyBoxesPerRow) - this.padding / howManyBoxesPerRow;
        this.howManyBoxesPerRow = howManyBoxesPerRow;
    }
    render() {
        const { provisioningStore } = this.props;
        return (
            <div className="wrapper">
                <div className="inner-container" ref="innerContainer">
                    {provisioningStore.preparedProvisioningKeys.length ?
                        _.map(provisioningStore.preparedProvisioningKeys, (provisioningKey, index) => {
                            return (
                                <ListItem
                                    provisioningStore={provisioningStore}
                                    provisioningKey={provisioningKey}
                                    width={this.boxWidth}
                                    key={index}
                                />
                            );
                        })
                    :
                        provisioningStore.provisioningKeysFetchAsync.isFetching ? 
                            <div className="wrapper-center">
                                <Loader />
                            </div>
                        :
                            <span className="content-empty">
                                <div className="wrapper-center">
                                    Oops, there are no keys to show.
                                </div>
                            </span>
                    }
                </div>
            </div>
        );
    }
}

List.propTypes = {
    provisioningStore: PropTypes.object.isRequired
}

export default List;

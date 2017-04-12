import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { Header } from '../partials';
import { TreehubContainer } from '../containers';

const title = "TreeHub";

@observer
class Treehub extends Component {
    constructor(props) {
        super(props);
    }
    componentWillUnmount() {
        this.props.featuresStore._reset();
    }
    render() {
        const { featuresStore } = this.props;
        return (
            <FadeAnimation 
                display="flex">
                <div className="wrapper-flex">
                    <Header 
                        title={title}/>
                    <MetaData 
                        title={title}>
                        <TreehubContainer 
                            featuresStore={featuresStore}
                        />
                    </MetaData>
                </div>
            </FadeAnimation>
        );
    }
}

Treehub.propTypes = {
    featuresStore: PropTypes.object
}

export default Treehub;
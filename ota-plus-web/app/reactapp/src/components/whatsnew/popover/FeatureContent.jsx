import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';

@observer
class FeatureContent extends Component {
    render() {
        const { data } = this.props;
        const renderContent = !_.isUndefined(data);
        const hasSimpleMarkup = !data.message.__html;
        return (
            renderContent ?
                <div className="content">
                    <h2 className="headline">{ data.title }</h2>
                    <div className="message">
                        {
                            hasSimpleMarkup ?
                                <p>{ data.message }</p>
                                :
                                <div dangerouslySetInnerHTML={ data.message }/>
                        }
                    </div>
                </div>
                :
                <div className="wrapper-center">
                    <p>{ "Something went wrong" }</p>
                </div>
        )
    }
}

FeatureContent.propTypes = {
    data: PropTypes.object,
};

export default FeatureContent;
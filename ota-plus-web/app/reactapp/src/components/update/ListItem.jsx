import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class ListItem extends Component {
    render() {
    	const { update } = this.props;
        return (
           <div className="c-update">
            	<div className="c-update__item item">
            		<div className="c-update__teaser">
		                <div className="c-update__name">
		                    {update.name}
		                </div>
		                <div className="c-update__hash">
		                   	{update.hash}
		                </div>
		                <div className="c-update__edit">
		                	<div className="c-update__edit-link">
		                    	Edit
		                	</div>
		                </div>
		            </div>
            	</div>
            </div>
        );
    }
}

ListItem.propTypes = {
}

export default ListItem;
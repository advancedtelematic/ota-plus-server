import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observe, observable } from 'mobx';
import _ from 'underscore';

@observer
class Comment extends Component {
	@observable activeEditField = false;
    @observable showEditButton = false;
    @observable commentFieldLength = 0;
    @observable commentTmp = '';
    @observable previouslySavedComment = '';

	constructor(props) {
        super(props);
        this.enableEditField = this.enableEditField.bind(this);
        this.disableEditField = this.disableEditField.bind(this);
        this.changeCommentFieldLength = this.changeCommentFieldLength.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);       
    }
    componentWillMount() {
        this.commentTmp = this.props.version.description;
        this.previouslySavedComment = this.props.version.description;
    }
   	enableEditField(e) {
   		if (e) e.preventDefault();
        this.activeEditField = true;
    }
    disableEditField(e) {
    	if (e) e.preventDefault();
        var that = this;
        setTimeout(function(){
            if(document.activeElement.className.indexOf('accept-button') == -1) {
                that.activeEditField = false;
                that.commentTmp = that.previouslySavedComment;
            }
        }, 1);
    }
    changeCommentFieldLength(e) {
        var val = e.target.value;
        this.commentFieldLength = val.length;
        this.commentTmp = val;
    }
    handleSubmit(name, version, e) {
    	if (e) e.preventDefault();
        this.commentTmp = this.refs.comment.value;
        this.previouslySavedComment = this.refs.comment.value;
        const data = {
            name: name,
            version: version,
            details: {
                description: this.commentTmp
            }
        };
        this.props.packagesStore.updatePackageDetails(data);        
        this.activeEditField = false;
    }

	render() {
		const { version } = this.props;
		return (
			<div className="comments-section">
				<textarea 
		            className="input-comment" 
		            name="comment" 
		            value={this.commentTmp} 
		            type="text"
                    ref="comment" 
		            placeholder="Comment here." 
		            onKeyUp={this.changeCommentFieldLength.bind(this)}
		            onChange={this.changeCommentFieldLength.bind(this)}
		            onFocus={this.enableEditField.bind(this)}
	            />
	            {this.commentFieldLength > 0 && this.activeEditField ?
	                <div className="action-buttons">
	                    <a href="#" className="cancel-button" onClick={this.disableEditField}>
	                        <img src="/assets/img/icons/close.svg" alt="" />
	                    </a>
	                    &nbsp;
	                    <a href="#" className="accept-button" onClick={this.handleSubmit.bind(this, version.id.name, version.id.version)}>
	                        <img src="/assets/img/icons/accept_icon.png" alt="" />
	                    </a>
	                </div>
	            :
	            	null}
        	</div>	
		);
	}
}

export default Comment;
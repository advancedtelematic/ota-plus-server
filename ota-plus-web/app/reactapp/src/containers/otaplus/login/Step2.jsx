import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';

const inputs = [1,2,3,4,5,6];

@observer
class Step2 extends Component {
	@observable focusedElement = 1;

    constructor(props) {
        super(props);
        this.validateInput = this.validateInput.bind(this);
        this.makeFocus = this.makeFocus.bind(this);        
    }
    componentDidMount() {
    	this.makeFocus(this.focusedElement);
    }
    validateInput(e) {
    	if(this.focusedElement !== _.last(inputs)) {
    		this.focusedElement = ++this.focusedElement;
    		this.makeFocus();
    	} else {
    		this.context.router.push('/dashboard');
    	}
    }
    makeFocus(id) {
		document.getElementById(this.focusedElement).focus();
    }
    render() {
        return (
            <div className="ota-plus-login-container">
            	<div className="logo">
            		<img src="/assets/img/icons/white/ota-plus-logo.png" alt="Image" />
            	</div>
            	<div className="form">
            		<form>
            			<div className="lock">
            				<img src="/assets/img/icons/white/lock.png" alt="Icon" />
            			</div>
        				{_.map(inputs, (id, i) => {
        					return (
			    				<input key={i} type="number" name="digit" className="digit" min="0" max="9" onChange={this.validateInput} id={id} />
							);
        				})}
	                </form>
            	</div>
            </div>
        );
    }
}

Step2.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Step2;
import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class Step1 extends Component {	
    constructor(props) {
        super(props);
        this.onDocumentKeyPress = this.onDocumentKeyPress.bind(this);
        this.redirectToNextStep = this.redirectToNextStep.bind(this);
    }
    componentDidMount() {
        document.getElementsByTagName("body")[0].addEventListener("keypress", this.onDocumentKeyPress);
    }
    componentWillUnmount() {
        document.getElementsByTagName("body")[0].removeEventListener("keypress", this.onDocumentKeyPress)
    }
    onDocumentKeyPress(e) {
        if(e.which == 13) {
            this.redirectToNextStep();
        }
    }
    redirectToNextStep(e) {
    	if(e) e.preventDefault();
    	this.context.router.push('/login/digits');
    }
    render() {
    	const { userStore } = this.props;
    	const password = "************";
        return (
            <div className="ota-plus-login-container">
            	<div className="logo">
            		<img src="/assets/img/icons/white/ota-plus-logo.png" alt="Image" />
            	</div>
            	<div className="form">
            		<form>
                    	<input type="email" name="email" defaultValue={userStore.user.email} placeholder="Email" className="input-wrapper" required />
                    	<input type="password" name="password" defaultValue={password} placeholder="Password" className="input-wrapper" required />
                    	<div className="submit">
                    		<input type="submit" name="submit" className="btn-main" id="submit" onClick={this.redirectToNextStep} value={"Log in"} />
                    	</div>
	                </form>
            	</div>
            </div>
        );
    }
}

Step1.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Step1;
import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { FlatButton } from 'material-ui';
import Cookies from 'js-cookie';
import Modal from './Modal';

@observer
class SizeVerify extends Component {
    @observable sizeVerifyHidden = true;

    constructor(props) {
        super(props);
        this.checkSize = this.checkSize.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        window.addEventListener("resize", this.checkSize);
        this.checkSize();
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.checkSize);
    }
    checkSize() {
        this.sizeVerifyHidden = (Cookies.get('sizeVerifyHidden') == 1 || (window.innerWidth >= this.props.minWidth && window.innerHeight >= this.props.minHeight));
    }
    handleClick() {
        const dontShowAgain = this.refs.checkbox.checked;
        if(dontShowAgain)
            Cookies.set('sizeVerifyHidden', 1);
        this.sizeVerifyHidden = true;
    }
    render() {
        const { minWidth, minHeight } = this.props;
        const content = (
            <span>
                <div className="desc" style={{textAlign: 'left'}}>
                    HERE OTA Connect works best in a browser window that is at least <strong>{minWidth} x {minHeight}</strong>. <br />
                    You can still use it at a smaller size, but we recommend using a desktop browser for the best experience.
                </div>
                <div className="body-actions">
                    <div className="wrapper-checkbox">
                        <input 
                            type="checkbox" 
                            name="dontShowAgain"
                            id="size-verify-dismiss"
                            value="1" 
                            ref="checkbox"
                        />&nbsp;
                        <span>Don't show this again</span>
                    </div>
                    <button
                        id="size-verify-confirm"
                        className="btn-primary"
                        onClick={this.handleClick}
                    >
                        OK
                    </button>
                </div>
            </span>
        );
        return (
            <Modal 
                title={"Tip"}
                content={content}
                shown={!this.sizeVerifyHidden}
                className="size-verify-modal"
            />
        );
    }
}

SizeVerify.propTypes = {
    minWidth: PropTypes.number,
    minHeight: PropTypes.number
}

SizeVerify.defaultProps = {
    minWidth: 1280,
    minHeight: 768
}

export default SizeVerify;
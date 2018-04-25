import React, {Component} from 'react';
import {observable} from "mobx"
import {observer} from 'mobx-react';

@observer
export default class Terms extends Component {
    @observable termsAccepted = false;

    render() {
        const {setTermsAccepted} = this.props;
        return (
            <div className="terms">
                <div className="wrapper-center wrapper-responsive">
                    <div className="logo">
                        <img src="/assets/img/HERE_pos.png" alt="HERE"/>
                    </div>
                    <div className="title">
                        Terms and conditions
                    </div>
                    <div className="checkbox-wrapper">
                        <button className={`btn-checkbox ${this.termsAccepted ? 'checked': ''}`} onClick={() => this.termsAccepted = !this.termsAccepted}>
                            <i className="fa fa-check" aria-hidden="true"></i>
                        </button>
                        <p>I AGREE TO OUR <a href="#">SERVICE TERMS</a> AND <a href="#">PRIVACY POLICY.</a></p>
                    </div>
                    <div className="steps">
                        <button className="back btn-primary">Back</button>
                        {this.termsAccepted ?
                            <button className="next btn-primary" onClick={setTermsAccepted}>Continue</button> :
                            <button className="next btn-primary" disabled>Continue</button>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

import { observable } from 'mobx';

export default class OtaPlusStore {
    @observable alphaPlusEnabled = false;
    @observable otaPlusMode = false;

    _toggleOtaPlusMode() {
    	this.otaPlusMode = !this.otaPlusMode;
    }

    _enableOtaPlusMode() {
    	this.otaPlusMode = true;
    }

    _enableAlphaPlus() {
    	this.alphaPlusEnabled = true;
    }
}

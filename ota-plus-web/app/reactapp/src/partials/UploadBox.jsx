import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import Draggable from 'react-draggable';
import { Circle } from 'react-progressbar.js';
import { translate } from 'react-i18next';
import _ from 'underscore';
import {
    PackagesCancelUploadModal,
    PackagesCancelAllUploadsModal
} from '../components/packages';
import { ConvertTime, ConvertBytes } from '../utils';

@observer
class UploadBox extends Component {
    @observable cancelUploadModalShown = false;
    @observable cancelAllUploadsModalShown = false;
    @observable actionUploadIndex = null;
    @observable ifClearUploads = false;

    constructor(props) {
        super(props);
        this.toggleMode = this.toggleMode.bind(this);
        this.removeFromList = this.removeFromList.bind(this);
        this.showCancelUploadModal = this.showCancelUploadModal.bind(this);
        this.hideCancelUploadModal = this.hideCancelUploadModal.bind(this);
        this.showCancelAllUploadsModal = this.showCancelAllUploadsModal.bind(this);
        this.hideCancelAllUploadsModal = this.hideCancelAllUploadsModal.bind(this);
        this.close = this.close.bind(this);
    }
    toggleMode(e) {
        if(e) e.preventDefault();
        this.props.toggleUploadBoxMode();
    }
    removeFromList(index, e) {
        if(e) e.preventDefault();
        this.props.packagesStore.packagesUploading.splice(index, 1);
    }
    showCancelUploadModal(index, e) {
        if(e) e.preventDefault();
        this.cancelUploadModalShown = true;
        this.actionUploadIndex = index;
    }
    hideCancelUploadModal(e) {
        if(e) e.preventDefault();
        this.cancelUploadModalShown = false;
        this.actionUploadIndex = null;
    }
    showCancelAllUploadsModal(ifClear = false, e) {
        if(e) e.preventDefault();
        this.cancelAllUploadsModalShown = true;
        this.ifClearUploads = ifClear;
    }
    hideCancelAllUploadsModal(e) {
        if(e) e.preventDefault();
        this.cancelAllUploadsModalShown = false;
    }
    close(e) {
        if(e) e.preventDefault();
        let uploadFinished = true;
        _.each(this.props.packagesStore.packagesUploading, (upload) => {
            if(upload.status === null)
                uploadFinished = false;
        });
        if(uploadFinished) {
            this.props.packagesStore.packagesUploading = [];
        } else {
            this.showCancelAllUploadsModal(true, null);
        }
    }
    render() {
        const { t, packagesStore, minimized } = this.props;
        const barOptions = {
            strokeWidth: 18,
            easing: 'easeInOut',
            color: '#A7DCD4',
            trailColor: '#eee',
            trailWidth: 18,
            svgStyle: null
        };
        let uploadFinished = true;
        let totalSize = 0;
        let secondsRemaining = 0;
        _.each(packagesStore.packagesUploading, (upload) => {
            let uploadSize = upload.size / (1024 * 1024);
            let uploadedSize = !isNaN(upload.uploaded) ? upload.uploaded / (1024 * 1024) : 0;
            let uploadSpeed = !isNaN(upload.upSpeed) ? upload.upSpeed : 100;
            let timeLeft = (upload.size - upload.uploaded) / (1024 * uploadSpeed);
            timeLeft = isFinite(timeLeft) ? timeLeft : secondsRemaining;
            secondsRemaining = timeLeft > secondsRemaining ? timeLeft : secondsRemaining;
            if(upload.status === null)
                uploadFinished = false;
        });
        return (
            <span>
                {packagesStore.packagesUploading.length ?
                    <Draggable
                        bounds="html"
                        disabled={true}
                    >
                        <div id={minimized ? "" : "upload-box"} className={minimized ? "minimized" : ""}>
                            <div className="heading">
                                Uploading {t('common.packageWithCount', {count: packagesStore.packagesUploading.length})}
                                <a href="#" className="box-toggle pack-box-maximize" title="Toggle upload box size" onClick={this.toggleMode}>
                                    <i className={"fa toggle-modal-size " + (minimized ? "fa-angle-up" : "fa-angle-down")} aria-hidden="true"></i>
                                </a>
                                {!minimized ?
                                    <a href="#" className="box-close" title="Close" onClick={this.close}>
                                        <span className="fa-stack close-x">
                                            <i className="fa fa-angle-down fa-stack-1x"></i>
                                            <i className="fa fa-angle-up fa-stack-1x"></i>
                                        </span>
                                    </a>
                                :
                                    null
                                }
                            </div>
                            {!minimized ?
                                <span>
                                    <div className="subheading">
                                        <div className="left">
                                            {uploadFinished ? 
                                                <span>
                                                    Upload is finished
                                                </span>
                                            :
                                                <span>
                                                    <ConvertTime 
                                                        seconds={secondsRemaining}
                                                    />
                                                    &nbsp;left
                                                </span>
                                            }
                                        </div>
                                        <div className="right">
                                            {!uploadFinished ? 
                                                <a href="#" onClick={this.showCancelAllUploadsModal.bind(this, false)}>Cancel all</a>
                                            :
                                                null
                                            }
                                        </div>
                                    </div>
                                    <div className="content">
                                        <ul className="list">
                                            {_.map(packagesStore.packagesUploading, (upload, index) => {
                                                return (
                                                    <li key={index}>
                                                        <div className="col name">
                                                            {upload.package.name}
                                                        </div>
                                                        <div className="col version">
                                                            {upload.package.version}
                                                        </div>
                                                        <div className="col uploaded">
                                                            <ConvertBytes 
                                                                bytes={upload.uploaded}
                                                            />
                                                            &nbsp;of&nbsp; 
                                                            <ConvertBytes 
                                                                bytes={upload.size}
                                                            />
                                                        </div>
                                                        <div className="col status">
                                                            {upload.progress !== 100 && upload.status === null ?
                                                                <Circle
                                                                    progress={upload.progress / 100}
                                                                    options={barOptions}
                                                                    initialAnimate={false}
                                                                    containerStyle={{
                                                                        width: '30px', 
                                                                        height: '30px',
                                                                        display: 'inline-block',
                                                                        verticalAlign: 'middle',
                                                                        margin: '-3px 0 0 0'
                                                                    }}
                                                                />
                                                            :
                                                                upload.status == 'success' ?
                                                                    <span>
                                                                        <i className="fa fa-check-circle" aria-hidden="true"></i> Success
                                                                    </span>
                                                                :
                                                                    upload.status == 'error' ?
                                                                        <span>
                                                                            <i className="fa fa-exclamation-triangle" aria-hidden="true"></i> Error
                                                                        </span>
                                                                    :
                                                                        <span>
                                                                            <i className="fa fa-square-o fa-spin"></i> &nbsp;
                                                                            <span className="counting black">Processing</span>
                                                                        </span>
                                                            }
                                                        </div>
                                                        <div className="col action">
                                                            {upload.status === null ?
                                                                <a href="#" onClick={this.showCancelUploadModal.bind(this, index)}>
                                                                    cancel
                                                                </a>
                                                            :
                                                                <a href="#" onClick={this.removeFromList.bind(this, index)}>
                                                                    remove from list
                                                                </a>
                                                            }
                                                        </div>
                                                    </li>
                                                );
                                            }, this)}
                                        </ul>
                                    </div>
                                </span>
                            :
                                null
                            }
                        </div>
                    </Draggable>
                :
                    null
                }
                <PackagesCancelUploadModal 
                    shown={this.cancelUploadModalShown}
                    hide={this.hideCancelUploadModal}
                    uploadIndex={this.actionUploadIndex}
                    packagesStore={packagesStore}
                />
                <PackagesCancelAllUploadsModal 
                    shown={this.cancelAllUploadsModalShown}
                    hide={this.hideCancelAllUploadsModal}
                    ifClearUploads={this.ifClearUploads}
                    packagesStore={packagesStore}
                />
            </span>
        );
    }
}

UploadBox.propTypes = {
    packagesStore: PropTypes.object
}

export default translate()(UploadBox);
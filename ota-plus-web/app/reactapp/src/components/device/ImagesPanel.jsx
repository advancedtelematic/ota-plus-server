import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Form } from 'formsy-react';
import { SubHeader, SearchBar, Loader } from '../../partials';
import { ImagesList } from './images';
@observer
class ImagesPanel extends Component {
    constructor(props) {
        super(props);
        this.changeSort = this.changeSort.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
    }
    changeSort(sort, e) {
        if(e) e.preventDefault();
        this.props.imagesStore._prepareImages(sort);
    }
    changeFilter(filter) {

    }
    render() {
        const { imagesStore, device, toggleImageAutoUpdate, installImage } = this.props;
        return (
            <div className="images-panel">
                <div className="darkgrey-header">
                    Images
                </div>
                <div className="wrapper-full">
                    <SubHeader>
                        <Form>
                            <SearchBar 
                                value={imagesStore.imagesFilter}
                                changeAction={this.changeFilter}
                            />
                        </Form>
                        <div className="sort-box">
                            {imagesStore.imagesSort == 'asc' ? 
                                <a href="#" onClick={this.changeSort.bind(this, 'desc')} id="link-sort-images-desc">
                                    <i className="fa fa-long-arrow-up" aria-hidden="true"></i> A &gt; Z
                                </a>
                            :
                                <a href="#" onClick={this.changeSort.bind(this, 'asc')} id="link-sort-images-asc">
                                    <i className="fa fa-long-arrow-down" aria-hidden="true"></i> Z &gt; A
                                </a>
                            }
                        </div>
                    </SubHeader>

                    <div className="wrapper-images">
                        {imagesStore.imagesFetchAsync.isFetching ?
                            <div className="wrapper-loader">
                                <Loader />
                            </div>
                        :
                            <ImagesList
                                imagesStore={imagesStore}
                                deviceId={device.uuid}
                                toggleImageAutoUpdate={toggleImageAutoUpdate}
                                installImage={installImage}
                            />
                        }
                    </div>

                    <div className="wrapper-statistics">
                        some stats
                    </div>
                </div>
            </div>
        );
    }
}

ImagesPanel.propTypes = {
    imagesStore: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired,
    toggleImageAutoUpdate: PropTypes.func.isRequired,
    installImage: PropTypes.func.isRequired,
}

export default ImagesPanel;
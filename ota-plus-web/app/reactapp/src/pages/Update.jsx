import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { Loader } from '../partials';
import { UpdateContainer } from '../containers';

const title = "Update";

@inject("stores")
@observer
class Update extends Component {
  componentWillMount() {
    const { updateStore } = this.props.stores;
    updateStore.fetchUpdates();
  }
  componentWillUnmount() {
    const { updateStore } = this.props.stores;
    updateStore._reset();
  }
  render() {
    return (
      <FadeAnimation>
        <MetaData
          title={title}>
          <UpdateContainer />
        </MetaData>
      </FadeAnimation>
    );
  }
}


export default Update;
import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
class UsersAndRoles extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <main id="billing">
                <div className="title">
                    <img src="/assets/img/icons/black/billing.png" alt=""/>
                    Users and roles
                </div>

                <hr />

                <span>Users and roles</span>
            </main>
        );
    }
}

UsersAndRoles.propTypes = {
};

export default UsersAndRoles;
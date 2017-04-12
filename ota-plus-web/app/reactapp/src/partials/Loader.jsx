import React, { PropTypes } from 'react';
import { CircularProgress } from 'material-ui';

const Loader = (props) => {
    const { className, size, thickness } = props;
    return (
        <div className={"loader" + (className ? " " + className : "")}>
            <CircularProgress
                size={size}
                thickness={thickness}
            />
        </div>
    );
}

Loader.propTypes = {
    className: PropTypes.string,
    size: PropTypes.number,
    thickness: PropTypes.number,
};

Loader.defaultProps = {
    size: 40,
    thickness: 3.5,
};

export default Loader;
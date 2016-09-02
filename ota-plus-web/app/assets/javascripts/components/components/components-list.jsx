define(function(require) {
  var React = require('react'),
      db = require('stores/db');

  class ComponentsList extends React.Component {
    constructor(props) {
      super(props);
    }
    componentDidMount() {
      if(this.props.mainLevel)
        this.props.handleMenu();
    }
    render() {
      var data = this.props.data;
      var result;
      
      if(this.props.mainLevel) {
        if(!_.isUndefined(data.id) && (!_.isUndefined(data.description) || !_.isUndefined(data.class))) {
          result = (
            <li>
              <a href="#" data-id={data.id}>
                <span className="components-menu-icon"></span>
                {data.description ? data.description : data.class}
                <i className="fa fa-info components-info-icon"></i>
              </a>
              <ul>
                <ComponentsList
                  data={data.children}
                  mainLevel={false}/>
              </ul>
            </li>
          );
        } else {
          result = (
            <div className="text-center center-xy padding-15">
              This device hasn’t reported any information about
              its hardware or system components yet.
            </div>
          );
        }
      } else {
        result = (
          <li>
            {_.map(data, function(child, i) {
              if(!_.isUndefined(child.id) && (!_.isUndefined(child.description) || !_.isUndefined(child.class))) {
                return (
                  <span key={"components-list-menu-" + child.id + "-" + child.class}>
                    <a href="#" data-id={child.id}>
                      <span className="components-menu-icon"></span>
                      {!_.isUndefined(child.description) ? child.description : child.class}
                      <i className="fa fa-info components-info-icon"></i>
                    </a>
                    {!_.isUndefined(child.children) && typeof child.children === 'object' ? 
                      <ul>
                        <ComponentsList
                          data={child.children}
                          mainLevel={false}/>
                      </ul>
                    : null}
                  </span>
                );
              } else {
                return false;
              }
            })}
          </li>
        );
      }
      
      return (
        result
      );
    }
  };

  return ComponentsList;
});

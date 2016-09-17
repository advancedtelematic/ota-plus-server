define(function(require) {
  var React = require('react'),
      db = require('stores/db');

  class ComponentsOverlay extends React.Component {
    constructor(props) {
      super(props);
      db.components.addWatch("poll-components-overlay", _.bind(this.forceUpdate, this, null));
      
      this.findNode = this.findNode.bind(this);
    }
    componentDidMount() {
    }
    componentWillUnmount() {
      db.components.removeWatch("poll-components-overlay");
    }
    findNode(id, currentNode) {
      var i, currentChild, result;
      if (id == currentNode['id-nr']) {
        return currentNode;
      } else {
        if (currentNode.children != null) {
          for (i = 0; i < currentNode.children.length; i += 1) {
            currentChild = currentNode.children[i];
            result = this.findNode(id, currentChild);
            if (result !== false) {
              return result;
            }
          }
        }
        return false;
      }
    }
    render() {
      var node = this.findNode(this.props.id, this.props.data);
      var general = [];
      var details = _.map(node, function(data, index) {
        if(index !== 'children') {
          var result;
          if(typeof data === 'object') {
            result = _.map(data, function(d, i) {
              return (
                <tr key={'component-row-' + i}>
                  <th>{i}:</th>
                  <td>{d}</td>
                </tr>
              );
            });
            
            return (
              <div key={'component-wrapper-' + index} className="margin-top-20 black">
                <div className="components-details-header">
                  <span className="text-capitalize font-14"><strong>{index}</strong></span>
                </div>
                <div className="row">
                  <div className="col-md-6 col-md-offset-1">
                    <table className="table margin-top-10">
                      <tbody>
                        {result}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          } else if(index !== 'id-nr'){
            general.push(
              <tr key={'component-' + index}>
                <th>{index}:</th>
                <td>{data}</td>
              </tr>
            );
          }
        }
      }, this);
            
      return (
        <div id="components-overlay">
          <div className="components-details">
            <span className="font-14"><strong>OVERVIEW</strong></span>
    
            <button className="btn-close-components" onClick={this.props.closeDetails}>
              <img src="/assets/img/icons/back.png" className="img-responsive" alt=""/>
            </button>
    
            <div className="margin-top-20 text-center">
              <img src="/assets/img/icons/chip.png" alt="" style={{width: '90px'}}/>
            </div>
    
            <div className="margin-top-20 text-center font-20">
              <strong>
                {node.product ? node.product : node.description ? node.description : node.class}
              </strong>
            </div>
            
            <div className="margin-top-20 black">
              <div className="components-details-header">
                <span className="font-14"><strong>General Informations</strong></span>
              </div>
              <div className="row">
                <div className="col-md-6 col-md-offset-1">
                  <table className="table margin-top-10">
                    <tbody>
                      {general}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {details}
          </div>
        </div>
      );
    }
  };

  return ComponentsOverlay;
});

define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher');

  class PackagesListItemDetailsVersion extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        activeEditField: false,
        showEditButton: false,
        commentFieldLength: 0,
        comment: this.props.version.description,
        commentTmp: this.props.version.description,
      };
      this.enableEditField = this.enableEditField.bind(this);
      this.disableEditField = this.disableEditField.bind(this);
      this.changeCommentFieldLength = this.changeCommentFieldLength.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentWillReceiveProps(nextProps) {
      if(nextProps.version.description !== this.props.version.description)
        this.setState({
          comment: nextProps.version.description,
          commentTmp: nextProps.version.description
        });
    }
    enableEditField(e) {
      e.preventDefault();
      this.setState({
        activeEditField: true
      });
      this.changeCommentFieldLength();
    }
    disableEditField(e) {
      e.preventDefault();
      var that = this;
      setTimeout(function(){
        if(document.activeElement.className.indexOf('accept-button') == -1) {
          that.setState({
            activeEditField: false,
            commentTmp: that.state.comment,
          });
        }
      }, 1);
    }
    changeCommentFieldLength() {
      var val = this.refs.comment.value;
      this.setState({
        commentFieldLength: val.length,
        commentTmp: val
      });
    }
    handleSubmit(e) {
      e.preventDefault();
      this.setState({
        comment: this.refs.comment.value,
        commentTmp: this.refs.comment.value,
        activeEditField: false
      });
      
      SotaDispatcher.dispatch({
        actionType: 'update-package-details',
        name: this.props.version.id.name,
        version: this.props.version.id.version,
        data: {"description": this.refs.comment.value}
      });
    }
    render() {
      return (
        <li className="package-version">
          <div className="package-left-box pull-left">
            <form>
              <fieldset>
                <input className="input-comment" name="comment" value={this.state.commentTmp} type="text" placeholder="Comment here." ref="comment" onKeyUp={this.changeCommentFieldLength} onChange={this.changeCommentFieldLength} onFocus={this.enableEditField} />
                {this.state.commentFieldLength > 0 && this.state.activeEditField ?
                  <div className="pull-right">
                    <a href="#" className="cancel-button pull-right" onClick={this.disableEditField}>
                      <img src="/assets/img/icons/close_icon.png" alt="" />
                    </a>
                    &nbsp;
                    <a href="#" className="accept-button pull-right" onClick={this.handleSubmit}>
                      <img src="/assets/img/icons/accept_icon.png" alt="" />
                    </a>
                  </div>
                : null}
              </fieldset>
            </form>
          </div>
          <div className="package-right-box pull-right text-right">
            <div className="package-statuses pull-right">
              v. {this.props.version.id.version}
            </div>
          </div>
        </li>
      );
    }
  };

  return PackagesListItemDetailsVersion;
});

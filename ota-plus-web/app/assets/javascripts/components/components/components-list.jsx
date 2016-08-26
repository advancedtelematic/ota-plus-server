define(function(require) {
  var React = require('react'),
      db = require('stores/db');

  class ComponentsList extends React.Component {
    constructor(props) {
      super(props);
    }
    componentWillReceiveProps(nextProps) {
      if(this.props.id !== nextProps.id) {
        $('#components-menu a').removeClass('selected');
        $('#components-menu').find('[data-id="' + nextProps.id + '"]').addClass('selected');
      }
    }
    componentDidMount() {
      var that = this;
      
      var MenuTree = {
        collapse: function(element) {
          element.slideToggle(500);
        },
        walk: function() {
          var padding_step = '10%';
          var max_nested_lvl = 0;
          $('a', '#components-menu').each(function() {
            var $a = $(this);
            max_nested_lvl = ($a.parents('li').length > max_nested_lvl) ? $a.parents('li').length : max_nested_lvl;
          });
            
          padding_step = Math.round(30 / max_nested_lvl);
                        
          $('a', '#components-menu').each(function() {
            var $a = $(this);
            var $li = $a.parent();

            if ($a.next().is('ul')) {
              var $ul = $a.next();
              $a.click(function(e) {
                e.preventDefault();
                if(e.target.className.indexOf('components-info-icon') > -1) {
                  that.props.showDetails($a.data('id'))
                } else {
                  MenuTree.collapse($ul);
                  $a.toggleClass('active').promise().done(function() {
                    $a.find('.components-menu-icon').html('<i class="fa fa-chevron-'+($a.hasClass('active') ? 'down' : 'right')+'" aria-hidden="true"></i> ');
                    if(!$a.hasClass('active') && $a.next('ul').find('[data-id="' + that.props.id + '"]').length) {
                      that.props.closeDetails();
                    }
                  });
                }
              });
              $a.find('.components-menu-icon').html('<i class="fa fa-chevron-right" aria-hidden="true"></i> ');
            } else {
              $a.click(function(e) {
                e.preventDefault();
                if(e.target.className.indexOf('components-info-icon') > -1) {
                  that.props.showDetails($a.data('id'))
                }
              });
            }
            var padding = $a.parents('li').length * padding_step + '%';
            $a.css('padding-left', padding);
          });
        }
      };
      
      var menu = $('#components-menu');
      var result = this.parseMenu(this.props.data, true);
      menu.append(result);
      MenuTree.walk();
    }
    parseMenu(data, isMain) {
      var html = '';
      if(isMain) {
        html += '<li><a href="#" data-id='+ data.id +'><span class="components-menu-icon"></span>'+(data.description ? data.description : data.class)+'<i class="fa fa-info components-info-icon"></i></a><ul>';
        html += this.parseMenu(data.children, false);
        html += '</ul></li>';
      } else {
          for (var i=0; i<data.length; i++) {
            html += '<li><a href="#" data-id='+ data[i].id +'><span class="components-menu-icon"></span>'+(data[i].description ? data[i].description : data[i].class)+'<i class="fa fa-info components-info-icon"></i></a>';
            if (data[i].children != null) {
              html += '<ul>';
              html += this.parseMenu(data[i].children, false);
              html += '</ul>';
            }
            html += '</li>';
          }
      }
      return html;
    }
    render() {
      return (
        <div id="components-list" style={{height: this.props.height}}>
          <ul id="components-menu"></ul>
        </div>
      );
    }
  };

  return ComponentsList;
});

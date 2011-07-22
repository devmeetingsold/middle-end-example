(function(global, exports){  
  
  var paragraph = function() {
    var __doc = global.document;
    var p, container = __doc.getElementById('container');
    for(var i =0; i < 5; i++) {
      p = __doc.createElement('p');
      p.innerHTML = 'generated paragraph nr ' + i;
      p.style.display = 'none';
      container.appendChild(p);
      
      jQuery.fx.off ? jQuery(p).show() : jQuery(p).delay((i+1) * 500).fadeIn();
    }
  }
  
  exports.paragraph = {
    render : paragraph
  }
  
}).call({}, window, window); //use window as exports, normally this could some be app namespace

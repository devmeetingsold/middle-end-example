(function(global, exports) {

    function render(model) {
        var __doc = global.document;
        container = __doc.getElementById('container');
        
        var list = $(Mustache.to_html(model.snippets.flights, model.data));
        list.hide().appendTo(container);        

        jQuery.fx.off ? jQuery(list).show() : jQuery(list).fadeIn();
    }
     
    exports.flights = { 
        render : render
    }; 
}).call({}, window, window); //use window as exports, normally this could some be app namespace>>>>>>> .r156

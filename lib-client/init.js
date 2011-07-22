(function(exports){
  
  var init = function(model) {
    exports.flights.render(model);
    exports.paragraph.render(model);
    //console.log(exports);   
  }
  
  exports.init = init;
  
}).call(this, window);

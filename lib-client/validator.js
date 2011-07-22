(function(global, exports){  
    var validators = {
        required: function(value) {
            return value !== null && value !== "";
        }
    };
    
    var messages = {
        required: "Field is required"
    };
    
//    model = {
//        name : "",
//        lastname: "rest",
//        phone : ""
//    }
//    
//    rules = {
//        name: ["required"],
//        lastname: ["required"]
//    }
    function validate(model, rules) {
        var key, rules, errors = [], fieldRules, i;
        for (key in model) {
            fieldRules = rules[key];
            if (fieldRules) {
                value = model[key];
                fieldRules.forEach(function(rule) {
                   var valid = validators[rule](value);
                   if (!valid) {
                       errors.push({
                           field: key, 
                           message: messages[rule]
                       });
                   }
                });
            }
        }
        
        return errors;
    }
    
    exports.validate = validate;
}).call({}, typeof global == "undefined" ? window : global, 
            typeof exports == "undefined" ? window : exports); 
//use window as exports, normally this could some be app namespace
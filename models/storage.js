var mongoose=require('mongoose');
//Schema
var ModuleSchema=mongoose.Schema({
    filename:{
        type:String,
        required:true
    },
    originalname:{
        type:String,
        required:true
    },
    fieldname:{
        type:String,
   
    },
    encoding:{
        type:String,
        
    },
    mimetype:{
        type:String,
       
    },
    destinations:{
        type:String,
        
    },
    path:{
        type:String,
       
    },
    size:{
        type:String,
       
    }
});

var Module=module.exports=mongoose.model('Module',ModuleSchema);
// Get Call
module.exports.getModule=function(callback,limit){
    Module.find(callback).limit(limit);
};
// Post Call
module.exports.addModule=function(module,callback){
    Module.create(module,callback);
};

// Delete Call
module.exports.deleteModule=function(originalname,callback){
    var query={originalname:originalname};
    Module.deleteOne(query,callback);
};
// Get One Module By Id
module.exports.getModuleById=function(originalname,callback){
    var query={originalname: originalname}
    Module.findOne(query,callback);
};
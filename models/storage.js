var mongoose=require('mongoose');

var ModuleSchema=mongoose.Schema({
    filename:{
        type:String,
        required:true
    },
    originalname:{
        type:String,
        required:true
    }
});

var Module=module.exports=mongoose.model('Module',ModuleSchema);

module.exports.getModule=function(callback,limit){
    Module.find(callback).limit(limit);
};

module.exports.addModule=function(module,callback){
    Module.create(module,callback);
};


module.exports.deleteModule=function(id,callback){
    var query={_id:id};
    Module.deleteOne(query,callback);
};
// module.exports.deleteQuestion=function(id,callback){
//     var query={id:id};
//     Question.findByIdAndRemove(id,callback);
// };
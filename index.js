var express = require('express');
var app = express();
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');

// CORS Definition
app.use(function (req, res, next) {
    if (req.method === 'OPTIONS') {
        console.log('!OPTIONS');
        var headers = {};
        headers["Access-Control-Allow-Origin"] = "*";
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = false;
        headers["Access-Control-Max-Age"] = '86400';
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
        res.writeHead(200, headers);
        res.end();
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Max-Age", "3600");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    next();
});

// Middleware
app.use(express.static(__dirname + '/storage'));
app.use('/storage/uploads', express.static(__dirname + '/storage/uploads'));
app.use(morgan('dev'));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// DB Connection
Module = require('./models/storage');
mongoose.connect("mongodb://localhost:27017/cli", { useNewUrlParser: true });
var db = mongoose.connection;

// Storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './storage/uploads/');
    },
    filename: function (req, file, cb) {

        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});


var uploadSingle = multer({
    storage: storage
}).single('avatar');


app.get('*', function (req, res) {
    res.sendfile('./storage/uploads');
});

// API for single file upload && POST Call
app.post('/api/v1/modules', function (req, res) {

    uploadSingle(req, res, function (err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }

        var module = new Module({
            filename: req.file.filename,
            originalname: req.file.originalname
        });
        Module.addModule(module, function (err, module) {
            if (err) {
                throw err;
            }
            app.set('json spaces', 2);
            res.json(module);
        });
    });
});


// Get Call
app.get('/api/v1/modules', function (req, res) {
    Module.getModule(function (err, module) {

        if (err) {
            throw err;
        }
        app.set('json spaces', 2);
        res.json(module);
    });

});

// Delete Call
app.delete('/api/v1/modules/:originalname', function (req, res) {
    var originalname = req.params.originalname;
    Module.deleteModule(originalname, function (err, module) {
        if (err) {
            console.log(err);
        }
        app.set('json spaces', 2);
        res.json(module);
    });
});


app.listen(process.env.PORT || 9004, function () {
    console.log("App listening on port 9004");
});


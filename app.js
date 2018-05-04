/**
 * @description Node Server for virtual classroom
 * @author AssassinDev422 saas.exp7@gmail.com
 * @version 0.0.1
 */
var slide_now;
var slide_prv;
var conferenceRoomId;
var conductorId;
var conductees;
var reciever;
var sender;
var cluster = require('cluster');
var store = new(require('socket.io-clusterhub'));
var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    redis = require('redis');
fs = require('fs');
var https = require("https");
var propertiesfile = require(__dirname + '/properties.json');
var privateKey = fs.readFileSync(__dirname + propertiesfile.private_key).toString();
var certificate = fs.readFileSync(__dirname + propertiesfile.certificate).toString();
var options = {
    key: privateKey,
    cert: certificate
};
var ssl_port = propertiesfile.ssl_port;
var default_port = propertiesfile.default_port;
var workerCount = propertiesfile.worker_count;
//var workerCount; //require('os').cpus().length;
var namespace = propertiesfile.namespace;
var app = express();
// all environments
app.set('port', process.env.PORT || default_port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}
app.get('/', routes.index);
app.get('/users', user.list);
app.post('/upload', function(req, res) {
    store.hub.get('pr_data', function(pr_data) {
        if (pr_data === null) {
            wbID = "1";
        } else {
            if (typeof pr_data.whiteboardID !== 'undefined') {
                wbID = pr_data.whiteboardID;
            } else {
                wbID = "1";
            }
        }
        //increase uploaded image count 
        store.hub.incr('upload_count_' + wbID, function(count) {
            fs.readFile(req.files.Filedata.path, function(err, data) {
                var newPath = __dirname + propertiesfile.upload_path + "uploaded_" + wbID + '_' + count + '.png';
                fs.writeFile(newPath, data, function(err) {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    res.write(JSON.stringify({
                        count: count
                    }));
                    res.end();
                });
            });
        });
    });
});
//autorize callback function for check tokens
function authorize(token1, token2, callback) {
    if (token1 === token2) {
        callback(true);
    } else {
        callback(false);
    }
}
//store data and initiate whiteboard
app.post('/conferenceData', function(req, res) {
    res.send(req.body);
    var object = req.body;
    var confrData = JSON.parse(object["conferenceObj"]);
    conferenceRoomId = confrData["conferenceRoomId"];
    conductorId = confrData["conductor"]["id"];
    conductees = confrData["conductees"];
    conductor = confrData["conductor"];
    var key, count = 0;
    for (key in confrData["conductees"]) {
        if (confrData["conductees"].hasOwnProperty(key)) {
            count++;
        }
    }
    store.hub.set('no_of_conductees', count);
    store.hub.set('conductees', conductees);
    store.hub.set('conductor', conductor);
    store.hub.set('roomid', conferenceRoomId);
    store.hub.set('wbOwner', {
        token: confrData["conductor"]["conductorToken"],
        uid: confrData["conductor"]["id"]
    });
});
//clear data and cancel current wb
app.post('/cancelSchedule', function(req, res) {
    res.send(req.body);
    var object = req.body;
    store.hub.del('no_of_conductees')
    store.hub.del('conductees');
    store.hub.del('conductor');
    store.hub.del('roomid');
    store.hub.del('slide_now');
    store.hub.del('slide_prv');
    store.hub.del('iswbloaded');
    store.hub.del('shapesData');
    store.hub.del('shapesDataPr');
    store.hub.del('socketIDArr');
    store.hub.del('socketIDArrTemp');
    store.hub.del('sid');
    store.hub.del('uid');
    store.hub.del('undoShapesData');
    store.hub.del('undoShapesDataPr');
    store.hub.del('uploadimageData');
    store.hub.del('uploadimageData_Tmp');
    store.hub.del('eraseData');
    store.hub.del('pr_data');

    store.hub.keys('uploadimageData_coords:*', function(zzz){
        for(var i = 0; i < zzz.length; i++){
            store.hub.del(zzz[i]);
        }
    });
    console.log(">>>>>> Cancel Done ! <<<<<<<");
});
//get current user list
app.post('/getUserList', function(req, res) {
    store.hub.get('socketIDArr', function(data) {
        var result = {
            "result": data
        };
        res.send(result);
    });
});
//node clustering 
if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < workerCount; i++) {
        var worker = cluster.fork();
        worker.on('listening', function() {
            //console.log("Worker listening");
        });
    }
    cluster.on('fork', function(worker) {
        console.log('New worker is forked :' + worker.id);
    });
    //cluster listening on events
    cluster.on('listening', function(worker, address) {
        console.log('Worker listening' + worker.id);
    });
    cluster.on('exit', function(worker, code, signal) {
        //console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    //Normal Configuration
    /*
    server = http.createServer(app);

    server.listen(default_port, function() {
        console.log('Express server listening on port ' + app.get('port'));
    });
    */
    // SSL Configuration
    server2 = http.createServer(app).listen(default_port, function() {
        console.log("Express server listening on port " + default_port);
    });
    server = https.createServer(options, app).listen(843, function() {
        console.log("Express server listening on port " + 843);
    });
    ///
    var workerId = cluster.worker.id;
    var io = require('socket.io').listen(server);
    var ox, oy;
    io.configure(function() {
        //setting socketio cluster hub store
        io.set('store', store);
    });
    io.of(namespace).on('connection', function(socket) {
        console.log("Client connected to server !");
         
        store.hub.get('slide_now', function(nxt) {
            if (!nxt) //return;
                nxt = 0;
            store.hub.get('slide_prv', function(prvs) {
                store.hub.get('iswbloaded', function(wbl) {
                    store.hub.get('pr_data', function(pr_data) {
                        store.hub.get('uploadimageData', function(udata) {
                            socket.emit('updateslides', {
                                next: nxt,
                                prv: prvs,
                                wbl: wbl,
                                pr_data: pr_data,
                                udata: udata,
                            });
                            //clear undo redo data
                            //store.hub.del('undoShapesData');
                            //store.hub.del('undoShapesDataPr');
                            if (pr_data === null) {
                                prID = "1";
                            } else {
                                prID = pr_data.whiteboardID;
                            }
                            if (udata != null) {
                                for (i = 0; i < udata.length; i++) {
                                    store.hub.get('uploadimageData_coords' + udata[i].currentWbNo + '_' + udata[i].imgNo, function(img_coords) {
                                        if (img_coords !== null) {
                                            socket.emit('coords', {
                                                coords: img_coords
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    });
                });
            });
        });
        store.hub.get('iswbloaded', function(wbl) {
            store.hub.get('pr_data', function(pr_data) {
                store.hub.get('shapesData', function(data) {
                    if (pr_data === null) {
                        prID = "1";
                        shapes = 'shapes_pr1';
                        storeMessages = "storeMsg1";
                        storeMessagesStatus = false;
                    } else {
                        prID = pr_data.whiteboardID;
                        shapes = pr_data.shapes;
                        storeMessages = pr_data.storeMessages;
                        storeMessagesStatus = pr_data.storeMessagesStatus;
                    }
                    socket.emit('shapes_data', {
                        data: data,
                        whiteboardClicked: wbl,
                        prID: prID,
                        shapes: shapes,
                        storeMessages: storeMessages,
                        storeMessagesStatus: storeMessagesStatus
                    });
                });
                //erase shapes
                store.hub.get('eraseData', function(data) {
                    if (pr_data === null) {
                        prID = "1";
                    } else {
                        prID = pr_data.whiteboardID;
                    }
                    socket.emit('erase_data', {
                        data: data,
                        whiteboardClicked: wbl,
                        prID: prID
                    });
                });
                //////
                store.hub.get('undoShapesData', function(data) {
                    if (pr_data === null) {
                        prID = "1";
                    } else {
                        prID = pr_data.whiteboardID;
                    }
                    socket.emit('undo_data', {
                        data: data,
                        whiteboardClicked: wbl,
                        prID: prID
                    });
                });
            });
            //presentation shapes
            store.hub.get('shapesDataPr', function(datat) {
                store.hub.get('slide_now', function(nxt) {
                    if (nxt === null) {
                        nxt = 0;
                    }
                    var prID;
                    store.hub.get('pr_data', function(pr_data) {
                        if (pr_data === null) {
                            prID = "1";
                            storeMessages = "storeMsg1";
                            storeMessagesStatus = false;
                            shapes = 'shapes_pr1';
                        } else {
                            prID = pr_data.presentationID;
                            storeMessages = pr_data.storeMessages;
                            storeMessagesStatus = pr_data.storeMessagesStatus;
                            shapes = pr_data.shapes;
                        }
                        store.hub.get('slide_now', function(slide_now) {
                            if (slide_now === null) {
                                slideNo = 0;
                            } else {
                                slideNo = slide_now;
                            }
                            socket.emit('shapes_data_tmp', {
                                data: datat,
                                nxt: nxt,
                                whiteboardClicked: wbl,
                                prID: prID,
                                storeMessages: storeMessages,
                                storeMessagesStatus: storeMessagesStatus,
                                shapes: shapes,
                                slideNo: slideNo
                            });
                            /*
                            store.hub.get('undoShapesDataPr', function(data) {
                                if (pr_data === null) {
                                    prID = "1";
                                } else {
                                    prID = pr_data.whiteboardID;
                                }
                                socket.emit('undo_data_pr', {
                                    data: data,
                                    whiteboardClicked: wbl,
                                    prID: prID,
                                    slideNo: slideNo
                                });
                            });*/
                        });
                    });
                });
            });
        });
        socket.on('client_register', function(data) {
            io.of(namespace).emit("user_connect", {
                "uid": data["uid"],
                "sid": socket.id
            });
            store.hub.rpush('socketIDArr', {
                sid: socket.id,
                uid: data["uid"]
            }); //Added
            store.hub.set('sid', socket.id);
            store.hub.set('uid', data["uid"]);
            store.hub.get('conductor', function(conductor_data) {
                if (typeof conductor_data != 'undefined' && conductor_data != null) {
                    if (typeof conductor_data["id"] != 'undefined' && conductor_data["id"] != null) {
                        store.hub.get('uid', function(uid) {
                            store.hub.get('sid', function(sid) {
                                if (conductor_data["id"] === uid) {
                                    //store.hub.rpush('socketIDArray', {sid:sid, uid:uid});
                                    console.log("Valid Conductor Found ! " + uid + " , " + sid);
                                }
                            });
                        });
                    } else {
                        console.log("Not an Authorized Conductor !");
                        //store.hub.lrem('socketIDArray', 1, socket.id);
                        //socket.disconnect();
                    }
                } else {
                    console.log("Not an Authorized Conductor !");
                }
            });
            store.hub.get('conductees', function(conductees_data) {
                if (typeof conductees_data != 'undefined' && conductees_data != null) {
                    store.hub.get('uid', function(uid) {
                        store.hub.get('sid', function(sid) {
                            if (typeof conductees_data[uid] != 'undefined' && conductees_data[uid] != null) {
                                if (conductees_data[uid]["uid"] === uid) {
                                    //store.hub.rpush('socketIDArray', {sid:sid, uid:uid});
                                    console.log("Valid User Found ! " + uid + " , " + sid);
                                }
                            } else {
                                console.log("Not an Authorized User !");
                                //store.hub.lrem('socketIDArray', 1, socket.id);
                                //socket.disconnect();
                            }
                        });
                    });
                } else {
                    console.log("Not an Authorized User !");
                    //store.hub.lrem('socketIDArray', 1, socket.id);
                    //socket.disconnect();
                }
            });
        });
        socket.on('disconnect', function(data) {
            console.log("Disconnected ! SocketID: " + socket.id);
            store.hub.get('slide_now', function(nxt) {
                if (nxt === null) {
                    nxt = 0;
                }
                store.hub.get('slide_prv', function(prvs) {
                    if (prvs === null) {
                        prvs = 0;
                    }
                    store.hub.get('iswbloaded', function(wbl) {
                        socket.emit('updateslides', {
                            next: nxt,
                            prv: prvs,
                            wbl: wbl
                        });
                    });
                });
            });
            store.hub.get('socketIDArr', function(sdata) {
                var obj = new Object();
                var mainobj = []
                if (sdata != null) {
                    for (var i = 0; i < sdata.length; i++) {
                        if (sdata[i]["sid"] != 'undefined') {
                            if (sdata[i]["sid"] != socket.id) {
                                obj.sid = sdata[i]["sid"];
                                obj.uid = sdata[i]["uid"];
                                mainobj[i] = obj;
                                store.hub.rpush('socketIDArrTemp', obj);
                            } else {
                                io.of(namespace).emit("user_disconnect", {
                                    "uid": sdata[i]["uid"]
                                });
                            }
                        }
                    }
                }
                store.hub.get('socketIDArrTemp', function(arr2) {
                    if (arr2 != null) {
                        store.hub.del('socketIDArr');
                        store.hub.set('socketIDArr', arr2);
                        store.hub.del('socketIDArrTemp');
                    } else {
                        store.hub.del('socketIDArr');
                    }
                });
            });
        });
        //chat
        socket.on('enterRoom', function(data) {
            if (typeof data != 'undefined' || data != null) {
                store.hub.get('conductees', function(conductees) {
                    if (typeof conductees != 'undefined' && conductees != null) {
                        if (typeof conductees[data.uid] != 'undefined') {
                            if (conductees[data.uid]["conducteeToken"] === (data.token)) {
                                reciever = conductees[data.uid]["uid"];
                                if (reciever) {
                                    socket.join(data.room);
                                    console.log("Conductee Joined !!!!");
                                } else {}
                            }
                        }
                    }
                });
                store.hub.get('conductor', function(conductor) {
                    if (typeof conductor != 'undefined' && conductor != null) {
                        if (conductor["conductorToken"] === (data.token)) {
                            reciever = conductor["id"];
                            if (reciever) {
                                socket.join(data.room);
                                console.log("Conductor Joined !!!!");
                            } else {}
                        }
                    }
                });
            }
        });
        socket.on('leaveRoom', function(data) {
            socket.leave(data.room);
        });
        socket.on('sendIM', function(data) {
            store.hub.get('conductor', function(conductor_data) {
                var sender;
                if (typeof conductor_data != 'undefined' && conductor_data != null) {
                    if (conductor_data["conductorToken"].toString() === (data.token).toString()) {
                        sender = data.uid;
                        console.log('CHAT SENDER: ' + sender);
                        var message = new Object();
                        message.msg = data.msg.msg;
                        message.sender = sender;
                        data.msg.sender = sender;
                        store.hub.get('socketIDArr', function(sarr) {
                            if (sarr != null && typeof sarr != 'undefined') {
                                if (sarr.length != null) {
                                    for (i = 0; i < sarr.length; i++) {
                                        if (sender === sarr[i].uid) {
                                            if (data.msg.to === "conductor") {
                                                console.log("Private chat 1 to: " + sarr[i].sid);
                                                io.of(namespace).socket(sarr[i].sid).emit('newIM', data.msg);
                                            } else {
                                                io.of(namespace). in (data.room).emit('newIM', data.msg);
                                                console.log("Chat to entire 1");
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            });
            store.hub.get('conductees', function(conductee_data) {
                var sender;
                if (typeof conductee_data != 'undefined' && conductee_data != null) {
                    if (typeof conductee_data[data.uid] != 'undefined') {
                        if (conductee_data[data.uid]["conducteeToken"].toString() === (data.token).toString()) {
                            sender = data.uid;
                            console.log('CHAT SENDER: ' + sender);
                            var message = new Object();
                            message.msg = data.msg.msg;
                            message.sender = sender;
                            data.msg.sender = sender;
                            store.hub.get('socketIDArr', function(sarr) {
                                if (sarr != null && typeof sarr != 'undefined') {
                                    if (sarr.length != null) {
                                        store.hub.get('conductor', function(conductor_data) {
                                            cid = conductor_data["id"];
                                            for (i = 0; i < sarr.length; i++) {
                                                if (cid == sarr[i].uid) {
                                                    if (data.msg.to === "conductor") {
                                                        console.log("Private chat 2 to: " + sarr[i].sid);
                                                        io.of(namespace).socket(sarr[i].sid).emit('newIM', data.msg);
                                                    } else {
                                                        io.of(namespace). in (data.room).emit('newIM', data.msg);
                                                        console.log("Chat to entire 2");
                                                    }
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            });
        });
        socket.on('sendPvtIM', function(data) {
            console.log("Pvt chat data: " + JSON.stringify(data));
            store.hub.get('conductor', function(conductor_data) {
                if (conductor_data != null && typeof conductor_data != 'undefined') {
                    if (conductor_data["conductorToken"].toString() === (data.token).toString()) {
                        io.of(namespace).socket(data.sid).emit('pvtIM', data.msg);
                    }
                }
            });
        });
        socket.on('draw_path', function(data) {
            store.hub.get('wbOwner', function(owndata) {
                if (owndata) {
                    if (typeof owndata.token !== 'undefined' && owndata.token !== null) {
                        authorize(owndata.token, data.token, function(auth) {
                            if (auth === true) {
                                socket.broadcast.emit('freeline_path', {
                                    _flb: data.flb,
                                    _fle: data.fle,
                                    _colour: data.colour,
                                    _strokeWidth: data.strokeWidth
                                });
                            }
                        });
                    }
                } else {
                    console.log("Err: Token validation failed !");
                }
            });
            store.hub.get('iswbloaded', function(iswbloaded) {
                store.hub.get('pr_data', function(pr_data) {
                    if (pr_data === null) {
                        flarray = "fl_array_wb1";
                        flarraytmp = "fl_array_pr1";
                    } else {
                        flarray = pr_data.wb_flArray;
                        flarraytmp = pr_data.pr_flArray;
                    }
                    if (iswbloaded === true) {
                        store.hub.rpush('shapesData', {
                            _flb: data.flb,
                            _fle: data.fle,
                            _colour: data.colour,
                            _strokeWidth: data.strokeWidth,
                            _flarray: flarray
                        });
                    } else if (iswbloaded === false || iswbloaded === null) {
                        store.hub.rpush('shapesDataPr', {
                            _flb: data.flb,
                            _fle: data.fle,
                            _colour: data.colour,
                            _strokeWidth: data.strokeWidth,
                            _shpid: data.shpid,
                            _flarraytmp: flarraytmp
                        });
                    }
                });
            });
        });
        socket.on('draw_path_update', function(data) {
            store.hub.get('wbOwner', function(owndata) {
                if (owndata) {
                    if (typeof owndata.token !== 'undefined' && owndata.token !== null) {
                        authorize(owndata.token, data.token, function(auth) {
                            if (auth === true) {
                                socket.broadcast.emit('freeline_path_update', {
                                    _arr: data.arr
                                });
                            }
                        });
                    }
                } else {
                    console.log("Err: Token validation failed !");
                }
            });
            store.hub.get('iswbloaded', function(iswbloaded) {
                store.hub.get('pr_data', function(pr_data) {
                    if (pr_data === null) {
                        flarray = "fl_array_wb1";
                        flarraytmp = "fl_array_pr1";
                    } else {
                        flarray = pr_data.wb_flArray;
                        flarraytmp = pr_data.pr_flArray;
                    }
                    if (iswbloaded === true) {
                        store.hub.rpush('shapesData', {
                            _arr: data.arr,
                            _flarray: flarray
                        });
                    } else if (iswbloaded === false || iswbloaded === null) {
                        store.hub.rpush('shapesDataPr', {
                            _arr: data.arr,
                            _shpid: data.shpid,
                            _flarraytmp: flarraytmp
                        });
                    }
                });
            });
        });
        socket.on('erase_line', function(data) {
            store.hub.get('wbOwner', function(owndata) {
                if (owndata) {
                    if (typeof owndata.token !== 'undefined' && owndata.token !== null) {
                        authorize(owndata.token, data.token, function(auth) {
                            if (auth == true) {
                                socket.broadcast.emit('erase_line', {
                                    _eflb: data.eflb,
                                    _efle: data.efle,
                                    _colour: data.colour,
                                    _strokeWidth: data.strokeWidth
                                });
                            }
                        });
                    }
                } else {
                    console.log("Err: Token validation failed !");
                }
            });
            store.hub.get('iswbloaded', function(iswbloaded) {
                store.hub.get('pr_data', function(pr_data) {
                    if (pr_data === null) {
                        eflarray = "erase_fl_array_wb1";
                    } else {
                        eflarray = pr_data.wb_eraseLineArray;
                    }
                    if (iswbloaded === true) {
                        store.hub.rpush('eraseData', {
                            _eflb: data.eflb,
                            _efle: data.efle,
                            _colour: data.colour,
                            _strokeWidth: data.strokeWidth,
                            _eflarray: eflarray
                        });
                    }
                });
            });
        });
        socket.on('erase_line_update', function(data) {
            store.hub.get('wbOwner', function(owndata) {
                if (owndata) {
                    if (typeof owndata.token !== 'undefined' && owndata.token !== null) {
                        authorize(owndata.token, data.token, function(auth) {
                            if (auth === true) {
                                socket.broadcast.emit('erase_line_update', {
                                    _earr: data.earr
                                });
                            }
                        });
                    }
                } else {
                    console.log("Err: Token validation failed !");
                }
            });
            store.hub.get('iswbloaded', function(iswbloaded) {
                store.hub.get('pr_data', function(pr_data) {
                    if (pr_data === null) {
                        eflarray = "erase_fl_array_wb1";
                    } else {
                        eflarray = pr_data.wb_eraseLineArray;
                    }
                    if (iswbloaded === true) {
                        store.hub.rpush('eraseData', {
                            _earr: data.earr,
                            _eflarray: eflarray
                        });
                    }
                });
            });
        });
        socket.on('draw_ellipse', function(data) {
            store.hub.get('wbOwner', function(owndata) {
                if (owndata) {
                    if (typeof owndata.token !== 'undefined' && owndata.token !== null && typeof data.token !== 'undefined' && data.token !== null) {
                        authorize(owndata.token, data.token, function(auth) {
                            if (auth === true) {
                                socket.broadcast.emit('ellipse_path', {
                                    _cb: data.cb,
                                    _ce: data.ce,
                                    _colour: data.colour,
                                    _strokeWidth: data.strokeWidth
                                });
                            }
                        });
                    }
                } else {
                    console.log("Err: Token validation failed !");
                }
            });
            store.hub.get('iswbloaded', function(iswbloaded) {
                store.hub.get('pr_data', function(pr_data) {
                    if (pr_data === null) {
                        earray = "e_array_wb1";
                        earraytmp = "e_array_pr1";
                    } else {
                        earray = pr_data.wb_eArray;
                        earraytmp = pr_data.pr_eArray;
                    }
                    if (iswbloaded === true) {
                        store.hub.rpush('shapesData', {
                            _cb: data.cb,
                            _ce: data.ce,
                            _colour: data.colour,
                            _strokeWidth: data.strokeWidth,
                            _earray: earray
                        });
                    } else if (iswbloaded === false || iswbloaded === null) {
                        store.hub.rpush('shapesDataPr', {
                            _cb: data.cb,
                            _ce: data.ce,
                            _colour: data.colour,
                            _strokeWidth: data.strokeWidth,
                            _shpid: data.shpid,
                            _earraytmp: earraytmp
                        });
                    }
                });
            });
        });
        socket.on('draw_ellipse_update', function(data) {
            store.hub.get('wbOwner', function(owndata) {
                if (owndata) {
                    if (typeof owndata.token !== 'undefined' && owndata.token !== null && typeof data.token !== 'undefined' && data.token !== null) {
                        authorize(owndata.token, data.token, function(auth) {
                            if (auth === true) {
                                socket.broadcast.emit('ellipse_path_update', {
                                    _cx: data.cx,
                                    _cy: data.cy
                                });
                            }
                        });
                    }
                } else {
                    console.log("Err: Token validation failed !");
                }
            });
            store.hub.get('iswbloaded', function(iswbloaded) {
                store.hub.get('pr_data', function(pr_data) {
                    if (pr_data === null) {
                        earray = "e_array_wb1";
                        earraytmp = "e_array_pr1";
                    } else {
                        earray = pr_data.wb_eArray;
                        earraytmp = pr_data.pr_eArray;
                    }
                    if (iswbloaded === true) {
                        store.hub.rpush('shapesData', {
                            _cx: data.cx,
                            _cy: data.cy,
                            _earray: earray
                        });
                    } else if (iswbloaded === false || iswbloaded === null) {
                        store.hub.rpush('shapesDataPr', {
                            _cx: data.cx,
                            _cy: data.cy,
                            _shpid: data.shpid,
                            _earraytmp: earraytmp
                        });
                    }
                });
            });
        });
        socket.on('draw_rect', function(data) {
            store.hub.get('wbOwner', function(owndata) {
                if (owndata) {
                    if (typeof owndata.token !== 'undefined' && owndata.token !== null && typeof data.token !== 'undefined' && data.token !== null) {
                        authorize(owndata.token, data.token, function(auth) {
                            if (auth === true) {
                                socket.broadcast.emit('rect_path', {
                                    _rb: data.rb,
                                    _re: data.re,
                                    _colour: data.colour,
                                    _strokeWidth: data.strokeWidth
                                });
                            }
                        });
                    }
                } else {
                    console.log("Err: Token validation failed !");
                }
            });
            store.hub.get('iswbloaded', function(iswbloaded) {
                store.hub.get('pr_data', function(pr_data) {
                    if (pr_data === null) {
                        rarray = "r_array_wb1";
                        rarraytmp = "r_array_pr1";
                    } else {
                        rarray = pr_data.wb_rArray;
                        rarraytmp = pr_data.pr_rArray;
                    }
                    if (iswbloaded === true) {
                        store.hub.rpush('shapesData', {
                            _rb: data.rb,
                            _re: data.re,
                            _colour: data.colour,
                            _strokeWidth: data.strokeWidth,
                            _rarray: rarray
                        });
                    } else if (iswbloaded === false || iswbloaded === null) {
                        store.hub.rpush('shapesDataPr', {
                            _rb: data.rb,
                            _re: data.re,
                            _colour: data.colour,
                            _strokeWidth: data.strokeWidth,
                            _shpid: data.shpid,
                            _rarraytmp: rarraytmp
                        });
                    }
                });
            });
        });
        socket.on('draw_rect_update', function(data) {
            store.hub.get('wbOwner', function(owndata) {
                if (owndata) {
                    if (typeof owndata.token !== 'undefined' && owndata.token !== null && typeof data.token !== 'undefined' && data.token !== null) {
                        authorize(owndata.token, data.token, function(auth) {
                            if (auth === true) {
                                socket.broadcast.emit('rect_path_update', {
                                    _rx: data.rx,
                                    _ry: data.ry
                                });
                            }
                        });
                    }
                } else {
                    console.log("Err: Token validation failed !");
                }
            });
            store.hub.get('iswbloaded', function(iswbloaded) {
                store.hub.get('pr_data', function(pr_data) {
                    if (pr_data === null) {
                        rarray = "r_array_wb1";
                        rarraytmp = "r_array_pr1";
                    } else {
                        rarray = pr_data.wb_rArray;
                        rarraytmp = pr_data.pr_rArray;
                    }
                    if (iswbloaded === true) {
                        store.hub.rpush('shapesData', {
                            _rx: data.rx,
                            _ry: data.ry,
                            _rarray: rarray
                        });
                    } else if (iswbloaded === false || iswbloaded === null) {
                        store.hub.rpush('shapesDataPr', {
                            _rx: data.rx,
                            _ry: data.ry,
                            _shpid: data.shpid,
                            _rarraytmp: rarraytmp
                        });
                    }
                });
            });
        });
        socket.on('clear_paper', function(data) {
            store.hub.get('wbOwner', function(owndata) {
                if (owndata) {
                    if (typeof owndata.token !== 'undefined' && owndata.token !== null && typeof data.token !== 'undefined' && data.token !== null) {
                        authorize(owndata.token, data.token, function(auth) {
                            if (auth === true) {
                                store.hub.get('pr_data', function(pr_data) {
                                    var prID;
                                    if (pr_data === null) {
                                        prID = "1";
                                    }
                                    socket.broadcast.emit('clear_paper_now', {
                                        _clr: data.clr,
                                        wbclicked: data.wbclicked,
                                        prID: prID,
                                        imagecount: data.imagecount
                                    });
                                });
                            }
                        });
                    }
                } else {
                    console.log("Err: Token validation failed !");
                }
            });
            if (data.wbclicked === false || data.wbclicked === null) {
                store.hub.get('shapesDataPr', function(sdata) {
                    store.hub.get('pr_data', function(pr_data) {
                        if (pr_data === null) {
                            prID = "1";
                        } else {
                            prID = pr_data.presentationID;
                        }
                        removeShapes(sdata, prID, data.wbclicked, data.slideno);
                    });
                });
            } else {
                store.hub.get('shapesData', function(sdata) {
                    store.hub.get('pr_data', function(pr_data) {
                        if (pr_data === null) {
                            prID = "1";
                        } else {
                            prID = pr_data.whiteboardID;
                        }
                        removeShapes(sdata, prID, data.wbclicked, data.slideno);
                    });
                });
                store.hub.get('eraseData', function(edata) {
                    store.hub.get('pr_data', function(pr_data) {
                        if (pr_data === null) {
                            prID = "1";
                        } else {
                            prID = pr_data.whiteboardID;
                        }
                        removeEraseData(edata, prID, data.wbclicked);
                    });
                });
                store.hub.get('uploadimageData', function(udata) {
                    store.hub.get('pr_data', function(pr_data) {
                        if (pr_data === null) {
                            prID = "1";
                        } else {
                            prID = pr_data.whiteboardID;
                        }
                        removeUploadedImages(udata, prID);
                    });
                });
            }
        });
        socket.on('drag_uploaded_image', function(data) {
            store.hub.get('wbOwner', function(owndata) {
                if (owndata) {
                    if (typeof owndata.token !== 'undefined' && owndata.token !== null && typeof data.token !== 'undefined' && data.token !== null) {
                        authorize(owndata.token, data.token, function(auth) {
                            if (auth === true) {
                                socket.broadcast.emit('drag_uploaded_image', data);
                            }
                        });
                    }
                } else {
                    console.log("Err: Token validation failed !");
                }
            });
            store.hub.set('uploadimageData_coords' + data.wbNo + '_' + data.imgNo, {
                _ox: data._ox,
                _oy: data._oy,
                ox: data.ox,
                oy: data.oy,
                uploadedImgArray: data.uploadedImgArray,
                imgNo: data.imgNo
            });
        });
        socket.on('load_uploaded_image', function(data) {
            store.hub.get('wbOwner', function(owndata) {
                if (owndata) {
                    if (typeof owndata.token !== 'undefined' && owndata.token !== null && typeof data.token !== 'undefined' && data.token !== null) {
                        authorize(owndata.token, data.token, function(auth) {
                            if (auth === true) {
                                socket.broadcast.emit('load_uploaded_image', data);
                            }
                        });
                    }
                } else {
                    console.log("Err: Token validation failed !");
                }
            });
            store.hub.rpush('uploadimageData', data);
        });

        function removeEraseData(data, prID, wbclicked) {
            if (wbclicked === true) {
                eflarray = "erase_fl_array_wb" + prID;
                store.hub.del('eraseData');
                if (data != null) {
                    for (i = 0; i < data.length; i++) {
                        if (eflarray === data[i]._eflarray) {
                            if (data[i].eflx || data[i].efly) {
                                delete data[i];
                            }
                        } else {
                            store.hub.rpush('eraseData', data[i]);
                        }
                    }
                }
            }
        }

        function removeShapes(data, prID, wbclicked, slideno) {
            if (wbclicked === true) {
                fl_Array = 'fl_array_wb' + prID;
                l_Array = 'l_array_wb' + prID;
                e_Array = 'e_array_wb' + prID;
                r_Array = 'r_array_wb' + prID;
                txt_Array = 'txt_array_wb' + prID;
                store.hub.del('shapesData');
                if (data != null) {
                    for (i = 0; i < data.length; i++) {
                        if (fl_Array === data[i]._flarray) {
                            if (data[i].flx || data[i].fly) {
                                delete data[i];
                            }
                        } else if (l_Array === data[i]._larray) {
                            if (data[i]._lx || data[i]._ly) {
                                delete data[i];
                            }
                        } else if (e_Array === data[i]._earray) {
                            if (data[i]._cx || data[i]._cy) {
                                delete data[i];
                            }
                        } else if (r_Array === data[i]._rarray) {
                            if (data[i]._rx || data[i]._ry) {
                                delete data[i];
                            }
                        } else if (txt_Array === data[i]._txtarray) {
                            if (data[i]._txtx || data[i]._txty) {
                                delete data[i];
                            }
                        } else {
                            store.hub.rpush('shapesData', data[i]);
                        }
                    }
                }
            } else {
                fl_Array_Tmp = 'fl_array_pr' + prID;
                l_Array_Tmp = 'l_array_pr' + prID;
                e_Array_Tmp = 'e_array_pr' + prID;
                r_Array_Tmp = 'r_array_pr' + prID;
                txt_Array_Tmp = 'txt_array_pr' + prID;
                var shpId = "shapes_pr" + prID + "_" + slideno;
                store.hub.del('shapesDataPr');
                if (data != null) {
                    for (var i = 0; i < data.length; i++) {
                        if (shpId === data[i]._shpid) {
                            delete data[i];
                        } else {
                            store.hub.rpush('shapesDataPr', data[i]);
                        }
                    }
                }
            }
        }

        function pushToUndoArray(data, callback) {
            if (data !== null) {
                console.log("Before UNDO: " + JSON.stringify(data));
                var count = 0;
                if (data !== null) {
                    for (var i = data.length - 1; i >= 0; i--) {
                        if (data[i]._flb || data[i]._lb || data[i]._cb || data[i]._rb) {
                            count++;
                        }
                        if (data[i].flx || data[i].fly || data[i]._flarray || data[i]._lx || data[i]._ly || data[i]._larray || data[i]._rx || data[i]._ry || data[i]._rarray || data[i]._cx || data[i]._cy || data[i]._earray) {
                            console.log("MMMMMMMMMM: " + count);
                            if (count >= 1) {
                                store.hub.lpush('undoShapesData', data[i]);
                                data.splice(i, 1);
                                break;
                            } else {
                                store.hub.lpush('undoShapesData', data[i]);
                                data.splice(i, 1);
                            }
                            //store.hub.rpush('shapesData', data[i]);
                        } else {
                            break;
                        }
                    }
                }
                console.log("After UNDO: " + JSON.stringify(data));
                callback(data);
            }
        }

        function pushToUndoArrayPr(data, prID, slideno, callback) {
            if (data !== null) {
                var shpId = "shapes_pr" + prID + "_" + slideno;
                var count = 0;
                for (var i = data.length - 1; i >= 0; i--) {
                    if (shpId === data[i]._shpid) {
                        if (data[i]._flb || data[i]._lb || data[i]._cb || data[i]._rb) {
                            count++;
                        }
                        if (data[i].flx || data[i].fly || data[i]._flarraytmp || data[i]._lx || data[i]._ly || data[i]._larraytmp || data[i]._rx || data[i]._ry || data[i]._rarraytmp || data[i]._cx || data[i]._cy || data[i]._earraytmp) {
                            if (count >= 1) {
                                store.hub.lpush('undoShapesDataPr', data[i]);
                                data.splice(i, 1);
                                break;
                            } else {
                                store.hub.lpush('undoShapesDataPr', data[i]);
                                data.splice(i, 1);
                            }
                        } else {
                            break;
                        }
                    }
                }
                callback(data);
            }
        }

        function pushToShapesArrayPr(data, prID, slideno, callback) {
            store.hub.get('shapesDataPr', function(d) {
                console.log("Before REDO: " + JSON.stringify(d));
            });
            console.log(">>>>>> Undo Array: " + JSON.stringify(data));
            if (data !== null) {
                var shpId = "shapes_pr" + prID + "_" + slideno;
                var count = 0;
                for (var i = 0; i < data.length; i++) {
                    if (shpId === data[i]._shpid) {
                        if (data[i]._flb || data[i]._lb || data[i]._rb || data[i]._cb) {
                            if (count !== 0) {
                                console.log(">>>>>>>>>> " + count);
                                data.splice(0, count);
                                break;
                            } else {}
                        } else {}
                        store.hub.rpush('shapesDataPr', data[i]);
                        //data.splice(i, 1);
                        count++;
                    }
                }
                store.hub.del('undoShapesDataPr');
                for (var i = 0; i < data.length; i++) {
                    store.hub.rpush('undoShapesDataPr', data[i])
                }
                console.log(">>>>>> Undo Array2: " + JSON.stringify(data));
            }
            store.hub.get('shapesDataPr', function(d) {
                console.log("After REDO: " + JSON.stringify(d));
            });
            callback(data);
        }

        function pushToShapesArray(data, callback) {
            store.hub.get('shapesData', function(d) {
                console.log("Before REDO: " + JSON.stringify(d));
            });
            if (data !== null) {
                console.log(">>>>>> Undo Array: " + JSON.stringify(data));
                var count = 0;
                for (var i = 0; i < data.length; i++) {
                    if (data[i]._flb || data[i]._lb || data[i]._rb || data[i]._cb) {
                        if (count !== 0) {
                            console.log(">>>>>>>>>> " + count);
                            data.splice(0, count);
                            break;
                        } else {}
                    } else {}
                    store.hub.rpush('shapesData', data[i]);
                    //data.splice(i, 1);
                    count++;
                }
                store.hub.del('undoShapesData');
                for (var i = 0; i < data.length; i++) {
                    store.hub.rpush('undoShapesData', data[i])
                }
                console.log(">>>>>> Undo Array2: " + JSON.stringify(data));
            }
            store.hub.get('shapesData', function(d) {
                console.log("After REDO: " + JSON.stringify(d));
            });
            callback(data);
        }

        function undoDrawings(data, prID, wbclicked, slideno) {
            if (data !== null) {
                if (wbclicked === true) {
                    //console.log("Before: " + JSON.stringify(data));
                    store.hub.del('shapesData');
                    pushToUndoArray(data, function(d) {
                        for (var i = 0; i < d.length; i++) {
                            store.hub.rpush('shapesData', d[i]);
                        }
                    });
                } else {
                    store.hub.del('shapesDataPr');
                    pushToUndoArrayPr(data, prID, slideno, function(d) {
                        for (var i = 0; i < d.length; i++) {
                            store.hub.rpush('shapesDataPr', d[i]);
                        }
                    });
                }
            }
        }

        function redoDrawings(prID, wbclicked, slideno) {
            if (wbclicked === true) {
                store.hub.get('undoShapesData', function(d) {
                    pushToShapesArray(d, function(arr) {
                        //console.log("******After undo Shapes Arr: "+JSON.stringify(arr));
                    });
                });
            } else {
                store.hub.get('undoShapesDataPr', function(d) {
                    pushToShapesArrayPr(d, prID, slideno, function(arr) {
                        //console.log("******After undo Shapes Arr: "+JSON.stringify(arr));
                    });
                });
            }
        }

        function removeUploadedImages(udata, prID) {
            if (udata !== null) {
                for (i = 0; i < udata.length; i++) {
                    if (udata[i].currentWbNo.toString() !== prID.toString()) {
                        store.hub.rpush('uploadimageData_Tmp', udata[i]);
                    } else {}
                }
                store.hub.del('uploadimageData');
                store.hub.get('uploadimageData_Tmp', function(data_tmp) {
                    store.hub.set('uploadimageData', data_tmp);
                    if (data_tmp === null) {
                        store.hub.del('uploadimageData');
                    }
                });
                store.hub.del('uploadimageData_Tmp');
            }
        }
        socket.on('undo_drawing', function(data) {
            socket.broadcast.emit('undo_drawing_now', data);
            if (data.wbclicked === false || data.wbclicked == null) {
                store.hub.get('shapesDataPr', function(sdata) {
                    store.hub.get('pr_data', function(pr_data) {
                        if (pr_data === null) {
                            prID = "1";
                        } else {
                            prID = pr_data.presentationID;
                        }
                        undoDrawings(sdata, prID, data.wbclicked, data.slideno);
                    });
                });
            } else {
                store.hub.get('shapesData', function(sdata) {
                    store.hub.get('pr_data', function(pr_data) {
                        if (pr_data == null) {
                            prID = "1";
                        } else {
                            prID = pr_data.whiteboardID;
                        }
                        undoDrawings(sdata, prID, data.wbclicked, data.slideno);
                    });
                });
            }
        });
        socket.on('redo_drawing', function(data) {
            socket.broadcast.emit('redo_drawing_now', data);
            if (data.wbclicked === false || data.wbclicked == null) {
                store.hub.get('shapesDataPr', function(rdata) {
                    store.hub.get('pr_data', function(pr_data) {
                        if (pr_data === null) {
                            prID = "1";
                        } else {
                            prID = pr_data.presentationID;
                        }
                        redoDrawings(prID, data.wbclicked, data.slideno);
                    });
                });
            } else {
                store.hub.get('shapesData', function(rdata) {
                    store.hub.get('pr_data', function(pr_data) {
                        if (pr_data === null) {
                            prID = "1";
                        } else {
                            prID = pr_data.whiteboardID;
                        }
                        redoDrawings(prID, data.wbclicked, data.slideno);
                    });
                });
            }
        });
        socket.on('draw_line', function(data) {
            store.hub.get('wbOwner', function(owndata) {
                if (owndata) {
                    if (typeof owndata.token !== 'undefined' && owndata.token !== null && typeof data.token !== 'undefined' && data.token !== null) {
                        authorize(owndata.token, data.token, function(auth) {
                            if (auth === true) {
                                socket.broadcast.emit('line_path', {
                                    _lb: data.lb,
                                    _le: data.le,
                                    _colour: data.colour,
                                    _strokeWidth: data.strokeWidth
                                });
                            }
                        });
                    }
                } else {
                    console.log("Err: Token validation failed !");
                }
            });
            store.hub.get('iswbloaded', function(iswbloaded) {
                store.hub.get('pr_data', function(pr_data) {
                    var larraytmp, larray;
                    if (pr_data === null) {
                        larray = "l_array_wb1";
                        larraytmp = "l_array_pr1";
                    } else {
                        larray = pr_data.wb_lArray;
                        larraytmp = pr_data.pr_lArray;
                    }
                    if (iswbloaded == true) {
                        store.hub.rpush('shapesData', {
                            _lb: data.lb,
                            _le: data.le,
                            _colour: data.colour,
                            _larray: larray,
                            _strokeWidth: data.strokeWidth,
                        });
                    } else if (iswbloaded == false || iswbloaded == null) {
                        store.hub.rpush('shapesDataPr', {
                            _lb: data.lb,
                            _le: data.le,
                            _shpid: data.shpid,
                            _colour: data.colour,
                            _larraytmp: larraytmp,
                            _strokeWidth: data.strokeWidth
                        });
                    }
                });
            });
        });
        socket.on('draw_line_update', function(data) {
            store.hub.get('wbOwner', function(owndata) {
                if (owndata) {
                    if (typeof owndata.token !== 'undefined' && owndata.token !== null && typeof data.token !== 'undefined' && data.token !== null) {
                        authorize(owndata.token, data.token, function(auth) {
                            if (auth === true) {
                                socket.broadcast.emit('line_path_update', {
                                    _lx: data.lx,
                                    _ly: data.ly
                                });
                            }
                        });
                    }
                } else {
                    console.log("Err: Token validation failed !");
                }
            });
            store.hub.get('iswbloaded', function(iswbloaded) {
                store.hub.get('pr_data', function(pr_data) {
                    if (pr_data === null) {
                        larray = "l_array_wb1";
                        larraytmp = "l_array_pr1";
                    } else {
                        larray = pr_data.wb_lArray;
                        larraytmp = pr_data.pr_lArray;
                    }
                    if (iswbloaded == true) {
                        store.hub.rpush('shapesData', {
                            _lx: data.lx,
                            _ly: data.ly,
                            _larray: larray
                        });
                    } else if (iswbloaded == false || iswbloaded == null) {
                        store.hub.rpush('shapesDataPr', {
                            _lx: data.lx,
                            _ly: data.ly,
                            _shpid: data.shpid,
                            _larraytmp: larraytmp
                        });
                    }
                });
            });
        });
        socket.on('draw_text', function(data) {
            store.hub.get('wbOwner', function(owndata) {
                if (owndata) {
                    if (typeof owndata.token !== 'undefined' && owndata.token !== null && typeof data.token !== 'undefined' && data.token !== null) {
                        authorize(owndata.token, data.token, function(auth) {
                            if (auth === true) {
                                socket.broadcast.emit('text_path', {
                                    _txtx: data.txtx,
                                    _txty: data.txty,
                                    _text: data.text,
                                    _colour: data.colour,
                                    _strokeWidth: data.strokeWidth
                                });
                            }
                        });
                    }
                } else {
                    console.log("Err: Token validation failed !");
                }
            });
            store.hub.get('iswbloaded', function(iswbloaded) {
                store.hub.get('pr_data', function(pr_data) {
                    if (pr_data === null) {
                        txtarray = "txt_array_wb1";
                        txtarraytmp = "txt_array_pr1";
                    } else {
                        txtarray = pr_data.wb_txtArray;
                        txtarraytmp = pr_data.pr_txtArray;
                    }
                    if (iswbloaded === true) {
                        store.hub.rpush('shapesData', {
                            _txtx: (data.txtx - data.tk),
                            _txty: (data.txty - data.tl),
                            _text: data.text,
                            _colour: data.colour,
                            _strokeWidth: data.strokeWidth,
                            _txtarray: txtarray
                        });
                    } else if (iswbloaded === false || iswbloaded === null) {
                        store.hub.rpush('shapesDataPr', {
                            _txtx: (data.txtx - data.tk),
                            _txty: (data.txty - data.tl),
                            _text: data.text,
                            _shpid: data.shpid,
                            _colour: data.colour,
                            _strokeWidth: data.strokeWidth,
                            _txtarraytmp: txtarraytmp
                        });
                    }
                });
            });
        });
        socket.on('gotonext', function(data) {
            store.hub.get('wbOwner', function(owndata) {
                if (owndata) {
                    if (typeof owndata.token !== 'undefined' && owndata.token !== null && typeof data.token !== 'undefined' && data.token !== null) {
                        authorize(owndata.token, data.token, function(auth) {
                            if (auth == true) {
                                socket.broadcast.emit('goto_next_page', {
                                    next: data.next_page,
                                    prv: data.prv_page
                                });
                            }
                        });
                    }
                } else {
                    console.log("Err: Token validation failed !");
                }
            });
            slide_now = data.next_page;
            slide_prv = data.prv_page;
            store.hub.set('slide_now', slide_now);
            store.hub.set('slide_prv', slide_prv);
        });
        socket.on('gotoprv', function(data) {
            store.hub.get('wbOwner', function(owndata) {
                if (owndata) {
                    if (typeof owndata.token !== 'undefined' && owndata.token !== null && typeof data.token !== 'undefined' && data.token !== null) {
                        authorize(owndata.token, data.token, function(auth) {
                            if (auth === true) {
                                socket.broadcast.emit('goto_prv_page', {
                                    next: data.next_page,
                                    prv: data.prv_page
                                });
                            }
                        });
                    }
                } else {
                    console.log("Err: Token validation failed !");
                }
            });
            slide_now = data.next_page;
            slide_prv = data.prv_page;
            store.hub.set('slide_now', slide_now);
            store.hub.set('slide_prv', slide_prv);
        });
        socket.on('gotofrst', function(data) {
            store.hub.get('wbOwner', function(owndata) {
                if (owndata) {
                    if (typeof owndata.token !== 'undefined' && owndata.token !== null && typeof data.token !== 'undefined' && data.token !== null) {
                        authorize(owndata.token, data.token, function(auth) {
                            if (auth === true) {
                                socket.broadcast.emit('goto_frst_page', {
                                    next: data.next_page,
                                    prv: data.prv_page
                                });
                            }
                        });
                    }
                } else {
                    console.log("Err: Token validation failed !");
                }
            });
            slide_now = data.next_page;
            slide_prv = data.prv_page;
            store.hub.set('slide_now', slide_now);
            store.hub.set('slide_prv', slide_prv);
        });
        socket.on('gotolst', function(data) {
            store.hub.get('wbOwner', function(owndata) {
                if (owndata) {
                    if (typeof owndata.token !== 'undefined' && owndata.token !== null && typeof data.token !== 'undefined' && data.token !== null) {
                        authorize(owndata.token, data.token, function(auth) {
                            if (auth == true) {
                                socket.broadcast.emit('goto_lst_page', {
                                    next: data.next_page,
                                    prv: data.prv_page
                                });
                            }
                        });
                    }
                } else {
                    console.log("Err: Token validation failed !");
                }
            });
            slide_now = data.next_page;
            slide_prv = data.prv_page;
            store.hub.set('slide_now', slide_now);
            store.hub.set('slide_prv', slide_prv);
        });
        //move between presentations
        socket.on('move_to_presentation', function(data) {
            store.hub.get('wbOwner', function(owndata) {
                if (owndata) {
                    if (typeof owndata.token !== 'undefined' && owndata.token !== null && typeof data.token !== 'undefined' && data.token !== null) {
                        authorize(owndata.token, data.token, function(auth) {
                            if (auth === true) {
                                socket.broadcast.emit('move_to_presentation', data);
                            }
                        });
                    }
                } else {
                    console.log("Err: Token validation failed !");
                }
            });
            store.hub.set('pr_data', data);
            store.hub.set('slide_now', data.currrentPrSlideNo);
            store.hub.set('iswbloaded', data.whiteboardClickedStatus);
        });
        //move between whiteboards
        socket.on('move_to_whiteboard', function(data) {
            store.hub.get('wbOwner', function(owndata) {
                if (owndata) {
                    if (typeof owndata.token !== 'undefined' && owndata.token !== null && typeof data.token !== 'undefined' && data.token !== null) {
                        authorize(owndata.token, data.token, function(auth) {
                            if (auth === true) {
                                socket.broadcast.emit('move_to_whiteboard', data);
                            }
                        });
                    }
                } else {
                    console.log("Err: Token validation failed !");
                }
            });
            store.hub.set('pr_data', data);
            store.hub.set('slide_now', data.currrentPrSlideNo);
            store.hub.set('iswbloaded', data.whiteboardClickedStatus);
        });
        //check whether the valid conductee request slides
        socket.on('slides_uploaded', function(data) {
            store.hub.get('conductor', function(conductor_data) {
                if (typeof conductor_data !== 'undefined' && conductor_data !== null) {
                    if (conductor_data["conductorToken"] === data.token) {
                        socket.broadcast.emit('slides_uploaded', data);
                    }
                }
            });
        });
        //change steam to a valid streamer
        socket.on('changeStream', function(data) {
            if (typeof data !== 'undefined' && data !== null) {
                store.hub.get('conductor', function(cdata) {
                    if (typeof cdata["conductorToken"] != 'undefined' || cdata["conductorToken"] != null) {
                        if (cdata["conductorToken"] === data.token) {
                            socket.broadcast.emit('streamChanged', {
                                'streamName': data.streamName,
                                'streamer': data.streamer
                            });
                        }
                    }
                });
            }
        });
        socket.on('share_screen', function(data) {
            if (typeof data != 'undefined' && data != null) {
                store.hub.get('conductor', function(cdata) {
                    if (typeof cdata["conductorToken"] != 'undefined' || cdata["conductorToken"] != null) {
                        if (cdata["conductorToken"] == data.token) {
                            socket.broadcast.emit('screen_shared', {
                                'screenShared': 'conductor desktop is shared'
                            });
                        }
                    }
                });
            }
        });
        socket.on('getWhiteBoardBack', function(data) {
            store.hub.get('conductor', function(conductor_data) {
                if (conductor_data != null && typeof conductor_data != 'undefined') {
                    if (conductor_data["conductorToken"].toString() == (data.token).toString()) {
                        store.hub.set('wbOwner', {
                            token: data.token,
                            uid: data.uid
                        });
                    }
                }
            });
        });
        socket.on('hand_raise', function(data) {
            //console.log("Hand raise data: " + JSON.stringify(data));
            store.hub.get('conductees', function(conductee_data) {
                if (conductee_data != null && typeof conductee_data != 'undefined') {
                    if (conductee_data[data.uid] != null && typeof conductee_data[data.uid] != 'undefined') {
                        if (conductee_data[data.uid]["conducteeToken"].toString() == (data.token).toString()) {
                            //valid conductee
                            store.hub.get('conductor', function(conductor_data) {
                                store.hub.get('socketIDArr', function(sarr) {
                                    for (var i = 0; i < sarr.length; i++) {
                                        if (sarr[i]["sid"] != 'undefined') {
                                            if (sarr[i]["uid"] == conductor_data["id"]) {
                                                csid = sarr[i]["sid"];
                                            }
                                        }
                                    }
                                    if (csid != null && typeof csid != 'undefined') {
                                        io.of(namespace).socket(csid).emit('hand_raised', data);
                                    } else {
                                        console.log("Invalid socket to emit-> ");
                                    }
                                });
                            });
                        }
                    }
                }
            });
        });
        socket.on('allow_whiteboard', function(data) {
            store.hub.set('wbOwner', {
                token: data.token,
                uid: data.uid
            });
            store.hub.get('socketIDArr', function(sarr) {
                if (typeof sarr !== 'undefined' && sarr != null) {
                    for (var i = 0; i < sarr.length; i++) {
                        if (typeof data.uid != 'undefined' && data.uid != null) {
                            if (sarr[i]["uid"] === data.uid) {
                                if (data.allow === true) {
                                    io.of(namespace).socket(sarr[i]["sid"]).emit('whiteboard_access_granted', data);
                                    io.of(namespace).socket(sarr[i]["sid"]).emit('access_to_slide_controls', true)
                                } else {
                                    console.log("Whiteboard access not granted");
                                    io.of(namespace).socket(sarr[i]["sid"]).emit('access_to_slide_controls', false);
                                }
                            }
                        } else {}
                    }
                }
            });
        });
        socket.on('streamChanged', function(data) {
            socket.emit('changeStream', data);
        });
        socket.on('conference_end', function(data) {
            store.hub.get('conductor', function(conductor_data) {
                if (typeof conductor_data["conductorToken"] != 'undefined' || conductor_data["conductorToken"] != null) {
                    if (conductor_data["conductorToken"] == data.token) {
                        io.of(namespace).emit('conference_ended', {
                            endNow: data.endNow
                        });
                    }
                }
            });
        });
        socket.on('mouse_position', function(data) {
            socket.broadcast.emit('mouse_position_update', data);
        });
    });
}

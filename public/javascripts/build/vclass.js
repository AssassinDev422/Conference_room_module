/*
 * Normal Configuration
 *
 */
/*
var PORT = 3000; //port that SocketIO will connect on
var SERVER_IP = window.location.hostname;
// Connect to the websocket via SocketIO
var socket = io.connect('http://' + SERVER_IP + ':' + PORT + '/node1');
var slide_dir = 'http://' + SERVER_IP + ':' + PORT + '/images/slides/';
var images_url = 'http://' + SERVER_IP + ':' + PORT + '/images/board.png';
*/
/*
 * SSL Configuration
 *
 */
var PORT = 843; //port that SocketIO will connect on
var SERVER_IP = window.location.hostname;
// Connect to the websocket via SocketIO
var socket = io.connect('https://' + SERVER_IP, {
    secure: true
});
var slide_dir = 'https://' + SERVER_IP + ':' + PORT + '/images/slides/';
var uploads_dir = 'https://' + SERVER_IP + ':' + PORT + '/images/uploads/';
// ^ need to remove when deploy with main app
// 
var VClassData = function() {
    this.shapes_wb1 = [], this.undo_shapes_wb1 = [], this.shapes_pr1 = [], this.l_array_wb1 = [], this.r_array_wb1 = [],
    this.e_array_wb1 = [], this.fl_array_wb1 = [], this.txt_array_wb1 = [], this.erase_fl_array_wb1 = [],
    this.l_array_pr1 = [], this.r_array_pr1 = [], this.e_array_pr1 = [], this.fl_array_pr1 = [],
    this.txt_array_pr1 = [], this.storeMsg1 = false, this.client_reconnect1 = false, this.whiteboardClicked1 = false,
    this.tmp_slide1 = 0, this.tmp_slide_end1 = 0, this.force_load1 = 0, this.images_pr1 = [],
    this.no_slides1 = 0, this.currrent_slide_no1 = 0, this.img_request1 = true, this.img_request_student1 = true,
    this.restore_data_arr_wb1 = [], this.restore_data_arr_pr1 = [], this.restore_erase_data_wb1 = [], this.uploaded_images_wb1 = [],
    this.undo_clicked_wb1 = false, this.undo_clicked_pr1 = false, this.scount_wb1,
    this.lx_wb1 = [], this.ly_wb1 = [], this.ox_wb1 = [], this.oy_wb1 = [], this.slide_shp_cnt1 = 0,
    this.undo_shp_arr_pr1 = [], this.undo_shp_arr_wb1 = [], this.prv_slide_no1 = 0,
    this.shapes_loaded_pr1 = false, this.shapes_loaded_wb1 = false,
    this.org_slide_cnt1 = $('#sldcnt1').text(),
    this.org_slide_cnt2 = $('#sldcnt2').text(),
    this.org_slide_cnt3 = $('#sldcnt3').text(),
    this.org_slide_cnt4 = $('#sldcnt4').text();
};
var shapes = 'shapes_pr1',
    undoShpArr = 'undo_shp_arr_pr1',
    undoShpArr2 = 'undo_shp_arr_wb1',
    wb_lArray = 'l_array_wb1',
    wb_eArray = 'e_array_wb1',
    wb_rArray = 'r_array_wb1',
    wb_flArray = 'fl_array_wb1',
    wb_eraseLineArray = 'erase_fl_array_wb1',
    wb_txtArray = 'txt_array_wb1',
    pr_lArray = 'l_array_pr1',
    pr_eArray = 'e_array_pr1',
    pr_rArray = 'r_array_pr1',
    pr_flArray = 'fl_array_pr1',
    pr_txtArray = 'txt_array_pr1',
    storeMessages = 'storeMsg1',
    clientReconnect = 'client_reconnect1',
    whiteboardClicked = 'whiteboardClicked1',
    tmpSlide = 'tmp_slide1',
    tmpSlideEnd = 'tmp_slide_end1',
    forceLoad = 'force_load1',
    currentPrArray = 'images_pr1',
    uploadedImgArray = 'uploaded_images_wb1',
    currrentSlideNo = 'currrent_slide_no1',
    prvSlideNo = 'prv_slide_no1',
    noOfSlides = 'no_slides1',
    orgSlideCount = 'org_slide_cnt1',
    imageRequest = 'img_request1',
    imageRequestStudent = 'img_request_student1',
    restoreWbDataArr = 'restore_data_arr_wb1',
    restorePrDataArr = 'restore_data_arr_pr1',
    restoreEraseDataArr = 'restore_erase_data_wb1',
    undoClickedWb = 'undo_clicked_wb1',
    undoClickedPr = 'undo_clicked_pr1',
    lx = 'lx_wb1',
    ly = 'ly_wb1',
    ox = 'ox_wb1',
    oy = 'oy_wb1',
    shapesLoadedPr = 'shapes_loaded_pr1',
    shapesLoadedWb = 'shapes_loaded_wb1';


function initPr(id) {
    currentPrArray = 'images_pr' + id,
    currrentSlideNo = 'currrent_slide_no' + id,
    prvSlideNo = 'prv_slide_no' + id,
    noOfSlides = 'no_slides' + id,
    orgSlideCount = 'org_slide_cnt' + id,
    imageRequest = 'img_request' + id,
    tmpSlide = 'tmp_slide' + id,
    tmpSlideEnd = 'tmp_slide_end' + id,
    forceLoad = 'force_load' + id,
    whiteboardClicked = 'whiteboardClicked' + id,
    shapes = 'shapes_pr' + id,
    undoShpArr = 'undo_shp_arr_pr' + id,
    pr_fArray = 'f_array_pr' + id,
    pr_lArray = 'l_array_pr' + id,
    pr_eArray = 'e_array_pr' + id,
    pr_rArray = 'r_array_pr' + id,
    pr_flArray = 'fl_array_pr' + id,
    pr_txtArray = 'txt_array_pr' + id,
    storeMessages = 'storeMsg' + id,
    undoClickedPr = 'undo_clicked_pr' + id,
    shapesLoadedPr = 'shapes_loaded_pr' + id;
    if (!vcdata[currrentSlideNo]) vcdata[currrentSlideNo] = 0;
    if (!vcdata[prvSlideNo]) vcdata[prvSlideNo] = 0;
    if (!vcdata[currentPrArray]) vcdata[currentPrArray] = [];
    if (!vcdata[noOfSlides]) vcdata[noOfSlides] = 0;
    if (!vcdata[orgSlideCount]) vcdata[orgSlideCount] = 0;
    if (!vcdata[imageRequest]) vcdata[imageRequest] = false;
    if (!vcdata[tmpSlide]) vcdata[tmpSlide] = 0;
    if (!vcdata[tmpSlideEnd]) vcdata[tmpSlideEnd] = 0;
    if (!vcdata[forceLoad]) vcdata[forceLoad] = 0;
    if (!vcdata[whiteboardClicked]) vcdata[whiteboardClicked] = false;
    if (!vcdata[shapes]) vcdata[shapes] = [];
    if (!vcdata[pr_txtArray]) vcdata[pr_txtArray] = []; /////18-06
    if (!vcdata[pr_lArray]) vcdata[pr_lArray] = [];
    if (!vcdata[pr_eArray]) vcdata[pr_eArray] = [];
    if (!vcdata[pr_rArray]) vcdata[pr_rArray] = [];
    if (!vcdata[pr_flArray]) vcdata[pr_flArray] = [];
    if (!vcdata[pr_txtArray]) vcdata[pr_txtArray] = [];
    if (!vcdata[storeMessages]) vcdata[storeMessages] = false;
    if (!vcdata[undoClickedPr]) vcdata[undoClickedPr] = false;
    if (!vcdata[undoShpArr]) vcdata[undoShpArr] = [];
    if (!vcdata[shapesLoadedPr]) vcdata[shapesLoadedPr] = false;
}

function initWb(id) {
    whiteboardClicked = 'whiteboardClicked' + id,
    shapes = 'shapes_wb' + id,
    wb_lArray = 'l_array_wb' + id,
    wb_eArray = 'e_array_wb' + id,
    wb_rArray = 'r_array_wb' + id,
    wb_flArray = 'fl_array_wb' + id,
    wb_txtArray = 'txt_array_wb' + id,
    wb_eraseLineArray = 'erase_fl_array_wb' + id,
    storeMessages = 'storeMsg' + id,
    undoClickedWb = 'undo_clicked_wb' + id,
    undoShpArr2 = 'undo_shp_arr_wb' + id,
    lx = 'lx_wb' + id,
    ly = 'ly_wb' + id,
    ox = 'ox_wb' + id,
    oy = 'oy_wb' + id,
    uploadedImgArray = 'uploaded_images_wb' + id,
    shapesLoadedWb = 'shapes_loaded_wb' + id;
    if (!vcdata[whiteboardClicked]) vcdata[whiteboardClicked] = false;
    if (!vcdata[shapes]) vcdata[shapes] = [];
    if (!vcdata[wb_lArray]) vcdata[wb_lArray] = [];
    if (!vcdata[wb_eArray]) vcdata[wb_eArray] = [];
    if (!vcdata[wb_rArray]) vcdata[wb_rArray] = [];
    if (!vcdata[wb_flArray]) vcdata[wb_flArray] = [];
    if (!vcdata[wb_txtArray]) vcdata[wb_txtArray] = [];
    if (!vcdata[wb_eraseLineArray]) vcdata[wb_eraseLineArray] = [];
    if (!vcdata[storeMessages]) vcdata[storeMessages] = false;
    if (!vcdata[undoClickedWb]) vcdata[undoClickedWb] = false;
    if (!vcdata[lx]) vcdata[lx] = [];
    if (!vcdata[ly]) vcdata[ly] = [];
    if (!vcdata[ox]) vcdata[ox] = [];
    if (!vcdata[oy]) vcdata[oy] = [];
    if (!vcdata[uploadedImgArray]) vcdata[uploadedImgArray] = [];
    if (!vcdata[undoShpArr2]) vcdata[undoShpArr2] = [];
    if (!vcdata[shapesLoadedWb]) vcdata[shapesLoadedWb] = false;
}
var vcdata = new VClassData();
var noPresentation = false;
var line, fline, ellipse, rect, text, rtext, erase_fline;
var sendMsgRatio = 3;
var timer, timer1, timer2, timer3, timer4, timer5, timer6, timer7;
var WHITEBOARD_WIDTH = 720,
    WHITEBOARD_HEIGHT = 540;
var TIME_DELAY = 1000;
var MIN_SLIDE_COUNT = 5;
var MAX_UPLOADED_IMAGES = 20;
var canvas = document.getElementById('wb1'),
    paper = new Raphael(canvas, WHITEBOARD_WIDTH, WHITEBOARD_HEIGHT),
    mousedown = false,
    lastX, lastY, pathString;
var cntt, flag_pr, flag_wb;
var draw_text;
var isLastClicked = false,
    studInLastSlide = false,
    student_access = false;
var imgNo = 1;
var strokeWidth = 1;
var eraserColor = '#1b831f';
var accessToken = "1435f0549f2c4b4a95f36e5e82f3bd46"; //// < need to remove when deploy with main app
var slidesUploaded = 'yes'; // < need to remove when deploy with main app
var currentPrId = '1';
var currentWbId = '1';
var colour = 'black';
var curPositionArr = [];
var cur = paper.circle(0, 0, 3);
cur.attr('fill', 'red');
//var shapes_loaded_pr = false;
//var shapes_loaded_wb = false;
/*
 //Zooming
 var zoomcount = 1;
 $(paper.canvas).bind('mousewheel', function(event, delta) {
 
 console.log("mousewheel: "+event.originalEvent.wheelDelta);
     if (event.originalEvent.wheelDelta>0) {
        zoomcount++;
     }else{
     zoomcount--;
         if (zoomcount<=0) {
         zoomcount = 1;
         }
     }
 paper.setViewBox(0, 0, WHITEBOARD_WIDTH/zoomcount, WHITEBOARD_HEIGHT/zoomcount, true);     
 });
 
 //ZoomingEnd
 */
if (navigator.userAgent.indexOf("Firefox") !== -1) {
    paper.renderfix();
}
/**
 * Update slide count when slide move and append value to a div
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @param  {number} slide number
 * @return {undefined}
 */
function updateSlideCount(slide_no) {
    $('.up-no').empty().append(slide_no);
}
/**
 * Update original(total) slide count when presentaion move and append value to a div
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @param  {number} slide number
 * @return {undefined}
 */
function updateOriginalSlideCount(org_sld_cnt) {
    $('#orgCount').empty().append(org_sld_cnt);
}
/**
 * Reduce massages count
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @param  {Object} sock   socket to emit messages
 * @param  {String} name   name of the message
 * @param  {JSON} json     json value which pass to server
 * @param  {number} by     reduce messages by
 * @return {undefined}
 */
function reduceMsg(sock, name, json, by) {
    if (cnt === 1 || cnt % by === 1) {
        sock.emit(name, json);
    }
    cnt++;
}
/**
 * Draw a freeline on whiteboard (helper function)
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @param  {number} startX    starting point x value of the freeline
 * @param  {number} startY    starting point y value of the freeline
 * @param  {Object} raphael   raphael object
 * @param  {String} col       color of the text
 * @return {undefined}
 */
function FreeLine(startX, startY, raphael, col, stoke_width, shpid) {
    var pathString;
    var start = {
        x: startX,
        y: startY
    };
    var getPath = function() {
        pathString = 'M' + start.x + ' ' + start.y + 'l0 0';
        return pathString;
    };
    var redraw = function() {
        node.attr("path", getPath());
    };
    var node = raphael.path(getPath());
    node.attr({
        'stroke': col,
        'fill-opacity': 1,
        'stroke-width': stoke_width
    });
    if (vcdata[storeMessages] === true) {
        vcdata[shapes].push({ //vcdata
            node: node,
            store: true
        });
    } else {
        var shpID;
        if (typeof shpid === 'undefined') {
            shpID = shapes + "_" + vcdata[currrentSlideNo];
        } else {
            shpID = shpid;
        }
        vcdata[shapes].push({
            node: node,
            store: false,
            prShpID: shpID
        });
    }
    return {
        updateStart: function(x, y) {
            start.x = x;
            start.y = y;
            redraw();
            return this;
        },
        updateEnd: function(x, y) {
            pathString += 'l' + x + ' ' + y;
            node.attr("path", pathString);
            return this;
        },
        clear: function() {
            node.remove();
        },
        hide: function() {
            node.hide();
        },
        show: function() {
            node.show();
        },
        toFront: function() {
            node.toFront();
        },
        unDrag: function() {
            node.undrag();
        }
    };
}
/**
 * Draw a line on whiteboard (helper function)
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @param  {number} startX    starting point x value of the line
 * @param  {number} startY    starting point y value of the line
 * @param  {number} endX      ending point x value of the line
 * @param  {number} endY      ending point y value of the line
 * @param  {Object} raphael   raphael object
 * @param  {String} col       color of the line
 * @return {undefined}
 */
function Line(startX, startY, endX, endY, raphael, col, stoke_width, shpid) {
    //console.log()
    var start = {
        x: startX,
        y: startY
    };
    var end = {
        x: endX,
        y: endY
    };
    var getPath = function() {
        return "M" + start.x + " " + start.y + " L" + end.x + " " + end.y;
    };
    var redraw = function() {
        node.attr("path", getPath());
    };
    var node = raphael.path(getPath());
    node.attr({
        'stroke': col,
        'fill-opacity': 1,
        'stroke-width': stoke_width
    });
    if (vcdata[storeMessages] === true) {
        vcdata[shapes].push({
            node: node,
            store: true
        });
    } else {
        var shpID;
        if (typeof shpid === 'undefined') {
            shpID = shapes + "_" + vcdata[currrentSlideNo];
        } else {
            shpID = shpid;
        }
        vcdata[shapes].push({
            node: node,
            store: false,
            prShpID: shpID
        });
    }
    return {
        updateStart: function(x, y) {
            start.x = x;
            start.y = y;
            redraw();
            return this;
        },
        updateEnd: function(x, y) {
            end.x = x;
            end.y = y;
            redraw();
            return this;
        },
        clear: function() {
            node.remove();
        },
        hide: function() {
            node.hide();
        },
        show: function() {
            node.show();
        }
    };
}
/**
 * Draw a ellipse on whiteboard (helper function)
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @param  {number} startX    starting point x value of the ellipse
 * @param  {number} startY    starting point y value of the ellipse
 * @param  {number} width     width of the ellipse
 * @param  {number} height    height of the ellipse
 * @param  {Object} raphael   raphael object
 * @param  {String} col       color of the ellipse
 * @return {undefined}
 */
function Ellipse(startX, startY, width, height, raphael, col, stoke_width, shpid) {
    var start = {
        x: startX,
        y: startY,
        w: width,
        h: height
    };
    var end = {
        w: width,
        h: height
    };
    var getWidth = function() {
        return end.w;
    };
    var getHeight = function() {
        return end.h;
    };
    var redraw = function() {
        node.attr({
            rx: getWidth(),
            ry: getHeight()
        });
    };
    var node = raphael.ellipse(start.x, start.y, getWidth(), getHeight());
    node.attr({
        'stroke': col,
        'fill-opacity': 1,
        'stroke-width': stoke_width
    });
    //node.attr({href: "http://google.com/", target: "blank"});
    if (vcdata[storeMessages] === true) {
        vcdata[shapes].push({
            node: node,
            store: true
        });
    } else {
        var shpID;
        if (typeof shpid === 'undefined') {
            shpID = shapes + "_" + vcdata[currrentSlideNo];
        } else {
            shpID = shpid;
        }
        vcdata[shapes].push({
            node: node,
            store: false,
            prShpID: shpID
        });
    }
    return {
        updateStart: function(x, y) {
            start.x = x;
            start.y = y;
            redraw();
            return this;
        },
        updateEnd: function(x, y) {
            var v = {
                x: Math.abs(x - start.x),
                y: Math.abs(y - start.y)
            };
            //Radius
            end.w = v.x;
            end.h = v.y;
            redraw();
            return this;
        },
        clear: function() {
            node.remove();
        },
        hide: function() {
            node.hide();
        },
        show: function() {
            node.show();
        }
    };
}
/**
 * Draw a rectangle shape on whiteboard (helper function)
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @param  {number} startX    starting point x value of the rectangle
 * @param  {number} startY    starting point y value of the rectangle
 * @param  {number} width     width of the rectangle
 * @param  {number} height    height of the rectangle
 * @param  {Object} raphael   raphael object
 * @param  {String} col       color of the rectangle
 * @return {undefined}
 */
function Rect(startX, startY, width, height, raphael, col, stoke_width, shpid) {
    var start = {
        x: startX,
        y: startY,
        w: width,
        h: height
    };
    var end = {
        w: width,
        h: height
    };
    var getWidth = function() {
        return end.w;
    };
    var getHeight = function() {
        return end.h;
    };
    var redraw = function() {
        node.attr({
            width: getWidth(),
            height: getHeight()
        });
    };
    var node = raphael.rect(start.x, start.y, getWidth(), getHeight());
    node.attr({
        'stroke': col,
        'fill-opacity': 1,
        'stroke-width': stoke_width
    });
    if (vcdata[storeMessages] === true) {
        vcdata[shapes].push({
            node: node,
            store: true
        });
    } else {
        var shpID;
        if (typeof shpid === 'undefined') {
            shpID = shapes + "_" + vcdata[currrentSlideNo];
        } else {
            shpID = shpid;
        }
        vcdata[shapes].push({
            node: node,
            store: false,
            prShpID: shpID
        });
    }
    return {
        updateStart: function(x, y) {
            start.x = x;
            start.y = y;
            redraw();
            return this;
        },
        updateEnd: function(x, y) {
            var v = {
                x: Math.abs(x - start.x),
                y: Math.abs(y - start.y)
            };
            //Width
            var width = v.x;
            var height = v.y;
            end.h = height;
            end.w = width;
            redraw();
            return this;
        },
        clear: function() {
            node.remove();
        },
        hide: function() {
            node.hide();
        },
        show: function() {
            node.show();
        }
    };
}
/**
 * Draw a text on whiteboard (helper function)
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @param  {number} startX    starting point x value of the text
 * @param  {number} startY    starting point y value of the text
 * @param  {number} rtext     text to draw
 * @param  {Object} raphael   raphael object
 * @param  {String} col       color of the text
 * @return {undefined}
 */
function Text(startX, startY, rtext, raphael, col, shpid) {
    var start = {
        x: startX,
        y: startY
    };
    var node = raphael.text(start.x, start.y, rtext);
    node.attr({
        'fill': col,
        'fill-opacity': 1,
        'font-size': 15,
        'text-anchor': 'start'
        //'stroke-width': stoke_width
    });
    if (vcdata[storeMessages] === true) {
        vcdata[shapes].push({
            node: node,
            store: true
        });
    } else {
        var shpID;
        if (typeof shpid === 'undefined') {
            shpID = shapes + "_" + vcdata[currrentSlideNo];
        } else {
            shpID = shpid;
        }
        vcdata[shapes].push({
            node: node,
            store: false,
            prShpID: shpID
        });
    }
    return {
        updateStart: function(x, y) {
            start.x = x;
            start.y = y;
            redraw();
            return this;
        },
        clear: function() {
            node.remove();
        },
        hide: function() {
            node.hide();
        },
        show: function() {
            node.show();
        }
        //node: node
    };
}
/**
 * @description Text drawing on text button click
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function drawText() {
    $(canvas).unbind();
    $(canvas).bind('mousemove', function(e) {
        movePointer(e);
    });
    draw_text = true;
    var x, y;
    $(canvas).mousedown(function(e) {
        //draw_text = true;
        if (e.offsetX === undefined) // this works for Firefox
        {
            x = e.pageX - $(canvas).offset().left;
            y = e.pageY - $(canvas).offset().top;
        } else // works in Google Chrome
        {
            x = e.offsetX;
            y = e.offsetY;
        }
        x = e.pageX;
        y = e.pageY - $("#cmd").height() / 2;
        lastX = x;
        lastY = y;
        if (draw_text === false) {
            $('#cmd').hide();
        }
        if (draw_text === true) {
            //draw_text = false;
            $('#cmd').css({
                left: x,
                top: y
            });
            $('#cmd').show();
        }
        $('#txtinput').focus();
        var cursor = window.setInterval(function() {
            if ($('#cursor').css('visibility') === 'visible') {
                $('#cursor').css({
                    visibility: 'hidden'
                });
            } else {
                $('#cursor').css({
                    visibility: 'visible'
                });
            }
        }, 500);
    });
    $("#txtinput").keyup(function(event) {
        if (event.keyCode === 13) {
            //$(canvas).unbind();
            var txt = $("#txtinput").val();
            k = $("#wb1").offset().left;
            l = $("#wb1").offset().top;
            rtext = Text(lastX - k, lastY - l, txt, paper, colour);
            socket.emit('draw_text', {
                txtx: lastX,
                txty: lastY,
                tk: k,
                tl: l,
                text: txt,
                colour: colour,
                shpid: shapes + "_" + vcdata[currrentSlideNo],
                token: accessToken
            });
            //mousedown = false;
            draw_text = false;
            $('#cmd').hide();
            $("#txtinput").val("");
        } else if (event.keyCode === 27) {
            draw_text = false;
            $('#cmd').hide();
            $("#txtinput").val("");
        }
    });
    $('#popupBoxClose').click(function() {
        $('#cmd').hide();
    });
    $t = $("#wb1");
    $("#overlay").css({
        opacity: 0.5,
        top: $t.offset().top,
        width: $t.outerWidth(),
        height: $t.outerHeight()
    });
}
$('#txtinput').keyup(function() {
    $('#cmd span').text($(this).val());
    //console.log($(this).val());
});
$('#txtinput').blur(function() {
    clearInterval(cursor);
    $('#cursor').css({
        visibility: 'visible'
    });
});
/**
 * @description Path drawing on button click
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function drawPath() {
    cnt = 1;
    var x, y;
    $(canvas).unbind();
    $(canvas).bind('mousemove', function(e) {
        movePointer(e);
    });
    $('#cmd').hide();
    $(canvas).mousedown(function(e) {
        mousedown = true;
        if (e.offsetX === undefined) // this works for Firefox
        {
            x = e.pageX - $(canvas).offset().left;
            y = e.pageY - $(canvas).offset().top;
        } else // works in Google Chrome
        {
            x = e.offsetX;
            y = e.offsetY;
        }
        $("text").each(function(index, element) {
            $(this).hide();
        });
        fline = FreeLine(x, y, paper, colour, strokeWidth);
        socket.emit('draw_path', {
            flb: x,
            fle: y,
            colour: colour,
            strokeWidth: strokeWidth,
            shpid: shapes + "_" + vcdata[currrentSlideNo],
            token: accessToken
        });
        lastX = x;
        lastY = y;
    });
    $(canvas).mouseup(function() {
        mousedown = false;
        $(canvas).unbind();
        socket.emit('draw_path_update', {
            arr: vcdata[wb_flArray],
            shpid: shapes + "_" + vcdata[currrentSlideNo],
            token: accessToken
        });
        vcdata[wb_flArray].length = 0;
        $("text").each(function(index, element) {
            $(this).show();
        });
        cnt = 1;
        drawPath();
    });
    $(canvas).mousemove(function(e) {
        var x, y;
        if (e.offsetX === undefined) // this works for Firefox
        {
            x = e.pageX - $(canvas).offset().left;
            y = e.pageY - $(canvas).offset().top;
        } else // works in Google Chrome
        {
            x = e.offsetX;
            y = e.offsetY;
        }
        if (!mousedown) {
            return;
        }
        fline.updateEnd(x - lastX, y - lastY);
        $("text").each(function(index, element) {
            $(this).hide();
        });
        vcdata[wb_flArray].push({
            flx: x - lastX,
            fly: y - lastY
        });
        lastX = x;
        lastY = y;
    });
    return fline;
}
/**
 * @description Line drawing on button click
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function drawLine() {
    cnt = 1;
    var x, y;
    $(canvas).unbind();
    $(canvas).bind('mousemove', function(e) {
        movePointer(e);
    });
    $('#cmd').hide();
    $(canvas).mousedown(function(e) {
        mousedown = true;
        if (e.offsetX === undefined) // this works for Firefox
        {
            x = e.pageX - $(canvas).offset().left;
            y = e.pageY - $(canvas).offset().top;
        } else // works in Google Chrome
        {
            x = e.offsetX;
            y = e.offsetY;
        }
        line = Line(x, y, x, y, paper, colour, strokeWidth);
        socket.emit('draw_line', {
            lb: x,
            le: y,
            colour: colour,
            strokeWidth: strokeWidth,
            shpid: shapes + "_" + vcdata[currrentSlideNo],
            token: accessToken
        });
        $("text").each(function(index, element) {
            $(this).hide();
        });
    });
    $(canvas).mouseup(function() {
        mousedown = false;
        $(canvas).unbind();
        $("text").each(function(index, element) {
            $(this).show();
        });
        cnt = 1;
        drawLine();
    });
    $(canvas).mousemove(function(e) {
        var x, y;
        if (e.offsetX === undefined) // this works for Firefox
        {
            x = e.pageX - $(canvas).offset().left;
            y = e.pageY - $(canvas).offset().top;
        } else // works in Google Chrome
        {
            x = e.offsetX;
            y = e.offsetY;
        }
        if (!mousedown) {
            return;
        }
        line.updateEnd(x, y);
        $("text").each(function(index, element) {
            $(this).hide();
        });
        reduceMsg(socket, 'draw_line_update', {
            lx: x,
            ly: y,
            shpid: shapes + "_" + vcdata[currrentSlideNo],
            token: accessToken
        }, sendMsgRatio);
        //socket.emit('draw_line_update', {lx: x, ly: y});
    });
}
/**
 * @description Ellipse drawing on button click
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function drawEllipse() {
    cnt = 1;
    var x, y;
    $(canvas).unbind();
    $(canvas).bind('mousemove', function(e) {
        movePointer(e);
    });
    $('#cmd').hide();
    $(canvas).mousedown(function(e) {
        mousedown = true;
        if (e.offsetX === undefined) // this works for Firefox
        {
            x = e.pageX - $(canvas).offset().left;
            y = e.pageY - $(canvas).offset().top;
        } else // works in Google Chrome
        {
            x = e.offsetX;
            y = e.offsetY;
        }
        ellipse = Ellipse(x, y, 0, 0, paper, colour, strokeWidth);
        socket.emit('draw_ellipse', {
            cb: x,
            ce: y,
            colour: colour,
            strokeWidth: strokeWidth,
            shpid: shapes + "_" + vcdata[currrentSlideNo],
            token: accessToken
        });
    });
    $(canvas).mouseup(function() {
        mousedown = false;
        $(canvas).unbind();
        $("text").each(function(index, element) {
            $(this).show();
        });
        cnt = 1;
        drawEllipse();
    });
    $(canvas).mousemove(function(e) {
        var x, y;
        if (e.offsetX === undefined) // this works for Firefox
        {
            x = e.pageX - $(canvas).offset().left;
            y = e.pageY - $(canvas).offset().top;
        } else // works in Google Chrome
        {
            x = e.offsetX;
            y = e.offsetY;
        }
        if (!mousedown) {
            return;
        }
        $("text").each(function(index, element) {
            $(this).hide();
        });
        ellipse.updateEnd(x, y);
        //socket.emit('draw_circle_update', {cx: x, cy: y});
        reduceMsg(socket, 'draw_ellipse_update', {
            cx: x,
            cy: y,
            shpid: shapes + "_" + vcdata[currrentSlideNo],
            token: accessToken
        }, sendMsgRatio);
    });
}
/**
 * @description Rectangle drawing on button click
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function drawRect() {
    cnt = 1;
    $(canvas).unbind();
    $(canvas).bind('mousemove', function(e) {
        movePointer(e);
    });
    $('#cmd').hide();
    $(canvas).mousedown(function(e) {
        var x, y;
        if (e.offsetX === undefined) // this works for Firefox
        {
            x = e.pageX - $(canvas).offset().left;
            y = e.pageY - $(canvas).offset().top;
        } else // works in Google Chrome
        {
            x = e.offsetX;
            y = e.offsetY;
        }
        mousedown = true;
        rect = Rect(x, y, 0, 0, paper, colour, strokeWidth);
        socket.emit('draw_rect', {
            rb: x,
            re: y,
            colour: colour,
            strokeWidth: strokeWidth,
            shpid: shapes + "_" + vcdata[currrentSlideNo],
            token: accessToken
        });
    });
    $(canvas).mouseup(function() {
        mousedown = false;
        $(canvas).unbind();
        $("text").each(function(index, element) {
            $(this).show();
        });
        cnt = 1;
        drawRect();
    });
    $(canvas).mousemove(function(e) {
        var x, y;
        if (e.offsetX === undefined) // this works for Firefox
        {
            x = e.pageX - $(canvas).offset().left;
            y = e.pageY - $(canvas).offset().top;
        } else // works in Google Chrome
        {
            x = e.offsetX;
            y = e.offsetY;
        }
        if (!mousedown) {
            return;
        }
        $("text").each(function(index, element) {
            $(this).hide();
        });
        rect.updateEnd(x, y);
        //socket.emit('draw_rect_update', {rx: x, ry: y});
        reduceMsg(socket, 'draw_rect_update', {
            rx: x,
            ry: y,
            shpid: shapes + "_" + vcdata[currrentSlideNo],
            token: accessToken
        }, sendMsgRatio);
    });
}
/**
 * @description delete all shapes
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function permenentlyDeleteShapes() {
    Array.prototype.map.call(vcdata[shapes], function(el) {
        el.node.remove();
    });
}
/**
 * @description clear erase data array
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function removeEraseData() {
    if (typeof vcdata[restoreEraseDataArr] !== 'undefined' && vcdata[restoreEraseDataArr] !== null) {
        if (vcdata[whiteboardClicked] === true) {
            vcdata[restoreEraseDataArr].length = 0;
        }
    }
}
/**
 * @description clear paper on button click
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function clearPaper() {
    showHidePrDrawings(90001);
    if (vcdata[whiteboardClicked] === true) {
        removeUploadedImages();
        permenentlyDeleteShapes();
        removeEraseData();
    }
    if (typeof vcdata[restoreWbDataArr] !== 'undefined' && vcdata[restoreWbDataArr] !== null) {
        if (vcdata[whiteboardClicked] === true) {
            vcdata[restoreWbDataArr].length = 0;
        }
    }
    if (typeof vcdata[restorePrDataArr] !== 'undefined' && vcdata[restorePrDataArr] !== null) {
        if (vcdata[whiteboardClicked] === false) {
            vcdata[restorePrDataArr].length = 0;
        }
    }
    socket.emit('clear_paper', {
        clr: true,
        wbclicked: vcdata[whiteboardClicked],
        slideno: vcdata[currrentSlideNo],
        uploadedImgArray: uploadedImgArray,
        token: accessToken
    });
}
/**
 * @description erase shapes on button click
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function erase() {
    $(canvas).unbind();
    if (vcdata[whiteboardClicked] === true) {
        cnt = 1;
        var x, y;
        $(canvas).bind('mousemove', function(e) {
            movePointer(e);
        });
        $('#cmd').hide();
        $(canvas).mousedown(function(e) {
            mousedown = true;
            if (e.offsetX === undefined) // this works for Firefox
            {
                x = e.pageX - $(canvas).offset().left;
                y = e.pageY - $(canvas).offset().top;
            } else // works in Google Chrome
            {
                x = e.offsetX;
                y = e.offsetY;
            }
            $("text").each(function(index, element) {
                $(this).hide();
            });
            erase_fline = FreeLine(x, y, paper, eraserColor, 6);
            socket.emit('erase_line', {
                eflb: x,
                efle: y,
                colour: eraserColor,
                strokeWidth: 6,
                whiteboardClickedStatus: vcdata[whiteboardClicked],
                token: accessToken
            });
            lastX = x;
            lastY = y;
        });
        $(canvas).mouseup(function() {
            mousedown = false;
            $(canvas).unbind();
            socket.emit('erase_line_update', {
                earr: vcdata[wb_eraseLineArray],
                token: accessToken
            });
            vcdata[wb_eraseLineArray] = [];
            $("text").each(function(index, element) {
                $(this).show();
            });
            cnt = 1;
            erase();
        });
        $(canvas).mousemove(function(e) {
            var x, y;
            if (e.offsetX === undefined) // this works for Firefox
            {
                x = e.pageX - $(canvas).offset().left;
                y = e.pageY - $(canvas).offset().top;
            } else // works in Google Chrome
            {
                x = e.offsetX;
                y = e.offsetY;
            }
            if (!mousedown) {
                return;
            }
            erase_fline.updateEnd(x - lastX, y - lastY);
            $("text").each(function(index, element) {
                $(this).hide();
            });
            vcdata[wb_eraseLineArray].push({
                eflx: x - lastX,
                efly: y - lastY
            });
            lastX = x;
            lastY = y;
        });
    }
}
/**
 * @description fullscreen on button click
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function fullScreen() {
    function enterCallback(actualElement) {
        sendMessage({
            scope: 'photo',
            name: 'enter',
            id: actualElement.id
        });
    }

    function exitCallback() {
        sendMessage({
            scope: 'photo',
            name: 'exit'
        });
    }

    function errorCallback(reason) {
        sendMessage({
            scope: 'photo',
            name: 'error',
            reason: reason,
            id: this.id
        });
    }
    var wb = document.getElementById('wb1');
    BigScreen.toggle(wb, enterCallback, exitCallback, errorCallback);
}
//color picker
$('#canvascolours [data-colour]').each(function() {
    var $this = $(this),
        divColour = $this.data('colour');
    // Change the background colour of the box
    $this.css('background-color', divColour);
    // Add the event listener
    $this.click(function() {
        colour = divColour;
    });
});
//disable dragging the slide(firefox)
$(document).bind("dragstart", function() {
    return false;
});
/**
 * @description load initial images
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function loadImages() {
    for (j = 0; j < MIN_SLIDE_COUNT; j++) {
        fetchImages(j, currentPrId);
        vcdata[noOfSlides] = j + 1;
        tmp_slide_std = j + 1;
    }
    vcdata[currentPrArray][0].show();
    updateSlideCount(1);
    //auto requesting images with 3s time delay
    (function step() {
        //console.log("fn: loadImages, timer");
        if (vcdata[noOfSlides] < vcdata[orgSlideCount]) {
            if (vcdata[orgSlideCount] - 1 < vcdata[noOfSlides]) {
                clearTimeout(timer);
                vcdata[imageRequest] = false;
                vcdata[imageRequestStudent] = false;
                return;
            }
            //console.log(vcdata[imageRequest] + " - " + vcdata[imageRequestStudent])
            if (vcdata[imageRequest] === true && vcdata[imageRequestStudent] === true) {
                fetchImages(vcdata[noOfSlides], currentPrId);
                timer = setTimeout(step, TIME_DELAY);
                vcdata[noOfSlides]++;
                tmp_slide_std = vcdata[noOfSlides]; //Added
            }
        }
    })();
}
if (slidesUploaded === 'yes') {
    loadImages();
}
/**
 * @description load images forward
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @param {number} from     slide from
 * @param {number} to       slide to
 * @return {undefined}
 */
function loadFrontImages(from, to) {
    (function frontstep() {
        if (from - 1 < to) {
            if (to < from) {
                clearTimeout(timer1);
                return;
            }
            fetchImages(from, currentPrId);
            timer1 = setTimeout(frontstep, TIME_DELAY);
            from++;
        }
    })();
}
/**
 * @description remove stored shapes of whiteboard (helper)
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function showHidePrDrawings(incr) {
    var shpID;
    if (incr === 10001) {
        shpID = shapes + "_" + 0;
    } else if (incr === 50001) {
        shpID = shapes + "_" + (vcdata[orgSlideCount] - 1);
    } else if (incr === 90001) {
        shpID = shapes + "_" + vcdata[currrentSlideNo];
    } else {
        shpID = shapes + "_" + (vcdata[currrentSlideNo] + incr);
    }
    if (vcdata[shapes]) {
        Array.prototype.map.call(vcdata[shapes], function(el) {
            if (shpID === el.prShpID) {
                el.node.show();
                el.node.toFront();
            } else {
                el.node.hide();
            }
            if (incr === 90001) { //vcdata[currrentSlideNo]
                if (shpID === el.prShpID) {
                    el.node.remove();
                }
            }
        });
    }
}
/**
 * @description remove all uploaded images
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function removeUploadedImages() {
    if (vcdata[whiteboardClicked] === true) {
        if (typeof vcdata[uploadedImgArray] !== 'undefined') {
            Array.prototype.map.call(vcdata[uploadedImgArray], function(el) {
                if (el !== null) {
                    if (typeof el !== 'undefined') {
                        el.remove();
                    }
                }
            });
        }
    }
}
/**
 * @description disable all slide controls
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @param {boolean} value  to disable or enable
 * @return {undefined}
 */
function disableSlideControls(value) {
    if (value === true) {
        $('#frst').attr('disabled', 'disabled');
        $('#lst').attr('disabled', 'disabled');
        $('#fwd').attr('disabled', 'disabled');
        $('#prv').attr('disabled', 'disabled');
    } else if (value === false) {
        $('#frst').removeAttr('disabled');
        $('#lst').removeAttr('disabled');
        $('#fwd').removeAttr('disabled');
        $('#prv').removeAttr('disabled');
    }
}
/**
 * @description get inner most index of the shapes array
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function getInnerBound(arr, curr) {
    var innerBound = 0;
    var shpID = shapes + "_" + curr;
    var l = 0;
    while (arr.length > 0 && l < arr.length) {
        if (shpID === arr[l].prShpID) {
            break;
        } else {
            innerBound++;
        }
        l++;
    }
    return innerBound;
}
/**
 * @description get shapes count presentation slide
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function getShapeCount(arr, curr) {
    var shpCnt = 0;
    var shpID = shapes + "_" + curr;
    var k = 0;
    while (arr.length > 0 && k < arr.length) {
        if (shpID === arr[k].prShpID) {
            shpCnt++;
        }
        k++;
    }
    return shpCnt;
}
/**
 * @description get shapes count whiteboard
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function getShapeCountWb(arr) {
    var shpCnt = 0;
    var k = 0;
    while (arr.length > 0 && k < arr.length) {
        shpCnt++;
        k++;
    }
    return shpCnt;
}
/**
 * @description undo drawings
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function sortShapes(shapes_arr) {
    for (var i = 0; i < shapes_arr.length; i++) {
        for (var j = i; j < shapes_arr.length; j++) {
            if (parseInt(shapes_arr[i].prShpID.slice(-1)) > parseInt(shapes_arr[j].prShpID.slice(-1))) {
                var tmp = shapes_arr[i];
                shapes_arr[i] = shapes_arr[j];
                shapes_arr[j] = tmp;
            }
        }
    }
}
/**
 * @description undo shapes
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function undo() {
    if (vcdata[whiteboardClicked] === true) {
        var shpCnt = getShapeCountWb(vcdata[shapes]);
        if (vcdata[shapes][shpCnt - 1]) {
            vcdata[shapes][shpCnt - 1].node.hide();
            vcdata[undoShpArr2].push(vcdata[shapes][shpCnt - 1]);
            vcdata[shapes].splice(shpCnt - 1, 1);
        }
        socket.emit('undo_drawing', {
            undo: true,
            wbclicked: vcdata[whiteboardClicked]
        });
    } else {
        if (vcdata[shapes]) {
            sortShapes(vcdata[shapes]);
            var innerBound = getInnerBound(vcdata[shapes], vcdata[currrentSlideNo]);
            var shpCnt2 = getShapeCount(vcdata[shapes], vcdata[currrentSlideNo]);
            if (vcdata[shapes][shpCnt2 + innerBound - 1]) {
                vcdata[shapes][shpCnt2 + innerBound - 1].node.hide();
                vcdata[undoShpArr].push(vcdata[shapes][shpCnt2 + innerBound - 1]);
                vcdata[shapes].splice(shpCnt2 + innerBound - 1, 1);
            }
        }
        socket.emit('undo_drawing', {
            undo: true,
            wbclicked: vcdata[whiteboardClicked],
            slideno: vcdata[currrentSlideNo]
        });
    }
}
/**
 * @description redo shapes
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function redo() {
    if (vcdata[whiteboardClicked] === true) {
        var shpCnt = getShapeCountWb(vcdata[undoShpArr2]);
        if (vcdata[undoShpArr2]) {
            vcdata[undoShpArr2][shpCnt - 1].node.show();
            vcdata[shapes].push(vcdata[undoShpArr2][shpCnt - 1]);
            vcdata[undoShpArr2].splice(shpCnt - 1, 1);
        }
        socket.emit('redo_drawing', {
            undo: true,
            wbclicked: vcdata[whiteboardClicked]
        });
    } else {
        var undoArrSize = vcdata[undoShpArr].length;
        sortShapes(vcdata[undoShpArr]);
        var innerBound = getInnerBound(vcdata[undoShpArr], vcdata[currrentSlideNo]);
        var shpCnt2 = getShapeCount(vcdata[undoShpArr], vcdata[currrentSlideNo]);
        if (vcdata[undoShpArr][innerBound]) {
            vcdata[undoShpArr][shpCnt2 + innerBound - 1].node.show();
            vcdata[shapes].push(vcdata[undoShpArr][shpCnt2 + innerBound - 1]);
            vcdata[undoShpArr].splice(shpCnt2 + innerBound - 1, 1);
        }
        socket.emit('redo_drawing', {
            undo: true,
            wbclicked: vcdata[whiteboardClicked],
            slideno: vcdata[currrentSlideNo]
        });
    }
}
/**
 * @description request range of images
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @param {number} buff  load images from...
 * @return {undefined}
 */
function requestImageRange(buff) {
    if (vcdata[forceLoad] < vcdata[tmpSlideEnd]) {
        if (buff > vcdata[forceLoad]) {
            if (buff < vcdata[orgSlideCount] && vcdata[forceLoad] <= vcdata[orgSlideCount] - 3) {
                vcdata[forceLoad] = buff;
                (function stepfwd() {
                    fetchImages(vcdata[forceLoad], currentPrId);
                    timer2 = setTimeout(stepfwd, TIME_DELAY);
                    if (vcdata[forceLoad] > buff + 3) {
                        clearTimeout(timer2);
                        vcdata[forceLoad] = buff + 3;
                    }
                    vcdata[forceLoad]++;
                })();
            }
        } else {}
    }
}
/**
 * @description load remaining images from last to current backwards
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @param {number} from  load images from
 * @param {number} to    load images to
 * @return {undefined}
 */
function requestOtherImages(from, to) {
    (function backstep() {
        if (from - 1 < to) {
            if (to < from) {
                clearTimeout(timer4);
                return;
            }
            fetchImages(to, currentPrId);
            timer4 = setTimeout(backstep, TIME_DELAY);
            to--;
            vcdata[tmpSlideEnd] = to;
        }
    })();
}
/**
 * @description go to next slide on button click
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function gotoNext() {
    if (vcdata[currrentSlideNo] == vcdata[orgSlideCount] - 2) {
        $('#fwd').attr('disabled', 'disabled');
    }
    clearTimeout(timer7);
    vcdata[storeMessages] = false;
    showHidePrDrawings(1);
    $('#frst').removeAttr('disabled');
    $('#prv').removeAttr('disabled');
    if (isLastClicked === true) { //Added
        vcdata[currentPrArray][0].hide();
    }
    next = vcdata[currrentSlideNo] + 1;
    prv = vcdata[currrentSlideNo];
    if (next < vcdata[orgSlideCount]) {
        if (typeof vcdata[currentPrArray][next] === 'undefined') {
            clearTimeout(timer6); //stop foward loading slides
            clearTimeout(timer7); //stop backward loading slides
            fetchImages(next, currentPrId);
        }
        vcdata[currentPrArray][prv].hide();
        vcdata[currentPrArray][next].show();
        socket.emit('gotonext', {
            next_page: next,
            prv_page: prv,
            currentPrId: currentPrId,
            token: accessToken
        });
        updateSlideCount(next + 1);
        vcdata[currrentSlideNo]++;
    }
    //Removed 24-06
}
/**
 * @description go to previous slide on button click
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function gotoPrv() {
    vcdata[storeMessages] = false;
    showHidePrDrawings(-1);
    if (vcdata[currrentSlideNo] >= 1) {
        if (vcdata[currrentSlideNo] <= 1) {
            $('#prv').attr('disabled', 'disabled');
            $('#frst').attr('disabled', 'disabled');
        }
        $('#lst').removeAttr('disabled');
        $('#fwd').removeAttr('disabled');
        next = vcdata[currrentSlideNo] - 1;
        prv = vcdata[currrentSlideNo];
        if (typeof vcdata[currentPrArray][next] === 'undefined') {
            clearTimeout(timer6); //stop foward loading slides
            clearTimeout(timer7); //stop backward loading slides
            fetchImages(next, currentPrId);
            vcdata[currentPrArray][prv].hide();
            vcdata[currentPrArray][next].show();
            socket.emit('gotoprv', {
                next_page: next,
                prv_page: prv,
                currentPrId: currentPrId,
                token: accessToken
            });
        } else {
            vcdata[currentPrArray][next].show();
            vcdata[currentPrArray][prv].hide();
            socket.emit('gotoprv', {
                next_page: next,
                prv_page: prv,
                currentPrId: currentPrId,
                token: accessToken
            });
        }
        updateSlideCount(next + 1);
        vcdata[currrentSlideNo]--;
    }
    //Removed 24-06
}
/**
 * @description go to first slide on button click
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function gotoFirst() {
    clearTimeout(timer2);
    $('#fwd').removeAttr('disabled');
    if (isLastClicked === true) {
        clearTimeout(timer4);
        if (vcdata[tmpSlideEnd] === 'undefined') {
            vcdata[tmpSlideEnd] = vcdata[tmpSlide];
        }
        vcdata[currentPrArray][0].hide(); //Added
    }
    vcdata[storeMessages] = false;
    showHidePrDrawings(10001);
    $('#lst').removeAttr('disabled');
    $('#frst').attr('disabled', 'disabled');
    $('#prv').attr('disabled', 'disabled');
    next = 0;
    prv = vcdata[currrentSlideNo];
    if (!vcdata[currentPrArray][next]) {
        fetchImages(next, currentPrId);
    }
    vcdata[currentPrArray][prv].hide();
    vcdata[currentPrArray][next].show();
    socket.emit('gotofrst', {
        next_page: next,
        prv_page: prv,
        currentPrId: currentPrId,
        token: accessToken
    });
    vcdata[currrentSlideNo] = 0;
    updateSlideCount(next + 1);
}
/**
 * @description go to last slide on button click
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function gotoLast() {
    clearTimeout(timer6); //stop foward loading slides
    $('#fwd').attr('disabled', 'disabled');
    vcdata[storeMessages] = false;
    if (isLastClicked === false) {
        isLastClicked = true;
        vcdata[tmpSlide] = vcdata[noOfSlides];
    } else {
        isLastClicked = false;
    }
    $('#lst').attr('disabled', 'disabled');
    $('#frst').removeAttr('disabled');
    $('#prv').removeAttr('disabled');
    showHidePrDrawings(50001);
    next = vcdata[orgSlideCount] - 1;
    prv = vcdata[currrentSlideNo];
    if (vcdata[imageRequestStudent] === true) {
        if (typeof vcdata[tmpSlideEnd] !== 'undefined') {
            requestOtherImages(vcdata[noOfSlides], vcdata[tmpSlideEnd] - 1);
            vcdata[imageRequestStudent] = false;
        } else {
            requestOtherImages(vcdata[noOfSlides], next);
            vcdata[imageRequestStudent] = false;
        }
    }
    if (typeof vcdata[currentPrArray][next] === 'undefined') {
        fetchImages(next, currentPrId);
        //vcdata[currentPrArray][next].show();
    } else {}
    vcdata[currentPrArray][prv].hide();
    vcdata[currentPrArray][next].show();
    socket.emit('gotolst', {
        next_page: next,
        prv_page: prv,
        currentPrId: currentPrId,
        token: accessToken
    });
    vcdata[noOfSlides] = vcdata[orgSlideCount];
    vcdata[currrentSlideNo] = vcdata[orgSlideCount] - 1;
    updateSlideCount(next + 1);
}
/**
 * @description request single image
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @param next image to request
 * @return {undefined}
 */
function fetchImages(imgNo, prid) {
    //console.log(imgNo+" <-> "+ prid);
    if (imgNo >= 0) {
        vcdata[currentPrArray][imgNo] = paper.image(slide_dir + prid + '_' + imgNo + '.gif?' + (new Date()).getTime(), 0, 0, WHITEBOARD_WIDTH, WHITEBOARD_HEIGHT);
        vcdata[currentPrArray][imgNo].node.id = prid + '_' + imgNo;
        vcdata[currentPrArray][imgNo].node.preserveAspectRatio.baseVal.align = 6;
        //paper.canvas.setAttribute('style','background-color:#00771E');
        vcdata[currentPrArray][imgNo].hide();
    }
}
/**
 * @description remove drawings of remote client
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function remoteShowHideUploadedimgs(incr) {
    var shpID;
    shpID = shapes + "_" + (vcdata[currrentSlideNo]);
    Array.prototype.map.call(vcdata[shapes], function(el) {
        if (incr === 90001) { //vcdata[currrentSlideNo]
            if (shpID === el.prShpID) {
                el.node.remove();
            }
        } else {
            if (shpID === el.prShpID) {
                el.node.show();
            } else {
                el.node.hide();
            }
        }
    });
}
/**
 * @description restore erase data
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function restoreEraseData(data, wbid) {
    wb_eraseLineArray = 'erase_fl_array_wb' + wbid;
    if (!vcdata[wb_eraseLineArray]) vcdata[wb_eraseLineArray] = [];
    if (data !== null) {
        Array.prototype.map.call(data, function(el) {
            if (wb_eraseLineArray === el._eflarray) {
                if (wb_eraseLineArray === el._eflarray) {
                    if (el._eflb || el._earr) {
                        vcdata[wb_eraseLineArray].push(el);
                    }
                }
            }
        });
    }
    //console.log(vcdata[wb_eraseLineArray].length);
    if (vcdata[wb_eraseLineArray].length !== 0) { //erase
        Array.prototype.map.call(vcdata[wb_eraseLineArray], function(el) {
            if (typeof el._eflb !== 'undefined') {
                erase_line = FreeLine(el._eflb, el._efle, paper, el._colour, el._strokeWidth);
            }
            if (typeof el._eflb === 'undefined') {
                Array.prototype.map.call(el._earr, function(el2) {
                    erase_line.updateEnd(el2.eflx, el2.efly);
                });
            }
        });
    }
    vcdata[wb_eraseLineArray].length = 0;
}
/**
 * @description restore shapes of whitebd (helper)
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function restoreShapesWb(data, wbid) {
    wb_flArray = 'fl_array_wb' + wbid;
    wb_lArray = 'l_array_wb' + wbid;
    wb_eArray = 'e_array_wb' + wbid;
    wb_rArray = 'r_array_wb' + wbid;
    wb_txtArray = 'txt_array_wb' + wbid;
    shapes = 'shapes_wb' + wbid;
    undoShpArr2 = 'undo_shp_arr_wb' + wbid;
    if (!vcdata[wb_flArray]) vcdata[wb_flArray] = [];
    if (!vcdata[wb_lArray]) vcdata[wb_lArray] = [];
    if (!vcdata[wb_eArray]) vcdata[wb_eArray] = [];
    if (!vcdata[wb_rArray]) vcdata[wb_rArray] = [];
    if (!vcdata[wb_txtArray]) vcdata[wb_txtArray] = [];
    if (!vcdata[shapes]) vcdata[shapes] = [];
    if (!vcdata[undoShpArr2]) vcdata[undoShpArr2] = [];
    if (data !== null) {
        Array.prototype.map.call(data, function(el) {
            if (wb_lArray === el._larray) {
                if (el._lb || el._lx) {
                    vcdata[wb_lArray].push(el);
                }
            } else if (wb_flArray === el._flarray) {
                if (el._flb || el._arr) {
                    vcdata[wb_flArray].push(el);
                }
            } else if (wb_eArray === el._earray) {
                if (el._cb || el._cx) {
                    vcdata[wb_eArray].push(el);
                }
            } else if (wb_rArray === el._rarray) {
                if (el._rb || el._rx) {
                    vcdata[wb_rArray].push(el);
                }
            } else if (wb_txtArray === el._txtarray) {
                if (el._text) {
                    vcdata[wb_txtArray].push(el);
                }
            }
        });
    }
    if (vcdata[wb_flArray].length !== 0) { //freeline
        Array.prototype.map.call(vcdata[wb_flArray], function(el) {
            if (typeof el._flb !== 'undefined') {
                fline = FreeLine(el._flb, el._fle, paper, el._colour, el._strokeWidth);
            }
            if (typeof el._flb === 'undefined') {
                Array.prototype.map.call(el._arr, function(el2) {
                    fline.updateEnd(el2.flx, el2.fly);
                });
            }
        });
    }
    vcdata[wb_flArray].length = 0;
    if (vcdata[wb_eArray] !== 0) { //ellipse
        Array.prototype.map.call(vcdata[wb_eArray], function(el) {
            if (typeof el._cb !== 'undefined') {
                ellipse = Ellipse(el._cb, el._ce, 0, 0, paper, el._colour, el._strokeWidth);
            }
            if (typeof el._cb === 'undefined') {
                ellipse.updateEnd(el._cx, el._cy);
            }
        });
    }
    vcdata[wb_eArray].length = 0;
    if (vcdata[wb_rArray] !== 0) { //rectangle
        Array.prototype.map.call(vcdata[wb_rArray], function(el) {
            if (typeof el._rb !== 'undefined') {
                rect = Rect(el._rb, el._re, 5, 5, paper, el._colour, el._strokeWidth);
            }
            if (typeof el._rb === 'undefined') {
                rect.updateEnd(el._rx, el._ry);
            }
        });
    }
    vcdata[wb_rArray].length = 0;
    if (vcdata[wb_lArray] !== 0) { //line
        Array.prototype.map.call(vcdata[wb_lArray], function(el) {
            if (typeof el._lb !== 'undefined') {
                line = Line(el._lb, el._le, el._lb, el._le, paper, el._colour, el._strokeWidth);
            }
            if (typeof el._lb === 'undefined') {
                line.updateEnd(el._lx, el._ly);
            }
        });
    }
    vcdata[wb_lArray].length = 0;
    if (vcdata[wb_txtArray] !== 0) { //text
        Array.prototype.map.call(vcdata[wb_txtArray], function(el) {
            text = Text(el._txtx, el._txty, el._text, paper, el._colour);
        });
    }
    vcdata[wb_txtArray].length = 0;

    vcdata[shapesLoadedWb] = true;
}
/**
 * @description showing and hiding uploaded images
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function showHideUploadedimgs(show) {
    if (typeof vcdata[uploadedImgArray] !== 'undefined') {
        Array.prototype.map.call(vcdata[uploadedImgArray], function(el) {
            if (typeof el !== 'undefined' && el !== null) {
                if (show === true) {
                    el.show();
                } else {
                    el.hide();
                }
            }
        });
    }
}
/**
 * @description clean arrays after clear whitebd
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function emptyElementArraysWb() {
    if (vcdata[wb_lArray] !== null || vcdata[wb_flArray] !== null || vcdata[wb_eArray] !== null || vcdata[wb_rArray] !== null || vcdata[wb_txtArray] !== null) {
        vcdata[wb_lArray].length = 0;
        vcdata[wb_flArray].length = 0;
        vcdata[wb_eArray].length = 0;
        vcdata[wb_rArray].length = 0;
        vcdata[wb_txtArray].length = 0;
    }
}
/**
 * @description clean arrays after clear presentation
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function emptyElementArraysPr() {
    if (vcdata[pr_lArray] !== null || vcdata[pr_flArray] !== null || vcdata[pr_eArray] !== null || vcdata[pr_rArray] !== null || vcdata[pr_txtArray] !== null) {
        vcdata[pr_lArray].length = 0;
        vcdata[pr_flArray].length = 0;
        vcdata[pr_eArray].length = 0;
        vcdata[pr_rArray].length = 0;
        vcdata[pr_txtArray].length = 0;
    }
}
/**
 * @description switch to specific presentation
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @param {var} presentationID presentation id
 * @return {undefined}
 */
function switchToPresentation(presentationID) {
    //initResources(presentationID);
    $(canvas).unbind();
    $(canvas).bind('mousemove', function(e) {
        movePointer(e);
    });
    showHideUploadedimgs(false);
    //clearTimeout(timer6);
    //clearTimeout(timer);
    //clearTimeout(timer4);
    //clearTimeout(timer6);
    clearTimeout(timer7);
    if (typeof vcdata[currentPrArray][vcdata[currrentSlideNo]] !== 'undefined') {
        vcdata[currentPrArray][vcdata[currrentSlideNo]].hide();
        //vcdata[currentPrArray][prvSlide].hide(); 
    }
    var prvPrArray = currentPrArray;
    //var prvSlide = currrentSlideNo;
    vcdata[prvSlideNo] = vcdata[currrentSlideNo];
    var prvShapesArr = shapes;
    var prvWhiteboardClicked = whiteboardClicked;
    vcdata[whiteboardClicked] = false;
    initPr(presentationID);
    currentPrId = presentationID;
    //console.log(vcdata[prvShapesArr]);
    vcdata[storeMessages] = false;
    var shpID;
    shpID = shapes + "_" + (vcdata[currrentSlideNo]);
    if (typeof vcdata[prvShapesArr] !== 'undefined' && typeof vcdata[shapes] !== 'undefined') {
        Array.prototype.map.call(vcdata[shapes], function(el) {
            var stored_shape = el.store;
            if (shapes !== prvShapesArr) {
                if (shpID === el.prShpID) {
                    el.node.show();
                } else {
                    el.node.hide();
                }
            }
        });
        Array.prototype.map.call(vcdata[prvShapesArr], function(el) {
            var stored_shape = el.store;
            if (shapes !== prvShapesArr) {
                el.node.hide();
            }
        });
    }
    if (vcdata[currentPrArray] === null || vcdata[currentPrArray].length === 0) {
        loadImages();
        if (vcdata[whiteboardClicked] === true) {
            vcdata[currentPrArray][0].hide();
        }
    } else {
        vcdata[currentPrArray][vcdata[currrentSlideNo]].show();
    }
    //23-06
    if (vcdata[restorePrDataArr] !== null && vcdata[restorePrDataArr].length !== 0) {
        if (vcdata[shapesLoadedPr] === false) {

            restoreShapesPr(vcdata[restorePrDataArr], presentationID, vcdata[currrentSlideNo]);
        }
    }
    if (vcdata[whiteboardClicked] === true) {
        $('#wbl').attr('disabled', 'disabled');
        $('#switch').removeAttr('disabled');
        disableSlideControls(true);
    } else {
        $('#wbl').removeAttr('disabled');
        $('#switch').attr('disabled', 'disabled');
        disableSlideControls(false);
    }
    socket.emit('move_to_presentation', {
        currrentSlideNo: currrentSlideNo,
        currentPrArray: currentPrArray,
        presentationID: presentationID,
        whiteboardClicked: whiteboardClicked,
        prvPrArray: prvPrArray,
        prvSlide: vcdata[prvSlideNo],
        noOfSlides: noOfSlides,
        orgSlideCount: orgSlideCount,
        imageRequest: imageRequest,
        tmpSlide: tmpSlide,
        tmpSlideEnd: tmpSlideEnd,
        forceLoad: forceLoad,
        currrentPrSlideNo: vcdata[currrentSlideNo],
        //prvPrSlideNo: prvSlide,
        whiteboardClickedStatus: false,
        prvWhiteboardClickedStatus: vcdata[prvWhiteboardClicked],
        shapes: shapes,
        prvShapes: prvShapesArr,
        pr_flArray: pr_flArray,
        pr_lArray: pr_lArray,
        pr_eArray: pr_eArray,
        pr_rArray: pr_rArray,
        pr_txtArray: pr_txtArray,
        storeMessages: storeMessages,
        storeMessagesStatus: vcdata[storeMessages],
        shapesLoadedPr: shapesLoadedPr,
        token: accessToken
    });
    vcdata[whiteboardClicked] = false;
    updateOriginalSlideCount(vcdata[orgSlideCount]);
    updateSlideCount(vcdata[currrentSlideNo] + 1);
}
/**
 * @description switch to specific whiteboard
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @param {var} whiteboardID whiteboard id
 * @return {undefined}
 */
function loadWhiteboard(whiteboardID) {
    $(canvas).unbind();
    $(canvas).bind('mousemove', function(e) {
        movePointer(e);
    });
    showHideUploadedimgs(false);
    //clearTimeout(timer);
    //clearTimeout(timer4);
    //clearTimeout(timer6);
    clearTimeout(timer7);
    if (typeof vcdata[currentPrArray][vcdata[currrentSlideNo]] !== 'undefined') {
        vcdata[currentPrArray][vcdata[currrentSlideNo]].hide();
    }
    var prvPrArray = currentPrArray;
    //var prvSlide = currrentSlideNo;
    vcdata[prvSlideNo] = vcdata[currrentSlideNo];
    vcdata[whiteboardClicked] = true;
    var prvShapesArr = shapes;

    initWb(whiteboardID);

    currentWbId = whiteboardID;
    if (typeof vcdata[prvShapesArr] !== 'undefined' && typeof vcdata[shapes] !== 'undefined') {
        Array.prototype.map.call(vcdata[shapes], function(el) {
            var stored_shape = el.store;
            if (shapes !== prvShapesArr) {
                el.node.show();
            }
        });
        Array.prototype.map.call(vcdata[prvShapesArr], function(el) {
            var stored_shape = el.store;
            if (shapes !== prvShapesArr) {
                el.node.hide();
            }
        });
    }
    vcdata[storeMessages] = true;
    if (typeof vcdata[currentPrArray][vcdata[currrentSlideNo]] !== 'undefined') {
        vcdata[currentPrArray][vcdata[currrentSlideNo]].hide();
    }
    //23-06
    if (vcdata[restoreWbDataArr] !== null && vcdata[restoreWbDataArr].length !== 0) {
        if (vcdata[shapesLoadedWb] === false) {
            restoreShapesWb(vcdata[restoreWbDataArr], whiteboardID);
        }
    }
    if (vcdata[restoreEraseDataArr] !== null) {
        restoreEraseData(vcdata[restoreEraseDataArr], whiteboardID);
    }
    if (vcdata[whiteboardClicked] === true) {
        $('#wbl').attr('disabled', 'disabled');
        $('#switch').removeAttr('disabled');
        disableSlideControls(true);
    } else {
        $('#wbl').removeAttr('disabled');
        $('#switch').attr('disabled', 'disabled');
        disableSlideControls(false);
    }
    showHideUploadedimgs(true);
    socket.emit('move_to_whiteboard', {
        whiteboardID: whiteboardID,
        whiteboardClicked: whiteboardClicked,
        whiteboardClickedStatus: true,
        prvPrArray: prvPrArray,
        prvSlide: vcdata[prvSlideNo],
        currentPrArray: currentPrArray,
        currrentSlideNo: currrentSlideNo,
        shapes: shapes,
        prvShapes: prvShapesArr,
        wb_flArray: wb_flArray,
        wb_lArray: wb_lArray,
        wb_eArray: wb_eArray,
        wb_rArray: wb_rArray,
        wb_txtArray: wb_txtArray,
        wb_eraseLineArray: wb_eraseLineArray,
        storeMessages: storeMessages,
        storeMessagesStatus: vcdata[storeMessages],
        uploadedImgArray: uploadedImgArray,
        shapesLoadedWb: shapesLoadedWb,
        lx: lx,
        ly: ly,
        ox: ox,
        oy: oy,
        token: accessToken
    });
    vcdata[whiteboardClicked] = true;
}
/**
 * @description restore shapes of a specific presentation
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @param {var} prID presentation id
 * @param {var} shapes data
 * @param {var} current slide number
 * @return {undefined}
 */
function restoreShapesPr(data, prID, currSlideNo) {

    pr_flArray = 'fl_array_pr' + prID,
    pr_lArray = 'l_array_pr' + prID,
    pr_eArray = 'e_array_pr' + prID,
    pr_rArray = 'r_array_pr' + prID,
    pr_txtArray = 'txt_array_pr' + prID,
    shapes = 'shapes_pr' + prID,
    undoShpArr = 'undo_shp_arr_pr' + prID;
    if (!vcdata[pr_flArray]) vcdata[pr_flArray] = [];
    if (!vcdata[pr_lArray]) vcdata[pr_lArray] = [];
    if (!vcdata[pr_eArray]) vcdata[pr_eArray] = [];
    if (!vcdata[pr_rArray]) vcdata[pr_rArray] = [];
    if (!vcdata[pr_txtArray]) vcdata[pr_txtArray] = [];
    if (!vcdata[shapes]) vcdata[shapes] = [];
    if (!vcdata[undoShpArr]) vcdata[undoShpArr] = [];
    var shpID = shapes + "_" + currSlideNo; //"_shpid":"shapes_pr1_3"
    if (data !== null) {
        Array.prototype.map.call(data, function(el) {
            if (pr_lArray === el._larraytmp) {
                if (el._lb || el._lx) {
                    vcdata[pr_lArray].push(el);
                }
            } else if (pr_flArray === el._flarraytmp) {
                if (el._flb || el._arr) {
                    vcdata[pr_flArray].push(el);
                }
            } else if (pr_eArray === el._earraytmp) {
                if (el._cb || el._cx) {
                    vcdata[pr_eArray].push(el);
                }
            } else if (pr_rArray === el._rarraytmp) {
                if (el._rb || el._rx) {
                    vcdata[pr_rArray].push(el);
                }
            } else if (pr_txtArray === el._txtarraytmp) {
                if (el._text) {
                    vcdata[pr_txtArray].push(el);
                }
            }
        });
    }
    if (typeof vcdata[pr_flArray] !== 'undefined') {
        if (vcdata[pr_flArray].length !== 0) { //freeline
            Array.prototype.map.call(vcdata[pr_flArray], function(el) {
                if (typeof el._flb != 'undefined') {
                    fline = FreeLine(el._flb, el._fle, paper, el._colour, el._strokeWidth, el._shpid);
                    if (shpID === el._shpid) {
                        fline.show();
                    } else {
                        fline.hide();
                    }
                }
                if (typeof el._flb === 'undefined') {
                    Array.prototype.map.call(el._arr, function(el2) {
                        fline.updateEnd(el2.flx, el2.fly);
                        if (shpID === el._shpid) {
                            fline.show();
                        } else {
                            fline.hide();
                        }
                    });
                }
            });
        }
    }
    if (vcdata[pr_flArray]) vcdata[pr_flArray].length = 0;
    if (typeof vcdata[pr_eArray] != 'undefined') {
        if (vcdata[pr_eArray] !== 0) { //ellipse
            Array.prototype.map.call(vcdata[pr_eArray], function(el) {
                if (typeof el._cb !== 'undefined') {
                    ellipse = Ellipse(el._cb, el._ce, 0, 0, paper, el._colour, el._strokeWidth, el._shpid);
                    if (shpID === el._shpid) {
                        ellipse.show();
                    } else {
                        ellipse.hide();
                    }
                }
                if (typeof el._cb === 'undefined') {
                    ellipse.updateEnd(el._cx, el._cy);
                    if (shpID === el._shpid) {
                        ellipse.show();
                    } else {
                        ellipse.hide();
                    }
                }
            });
        }
    }
    if (vcdata[pr_eArray]) vcdata[pr_eArray].length = 0;
    if (typeof vcdata[pr_rArray] != 'undefined') {
        Array.prototype.map.call(vcdata[pr_rArray], function(el) {
            if (typeof el._rb !== 'undefined') {
                rect = Rect(el._rb, el._re, 5, 5, paper, el._colour, el._strokeWidth, el._shpid);
                if (shpID === el._shpid) {
                    rect.show();
                } else {
                    rect.hide();
                }
            }
            if (typeof el._rb === 'undefined') {
                rect.updateEnd(el._rx, el._ry);
                if (shpID === el._shpid) {
                    rect.show();
                } else {
                    rect.hide();
                }
            }
        });
    }
    if (vcdata[pr_rArray]) vcdata[pr_rArray].length = 0;
    if (typeof vcdata[pr_lArray] !== 'undefined') {
        if (vcdata[pr_lArray] !== 0) { //line
            Array.prototype.map.call(vcdata[pr_lArray], function(el) {
                if (typeof el._lb !== 'undefined') {
                    line = Line(el._lb, el._le, el._lb, el._le, paper, el._colour, el._strokeWidth, el._shpid);
                    if (shpID === el._shpid) {
                        line.show();
                    } else {
                        line.hide();
                    }
                }
                if (typeof el._lb === 'undefined') {
                    line.updateEnd(el._lx, el._ly);
                    if (shpID === el._shpid) {
                        line.show();
                    } else {
                        line.hide();
                    }
                }
            });
        }
    }
    if (vcdata[pr_lArray]) vcdata[pr_lArray].length = 0;
    if (typeof vcdata[pr_txtArray] !== 'undefined') {
        if (vcdata[pr_txtArray].length !== 0) { //text
            text = Text(vcdata[pr_txtArray][0]._txtx, vcdata[pr_txtArray][0]._txty, vcdata[pr_txtArray][0]._text, paper, vcdata[pr_txtArray][0]._colour, vcdata[pr_txtArray][0]._shpid);
            if (shpID === vcdata[pr_txtArray][0]._shpid) {
                text.show();
            } else {
                text.hide();
            }
        }
    }
    if (vcdata[pr_txtArray]) vcdata[pr_txtArray].length = 0;
    vcdata[shapesLoadedPr] = true;
}

function loadUploadedImage(cwbid, count) {
    //console.log("WbID: "+cwbid+' - Count: '+count);
    imgNo = count;
    imgUrl = uploads_dir + 'uploaded_' + cwbid + '_' + imgNo + '.png';
    var uImg = new Image();
    uImg.src = imgUrl;
    uImg.onload = function() {
        var width = uImg.width;
        var height = uImg.height;
        if (typeof vcdata[uploadedImgArray] !== 'undefined') {
            if (typeof vcdata[uploadedImgArray][imgNo] === 'undefined') {
                vcdata[uploadedImgArray][imgNo] = paper.image(imgUrl, 0, 0, width, height);
                if (imgNo < 10) {
                    no = '0' + imgNo;
                } else {
                    no = imgNo;
                }
                vcdata[uploadedImgArray][imgNo].node.id = 'uploaded_' + cwbid + '_' + no;
            }
            if (vcdata[whiteboardClicked] === true) {
                vcdata[uploadedImgArray][imgNo].draggable();
            } else {
                Array.prototype.map.call(vcdata[uploadedImgArray], function(el) {
                    if (typeof el !== 'undefined') {
                        el.hide();
                    }
                });
            }
        }
        WbNo = cwbid;
        socket.emit('load_uploaded_image', {
            whiteboardClicked: true,
            currentWbNo: WbNo.toString(),
            currentWbId: cwbid,
            imgNo: imgNo,
            uploadedImgArray: uploadedImgArray,
            token: accessToken,
            width: width,
            height: height
        });
    };
    //}
}

function mvCur(x, y) {
    cur.attr({
        cx: x,
        cy: y
    });
}

function movePointer(e) {
    var x, y;
    if (e.offsetX === undefined) // this works for Firefox
    {
        x = e.pageX - $(canvas).offset().left;
        y = e.pageY - $(canvas).offset().top;
    } else // works in Google Chrome
    {
        x = e.offsetX;
        y = e.offsetY;
    }
    mvCur(x, y);
    curPositionArr.push({
        mx: x,
        my: y
    });
    lastTimeMouseMoved = new Date().getTime();
    var t = setTimeout(function() {
        var currentTime = new Date().getTime();
        if (currentTime - lastTimeMouseMoved > 1000) {
            curPositionArr.push({
                mx: x,
                my: y
            });
            socket.emit('mouse_position', curPositionArr);
            curPositionArr.length = 0;
        }
    }, 1000);
}
$(canvas).mousemove(function(e) {
    movePointer(e);
});
socket.on('mouse_position_update', function(data) {
    var next = 0;

    function animate() {
        if (data[next]) {
            cur.animate({
                cx: data[next].mx,
                cy: data[next].my
            }, 1, 'linear', animate);
            next++;
        }
    }
    animate();
});
$('body').on('change', '#thickness', function() {
    strokeWidth = $("option:selected").text();
});
Raphael.el.draggable = function() {
    var me = this,
        moveFnc = function(dx, dy) {
            wbNo = currentWbId;
            (vcdata[lx])[imgNo] = dx + (vcdata[ox])[imgNo];
            (vcdata[ly])[imgNo] = dy + (vcdata[oy])[imgNo];
            me.transform('t' + (vcdata[lx])[imgNo] + ',' + (vcdata[ly])[imgNo]);
        },
        startFnc = function() {
            $(canvas).unbind();
            $(canvas).bind('mousemove', function(e) {
                movePointer(e);
            });
            var lastno = $(this)[0].node.id.slice(-2);
            if (lastno < 10) {
                lastno = lastno.slice(-1);
            }
            imgNo = lastno;
            wbNo = currentWbId;
            //console.log("lx: "+vcdata[lx][imgNo]+"ly: "+vcdata[ly][imgNo]+"ox: "+vcdata[ox][imgNo]+"oy: "+vcdata[oy][imgNo]);
            if (!(vcdata[ox])[imgNo]) {
                vcdata[ox][imgNo] = 0;
            }
            if (!(vcdata[oy])[imgNo]) {
                vcdata[oy][imgNo] = 0;
            }
            if (vcdata[lx].length === 0) {
                for (var a = 0; a < MAX_UPLOADED_IMAGES; a++) {
                    (vcdata[lx])[a] = 0;
                }
            }
            if (vcdata[ly].length === 0) {
                for (var b = 0; b < MAX_UPLOADED_IMAGES; b++) {
                    (vcdata[ly])[b] = 0;
                }
            }
            if (vcdata[ox].length === 0) {
                for (var c = 0; c < MAX_UPLOADED_IMAGES; c++) {
                    (vcdata[ox])[c] = 0;
                }
            }
            if (vcdata[oy].length === 0) {
                for (var d = 0; d < MAX_UPLOADED_IMAGES; d++) {
                    (vcdata[oy])[d] = 0;
                }
            }
        },
        endFnc = function() {
            (vcdata[ox])[imgNo] = (vcdata[lx])[imgNo];
            (vcdata[oy])[imgNo] = (vcdata[ly])[imgNo];
            socket.emit('drag_uploaded_image', {
                _ox: (vcdata[ox])[imgNo],
                _oy: (vcdata[oy])[imgNo],
                lx: lx,
                ly: ly,
                ox: ox,
                oy: oy,
                uploadedImgArray: uploadedImgArray,
                imgNo: imgNo,
                wbNo: wbNo.toString(),
                token: accessToken
            });
        };
    this.drag(moveFnc, startFnc, endFnc);
};
var uploader = document.getElementById('uploader');
upclick({
    element: uploader,
    action: '/upload',
    onstart: function(filename) {},
    oncomplete: function(response_data) {
        //console.log(response_data);
        data = JSON.parse(response_data);
        loadUploadedImage(currentWbId, data.count);
    }
});
socket.on('drag_uploaded_image', function(data) {
    vcdata[data.uploadedImgArray][parseInt(data.imgNo)].transform('t' + data._ox + ',' + data._oy);
});
socket.on('load_uploaded_image', function(data) {
    //if (data.whiteboardClicked == true) {
    imgUrl = uploads_dir + 'uploaded_' + data.currentWbId + '_' + data.imgNo + '.png';
    var uImg = new Image();
    uImg.src = imgUrl;
    uImg.onload = function() {
        var width = uImg.width;
        var height = uImg.height;
        if (typeof vcdata[data.uploadedImgArray][data.imgNo] === 'undefined') {
            vcdata[data.uploadedImgArray][data.imgNo] = paper.image(imgUrl, 0, 0, width, height);
            if (data.imgNo < 10) {
                no = '0' + data.imgNo;
            } else {
                no = data.imgNo;
            }
            vcdata[data.uploadedImgArray][data.imgNo].node.id = 'uploaded_' + data.currentWbId + '_' + no;
            //mySet.push(vcdata[data.uploadedImgArray][data.imgNo]);
        }
        if (data.whiteboardClicked === true) {
            vcdata[data.uploadedImgArray][data.imgNo].draggable();
        } else {
            Array.prototype.map.call(vcdata[data.uploadedImgArray], function(el) {
                if (typeof el != 'undefined') {
                    el.hide();
                }
            });
        }
    };

});
socket.on('move_to_whiteboard', function(data) {
    showHideUploadedimgs(false);
    //clearTimeout(timer);
    //clearTimeout(timer4);
    //clearTimeout(timer6);
    clearTimeout(timer7);
    if (typeof vcdata[data.currentPrArray][vcdata[data.currrentSlideNo]] !== 'undefined') {
        vcdata[data.currentPrArray][vcdata[data.currrentSlideNo]].hide();
    }
    var prvPrArray = data.prvPrArray;
    vcdata[prvSlideNo] = data.prvSlide;
    var prvShapesArr = shapes;
    whiteboardClicked = data.whiteboardClicked;
    shapes = data.shapes;
    wb_lArray = data.wb_lArray;
    wb_eArray = data.wb_eArray;
    wb_rArray = data.wb_rArray;
    wb_flArray = data.wb_flArray;
    wb_txtArray = data.wb_txtArray;
    currentPrArray = data.currentPrArray;
    currrentSlideNo = data.currrentSlideNo;
    uploadedImgArray = data.uploadedImgArray;
    storeMessages = data.storeMessages;
    if (!vcdata[whiteboardClicked]) vcdata[whiteboardClicked] = false;
    if (!vcdata[shapes]) vcdata[shapes] = [];
    if (!vcdata[wb_lArray]) vcdata[wb_lArray] = [];
    if (!vcdata[wb_eArray]) vcdata[wb_eArray] = [];
    if (!vcdata[wb_rArray]) vcdata[wb_rArray] = [];
    if (!vcdata[wb_flArray]) vcdata[wb_flArray] = [];
    if (!vcdata[wb_txtArray]) vcdata[wb_txtArray] = [];
    if (!vcdata[currentPrArray]) vcdata[currentPrArray] = [];
    if (!vcdata[currrentSlideNo]) vcdata[currrentSlideNo] = 0;
    if (!vcdata[uploadedImgArray]) vcdata[uploadedImgArray] = [];
    if (!vcdata[storeMessages]) vcdata[storeMessages] = false;
    vcdata[whiteboardClicked] = true;
    currentWbId = data.whiteboardID;
    //23-06
    if (vcdata[restoreWbDataArr] !== null && vcdata[restoreWbDataArr].length !== 0) {
        if (vcdata[shapesLoadedWb] === false) {
            restoreShapesWb(vcdata[restoreWbDataArr], data.whiteboardID);
        }
    }
    if (vcdata[restoreEraseDataArr] !== null) {
        restoreEraseData(vcdata[restoreEraseDataArr], data.whiteboardID);
    }
    if (typeof vcdata[prvShapesArr] !== 'undefined' && typeof vcdata[shapes] !== 'undefined') {
        Array.prototype.map.call(vcdata[shapes], function(el) {
            var stored_shape = el.store;
            if (shapes !== prvShapesArr) {
                el.node.show();
            }
        });
        Array.prototype.map.call(vcdata[prvShapesArr], function(el) {
            var stored_shape = el.store;
            if (shapes !== prvShapesArr) {
                el.node.hide();
            }
        });
    }
    vcdata[storeMessages] = true;
    $('#wbl').attr('disabled', 'disabled');
    $('#switch').removeAttr('disabled');
    vcdata[data.storeMessages] = true;
    showHideUploadedimgs(true);
});
socket.on('move_to_presentation', function(data) {
    //clearTimeout(timer);
    //clearTimeout(timer4);
    clearTimeout(timer6);
    clearTimeout(timer7);
    $('#switch').attr('disabled', 'disabled');
    $('#wbl').removeAttr('disabled');
    if (typeof vcdata[currentPrArray][vcdata[currrentSlideNo]] !== 'undefined') {
        vcdata[currentPrArray][vcdata[currrentSlideNo]].hide();
    }
    var prvShapesArr = shapes;
    var prvWhiteboardClicked = whiteboardClicked;
    currrentSlideNo = data.currrentSlideNo;
    currentPrArray = data.currentPrArray;
    noOfSlides = data.noOfSlides;
    orgSlideCount = data.orgSlideCount;
    imageRequest = data.imageRequest;
    tmpSlide = data.tmpSlide;
    tmpSlideEnd = data.tmpSlideEnd;
    forceLoad = data.forceLoad;
    whiteboardClicked = data.whiteboardClicked;
    shapes = data.shapes;
    pr_fArray = data.pr_fArray;
    pr_lArray = data.pr_lArray;
    pr_eArray = data.pr_eArray;
    pr_rArray = data.pr_rArray;
    pr_flArray = data.pr_flArray;
    pr_txtArray = data.pr_txtArray;
    storeMessages = data.storeMessages;
    if (!vcdata[currrentSlideNo]) vcdata[currrentSlideNo] = 0;
    if (!vcdata[currentPrArray]) vcdata[currentPrArray] = [];
    if (!vcdata[noOfSlides]) vcdata[noOfSlides] = 0;
    if (!vcdata[orgSlideCount]) vcdata[orgSlideCount] = 0;
    if (!vcdata[imageRequest]) vcdata[imageRequest] = false;
    if (!vcdata[tmpSlide]) vcdata[tmpSlide] = 0;
    if (!vcdata[tmpSlideEnd]) vcdata[tmpSlideEnd] = 0;
    if (!vcdata[forceLoad]) vcdata[forceLoad] = 0;
    if (!vcdata[whiteboardClicked]) vcdata[whiteboardClicked] = false;
    if (!vcdata[shapes]) vcdata[shapes] = [];
    if (!vcdata[pr_fArray]) vcdata[pr_fArray] = [];
    if (!vcdata[pr_lArray]) vcdata[pr_lArray] = [];
    if (!vcdata[pr_eArray]) vcdata[pr_eArray] = [];
    if (!vcdata[pr_rArray]) vcdata[pr_rArray] = [];
    if (!vcdata[pr_flArray]) vcdata[pr_flArray] = [];
    if (!vcdata[pr_txtArray]) vcdata[pr_txtArray] = [];
    if (!vcdata[storeMessages]) vcdata[storeMessages] = false;
    currentPrId = data.presentationID;
    vcdata[storeMessages] = false;
    var shpID;
    shpID = shapes + "_" + data.currrentPrSlideNo;
    if (typeof vcdata[prvShapesArr] !== 'undefined' && typeof vcdata[shapes] !== 'undefined') {
        Array.prototype.map.call(vcdata[shapes], function(el) {
            var stored_shape = el.store;
            if (shapes !== prvShapesArr) {
                //vcdata[shapes][k]["node"].show();
                if (shpID === el.prShpID) {
                    el.node.show();
                } else {
                    el.node.hide();
                }
            }
        });
        Array.prototype.map.call(vcdata[prvShapesArr], function(el) {
            var stored_shape = el.store;
            if (shapes !== prvShapesArr) {
                el.node.hide();
            }
        });
    }
    if (vcdata[currentPrArray] === null || vcdata[currentPrArray].length === 0) {
        if (data.whiteboardClickedStatus === false) {
            loadImages();
        } else {
            loadImages();
            vcdata[currentPrArray][0].hide();
        }
    } else {
        if (data.whiteboardClickedStatus === false) {
            vcdata[currentPrArray][vcdata[currrentSlideNo]].show();
        } else {
            vcdata[currentPrArray][vcdata[currrentSlideNo]].show();
        }
    }
    //23-06
    if (vcdata[restorePrDataArr] !== null && vcdata[restorePrDataArr].length !== 0) {
        if (vcdata[shapesLoadedPr] === false) {

            restoreShapesPr(vcdata[restorePrDataArr], data.presentationID, data.currrentPrSlideNo);
        }
    }
    showHideUploadedimgs(false);
    updateOriginalSlideCount(vcdata[orgSlideCount]);
    updateSlideCount(vcdata[currrentSlideNo] + 1);
});
/**
 * socket responce - update slides when user joined
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('updateslides', function(data) {
    //vcdata['images_pr1'][0].hide();
    //console.log(data);
    if (data.pr_data !== null) {
        currentPrArray = data.pr_data.currentPrArray;
        currrentSlideNo = data.pr_data.currrentSlideNo;
        noOfSlides = data.pr_data.noOfSlides;
        orgSlideCount = data.pr_data.orgSlideCount;
        imageRequest = data.pr_data.imageRequest;
        tmpSlide = data.pr_data.tmpSlide;
        tmpSlideEnd = data.pr_data.tmpSlideEnd;
        forceLoad = data.pr_data.forceLoad;
        whiteboardClicked = data.pr_data.whiteboardClicked;
        prvSlide = data.pr_data.prvSlide;
        prvPrArray = data.pr_data.prvPrArray;
        currentPrId = data.pr_data.presentationID;
        uploadedImgArray = data.pr_data.uploadedImgArray;
        shapesLoadedWb = data.shapesLoadedWb;
        shapesLoadedPr = data.shapesLoadedPr;

        if (!vcdata[currentPrArray]) vcdata[currentPrArray] = [];
        if (!vcdata[currrentSlideNo]) vcdata[currrentSlideNo] = 0;
        if (!vcdata[prvSlideNo]) vcdata[prvSlideNo] = 0;
        if (!vcdata[noOfSlides]) vcdata[noOfSlides] = 0;
        if (!vcdata[orgSlideCount]) vcdata[orgSlideCount] = 0;
        if (!vcdata[imageRequest]) vcdata[imageRequest] = false;
        if (!vcdata[tmpSlide]) vcdata[tmpSlide] = 0;
        if (!vcdata[tmpSlideEnd]) vcdata[tmpSlideEnd] = 0;
        if (!vcdata[forceLoad]) vcdata[forceLoad] = 0;
        if (!vcdata[whiteboardClicked]) vcdata[whiteboardClicked] = false;
        if (!vcdata[prvPrArray]) vcdata[prvPrArray] = [];

        if (!vcdata[shapesLoadedWb]) vcdata[shapesLoadedWb] = false;
        if (!vcdata[shapesLoadedPr]) vcdata[shapesLoadedPr] = false;
        //if (!vcdata[uploadedImgArray]) vcdata[uploadedImgArray] = [];
        //vcdata[prvSlideNo]
        vcdata[prvSlideNo] = prvSlide;
        //console.log(">>>>>>>>>>>> " + vcdata[prvSlideNo]);
        if (typeof data.pr_data.whiteboardID !== 'undefined') {
            currentWbId = data.pr_data.whiteboardID;
        }
    }
    vcdata[whiteboardClicked] = data.wbl;
    if (data.udata !== null) {
        Array.prototype.map.call(data.udata, function(el) {
            if (!vcdata[el.uploadedImgArray]) vcdata[el.uploadedImgArray] = [];
            if (vcdata[el.uploadedImgArray].length === 0) {
                vcdata[el.uploadedImgArray].push(null);
            }
            imgUrl = uploads_dir + 'uploaded_' + el.currentWbId + '_' + el.imgNo + '.png';
            uimage = paper.image(imgUrl, 0, 0, el.width, el.height);
            vcdata[el.uploadedImgArray].push(uimage);
            uimage.hide();
            uimage.draggable();
            if (el.imgNo < 10) {
                no = '0' + el.imgNo;
            } else {
                no = el.imgNo;
            }
            uimage.node.id = 'uploaded_' + el.currentWbId + '_' + no;
        });
    }
    showHideUploadedimgs(data.wbl);
    if (data.wbl === null) {
        if (!noPresentation) {
            vcdata[whiteboardClicked] = false;
        } else {
            vcdata[whiteboardClicked] = true;
        }
    }
    if (data.wbl === true) {
        //hideSlideNav();
        disableSlideControls(true);
        flag_wb = true;
        flag_pr = false;
        // Siripalage wickramayan
        $("#wb1").addClass("whiteboard_active");
        $(".b_wbl").addClass("active");
    } else {
        disableSlideControls(false);
        flag_wb = false;
        flag_pr = true;
    }
    if (vcdata[currentPrArray][0] !== undefined) {
        vcdata[currentPrArray][0].hide();
    }
    clearTimeout(timer);
    if (data.next === vcdata[orgSlideCount] - 1) { //Added
        $('#lst').attr('disabled', 'disabled');
    }
    if (data.next === 0) {
        $('#frst').attr('disabled', 'disabled');
    }
    if (data.next < vcdata[orgSlideCount] && data.next >= 0) {
        //conductor reconnected
        vcdata[currrentSlideNo] = data.next; /////Added
        vcdata[clientReconnect] = true;
        if (typeof data.next !== 'undefined' && typeof data.prv !== 'undefined') {
            to = vcdata[orgSlideCount];
            to2 = -1;
            //load last 4 images
            for (var j = vcdata[orgSlideCount] - 1; j > vcdata[orgSlideCount] - 5; j--) {
                fetchImages(j, currentPrId);
                to = j;
                vcdata[tmpSlideEnd] = j;
            }
            //console.log(to);
            //load next 2 images forward
            j = data.next;
            if (j < vcdata[orgSlideCount] - 3 && j < vcdata[tmpSlideEnd]) { //edited
                for (var i = data.next; i < data.next + 3; i++) {
                    fetchImages(i, currentPrId);
                    j = i + 1;
                }
                //load front images with time intervel 
                (function fwd() {
                    //console.log("fn: updateslides, timer6");
                    fetchImages(j, currentPrId);
                    timer6 = setTimeout(fwd, TIME_DELAY);
                    if (j >= to - 1) {
                        clearTimeout(timer6); //stop foward loading slides
                        vcdata[imageRequest] = false;
                    }
                    vcdata[noOfSlides] = j;
                    j++;
                    tmp_slide_std = j; //Added
                    ///tmp_slide = j;
                })();
            }
            vcdata[currentPrArray][data.next].show();
            //load previous 2 images backward
            k = data.next - 1;
            if (k <= data.next + 3 && k >= 0) {
                for (var l = data.next - 1; l >= data.next - 3; l--) {
                    if (l >= 0) {
                        fetchImages(l, currentPrId);
                    }
                    k = l - 1;
                }
                //console.log(to2);
                //load back images with time intervel 
                (function bwd() {
                    //console.log("fn: updateslides, timer7");
                    if (k >= 0) {
                        fetchImages(k, currentPrId);
                    } else {
                        k = 0;
                        clearTimeout(timer7);
                    }
                    timer7 = setTimeout(bwd, TIME_DELAY);
                    if (k <= to2 + 1 || k <= tmp_slide_std) {
                        //clearTimeout(timer7);
                        vcdata[imageRequest] = false;
                    }
                    k--;
                    vcdata[tmpSlideEnd] = k; //Added    
                })();
            }
            if (data.wbl === true) {
                vcdata[currentPrArray][data.next].hide();
            } else {
                if (vcdata[currentPrArray][0]) {
                    vcdata[currentPrArray][0].hide();
                }
                vcdata[currentPrArray][data.next].show();
            }
            updateSlideCount(data.next + 1);
        }
    }
    if (vcdata[currentPrArray][data.next] !== undefined) {
        vcdata[currentPrArray][data.next].toBack();
    }
    updateOriginalSlideCount(vcdata[orgSlideCount]);
    //vcdata[currrentSlideNo] = data.next;
});
var ddd = 1;
socket.on('coords', function(data) {
    if (!vcdata[data.coords.ox]) vcdata[data.coords.ox] = [];
    if (!vcdata[data.coords.oy]) vcdata[data.coords.oy] = [];
    if (typeof vcdata[data.coords.uploadedImgArray][parseInt(data.coords.imgNo)] === 'undefined') {
        vcdata[data.coords.uploadedImgArray][parseInt(data.coords.imgNo)] = vcdata[data.coords.uploadedImgArray][ddd];
        ddd++;
    }
    vcdata[data.coords.uploadedImgArray][parseInt(data.coords.imgNo)].transform('t' + data.coords._ox + ',' + data.coords._oy);
    (vcdata[data.coords.ox])[data.coords.imgNo] = data.coords._ox;
    (vcdata[data.coords.oy])[data.coords.imgNo] = data.coords._oy;
});
/**
 * socket responce - restore whiteboard shapes for newly joined user
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('shapes_data', function(data) {
    shapes = data.shapes;
    storeMessages = data.storeMessages;
    vcdata[storeMessages] = data.storeMessagesStatus;
    restoreWbDataArr = 'restore_data_arr_wb' + data.prID;
    if (!vcdata[restoreWbDataArr]) vcdata[restoreWbDataArr] = [];
    if (data !== null) {
        //shapes_loaded_wb = true;
        vcdata[restoreWbDataArr] = data.data;
        if (data.whiteboardClicked === true) {
            restoreShapesWb(data.data, data.prID);
        }
    }
});
/**
 * socket responce - restore presentation shapes for newly joined user
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('shapes_data_tmp', function(data) {
    shapes = data.shapes;
    //console.log(shapes);
    storeMessages = data.storeMessages;
    vcdata[storeMessages] = data.storeMessagesStatus;
    restorePrDataArr = 'restore_data_arr_pr' + data.prID;
    if (!vcdata[restorePrDataArr]) vcdata[restorePrDataArr] = [];
    if (data !== null) {
        //shapes_loaded = true;
        vcdata[restorePrDataArr] = data.data;
        if (data.whiteboardClicked === false || data.whiteboardClicked === null) {
            restoreShapesPr(data.data, data.prID, data.slideNo);
        }
    }
});
socket.on('erase_data', function(data) {
    //console.log(data);
    if (data !== null) {
        restoreEraseDataArr = 'restore_erase_data_wb' + data.prID;
        if (!vcdata[restoreEraseDataArr]) vcdata[restoreEraseDataArr] = [];
        vcdata[restoreEraseDataArr] = data.data;
        if (data.whiteboardClicked === true) {
            restoreEraseData(data.data, data.prID);
        }
    }
});
/**
 * socket responce - user connect
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('connect', function(data) {
    console.log("Client Connected");
});
/**
 * socket responce - error
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('error', function(reason) {
    console.error('unable to connect !', reason);
});
/**
 * socket responce - draw freeline
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('freeline_path', function(data) {
    fline = FreeLine(data._flb, data._fle, paper, data._colour, data._strokeWidth);
});
/**
 * socket responce - complete draw freeline
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('freeline_path_update', function(data) {
    Array.prototype.map.call(data._arr, function(el) {
        fline.updateEnd(el.flx, el.fly);
    });
});
/**
 * socket responce - draw line
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('line_path', function(data) {
    line = Line(data._lb, data._le, data._lb, data._le, paper, data._colour, data._strokeWidth);
});
/**
 * socket responce - complete draw line
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('line_path_update', function(data) {
    line.updateEnd(data._lx, data._ly);
});
/**
 * socket responce - draw ellipse
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('ellipse_path', function(data) {
    ellipse = Ellipse(data._cb, data._ce, 0, 0, paper, data._colour, data._strokeWidth);
});
/**
 * socket responce - complete draw ellipse
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('ellipse_path_update', function(data) {
    ellipse.updateEnd(data._cx, data._cy);
});
/**
 * socket responce - draw rectangle
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('rect_path', function(data) {
    rect = Rect(data._rb, data._re, 5, 5, paper, data._colour, data._strokeWidth);
});
/**
 * socket responce - draw rectangle update
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('rect_path_update', function(data) {
    rect.updateEnd(data._rx, data._ry);
});
/**
 * socket responce - draw text
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('text_path', function(data) {
    k = $("#wb1").offset().left;
    l = $("#wb1").offset().top;
    text = Text(data._txtx - k, data._txty - l, data._text, paper, data._colour);
});
/**
 * socket responce - clear whiteboard
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('clear_paper_now', function(data) {
    //console.log(data);
    if (data._clr === true) {
        remoteShowHideUploadedimgs(90001);
        emptyElementArraysWb();
        if (data.wbclicked === true) {
            removeUploadedImages();
            permenentlyDeleteShapes();
        }
        if (vcdata[restoreWbDataArr] != 'undefined' && vcdata[restoreWbDataArr] !== null) {
            if (data.wbclicked === true) {
                showHidePrDrawings(90001);
                vcdata[restoreWbDataArr].length = 0;
            }
            if (vcdata[restorePrDataArr] !== null) {
                vcdata[restorePrDataArr].length = 0;
            }
        }
    }
});
socket.on('erase_line', function(data) {
    //console.log(data);
    //if(data.whiteboardClickedStatus === true){
    erase_line = FreeLine(data._eflb, data._efle, paper, data._colour, data._strokeWidth);
    erase_line.toFront();
    //}
});
socket.on('erase_line_update', function(data) {
    //console.log(data);
    Array.prototype.map.call(data._earr, function(el) {
        erase_line.updateEnd(el.eflx, el.efly);
        erase_line.toFront();
    });
});
/**
 * socket responce - undo drawings
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('undo_drawing_now', function(data) {
    //console.log(data);
    if (data.wbclicked === true) {
        var shpCnt = getShapeCountWb(vcdata[shapes]);
        if (vcdata[shapes][shpCnt - 1]) {
            vcdata[shapes][shpCnt - 1].node.hide();
            vcdata[undoShpArr2].push(vcdata[shapes][shpCnt - 1]);
            vcdata[shapes].splice(shpCnt - 1, 1);
        }
    } else {
        sortShapes(vcdata[shapes]);
        var innerBound = getInnerBound(vcdata[shapes], vcdata[currrentSlideNo]);
        var shpCnt2 = getShapeCount(vcdata[shapes], vcdata[currrentSlideNo]);
        if (vcdata[shapes][shpCnt2 + innerBound - 1]) {
            vcdata[shapes][shpCnt2 + innerBound - 1].node.hide();
            vcdata[undoShpArr].push(vcdata[shapes][shpCnt2 + innerBound - 1]);
            vcdata[shapes].splice(shpCnt2 + innerBound - 1, 1);
        }
    }
});
socket.on('redo_drawing_now', function(data) {
    if (data.wbclicked === true) {
        var shpCnt = getShapeCountWb(vcdata[undoShpArr2]);
        if (vcdata[undoShpArr2]) {
            vcdata[undoShpArr2][shpCnt - 1].node.show();
            vcdata[shapes].push(vcdata[undoShpArr2][shpCnt - 1]);
            vcdata[undoShpArr2].splice(shpCnt - 1, 1);
        }
    } else {
        var undoArrSize = vcdata[undoShpArr].length;
        sortShapes(vcdata[undoShpArr]);
        var innerBound = getInnerBound(vcdata[undoShpArr], vcdata[currrentSlideNo]);
        var shpCnt2 = getShapeCount(vcdata[undoShpArr], vcdata[currrentSlideNo]);
        if (vcdata[undoShpArr][innerBound]) {
            vcdata[undoShpArr][shpCnt2 + innerBound - 1].node.show();
            vcdata[shapes].push(vcdata[undoShpArr][shpCnt2 + innerBound - 1]);
            vcdata[undoShpArr].splice(shpCnt2 + innerBound - 1, 1);
        }
    }
});
/**
 * socket responce - go to next page
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('goto_next_page', function(data) {
    vcdata[currrentSlideNo] = data.next;
    vcdata[storeMessages] = false;
    remoteShowHideUploadedimgs(1);
    vcdata[currentPrArray][0].hide();
    if (data.next < vcdata[noOfSlides] && data.next >= 0) {
        if (typeof vcdata[currentPrArray][data.next] !== 'undefined' && typeof vcdata[currentPrArray][data.prv] !== 'undefined') {
            vcdata[currentPrArray][data.prv].hide();
            vcdata[currentPrArray][data.next].show();
            updateSlideCount(data.next + 1);
        } else {
            clearTimeout(timer6); //stop foward loading slides
            //requestOtherImages(no_,data.next)
            fetchImages(data.next, currentPrId);
            vcdata[currentPrArray][data.prv].hide();
            vcdata[currentPrArray][data.next].show();
        }
    } else {
        if (vcdata[noOfSlides] <= vcdata[orgSlideCount]) {
            if (vcdata[imageRequest] === true) {
                clearTimeout(timer6); //stop foward loading slides
                fetchImages(data.next, currentPrId);
            }
            if (typeof vcdata[currentPrArray][data.next] !== 'undefined' && typeof vcdata[currentPrArray][data.prv] !== 'undefined') {
                vcdata[currentPrArray][data.prv].hide();
                vcdata[currentPrArray][data.next].show();
                updateSlideCount(data.next + 1);
            } else {
                clearTimeout(timer6); //stop foward loading slides
                fetchImages(data.next, currentPrId);
                vcdata[currentPrArray][data.prv].hide();
                vcdata[currentPrArray][data.next].show();
            }
            vcdata[noOfSlides]++;
        } else {
            if (typeof vcdata[currentPrArray][data.next] !== 'undefined' && typeof vcdata[currentPrArray][data.prv] !== 'undefined') {
                vcdata[currentPrArray][data.prv].hide();
                vcdata[currentPrArray][data.next].show();
                updateSlideCount(data.next + 1);
            } else {
                requestImageRange(data.next);
            }
            vcdata[imageRequest] = false;
        }
    }
});
/**
 * socket responce - go to previous page
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('goto_prv_page', function(data) {
    //clearTimeout(timer7);
    if (student_access === true) {
        vcdata[currrentSlideNo] = data.next;
    } else {
        vcdata[currrentSlideNo] = data.next;
    }
    vcdata[storeMessages] = false;
    remoteShowHideUploadedimgs(-1);
    if (data.prv > 0) {
        if (typeof vcdata[currentPrArray][data.next] !== 'undefined' && typeof vcdata[currentPrArray][data.prv] !== 'undefined') {
            vcdata[currentPrArray][data.next].show();
            vcdata[currentPrArray][data.prv].hide();
            updateSlideCount(data.next + 1);
        } else {
            clearTimeout(timer4);
            fetchImages(data.next, currentPrId);
            vcdata[currentPrArray][data.next].show();
            vcdata[currentPrArray][data.prv].hide();
        }
    }
});
/**
 * socket responce - go to first page
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('goto_frst_page', function(data) {
    if (student_access === true) {
        vcdata[currrentSlideNo] = data.next;
    } else {
        vcdata[currrentSlideNo] = data.next;
    }
    vcdata[storeMessages] = false;
    clearTimeout(timer7);
    remoteShowHideUploadedimgs(10001);
    if (studInLastSlide === true) {
        clearTimeout(timer4);
        loadFrontImages(tmp_slide_std, vcdata[tmpSlideEnd]);
        vcdata[noOfSlides] = vcdata[orgSlideCount];
        tmp_slide_std = vcdata[orgSlideCount] - 1;
        vcdata[tmpSlideEnd] = vcdata[orgSlideCount] - 1;
    }
    if (data.prv > 0) {
        vcdata[currentPrArray][data.prv].hide();
        vcdata[currentPrArray][data.next].show();
        updateSlideCount(data.next + 1);
    }
});
/**
 * socket responce - go to last page
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('goto_lst_page', function(data) {
    if (student_access === true) {
        vcdata[currrentSlideNo] = data.next;
    } else {
        vcdata[currrentSlideNo] = data.next;
    }
    vcdata[storeMessages] = false;
    clearTimeout(timer6); //stop foward loading slides
    remoteShowHideUploadedimgs(50001);
    if (studInLastSlide === false) {
        studInLastSlide = true;
        tmp_slide_std = vcdata[noOfSlides];
    } else {
        studInLastSlide = false;
    }
    //showHidePrDrawings();
    if (vcdata[imageRequest] === true) {
        if (typeof vcdata[tmpSlideEnd] !== 'undefined') {
            requestOtherImages(vcdata[noOfSlides], vcdata[tmpSlideEnd] - 1);
            vcdata[imageRequest] = false;
        } else {
            requestOtherImages(vcdata[noOfSlides], data.next);
            vcdata[imageRequest] = false;
        }
    }
    updateSlideCount(data.next + 1);
    if (!vcdata[currentPrArray][data.next]) {
        fetchImages(data.next, currentPrId);
    }
    if (!vcdata[currentPrArray][data.prv]) {
        fetchImages(data.prv, currentPrId);
    }
    vcdata[currentPrArray][data.prv].hide();
    vcdata[currentPrArray][data.next].show();
});
/**
 * socket responce - slide control permission to student
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('access_to_slide_controls', function(data) {
    if (data === true) {
        student_access = true;
    } else {
        student_access = false;
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//need to remove when deploy with main app
var accessToWhiteboard = false;
/**
 * conductee raise hand
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function raiseHand() {
    socket.emit('hand_raise', {
        uid: "duminda",
        token: "eee458fc0e164cb5af7978eb5c5af0c1"
    });
}
/**
 * conductor give wb permissions to hand raised user
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function giveWhiteboardAccess() {
    if (accessToWhiteboard === true) {
        socket.emit('allow_whiteboard', {
            allow: true,
            uid: "duminda",
            token: "eee458fc0e164cb5af7978eb5c5af0c1"
        });
    } else {
        socket.emit('allow_whiteboard', {
            allow: false
        });
    }
}
/**
 * conductor get wb permissions back to admin
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
function getWhiteboardAccess() {
    socket.emit('allow_whiteboard', {
        allow: false,
        uid: "kavi",
        whiteboardClicked: vcdata[whiteboardClicked],
        token: "1435f0549f2c4b4a95f36e5e82f3bd46"
    });
}
/**
 * socket responce - user hand raised
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('hand_raised', function(data) {
    //conductor recieved hand raise signal and allow user to whiteboard access
    if (data.token === "eee458fc0e164cb5af7978eb5c5af0c1") {
        accessToWhiteboard = true;
    } else {
        accessToWhiteboard = false;
    }
});
/**
 * socket responce - conductee granted access to access whiteboard
 * @author Duminda Wanninayake duminda@thinkcube.com
 * @return {undefined}
 */
socket.on('whiteboard_access_granted', function(data) {
    if (data === true) {}
});

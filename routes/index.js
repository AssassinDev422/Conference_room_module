/*
 * GET home page.
 */
exports.index = function(req, res) {

    var curr_dir = __dirname;
    var pos = curr_dir.indexOf("/routes");
    var dir = curr_dir.slice(0, pos);
    var reslt = fs.readdirSync(dir + "/public/images/slides");
    var cnt_1 = 0;
    var cnt_2 = 0;
    var cnt_3 = 0;
    var cnt_4 = 0;
    for (var i = 0; i < reslt.length; i++) {
        if (reslt[i].substr(0, 2) == '1_') {
            cnt_1++;
        }
        if (reslt[i].substr(0, 2) == '2_') {
            cnt_2++;
        }
        if (reslt[i].substr(0, 2) == '3_') {
            cnt_3++;
        }
        if (reslt[i].substr(0, 2) == '4_') {
            cnt_4++;
        }
    }
    res.render('index', {
        title: 'Virtual Classroom: Whiteboard',
        name: 'Whiteboard',
        slide_count_1: cnt_1,
        slide_count_2: cnt_2,
        slide_count_3: cnt_3,
        slide_count_4: cnt_4
    });
};

var db = require('./../helpers/db_helpers')
var helper = require('./../helpers/helpers')
var multiparty = require('multiparty')
var fs = require('fs');
var imageSavePath = "./public/img/"

//User Type:
const ut_admin = 4
const ut_driver = 2
const ut_user = 1

module.exports.controller = (app, io, socket_list) => {

    const msg_success = "successfully";
    const msg_fail = "fail";
    const msg_invalidUser = "invalid username";
    const msg_no_doc = "No Document"
    const msg_doc_approved = "Document approved successfully"
    const msg_doc_unapproved = "Document unapproved successfully"
    const msg_doc_add = "Document added successfully"
    const msg_doc_update = "Document updated successfully"
    const msg_doc_delete = "Document delete successfully"
    const msg_doc_upload = "Document uploaded successfully"

    //App Api
    app.post('/api/driver_update_document', (req, res) => {

        var form = new multiparty.Form();
        form.parse(req, (err, reqObj, files) => {
            if (err) {
                helper.ThrowHtmlError(err, res);
                return;
            }
            checkAccessToken(req.headers, res, (uObj) => {
                helper.CheckParameterValid(res, reqObj, ["doc_id", "zone_doc_id", "user_car_id", "expriry_date"], () => {

                    helper.CheckParameterValid(res, files, ["image"], () => {

                        helper.Dlog("working -----");

                        var driver_doc_id = "";
                        if (reqObj.driver_doc_id != undefined || reqObj.driver_doc_id != null) {
                            driver_doc_id = reqObj.driver_doc_id[0];
                        }

                        documentUpload(reqObj.doc_id[0], uObj.user_id, reqObj.expriry_date[0], files.image[0], driver_doc_id, (isDone, result) => {
                            if (!isDone) {
                                res.json({ "status": "0", "message": result })
                            } else {

                                if (reqObj["user_car_id"][0] == "") {
                                    res.json({ "status": "1", "message": msg_doc_upload })
                                } else {
                                    db.query("INSERT INTO `zone_wise_doc_link`(`zone_doc_id`,`driver_doc_id`,`user_car_id`, `linked_date`) VALUES (?,?,?, NOW()) ", [reqObj.zone_doc_id[0], result, reqObj.user_car_id[0]], (err, result) => {
                                        if (err) {
                                            helper.ThrowHtmlError(err, res);
                                            return
                                        }
                                        if (result) {
                                            res.json({ "status": "1", "message": msg_doc_upload })
                                        } else {
                                            res.json({ "status": "0", "message": msg_fail })
                                        }
                                    })
                                }


                            }
                        })

                    })
                })

            }, "2")
        })
    })

    app.post('/api/document_list', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ["user_car_id"], () => {
                db.query('SELECT IFNULL(`select_service_id`, "" ) AS `select_service_id` FROM `user_detail` WHERE `user_id` = ?', [uObj.user_id], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.length > 0) {
                        helper.Dlog(result);
                        if (result[0].select_service_id != "") {
                            db.query("SELECT `zwd`.`zone_doc_id`, `zwd`.`service_id`, `zwd`.`personal_doc`, `zwd`.`car_doc`, `sd`.`service_name`, `sd`.`color` FROM `zone_document` AS `zwd`" +
                                "INNER JOIN`user_detail` AS`ud` ON`ud`.`zone_id` = `zwd`.`zone_id` AND`ud`.`user_id` = ? " +
                                "INNER JOIn`service_detail` AS`sd` ON`sd`.`service_id` = `zwd`.`service_id` AND`sd`.`status` = 1 " + "AND`zwd`.`status` = 1 AND`zwd`.`service_id` IN(" + result[0].select_service_id + ") ", [uObj.user_id], (err, result) => {
                                    if (err) {
                                        helper.ThrowHtmlError(err, res);
                                        return
                                    }

                                    if (result.length > 0) {
                                        var payloadData = [];

                                        result.forEach((serviceDetail, index) => {
                                            payloadData.push(serviceDetail);
                                            var isServiceLast = false;
                                            if (serviceDetail == result.slice(-1)[0]) {
                                                isServiceLast = true;
                                            }

                                            var doc_id = "";
                                            if (serviceDetail.personal_doc != "") {
                                                doc_id = serviceDetail.personal_doc
                                            }

                                            if (serviceDetail.car_doc != "") {
                                                if (doc_id == "") {
                                                    doc_id = serviceDetail.car_doc
                                                } else {
                                                    doc_id = doc_id + "," + serviceDetail.car_doc
                                                }

                                            }
                                            helper.Dlog("----- document ------")
                                            helper.Dlog(doc_id);
                                            helper.Dlog("----- service detail ------")
                                            helper.Dlog(serviceDetail);

                                            var sql_doc = "SELECT `doc_id`, `name`, `type`, `status`, `create_date`, `modify_date` FROM `document` WHERE `status` = 1 AND `doc_id` IN (" + doc_id + "); " +
                                                'SELECT  `uc`.`user_car_id`, `cs`.`series_name`, `cm`.`model_name`, `cb`.`brand_name`, `uc`.`car_number`, `uc`.`car_image` FROM `user_cars` AS `uc` ' +
                                                'INNER JOIN `car_series` AS `cs` ON  `uc`.`series_id` = `cs`.`series_id` ' +
                                                'INNER JOIN `car_model` AS `cm` ON  `cs`.`model_id` = `cm`.`model_id` ' +
                                                'INNER JOIN `car_brand` AS `cb` ON `cb`.`brand_id` = `cm`.`brand_id`  ' +
                                                "WHERE `uc`.`user_id` = ? AND `uc`.`status` != 2 ";

                                            helper.Dlog(sql_doc);
                                            db.query(sql_doc, [uObj.user_id], (err, docResult) => {

                                                if (err) {
                                                    helper.ThrowHtmlError(err);
                                                    return;
                                                }

                                                serviceDetail.cars_list = []

                                                helper.Dlog(docResult[1]);

                                                docResult[1].forEach((carDetail, index) => {

                                                    var is_car_doc_last = false;
                                                    if (carDetail == docResult[1].slice(-1)[0]) {
                                                        is_car_doc_last = true;
                                                    }

                                                    serviceDetail.cars_list.push(carDetail);

                                                    var sqlCarDoc = 'SELECT `zwdl`.`zone_link_id`, `zwdl`.`driver_doc_id`, `zwdl`.`doc_status`, `zwdl`.`linked_date`, `dd`.`doc_id`, IFNULL( `dd`.`doc_image`, "" ) AS `doc_image`, `dd`.`expiry_date`, `dd`.`created_date`, `dd`.`status`, `d`.`type`, `d`.`name` AS `doc_name`  FROM `zone_wise_doc_link` AS `zwdl` ' +
                                                        'INNER JOIN `zone_document` AS `zwd` ON`zwd`.`zone_doc_id` = `zwdl`.`zone_doc_id` ' +
                                                        'INNER JOIN `driver_document` AS `dd` ON`dd`.`driver_doc_id` = `zwdl`.`driver_doc_id` AND`dd`.`status` != 1 ' +
                                                        'INNER JOIN `document` AS `d` ON `dd`.`doc_id` = `d`.`doc_id` ' +
                                                        'WHERE `dd`.`user_id` = ? AND`zwdl`.`user_car_id` = ? AND`zwd`.`zone_doc_id` = ? AND`zwdl`.`doc_status` != 1';

                                                    db.query(sqlCarDoc, [uObj.user_id, carDetail.user_car_id, serviceDetail.zone_doc_id], (err, carDoc) => {
                                                        if (err) {
                                                            helper.ThrowHtmlError(err);
                                                            return;
                                                        }
                                                        carDetail.doc_list = [];
                                                        for (let i = 0; i < docResult[0].length; i++) {
                                                            var isSet = false;
                                                            for (let j = 0; j < carDoc.length; j++) {
                                                                if (docResult[0][i].doc_id == carDoc[j].doc_id) {
                                                                    carDetail.doc_list.push(carDoc[j])
                                                                    isSet = true;
                                                                }
                                                            }

                                                            if (!isSet) {
                                                                docResult[0][i].expriry_date = "";
                                                                docResult[0][i].status = -1;
                                                                docResult[0][i].doc_status = "";
                                                                docResult[0][i].linked_date = "";
                                                                docResult[0][i].doc_image = "";
                                                                carDetail.doc_list.push(docResult[0][i])
                                                            }

                                                        }

                                                        if (isServiceLast && is_car_doc_last) {

                                                            console.log(payloadData)
                                                            res.json({ "status": "1", "payload": payloadData })
                                                        }
                                                    })

                                                });


                                            })

                                        });
                                    } else {
                                        res.json({ "status": "0", "message": msg_no_doc })
                                    }

                                })
                        } else {
                            res.json({ "status": "0", "message": "Please select service" })
                        }
                        // res.json({ "status": "1", "payload": result })
                    } else {
                        res.json({ "status": "0", "message": msg_invalidUser })
                    }
                })
            })
        }, "2")
    })

    app.post('/api/personal_document_list', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            db.query("SELECT `zl`.`zone_name`, `zl`.`zone_id`, `zld`.`zone_doc_id`, `zld`.`service_id`, `sd`.`service_name`, `zld`.`personal_doc`, `d`.`name`, `d`.`type`, `d`.`doc_id`, `dd`.`doc_image`, `dd`.`expiry_date`, `dd`.`status`, `dd`.`created_date`, `dd`.`driver_doc_id` FROM `user_detail` AS `ud` " +
                "INNER JOIN `zone_list` AS `zl` ON `zl`.`zone_id` = `ud`.`zone_id` AND `zl`.`status` = 1 AND `ud`.`user_id` = ? " +
                "INNER JOIN `zone_document` AS `zld` ON `zld`.`zone_id` = `zl`.`zone_id` AND FIND_IN_SET( `zld`.`service_id`, `ud`.`select_service_id` ) > 0 AND `zld`.`status` = 1 " +
                "INNER JOIN `service_detail` AS `sd` ON `sd`.`service_id` = `zld`.`service_id` AND `sd`.`status` = 1 " +
                "INNER JOIN `document` AS `d` ON FIND_IN_SET( `d`.`doc_id`, `zld`.`personal_doc` ) > 0 AND `d`.`status` = 1 " +
                "LEFT JOIN `driver_document` AS `dd` ON `dd`.`doc_id` = `d`.`doc_id` AND `dd`.`user_id` = `ud`.`user_id` AND `dd`.`status` != 1;", [uObj.user_id], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.length > 0) {
                        res.json({
                            'status': '1',
                            'payload': result
                        })
                    } else {
                        res.json({
                            'status': "0",
                            "message": "Please select any one zone & any one provide service type"
                        })
                    }

                })
        })


    })

    app.post('/api/car_document_list', ( req, res) => {

        helper.Dlog(req.body);
        var reqObj = req.body
        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ["user_car_id"], () => {
                db.query("SELECT `zl`.`zone_name`, `zl`.`zone_id`, `zld`.`zone_doc_id`, `zld`.`service_id`, `sd`.`service_name`, `zld`.`personal_doc`, `d`.`name`, `d`.`type`, `d`.`doc_id`, `dd`.`doc_image`, `dd`.`expiry_date`, `dd`.`status`, `dd`.`created_date`, `dd`.`driver_doc_id`, `zwdl`.`zone_link_id`, `zwdl`.`doc_status` FROM `user_detail` AS `ud`" +
                "INNER JOIN `zone_list` AS `zl` ON `zl`.`zone_id` = `ud`.`zone_id` AND `zl`.`status` = 1 AND `ud`.`user_id` = ? " +
                "INNER JOIN `zone_document` AS `zld` ON `zld`.`zone_id` = `zl`.`zone_id` AND FIND_IN_SET ( `zld`.`service_id`, `ud`.`select_service_id` ) > 0 AND `zld`.`status` = 1 " +
                "INNER JOIN `service_detail` AS `sd` ON `sd`.`service_id` = `zld`.`service_id` AND `sd`.`status` = 1 " +
                "INNER JOIN `document` AS `d` ON FIND_IN_SET(`d`.`doc_id`, `zld`.`car_doc` ) > 0 AND `d`.`status` = 1 " +
                "LEFT JOIN `zone_wise_doc_link` AS `zwdl` ON `zwdl`.`zone_doc_id` = `zld`.`zone_doc_id` AND `zwdl`.`user_car_id` = ? AND `zwdl`.`doc_status` != 1 " +
                "LEFT JOIN `driver_document` AS `dd` ON `dd`.`driver_doc_id` = `zwdl`.`driver_doc_id` AND `dd`.`user_id` = `ud`.`user_id` AND `dd`.`status` != 1; ", [
                    uObj.user_id,
                    reqObj.user_car_id
                ], (err, result) => {

                    if(err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if(result.length > 0) {
                        res.json({
                            'status':'1',
                            'payload': result
                        })
                    }else{
                        res.json({
                            'status':"0",
                            "message":"Please select any one zone & any one provide service type"
                        })
                    }

                } )
            })
        })

    })
  

    //Admin Api
    app.post('/api/admin/add_document', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ["document_name", "document_type"], () => {

                db.query("INSERT INTO `document`(`name`, `type`) VALUES (?,?) ", [reqObj.document_name, reqObj.document_type], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result) {
                        res.json({
                            "status": "1", "payload": {
                                "doc_id": result.insertId,
                                "name": reqObj.document_name,
                                "type": reqObj.document_type,
                                "status": 0,
                            }, "message": msg_doc_add
                        })
                    } else {
                        res.json({ "status": "0", "message": msg_fail })
                    }
                })
            })
        }, "4")
    })

    app.post('/api/admin/document_list', (req, res) => {
        checkAccessToken(req.headers, res, (uObj) => {
            db.query('SELECT `doc_id`, `name`, `type`, `status` FROM `document` WHERE `status` != ?', [2], (err, result) => {
                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return
                }

                if (result.length > 0) {
                    res.json({ "status": "1", "payload": result })

                } else {
                    res.json({ "status": "0", "message": msg_no_doc })
                }
            })
        }, "4")

    })

    app.post('/api/admin/document_delete', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;
        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ["doc_id"], () => {

                db.query('UPDATE `document` SET `status`=2, `modify_date`=NOW() WHERE `doc_id` = ? AND `status` != 2', [reqObj.doc_id], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                    }
                    if (result.affectedRows > 0) {
                        res.json({ "status": "1", "message": msg_doc_delete })
                    } else {
                        res.json({ "status": "0", "message": msg_fail })
                    }
                })
            })
        }, "4")
    })

    app.post('/api/admin/document_update', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ["doc_id", "document_name", "document_type"], () => {

                db.query('UPDATE `document` SET `name`=?, `type` = ?,  `modify_date`=NOW() WHERE `doc_id` = ? AND `status` != 2', [reqObj.document_name, reqObj.document_type, reqObj.doc_id], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                    }
                    if (result.affectedRows > 0) {
                        res.json({ "status": "1", "message": msg_doc_update })
                    } else {
                        res.json({ "status": "0", "message": msg_fail })
                    }
                })
            })
        }, "4")
    })

    // app.post('/api/upload_image', (req, res) => {
    //     var form = new multiparty.Form();
    //     form.parse(req, (err, reqObj, files) => {
    //         if (err) {
    //             helper.ThrowHtmlError(err, res);
    //             return;
    //         }

    //         helper.Dlog("--------------- Parameter --------------")
    //         helper.Dlog(reqObj);

    //         helper.Dlog("--------------- Files --------------")
    //         helper.Dlog(files);

    //         if (files.image != undefined || files.image != null) {
    //             var extension = files.image[0].originalFilename.substring(files.image[0].originalFilename.lastIndexOf(".") + 1);
    //             var imageFileName = helper.fileNameGenerate(extension);

    //             var newPath = imageSavePath + imageFileName;

    //             fs.rename(files.image[0].path, newPath, (err) => {

    //                 if (err) {
    //                     helper.ThrowHtmlError(err);
    //                     return;
    //                 } else {

    //                     var name = reqObj.name;
    //                     var address = reqObj.address;

    //                     helper.Dlog(name);
    //                     helper.Dlog(address);

    //                     res.json({
    //                         "status": "1",
    //                         "payload": { "name": name, "address": address, "image": helper.ImagePath() + imageFileName },
    //                         "message": msg_success
    //                     })
    //                 }
    //             })
    //         }
    //     })
    // })

}

function documentUpload(doc_id, user_id, expriry_date, image, driver_doc_id, callback) {
    if (driver_doc_id == undefined || driver_doc_id == "") {
        //
        var extension = image.originalFilename.substring(image.originalFilename.lastIndexOf(".") + 1);
        var imageFileName = "car/" + helper.fileNameGenerate(extension);

        var newPath = imageSavePath + imageFileName;

        fs.rename(image.path, newPath, (err) => {

            if (err) {
                helper.ThrowHtmlError(err);
                return callback(false, "document upload fail")

            } else {

                db.query("INSERT INTO `driver_document`( `doc_id`, `user_id`, `doc_image`, `expiry_date`) VALUES (?,?,?, ?)", [doc_id, user_id, imageFileName, expriry_date], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err);
                        return callback(false, "document upload fail")
                    }

                    if (result) {
                        return callback(true, result.insertId)
                    } else {
                        return callback(false, "document upload fail")
                    }
                })
            }
        })
    } else {
        db.query("SELECT * FROM `driver_document` WHERE `driver_doc_id` = ? AND `user_id` = ? AND `doc_id` = ? ", [driver_doc_id, user_id, doc_id], (err, result) => {
            if (err) {
                helper.ThrowHtmlError(err);
                return callback(true, "document upload fail")

            } else {
                if (result.length > 0) {
                    return callback(true, result[0].driver_doc_id)
                } else {
                    return callback(false, "invalid document")
                }
            }

        })
    }
}


function checkAccessToken(helperObj, res, callback, requireType = "") {
    helper.Dlog(helperObj.access_token)
    helper.CheckParameterValid(res, helperObj, ["access_token"], () => {
        db.query('SELECT `user_id`, `name`, `email`, `gender`, `mobile`, `mobile_code`, `auth_token`,  `user_type`, `is_block`,  `image`, `status` FROM `user_detail` WHERE  `auth_token` = ? AND (`status` = ? OR `status` = ?) ', [helperObj.access_token, "1", "2"], (err, result) => {

            if (err) {
                helper.ThrowHtmlError(err);
                return
            }

            helper.Dlog(result)

            if (result.length > 0) {
                if (requireType != "") {
                    if (requireType == result[0].user_type) {
                        return callback(result[0])
                    } else {
                        res.json({ "status": "0", "code": "404", "message": "Access denied. Unauthorized user access." })
                    }
                } else {
                    return callback(result[0])
                }

            } else {
                res.json({ "status": "0", "code": "404", "message": "Access denied. Unauthorized user access." })
            }
        })
    })
}
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

    //App api
    app.post('/api/zone_list', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            db.query("SELECT `zl`.`zone_id`, `zl`.`zone_name`, `zl`.`city`, `zl`.`tax` FROM `zone_list` AS `zl` " +
                "INNER JOIN `price_detail` AS `pd` ON `pd`.`zone_id` = `zl`.`zone_id` AND `pd`.`status` = 1 " +
                "INNER JOIN  `service_detail` AS `sd` ON `sd`.`service_id` = `pd`.`service_id` AND `sd`.`status` = 1 AND `zl`.`status` = 1 " +
                "GROUP BY `zl`.`zone_id` ", [], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }
                    if (result.length > 0) {
                        res.json({ "status": "1", "payload": result })
                    } else {
                        res.json({ "status": "0", "message": "no zone data" })
                    }
                })

        }, ut_driver)
    })

    //Admin Api
    app.post('/api/admin/zone_add', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ["zone_name", "zone_json", "city" , "price_json", "tax"], () => {

                var zonePriceObj = JSON.parse(reqObj.price_json);
                if (zonePriceObj.length > 0) {
                    db.query('INSERT INTO `zone_list`(`zone_name`, `city` , `zone_json`, `tax`) VALUES (?,?,?, ?)', [reqObj.zone_name,reqObj.city , reqObj.zone_json, reqObj.tax], (err, result) => {
                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return
                        }
                        if (result) {

                            var priceArray = []
                            var documentArray = []

                            zonePriceObj.forEach((zoneServiceObj) => {
                                priceArray.push([result.insertId, zoneServiceObj.service_id, zoneServiceObj.base_charge, zoneServiceObj.per_km_charge, zoneServiceObj.per_minute_charge, zoneServiceObj.booking_charge, zoneServiceObj.minimum_fair, zoneServiceObj.minimum_km, zoneServiceObj.cancel_charge, reqObj.tax]);

                                documentArray.push([result.insertId, zoneServiceObj.service_id, zoneServiceObj.document_id, zoneServiceObj.car_document_id]);

                            });

                            helper.Dlog(priceArray);
                            helper.Dlog(documentArray);

                            db.query("INSERT INTO `price_detail`(`zone_id`, `service_id`, `base_charge`, `per_km_charge`, `per_min_charge`, `booking_charge`, `mini_fair`, `mini_km`, `cancel_charge`, `tax`) VALUES ?;" +
                                "INSERT INTO `zone_document`(`zone_id`, `service_id`, `personal_doc`, `car_doc`) VALUES ? ;", [priceArray, documentArray], (err, pResult) => {

                                    if (err) {
                                        helper.ThrowHtmlError(err, res);
                                        return
                                    }

                                    if (pResult[0] && pResult[1]) {
                                        res.json({ "status": "1", "message": "zone add successfully" })
                                    } else {
                                        res.json({ "status": "0", "message": msg_fail })
                                    }

                                })


                        } else {
                            res.json({ "status": "0", "message": msg_fail })
                        }
                    })
                } else {
                    res.json({ "status": "0", "message": "zone price data is missing" })
                }

            })
        }, ut_admin)
    })

    app.post('/api/admin/zone_list', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            db.query("SELECT `zd`.`zone_doc_id`, `pd`.`price_id`, `pd`.`service_id`, `zl`.`zone_id`, `zl`.`zone_name`, `zl`.`city`, `zl`.`tax`, `sd`.`service_name`, GROUP_CONCAT( CASE WHEN `d`.`type` = 1 THEN IFNULL (`d`.`name`, '' ) ELSE '' END) AS `document_name`, GROUP_CONCAT( CASE WHEN `d`.`type` = 2 THEN IFNULL (`d`.`name`, '' ) ELSE '' END) AS `car_document_name`, `pd`.`base_charge`, `pd`.`per_km_charge`, `pd`.`per_min_charge`, `pd`.`booking_charge`, `pd`.`mini_fair`, `pd`.`mini_km`, `pd`.`cancel_charge` FROM `zone_list` AS `zl` " +
                "INNER JOIN  `zone_document` AS `zd` ON `zd`.`zone_id` = `zl`.`zone_id` AND `zd`.`status` = 1 AND `zl`.`status` != 2 " +
                
                "INNER JOIN `price_detail` AS `pd` ON `pd`.`zone_id` = `zl`.`zone_id` AND `pd`.`status` = 1 " +
                "INNER JOIN  `service_detail` AS `sd` ON `sd`.`service_id` = `pd`.`service_id` AND `sd`.`status` = 1 " +
                "LEFT JOIN `document` AS `d` ON `d`.`status` = 1 AND ( FIND_IN_SET( `d`.`doc_id`,  `zd`.`personal_doc` ) != 0  OR FIND_IN_SET( `d`.`doc_id`,  `zd`.`car_doc` ) != 0) GROUP BY `pd`.`price_id` ", [], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.length > 0) {
                        res.json({ "status": "1", "payload": result })
                    } else {
                        res.json({ "status": "0", "message": "no zone data" })
                    }
                })




        }, "4")
    })

    app.post('/api/admin/zone_price_list', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            var condition = "";

            if (reqObj.zone_id != undefined && reqObj.zone_id != "") {
                condition = " AND `pd`.`zone_id` = " + reqObj.zone_id;
            }

            if (reqObj.service_id != undefined && reqObj.service_id != "") {
                condition += " AND `pd`.`service_id` = " + reqObj.service_id;
            }

            db.query("SELECT `pd`.`price_id`, `pd`.`service_id`, `zl`.`zone_id`, `zl`.`zone_name`, `zl`.`city`, `zl`.`tax`, `sd`.`service_name`, `pd`.`base_charge`, `pd`.`per_km_charge`, `pd`.`per_min_charge`, `pd`.`booking_charge`, `pd`.`mini_fair`, `pd`.`mini_km`, `pd`.`cancel_charge` FROM `zone_list` AS `zl` " +
                "INNER JOIN `price_detail` AS `pd` ON `pd`.`zone_id` = `zl`.`zone_id` AND `pd`.`status` = 1 " +
                "INNER JOIN  `service_detail` AS `sd` ON `sd`.`service_id` = `pd`.`service_id` AND `sd`.`status` = 1 " +
                "WHERE `zl`.`status` != 2 " + condition, [], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.length > 0) {
                        res.json({ "status": "1", "payload": result })
                    } else {
                        res.json({ "status": "0", "message": "no zone data" })
                    }
                })
        }, "4")
    })

    app.post('/api/admin/zone_price_delete', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ["price_id", "zone_id", "service_id"], () => {

                db.query(" UPDATE `price_detail` SET `status` = 2, `modify_date` = NOW() WHERE `price_id` = ? AND `zone_id` = ? AND `service_id` = ? ", [reqObj.price_id, reqObj.zone_id, reqObj.service_id], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({ "status": "1", "message": "zone price delete successfully" })
                    } else {
                        res.json({ "status": "0", "message": msg_fail })
                    }
                })
            })
        }, "4")
    })

    app.post('/api/admin/zone_price_edit', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ["price_id", "zone_id", "service_id", "base_charge", "per_km_charge", "per_min_charge", "booking_charge", "mini_fair", "mini_km", "cancel_charge", "tax"], () => {

                if (reqObj.price_id == "") {
                    //new price add
                    zoneNewPriceAdd( reqObj, res, "zone price added successfully"  )
                } else {
                    //old price delete then new price add
                    db.query(" UPDATE `price_detail` SET `status` = 2, `modify_date` = NOW() WHERE `price_id` = ? AND `zone_id` = ? AND `service_id` = ? ", [reqObj.price_id, reqObj.zone_id, reqObj.service_id], (err, result) => {

                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return
                        }

                        if (result.affectedRows > 0) {
                            zoneNewPriceAdd( reqObj, res, "zone price edited successfully")
                        } else {
                            res.json({ "status": "0", "message": msg_fail })
                        }
                    })
                }

            })
        }, "4")
    })
    app.post('/api/admin/zone_document_edit', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ["zone_doc_id", "personal_doc", "car_doc"  ], () => {

                db.query(" UPDATE `zone_document` SET `personal_document` = ?, `car_document` = ?, `modify_date` = NOW() WHERE `zone_doc_id` = ? ", [reqObj.personal_doc, reqObj.car_doc, reqObj.zone_doc_id], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {
                        zoneNewPriceAdd(reqObj, res, "zone document edited successfully")
                    } else {
                        res.json({ "status": "0", "message": msg_fail })
                    }
                })

            })
        }, "4")
    })

    app.post('/api/admin/zone_document_list', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            var condition = "";

            if (reqObj.zone_id != undefined && reqObj.zone_id != "") {
                condition = " AND `zd`.`zone_id` = " + reqObj.zone_id;
            }

            if (reqObj.service_id != undefined && reqObj.service_id != "") {
                condition += " AND `zd`.`service_id` = " + reqObj.service_id;
            }

            db.query("SELECT `zd`.`zone_doc_id`, `zl`.`zone_id`, `zl`.`zone_name`, `zl`.`city`, `zl`.`modify_date`, `zl`.`tax`, `sd`.`service_name`, GROUP_CONCAT( CASE WHEN `d`.`type` = 1 THEN IFNULL (`d`.`name`, '' ) ELSE '' END) AS `document_name`, GROUP_CONCAT( CASE WHEN `d`.`type` = 2 THEN IFNULL (`d`.`name`, '' ) ELSE '' END) AS `car_document_name`, `pd`.`base_charge`, `pd`.`per_km_charge`,  FROM `zone_list` AS `zl` " +
                "INNER JOIN `zone_document` AS `zd` ON `zd`.`zone_id` = `zl`.`zone_id` AND `zd`.`status` = 1 AND `zl`.`status` != 2 " +
                "INNER JOIN `price_detail` AS `pd` ON `pd`.`zone_id` = `zl`.`zone_id` AND `pd`.`status` = 1 " +
                "INNER JOIN  `service_detail` AS `sd` ON `sd`.`service_id` = `pd`.`service_id` AND `sd`.`status` = 1 " +
                "LEFT JOIN `document` AS `d` ON `d`.`status` = 1 AND ( FIND_IN_SET( `d`.`doc_id`,  `zd`.`personal_doc` ) != 0  OR FIND_IN_SET( `d`.`doc_id`,  `zd`.`car_doc` ) != 0) " +
                "WHERE `zl`.`status` = 0 " + condition  + "  GROUP BY `zd`.`zone_doc_id` ;" +
                "SELECT `doc_id`, `name`, `type`, `created_date`, `modify_date` FROM `document` WHERE `status` = 0  "  , [], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result[0].length > 0) {
                        res.json({ "status": "1", "payload": result[0], "document_list": result[1] })
                    } else {
                        res.json({ "status": "0", "message": "no zone data" })
                    }
                })
        }, "4")
    })
}


function zoneNewPriceAdd(reqObj, res, message) {
    db.query("INSERT INTO `price_detail`(`zone_id`, `service_id`, `base_charge`, `per_km_charge`, `per_min_charge`, `booking_charge`, `mini_fair`, `mini_km`, `cancel_charge`, `tax`) VALUES (?,?,?, ?,?,?, ?,?,?, ?);"
        , [reqObj.zone_id, reqObj.service_id, reqObj.base_charge, reqObj.per_km_charge, reqObj.per_min_charge, reqObj.booking_charge, reqObj.mini_fair, reqObj.mini_km, reqObj.cancel_charge, reqObj.tax], (err, result) => {

            if (err) {
                helper.ThrowHtmlError(err, res);
                return
            }

            if (result) {
                res.json({ "status": "1", "payload": { "price_id": result.insertId }, "message": message })
            } else {
                res.json({ "status": "0", "message": msg_fail })
            }

        })
}

function checkAccessToken(helperObj, res, callback, requireType = "") {
    helper.Dlog(helperObj.access_token)
    helper.CheckParameterValid(res, helperObj, ["access_token"], () => {
        db.query('SELECT `user_id`, `name`, `email`, `gender`, `mobile`, `mobile_code`, `auth_token`,  `user_type`, `is_block`,  `image`, `status` FROM `user_detail` WHERE  `auth_token` = ? AND `status` = ? ', [helperObj.access_token, "1"], (err, result) => {

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
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

    //Admin Api
    app.post('/api/admin/zone_add', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ["zone_name", "zone_json", "price_json", "tax"], () => {

                var zonePriceObj = JSON.parse(reqObj.price_json);
                if (zonePriceObj.length > 0) {
                    db.query('INSERT INTO `zone_list`(`zone_name`, `zone_json`, `tax`) VALUES (?,?,?)', [reqObj.zone_name, reqObj.zone_json, reqObj.tax], (err, result) => {
                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return
                        }
                        if (result) {

                            var priceArray = []
                            var documentArray = []

                            zonePriceObj.forEach((zoneServiceObj) => {
                                priceArray.push([result.insertId, zoneServiceObj.service_id, zoneServiceObj.base_charge, zoneServiceObj.per_km_charge, zoneServiceObj.per_min_charge, zoneServiceObj.booking_charge, zoneServiceObj.mini_fair, zoneServiceObj.mini_km, zoneServiceObj.cancel_change, reqObj.tax ]);

                                documentArray.push([result.insertId, zoneServiceObj.service_id, zoneServiceObj.document_id, zoneServiceObj.car_document_id]);
                               
                            });

                            helper.Dlog(priceArray);
                            helper.Dlog(documentArray);

                            db.query("INSERT INTO `price_detail`(`zone_id`, `service_id`, `base_charge`, `per_km_charge`, `per_min_charge`, `booking_charge`, `mini_fair`, `mini_km`, `cancel_change`, `tax`) VALUES ?;" +
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
        }, "4")
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
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

    app.post('/api/login', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        helper.CheckParameterValid(res, reqObj, ["user_type", "mobile_code", "mobile", "os_type", "push_token", "socket_id"], () => {

            db.query('SELECT `user_id`, `name`, `email`, `gender`, `mobile`, `mobile_code`,  `user_type`, `is_block`,  `image`, `status` FROM `user_detail` WHERE  `mobile` = ? AND  `mobile_code` = ? AND `user_type` = ? ', [reqObj.mobile, reqObj.mobile_code, reqObj.user_type], (err, result) => {

                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return
                }

                if (result.length > 0) {
                    var auth_token = helper.createRequestToken();
                    db.query("UPDATE `user_detail` SET `auth_token` = ?, `modify_date` = NOW() WHERE `mobile` = ? AND  `mobile_code` = ? AND `user_type` = ? ", [auth_token, reqObj.mobile, reqObj.mobile_code, reqObj.user_type], (err, uResult) => {
                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return
                        }
                        if (uResult.affectedRows > 0) {
                            getUserDetailUserId(result[0].user_id, (isDone, uObj) => {
                                res.json({ "status": "1", "payload": uObj })
                            })
                        }

                    })

                } else {
                    var auth_token = helper.createRequestToken();
                    db.query("INSERT INTO `user_detail` (  `mobile`, `mobile_code`,`user_type`, `push_token`, `auth_token`, `device_source`, `status`  ) VALUES (?,?,?, ?,?,?, ?)", [
                        reqObj.mobile, reqObj.mobile_code, reqObj.user_type, reqObj.push_token, auth_token, reqObj.os_type, "1"
                    ], (err, result) => {
                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return
                        }

                        if (result) {
                            getUserDetailUserId(result.insertId, (isDone, uObj) => {
                                res.json({ "status": "1", "payload": uObj })
                            })
                        } else {
                            res.json({ "status": "0", "message": msg_fail })
                        }
                    })
                }
            })
        })
    })

    app.post('/api/static_data', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;
        helper.CheckParameterValid(res, reqObj, ["last_call_time"], () => {

            var lastCallTime = reqObj.last_call_time

            if (!lastCallTime || lastCallTime == "") {
                lastCallTime = "2023-08-01 00:00:00"
            }

            db.query(
                "SELECT * FROM `zone_list` WHERE `modify_date` >= ? ;" +
                'SELECT `service_id`, `service_name`, `seat`, `color`,  (CASE WHEN `icon` != ""  THEN CONCAT( "' + helper.ImagePath() + '" , `icon`  ) ELSE "" END) AS `icon`,  (CASE WHEN `top_icon` != ""  THEN CONCAT( "' + helper.ImagePath() + '" , `top_icon`  ) ELSE "" END) AS `top_icon`, `gender`, `status`, `created_date`, `modify_date`, `description` FROM `service_detail` WHERE `modify_date` >= ? ;' +
                "SELECT * FROM `price_detail` WHERE `modify_date` >= ? ;" +
                "SELECT * FROM `document` WHERE `modify_date` >= ? ;" +
                "SELECT * FROM `zone_document` WHERE `modify_date` >= ? ;",

                [lastCallTime, lastCallTime, lastCallTime, lastCallTime, lastCallTime,], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    res.json(
                        {
                            "status": "1",
                            "payload":

                            {
                                "zone_list": result[0],
                                "service_detail": result[1],
                                "price_detail": result[2],
                                "document": result[3],
                                "zone_document": result[4],
                            }
                        })
                }
            )
        })
    })

    function getUserDetailUserId(user_id, callback) {
        db.query('SELECT `user_id`, `name`, `email`, `gender`, `mobile`, `mobile_code`, `auth_token`,  `user_type`, `is_block`,  (CASE WHEN `image` != ""  THEN CONCAT( "' + helper.ImagePath() + '" , `image`  ) ELSE "" END) AS `image`, `status`, `zone_id`, `select_service_id`  FROM `user_detail` WHERE  `user_id` = ? ', [user_id], (err, result) => {

            if (err) {
                helper.ThrowHtmlError(err);
                return callback(false, [])
            }

            if (result.length > 0) {
                return callback(true, result[0])
            } else {
                return callback(false, [])
            }
        })
    }

    app.post('/api/driver_online', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body
        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['is_online'], () => {

                db.query(
                    "SELECT `ud`.`user_id`, `ud`.`car_id`, `ud`.`status`, `ucd`.`status` AS `car_status`, `zwcs`.`zone_service_id`  FROM  `user_detail` AS `ud` " +
                    "LEFT JOIN `user_cars` AS `ucd` ON `ud`.`car_id` = `ucd`.`user_car_id` " +
                    "LEFT JOIN `zone_document` AS `zd` ON `ud`.`zone_id` = `zd`.`zone_id` " +
                    "LEFT JOIN `zone_wise_cars_service` AS `zwcs` ON `zwcs`.`user_car_id` = `ucd`.`user_car_id` AND `zwcs`.`zone_doc_id` = `zd`.`zone_doc_id` AND `zwcs`.`status` = '1' AND `zwcs`.`service_provide` = '1' " +
                    "WHERE `ud`.`user_id` = ? AND `ud`.`user_type` = ? ORDER BY`zwcs`.`zone_service_id` DESC ", [uObj.user_id, ut_driver], (err, result) => {
                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return
                        }
                        

                       
                        if (result.length > 0) {

                            if (reqObj.is_online == 0) {
                                //Offline
                                if (result[0].status == 2) {
                                    //Not Offline Driver ride is started
                                    res.json({
                                        "status": "0",
                                        "message": "please complete ride after offline !"
                                    })
                                    return
                                }
                            } else {
                                //Online

                                if (result[0].status == 0 || result[0].status == -1) {
                                    
                                    res.json({
                                        "status": "0",
                                        "message": "Your account not approved"
                                    })
                                    return
                                }
                                if (result[0].car_id == undefined || result[0].car_id == "") {
                                    res.json({
                                        "status": "0",
                                        "message": "Not select on ride car!"
                                    })
                                    return
                                }
                                if (result[0].car_id != undefined && result[0].car_id != "" && result[0].car_status != 1) {
                                    res.json({
                                        "status": "0",
                                        "message": "Not select on ride car!"
                                    })
                                    return
                                }

                                if (result[0].zone_service_id == undefined || result[0].zone_service_id == "") {
                                    res.json({
                                        "status": "0",
                                        "message": "Please select on ride car provide service"
                                    })
                                    return
                                }
                            }

                            var status_condition = "="
                            if (reqObj.is_online == 1) {
                                status_condition = ">="
                            }

                            db.query("UPDATE `user_detail` SET `is_online` = ? WHERE `user_id` = ? AND `status` " + status_condition + " ?", [reqObj.is_online, uObj.user_id, 1], (err, result) => {
                                if (err) {
                                    helper.ThrowHtmlError(err, res);
                                    return
                                }

                                if (result.affectedRows > 0) {
                                    var msg = "You're Offline"

                                    if (reqObj.is_online == 1) {
                                        msg = "You're Online"
                                    }

                                    res.json({
                                        'status': '1',
                                        'is_online': reqObj.is_online,
                                        'message': msg
                                    })

                                } else {
                                    res.json({
                                        'status': '0',
                                        'message': msg_fail
                                    })
                                }
                            })

                        } else {
                            res.json({
                                'status': '0',
                                'message': msg_fail
                            })
                        }


                    }
                )
            })
        })
    })

    app.post('/api/admin/login', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        helper.CheckParameterValid(res, reqObj, ["email", "password", "socket_id"], () => {

            var auth_token = helper.createRequestToken();
            db.query("UPDATE `user_detail` SET `auth_token` = ? , `modify_date` = NOW() WHERE `email` = ? AND  `password` = ? AND `user_type` = ? ", [auth_token, reqObj.email, reqObj.password, ut_admin], (err, result) => {
                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return
                }

                if (result.affectedRows > 0) {
                    db.query('SELECT `user_id`, `name`, `email`, `auth_token` , `gender`, `mobile`, `mobile_code`,  `user_type`, `is_block`,  `image`, `status` FROM `user_detail` WHERE  `email` = ? AND  `password` = ? AND `user_type` = ? ', [reqObj.email, reqObj.password, ut_admin], (err, result) => {

                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return
                        }

                        res.json({ "status": "1", "payload": result[0] })
                    })

                } else {
                    res.json({ "status": "0", "message": "invalid email & password" })
                }
            })


        })

    })

    app.post('/api/profile_update', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            var check = ["name", "gender", "email", "mobile", "mobile_code"]

            if (uObj.user_type == ut_driver) {
                check.push('zone_id')
                check.push('select_service_id')
            }
            helper.CheckParameterValid(res, reqObj, check, () => {

                db.query("SELECT `user_id`, `mobile`, `mobile_code` FROM `user_detail` WHERE `user_id` != ? AND `mobile` = ? AND `mobile_code` = ?   ", [uObj.user_id, reqObj.mobile, reqObj.mobile_code], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.length == 0) {

                        var select_service_id = ""
                        var zone_id = ""
                        if (uObj.user_type == ut_driver) {
                            zone_id = reqObj.zone_id
                            select_service_id = reqObj.select_service_id
                        }
                        db.query("UPDATE  `user_detail` SET `name` = ?, `email` = ?, `gender` = ?, `mobile` = ? , `mobile_code` = ?, `zone_id` = ?, `select_service_id` = ? WHERE `user_id` = ? ", [
                            reqObj.name, reqObj.email, reqObj.gender, reqObj.mobile, reqObj.mobile_code, zone_id, select_service_id, uObj.user_id
                        ], (err, result) => {

                            if (err) {
                                helper.ThrowHtmlError(err, res);
                                return
                            }

                            if (result.affectedRows > 0) {
                                getUserDetailUserId(uObj.user_id, (isDone, userObj) => {
                                    res.json({ "status": "1", "payload": userObj })
                                })
                            } else {
                                res.json({ "status": "0", "message": msg_fail })
                            }
                        })

                    } else {
                        res.json({ "status": "0", "message": "mobile number exits" })
                    }

                })
            })
        })
    })

    app.post('/api/profile_image', (req, res) => {
        helper.Dlog(req.body);

        var form = new multiparty.Form();
        form.parse(req, (err, reqObj, files) => {
            if (err) {
                helper.ThrowHtmlError(err, res);
                return
            }

            checkAccessToken(req.headers, res, (uObj) => {
                helper.CheckParameterValid(res, files, ["image"], () => {

                    var extension = files.image[0].originalFilename.substring(files.image[0].originalFilename.lastIndexOf(".") + 1)
                    var imageFileName = "profile/" + helper.fileNameGenerate(extension);

                    var newPath = imageSavePath + imageFileName;
                    fs.rename(files.image[0].path, newPath, (err) => {
                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return;
                        } else {
                            db.query("UPDATE `user_detail` SET `image` = ? WHERE `user_id` = ? ", [imageFileName, uObj.user_id], (err, result) => {

                                if (err) {
                                    helper.ThrowHtmlError(err, res);
                                    return
                                }

                                if (result.affectedRows > 0) {

                                    getUserDetailUserId(uObj.user_id, (isDone, uObj) => {
                                        res.json({ "status": "1", "payload": uObj })
                                    })


                                } else {
                                    res.json({ "status": "0", "message": msg_fail })
                                }
                            })
                        }


                    })
                })
            })

        })

    })


    app.post('/api/service_and_zone_list', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            db.query("SELECT `zl`.`zone_id`, `zl`.`zone_name` FROM `zone_list` AS `zl` " +
                "INNER JOIN `price_detail` AS `pd` ON `pd`.`zone_id` = `zl`.`zone_id` AND `pd`.`status` = 1 " +
                "INNER JOIN `service_detail` AS `sd` ON `sd`.`service_id` = `pd`.`service_id` AND `sd`.`status` = 1 AND `zl`.`status` = 1 " +
                "GROUP BY `zl`.`zone_id` ;" +
                "SELECT `service_id`, `service_name`, `seat`, `color`, ( CASE WHEN `icon` != '' THEN CONCAT('" + helper.ImagePath() + "', `icon` ) ELSE '' END ) AS `icon`, " +
                " (CASE WHEN `top_icon` != '' THEN CONCAT('" + helper.ImagePath() + "',`top_icon`) ELSE '' END) AS `top_icon` FROM `service_detail` " +
                "WHERE `status` = 1 ", [], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return;
                    }

                    res.json({
                        'status': '1',
                        'payload': {
                            'zone_list': result[0],
                            'service_list': result[1]
                        }
                    })
                })
        })


    })


    app.post('/api/address_add', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ["tag_name", "address", "lati", "longi"], () => {

                db.query("INSERT INTO `user_address`(`user_id`, `address`, `lati`, `longi`,  `tag_name`) VALUES (?,?,?, ?,?)  ", [uObj.user_id, reqObj.address, reqObj.lati, reqObj.longi, reqObj.tag_name], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result) {


                        db.query("SELECT `address_id`, `user_id`, `address`, `lati`, `longi`,  `tag_name`, `created_date`FROM `user_address` WHERE WHERE `user_id` = ? AND `status` != ? ", [
                            uObj.user_id, "2"
                        ], (err, result) => {

                            if (err) {
                                helper.ThrowHtmlError(err, res);
                                return
                            }

                            res.json({ "status": "1", "payload": result, "message": msg_success })
                        })

                    } else {
                        res.json({ "status": "0", "message": msg_fail })
                    }

                })
            })


        }, "1")
    })

    app.post('/api/address_edit', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ["address_id", "tag_name", "address", "lati", "longi"], () => {

                db.query("UPDATE `user_address` SET `address`=?,`lati`=?,`longi`=?,`tag_name`=?,`modify_date`=NOW() WHERE `address_id` = ? AND `user_id` = ? AND `status` != 2", [reqObj.address, reqObj.lati, reqObj.longi, reqObj.tag_name, reqObj.address_id, uObj.user_id], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {


                        res.json({ "status": "1", "payload": result, "message": msg_success })

                    } else {
                        res.json({ "status": "0", "message": msg_fail })
                    }

                })
            })
        }, "1")
    })

    app.post('/api/address_delete', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ["address_id"], () => {

                db.query("UPDATE `user_address` SET `status`=2, `modify_date`=NOW() WHERE `address_id` = ? AND `user_id` = ? AND `status` != 2", [reqObj.address_id, uObj.user_id], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {

                        res.json({ "status": "1", "payload": result, "message": msg_success })

                    } else {
                        res.json({ "status": "0", "message": msg_fail })
                    }

                })
            })
        }, "1")
    })

    app.post('/api/address_list', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            db.query("SELECT `address_id`, `user_id`, `address`, `lati`, `longi`,  `tag_name`, `created_date`FROM `user_address` WHERE `user_id` = ? AND `status` != ? ", [
                uObj.user_id, "2"
            ], (err, result) => {

                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return
                }

                res.json({ "status": "1", "payload": result, "message": msg_success })
            })
        }, "1")

    })

    app.post('/api/driver_service_provide', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ["zone_service_id", "is_switch"], () => {

                db.query("UPDATE `zone_wise_cars_service` AS `zwcs` INNER JOIN `user_cars` AS `uc` ON `zwcs`.`user_car_id` = `uc`.`user_car_id` SET `zwcs`.`service_provide`=?, `modify_date`=NOW() WHERE `uc`.`user_id` = ? AND `zwcs`.`zone_service_id` = ?", [reqObj.is_switch, uObj.user_id, reqObj.zone_service_id], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {


                        res.json({ "status": "1", "payload": result, "message": "service change successfully" })

                    } else {
                        res.json({ "status": "0", "message": msg_fail })
                    }

                })
            })
        }, ut_driver)
    })

    app.post('/api/bank_detail', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            db.query("SELECT  `user_id`, `account_name`, `bsb`, `account_no`, `bank_name` FROM `bank_detail` WHERE `user_id` = ?  ", [
                uObj.user_id
            ], (err, result) => {

                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return
                }

                if (result.length > 0) {
                    res.json({ "status": "1", "payload": result[0] })
                } else {
                    res.json({ "status": "0", "message": "no bank info" })
                }

            })
        }, ut_driver)

    })

    app.post('/api/driver_bank_update', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ["account_name", "ifsc", "account_no", "bank_name"], () => {
                db.query("SELECT  `user_id`, `account_name`, `bsb`, `account_no`, `bank_name` FROM `bank_detail` WHERE `user_id` = ?  ", [
                    uObj.user_id
                ], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.length > 0) {
                        // already added
                        db.query("UPDATE `bank_detail` SET `account_name`=?, `bsb` = ?, `account_no` = ?, `bank_name` = ? WHERE `user_id` = ? ", [reqObj.account_name, reqObj.ifsc, reqObj.account_no, reqObj.bank_name, uObj.user_id], (err, result) => {
                            if (err) {
                                helper.ThrowHtmlError(err, res);
                                return
                            }

                            if (result.affectedRows > 0) {
                                res.json({ "status": "1", "message": "update bank info done" })

                            } else {
                                res.json({ "status": "0", "message": msg_fail })
                            }

                        })
                    } else {
                        // New Add
                        db.query("INSERT INTO `bank_detail` (`user_id`, `account_name`, `bsb`, `account_no`, `bank_name` ) VALUES (?,?,?, ?,?) ", [uObj.user_id, reqObj.account_name, reqObj.ifsc, reqObj.account_no, reqObj.bank_name], (err, result) => {
                            if (err) {
                                helper.ThrowHtmlError(err, res);
                                return
                            }

                            if (result) {
                                res.json({ "status": "1", "message": "update bank info done" })

                            } else {
                                res.json({ "status": "0", "message": msg_fail })
                            }
                        })
                    }

                })


            })
        }, ut_driver)
    })

    app.post('/api/service_detail', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            db.query("SELECT `sd`.`service_name`, `sd`.`color`, `sd`.`icon`, `sd`.`top_icon` ,  `zwcs`.`zone_service_id`, `zwcs`.`service_provide`, `zwcs`.`status_message` FROM `zone_wise_cars_service` AS `zwcs` " +
                "INNER JOIN`zone_document` AS`zd` ON`zd`.`zone_doc_id` = `zwcs`.`zone_doc_id` " +
                "INNER JOIN`user_detail` AS`ud` ON`ud`.`car_id` = `zwcs`.`user_car_id` AND`ud`.`zone_id` = `zd`.`zone_id` " +
                "INNER JOIN`service_detail` AS`sd` ON`sd`.`service_id` = `zd`.`service_id` AND FIND_IN_SET(`sd`.`service_id`, `ud`.`select_service_id`) != 0 " +
                "WHERE`ud`.`user_id` = ? AND`zwcs`.`status` = 1 AND`sd`.`status` = 1; " +
                "SELECT `ud`.`status` , `ud`.`car_id` FROM `user_detail` AS  `ud` WHERE `ud`.`user_id`  = ? ", [
                uObj.user_id, uObj.user_id
            ], (err, result) => {

                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return
                }

                if (result.length > 0) {
                    var userStatus = "Approved";
                    switch (result[1][0].status) {
                        case 0:
                            userStatus = "No Verify"
                            break;
                        case 1:
                            userStatus = "Not Approved"
                            break
                        default:
                            break;
                    }
                    var carStatus = ""
                    if (result[1][0].car_id == "" || result[1][0].car_id == undefined) {
                        carStatus = "Car not selected"
                    } else {
                        if (result[0].length > 0) {
                            carStatus = "Active"
                        } else {
                            carStatus = "Missing Document"
                        }
                        res.json({ "status": "1", "payload": result[0], "car_status": carStatus, "user_status": userStatus })
                    }

                } else {
                    res.json({ "status": "0", "message": "No Service Available || Please Select Car", "car_status": "", "user_status": "" })
                }

            })
        }, ut_driver)

    })

    app.post('/api/change_password', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body
        checkAccessToken( req.headers,  res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ["old_password", "new_password"], ()=> {
                db.query("UPDATE `user_detail` SET `password` = ? WHERE `user_id` = ? AND `password` = ? ",[  reqObj.new_password, uObj.user_id, reqObj.old_password ], (err, result) => {

                    if(err) {
                        helper.ThrowHtmlError(err, res)
                        return
                    }

                    if(result.affectedRows > 0) {
                        res.json({
                            'status': '1',
                            'message': 'password change successfully'
                        })
                    }else{
                        res.json({
                            'status':'0',
                            'message':'invalid password'
                        })
                    }

                } )
            } )

        } )
    } )

    app.post('/api/contact_us', (req, res) => {
        helper.Dlog(req.body)
        var reqObj =  req.body
        helper.CheckParameterValid(res, reqObj, ["name", "email", "subject", "message"], () => {

            db.query("INSERT INTO `contact_us_detail` (`name`, `email`, `subject`, `message`) VALUES (?,?,?, ?) ", [ reqObj.name, reqObj.email, reqObj.subject, reqObj.message ], (err, result) => {

                if(err) {
                    helper.ThrowHtmlError(err, res)
                    return;
                }

                if(result) {
                    res.json({
                        'status':'1',
                        'message':'message send successfully'
                    })
                }else{
                    res.json({
                        'status': '0',
                        'message': 'message send fail'
                    })
                }

            } )

        })

    } )

    app.post('/api/admin/user_list', (req, res) => {
        helper.Dlog(req.body)
        checkAccessToken(req.headers, res, (uObj) => {
            db.query("SELECT `ud`.`user_id`, `ud`.`name`, `ud`.`email`, `ud`.`gender`, `ud`.`mobile`, `ud`.`mobile_code`, `ud`.`user_type`, `ud`.`device_source`, `ud`.`zone_id`, `ud`.`is_block`, (CASE WHEN `ud`.`image` != '' THEN CONCAT('" + helper.ImagePath() + "', `ud`.`image`  ) ELSE '' END) AS `image` , `ud`.`is_online`, `ud`.`status`, `ud`.`created_date`, IFNULL( `zl`.`zone_name`, '' ) AS `zone_name` FROM `user_detail` AS `ud`" +
                "LEFT JOIN`zone_list` AS`zl` ON`zl`.`zone_id` = `ud`.`zone_id`" +
                "WHERE`user_type` = 1 ORDER BY`ud`.`user_id` DESC", [], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.length > 0) {
                        res.json({ "status": "1", "payload": result })
                    } else {
                        res.json({ "status": "0", "payload": [], "message": "no data" })
                    }
                })
        }, ut_admin)
    })

    app.post('/api/admin/driver_list', (req, res) => {
        helper.Dlog(req.body)
        checkAccessToken(req.headers, res, (uObj) => {
            db.query("SELECT `ud`.`user_id`, `ud`.`name`, `ud`.`email`, `ud`.`gender`, `ud`.`mobile`, `ud`.`mobile_code`, `ud`.`user_type`, `ud`.`device_source`, `ud`.`zone_id`, `ud`.`is_block`, (CASE WHEN `ud`.`image` != '' THEN CONCAT('" + helper.ImagePath() + "', `ud`.`image`  ) ELSE '' END) AS `image` , `ud`.`is_online`, `ud`.`status`, `ud`.`created_date`, IFNULL( `zl`.`zone_name` , '' ) AS `zone_name` FROM `user_detail` AS `ud`" +
                "LEFT JOIN`zone_list` AS`zl` ON`zl`.`zone_id` = `ud`.`zone_id`" +
                "WHERE`user_type` = 2 ORDER BY`ud`.`user_id` DESC", [], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.length > 0) {
                        res.json({ "status": "1", "payload": result })
                    } else {
                        res.json({ "status": "0", "payload": [], "message": "no data" })
                    }
                })
        }, ut_admin)
    })

    app.post('/api/admin/driver_detail', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body
        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ["user_id"], () => {
                db.query("SELECT `ud`.`user_id`, `ud`.`name`, `ud`.`email`, `ud`.`gender`, `ud`.`mobile`, `ud`.`mobile_code`, `ud`.`user_type`, `ud`.`device_source`, `ud`.`zone_id`, `ud`.`is_block`, `ud`.`image`, `ud`.`is_online`, `ud`.`status`, `ud`.`created_date`, IFNULL( `zl`.`zone_name` ) AS `zone_name` FROM `user_detail` AS `ud`" +
                    "LEFT JOIN`zone_list` AS`zl` ON`zl`.`zone_id` = `ud`.`zone_id`" +
                    "WHERE`user_type` = 2 AND `user_id` = ? ORDER BY`ud`.`user_id` DESC;" +
                    "SELECT `bank_id`, `user_id`, `account_name`, `bsb`, `account_no`, `bank_name`, `created_date`, `status` FROM `bank_detail` WHERE `user_id` = ? ", [reqObj.user_id, reqObj.user_id], (err, result) => {
                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return
                        }

                        if (result.length > 0) {
                            res.json({
                                "status": "1", "payload": {
                                    "user_info": result[0],
                                    "bank_info": result[1]
                                }
                            })
                        } else {
                            res.json({ "status": "0", "payload": [], "message": msg_invalidUser })
                        }
                    })
            })


        }, ut_admin)
    })

    app.post('/api/admin/service_add', (req, res) => {
        var form = new multiparty.Form();
        form.parse(req, (err, reqObj, files) => {
            if (err) {
                helper.ThrowHtmlError(err, res);
                return;
            }

            helper.Dlog("--------------- Parameter --------------")
            helper.Dlog(reqObj);

            helper.Dlog("--------------- Files --------------")
            helper.Dlog(files);

            checkAccessToken(req.headers, res, (uObj) => {

                helper.CheckParameterValid(res, reqObj, ["service_name", "seat", "color", "gender", "description"], () => {
                    helper.CheckParameterValid(res, files, ["icon", "top_icon"], () => {


                        var iconExtension = files.icon[0].originalFilename.substring(files.icon[0].originalFilename.lastIndexOf(".") + 1);
                        var iconName = "service/" + helper.fileNameGenerate(iconExtension);
                        var iconNewPath = imageSavePath + iconName;

                        fs.rename(files.icon[0].path, iconNewPath, (err) => {

                            if (err) {
                                helper.ThrowHtmlError(err);
                                return;
                            } else {

                                var topIconExtension = files.top_icon[0].originalFilename.substring(files.top_icon[0].originalFilename.lastIndexOf(".") + 1);
                                var topIConName = "service/" + helper.fileNameGenerate(topIconExtension);
                                var topIConNewPath = imageSavePath + topIConName;

                                fs.rename(files.top_icon[0].path, topIConNewPath, (err) => {

                                    if (err) {
                                        helper.ThrowHtmlError(err);
                                        return;
                                    } else {

                                        db.query("INSERT INTO `service_detail`(`service_name`, `seat`, `color`, `icon`, `top_icon`, `gender`, `description`) VALUES (?,?,?, ?,?,?, ?)", [
                                            reqObj.service_name[0], reqObj.seat[0], reqObj.color[0], iconName, topIConName, reqObj.gender[0], reqObj.description[0],
                                        ], (err, result) => {
                                            if (err) {
                                                helper.ThrowHtmlError(err);
                                                return;
                                            }

                                            if (result) {
                                                res.json({
                                                    "status": "1", "message": msg_success
                                                })
                                            } else {
                                                res.json({ "status": "0", "message": msg_fail })
                                            }
                                        })

                                    }
                                })


                            }
                        })
                    })
                })

            }, ut_admin)


        })
    })

    app.post('/api/admin/service_list', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body
        checkAccessToken(req.headers, res, (uObj) => {


            db.query("SELECT `service_id`, `service_name`, `seat`, `color`, (CASE WHEN `icon` != '' THEN CONCAT('" + helper.ImagePath() + "', `icon`  ) ELSE '' END) AS `icon`,  (CASE WHEN `top_icon` != '' THEN CONCAT('" + helper.ImagePath() + "', `top_icon`  ) ELSE '' END) AS `top_icon`, `gender`, `status`, `created_date`, `description` FROM `service_detail` WHERE `status` != 2 ", [], (err, result) => {
                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return
                }

                res.json({
                    "status": "1", "payload": result
                })
            })
        }, ut_admin)
    })

    app.post('/api/admin/service_document_list', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body
        checkAccessToken(req.headers, res, (uObj) => {


            db.query("SELECT `service_id`, `service_name`, `seat`, `color`, `icon`, `top_icon`, `gender`, `status`, `created_date`, `description` FROM `service_detail` WHERE `status` != 2 ;" +
                "SELECT `doc_id`, `name`, `type`, `status`, `create_date` FROM `document` WHERE `status` != 2 ", [], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    res.json({
                        "status": "1", "payload": {
                            "service": result[0],
                            "document": result[1]
                        }
                    })
                })
        }, ut_admin)
    })

    app.post('/api/admin/service_edit', (req, res) => {
        var form = new multiparty.Form();
        form.parse(req, (err, reqObj, files) => {
            if (err) {
                helper.ThrowHtmlError(err, res);
                return;
            }

            helper.Dlog("--------------- Parameter --------------")
            helper.Dlog(reqObj);

            helper.Dlog("--------------- Files --------------")
            helper.Dlog(files);

            checkAccessToken(req.headers, res, (uObj) => {

                helper.CheckParameterValid(res, reqObj, ["service_id", "service_name", "seat", "color", "gender", "description"], () => {


                    var iconName = ""
                    var topIConName = ""
                    var updateSetValue = ""
                    if (files.icon) {
                        var iconExtension = files.icon[0].originalFilename.substring(files.icon[0].originalFilename.lastIndexOf(".") + 1);
                        iconName = "service/" + helper.fileNameGenerate(iconExtension);
                        var iconNewPath = imageSavePath + iconName;
                        updateSetValue = ", `icon` = '" + iconName + "' "
                        fs.rename(files.icon[0].path, iconNewPath, (err) => {

                            if (err) {
                                helper.ThrowHtmlError(err);
                                return;
                            }
                        })
                    }

                    if (files.top_icon) {
                        var topIconExtension = files.top_icon[0].originalFilename.substring(files.top_icon[0].originalFilename.lastIndexOf(".") + 1);
                        topIConName = "service/" + helper.fileNameGenerate(topIconExtension);
                        var topIConNewPath = imageSavePath + topIConName;
                        updateSetValue = updateSetValue + ", `top_icon` = '" + topIConName + "' "
                        fs.rename(files.top_icon[0].path, topIConNewPath, (err) => {

                            if (err) {
                                helper.ThrowHtmlError(err);
                                return;
                            }
                        })

                    }



                    db.query("UPDATE `service_detail` SET `service_name`=?,`seat`=?,`color`=?,`gender`=?,`description`=? " + updateSetValue + ", `modify_date` = NOW() WHERE `service_id` = ? AND  `status` != 2 ;", [
                        reqObj.service_name[0], reqObj.seat[0], reqObj.color[0], reqObj.gender[0], reqObj.description[0],
                        reqObj.service_id[0]
                    ], (err, result) => {
                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return;
                        }

                        if (result.affectedRows > 0) {
                            db.query(
                                "SELECT `service_id`, `service_name`, `seat`, `color`, (CASE WHEN `icon` != '' THEN CONCAT('" + helper.ImagePath() + "', `icon`  ) ELSE '' END) AS `icon`,  (CASE WHEN `top_icon` != '' THEN CONCAT('" + helper.ImagePath() + "', `top_icon`  ) ELSE '' END) AS `top_icon`, `gender`, `status`, `created_date`, `description` FROM `service_detail` WHERE `service_id` = ? ", [
                                reqObj.service_id[0]
                            ], (err, result) => {

                                if (err) {
                                    helper.ThrowHtmlError(err, res);
                                    return;
                                }
                                res.json({
                                    "status": "1", "message": "service updated successfully", "payload": result[0]
                                })

                            })

                        } else {
                            res.json({ "status": "0", "message": msg_fail })
                        }
                    })
                })
            }, ut_admin)
        })
    })

    app.post('/api/admin/service_delete', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body
        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ["service_id"], () => {
                db.query("UPDATE `service_detail` SET `status`=?, `modify_date` = NOW() WHERE `service_id` = ? AND  `status` != 2 ;", ["2", reqObj.service_id], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({
                            "status": "1", "message": "service deleted successfully"
                        })
                    } else {
                        res.json({
                            "status": "0", "message": msg_fail
                        })
                    }


                })
            })

        }, ut_admin)
    })

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
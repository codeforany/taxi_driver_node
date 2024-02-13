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

    //App Api

    app.post('/api/support_user_list', (req, res) => {
        helper.Dlog(req.body);
        var reqObj =  req.body;
        checkAccessToken( req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, [ "socket_id"] , () => {

                db.query('SELECT `ud`.`user_id`, "App Support" AS `name`, (CASE WHEN `ud`.`image` != "" THEN CONCAT("' + helper.ImagePath() + '", `ud`.`image` ) ELSE "" END ) AS `image`, "" AS `message`, 0 as `message_type`, NOW() AS `created_date`, 0 AS `base_count` FROM `user_detail` AS `ud` WHERE `ud`.`user_type` = ?;' +
                
                    'SELECT `ud`.`user_id`, `ud`.`name`, (CASE WHEN `ud`.`image` != "" THEN CONCAT("' + helper.ImagePath() + '", `ud`.`image` ) ELSE "" END ) AS `image`, IFNULL(`cm`.`message` , "" ) AS `message`, IFNULL(`cm`.`message_type` , 0 ) AS `message_type`, IFNULL(`cm`.`created_date` ,   NOW() ) AS `created_date`, IFNULL(`bc`.`base_count` , 0 ) AS `base_count` FROM `user_detail` AS `ud` ' +
                    
                    'INNER JOIN (' +

                        'SELECT `created_date`, `message_type`, `message`, (CASE WHEN  `sender_id` = ? THEN `receiver_id` ELSE `sender_id` END) AS `user_id` FROM `chat_message` ' +
                        'WHERE `chat_id` IN ( SELECT MAX(`chat_id`) FROM `chat_message` WHERE `status` < "3" AND ( `sender_id` = ? OR ( `receiver_id` = ? AND `status` > "-1") ) GROUP BY (CASE WHEN `sender_id` = ? THEN `receiver_id` ELSE `sender_id` END)  ) ' +

                    ') AS `cm` ON `cm`.`user_id` = `ud`.`user_id` ' +
                    'LEFT JOIN (SELECT count(`chat_id`) AS `base_count`, `sender_id` AS `user_id` FROM `chat_message` WHERE `receiver_id` = ? AND `status` = 0 GROUP BY `sender_id` ) AS `bc` ON `cm`.`user_id` = `bc`.`user_id` ' +
                    "WHERE `ud`.`status` = 1 ORDER BY `cm`.`created_date` DESC", [ut_admin, uObj.user_id, uObj.user_id, uObj.user_id, uObj.user_id, uObj.user_id  ], (err, result) => {

                    if(err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    var adminArr = [];

                    helper.Dlog(result[1]);
                    if(result[0].length > 0) {

                       adminArr = result[1].filter( (uObj) => result[0][0].user_id == uObj.user_id);
                        
                       // chat message not found admin user
                        if (adminArr.length == 0) {
                            //insert admin support

                            result[1].unshift(result[0][0]);
                        }

                    }

                    res.json({
                        'status':"1",
                        "payload": result[1]
                    })


                } )

            } )
        } )
    } )

    app.post('/api/support_connect', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;
        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ["user_id", "socket_id"], () => {
                socket_list["us_" + uObj.user_id.toString()] = {
                    'socket_id': reqObj.socket_id
                };

                db.query('SELECT `created_date` FROM `chat_delete` WHERE `user_id` = ? AND `receiver_id` = ? ', [uObj.user_id, reqObj.user_id], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return;
                    }

                    var deleteMessageTime = "2024-01-01 00:00:00"
                    if (result.length > 0) {
                        deleteMessageTime = helper.serverMySqlDate(result[0].created_date, "YYYY-MM-DD HH:mm:ss");
                    }


                    db.query(
                        "SELECT `user_id`, `name`, `image` FROM `user_detail` WHERE `user_id` = ? ;" +
                        "SELECT `chat_id`, `sender_id`, `receiver_id`, `message`, `created_date`, `message_type` FROM `chat_message` WHERE `created_date` > ? AND ( (`sender_id` = ? AND `receiver_id` = ?) OR  (`sender_id` = ? AND `receiver_id` = ?) ); ", [reqObj.user_id, deleteMessageTime, reqObj.user_id, uObj.user_id, uObj.user_id, reqObj.user_id], (err, result) => {

                            if (err) {
                                helper.ThrowHtmlError(err, res);
                                return
                            }

                            if (result[0].length > 0) {

                                db.query("UPDATE `chat_message` SET `status` = 1, `modify_date` = NOW() WHERE `sender_id` = ? AND `receiver_id` = ? AND `status` = 0 ", [reqObj.user_id, uObj.user_id], (err, uResult) => {
                                    if (err) {
                                        helper.ThrowHtmlError(err);
                                        return
                                    }

                                    if(uResult.affectedRows > 0) {
                                        helper.Dlog("User base reset done");
                                    }else{
                                        helper.Dlog("User base reset fail");
                                    }
                                })

                                res.json(
                                    {
                                        "status": "1",
                                        "payload": {
                                            "user_info": result[0][0],
                                            "messages": result[1],
                                        }
                                    }
                                )
                            } else {
                                res.json(
                                    {
                                        "status": "0",
                                        "message": "invalid user"
                                    }
                                )
                            }
                        }
                    )
                })

            })
        })

    });

    app.post('/api/support_clear', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;
        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ["receiver_id"], () => {

                db.query('UPDATE `chat_delete` SET `created_date` = NOW() WHERE `user_id` = ? AND `receiver_id` = ? ', [uObj.user_id, reqObj.receiver_id], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return;
                    }


                    if (result.affectedRows > 0) {
                        res.json({ "status": "1", "message": msg_success });
                    } else {
                        db.query("INSERT INTO `chat_delete` (`user_id`,`receiver_id`,`created_date`) VALUES (?,?,NOW()) ", [uObj.user_id, reqObj.receiver_id], (err, result) => {

                            if (err) {
                                helper.ThrowHtmlError(err, res);
                                return;
                            }

                            if (result) {
                                res.json({ "status": "1", "message": msg_success });
                            } else {
                                res.json({ "status": "0", "message": msg_fail });
                            }
                        })
                    }
                })
            })
        })
    });

    app.post('/api/support_message', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;
        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ["receiver_id", "message", "socket_id"], () => {
                socket_list["us_" + uObj.user_id.toString()] = {
                    'socket_id': reqObj.socket_id
                };

                var createdDate = helper.serverYYYYMMDDHHmmss()

                db.query('INSERT INTO `chat_message` (`sender_id`,`receiver_id`,`message`, `message_type` ) VALUES (?,?,?, ?) ;' +
                    'SELECT `user_id`, `name`, (CASE WHEN `image` != "" THEN CONCAT("' + helper.ImagePath() + '", `image` ) ELSE "" END ) AS `image`, "" AS `message`, 0 as `message_type`, NOW() AS `created_date`, 0 AS `base_count`  FROM `user_detail` WHERE `user_id` = ? ; ', [uObj.user_id, reqObj.receiver_id, reqObj.message, "0", uObj.user_id ], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return;
                    }

                    if (result[0]) {
                        var dataMessage = {
                            "chat_id": result[0].insertId,
                            "sender_id": uObj.user_id, "receiver_id": parseInt(reqObj.receiver_id), "message": reqObj.message, "created_date": helper.isoDate(createdDate), "message_type": 0,
                        }
                        res.json({
                            "status": "1",
                            "payload": dataMessage,
                            "message": msg_success,
                        })

                        //socket send emit event calling
                        var receiverSocket = socket_list['us_' + reqObj.receiver_id];
                        if (receiverSocket && io.sockets.sockets.get(receiverSocket.socket_id)) {
                            io.sockets.sockets.get(receiverSocket.socket_id).emit("support_message", {
                                "status": "1", "payload": [dataMessage], "user_info": result[1].length > 0 ? result[1][0] : {}
                            })

                            helper.Dlog("receiverSocket emit done")
                        } else {
                            helper.Dlog("receiverSocket client not connected");
                        }

                    } else {
                        res.json({
                            "status": "0",
                            "message": msg_fail
                        })
                    }

                })

            })
        })

    });


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
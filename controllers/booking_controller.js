var db = require('./../helpers/db_helpers')
var helper = require('./../helpers/helpers')
var multiparty = require('multiparty')
var fs = require('fs');
const { duration } = require('moment-timezone');
var imageSavePath = "./public/img/"

//Booking Status

const bs_pending = 0
const bs_accept = 1
const bs_go_user = 2
const bs_wait_user = 3
const bs_start = 4
const bs_complete = 5
const bs_cancel = 6
const bs_no_driver = 7
const rideCommissionVal = 10.0

//Notification ID

const nt_id_1_new_request = "1"
const nt_id_2_accpet_request = "2"
const nt_id_3_driver_wait = "3"
const nt_id_4_ride_state = "4"
const nt_id_5_ride_complete = "5"
const nt_id_6_ride_cancel = "6"
const nt_id_7_drive_no_available = "7"

//Notification ID

const nt_t_1_new_request = "New Request"
const nt_t_2_accpet_request = "Driver Accepted"
const nt_t_3_driver_wait = "Driver is waiting"
const nt_t_4_ride_state = "Ride Started"
const nt_t_5_ride_complete = "Ride Completed"
const nt_t_6_ride_cancel = "Ride Cancelled"
const nt_t_7_drive_no_available = "No Driver available"

//User Type:
const ut_admin = 4
const ut_driver = 2
const ut_user = 1

var controllerIO;
var controllerSocketList;

const newRequestTimeABC = 15 // time in 30 min
const requestAcceptTime = 60 // time in second
const requestWaitingAcceptTime = requestAcceptTime + 5 // time in second
const userRideCancelTime = 60 * 5 // time in second

const requestPendingArray = [];
const userLocationInfoArray = {};

module.exports.controller = (app, io, socket_list) => {

    controllerIO = io;
    controllerSocketList = socket_list;

    const msg_success = "successfully";
    const msg_fail = "fail";
    const msg_invalidUser = "invalid username";
    const msg_all_ready_book = "all ready other ride scheduled booking."



    //App Api

    app.post('/api/booking_request', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;
        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ["pickup_latitude", "pickup_longitude", "pickup_address", "drop_latitude", "drop_longitude", "drop_address", "pickup_date", "payment_type", "card_id", "price_id", "est_total_distance", 'est_duration', 'amount', "service_id"], () => {

                helper.Dlog(" Date Time:  " + helper.serverDateTimeAddMin(reqObj.pickup_date, "YYYY-MM-DD HH:mm:ss", -newRequestTimeABC) + " , " + helper.serverDateTimeAddMin(reqObj.pickup_date, "YYYY-MM-DD HH:mm:ss", newRequestTimeABC));
                db.query(

                    //Check Per Pending Request  8:45 to 9:15 
                    //Booking Time = 9:00 



                    "SELECT COUNT (*) AS `booking_count` FROM `booking_detail` WHERE `user_id` = ? AND (`pickup_date` BETWEEN ? AND ?) AND `booking_status` < ? ;" +

                    "SELECT `pd`.`base_charge`, `pd`.`booking_charge`, `zl`.`tax`, `pd`.`per_km_charge`, `pd`.`per_min_charge`, `pd`.`mini_fair`, `pd`.`mini_km`, `cancel_charge` FROM `price_detail` AS `pd` INNER JOIN `zone_list` AS `zl` ON `zl`.`zone_id` = `pd`.`zone_id` WHERE `pd`.`price_id` = ? ;",




                    [uObj.user_id, helper.serverDateTimeAddMin(reqObj.pickup_date, "YYYY-MM-DD HH:mm:ss", -newRequestTimeABC), helper.serverDateTimeAddMin(reqObj.pickup_date, "YYYY-MM-DD HH:mm:ss", newRequestTimeABC), bs_complete, reqObj.price_id], (err, result) => {

                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return
                        }

                        if (result[0][0].booking_count == 0) {

                            if (result[1].length > 0) {

                                var amount = parseInt(reqObj.amount);
                                var driverAmount = '0';
                                var rideCommission = '0';
                                var taxAmount = '0';

                                // 110% 1000
                                var totalAmount = amount * 100 / (100 + parseInt(result[1][0].tax)) // 1000 * 100 / (100 + 10)


                                //10 %
                                taxAmount = (amount - totalAmount).toFixed(3); // 110% - 100% = 10% amount

                                driverAmount = ((totalAmount - parseFloat(result[1][0].booking_charge)) * (1 - (rideCommissionVal / 100.0))).toFixed(2)

                                rideCommission = parseFloat(totalAmount - driverAmount).toFixed(2)

                                helper.Dlog([

                                    reqObj.card_id, reqObj.payment_type, amount, 0,
                                    driverAmount, taxAmount, rideCommission
                                ]);

                                db.query("INSERT INTO `payment_detail` ( `card_id`, `payment_type`, `amt`, `discount_amt`, `driver_amt`, `tax_amt`, `ride_commission`,  `created_date`, `modify_date` ) VALUES (?,?,?, ?,?,?, ?,NOW(),NOW()) ", [

                                    reqObj.card_id, reqObj.payment_type, amount, 0,
                                    driverAmount, taxAmount, rideCommission
                                ], (err, pResult) => {

                                    if (err) {
                                        helper.ThrowHtmlError(err, res);
                                        return
                                    }

                                    if (pResult) {

                                        db.query(
                                            "INSERT INTO `booking_detail`( `user_id`, `pickup_lat`, `pickup_long`, `pickup_address`, `drop_lat`, `drop_long`, `drop_address`, `pickup_date`, `service_id`, `price_id`, `payment_id`, `est_total_distance`, `est_duration`,  `created_date`) VALUES (?,?,?, ?,?,?, ?,?,?,  ?,?,?, ?, NOW())", [

                                            uObj.user_id, reqObj.pickup_latitude, reqObj.pickup_longitude,

                                            reqObj.pickup_address, reqObj.drop_latitude, reqObj.drop_longitude, reqObj.drop_address, reqObj.pickup_date, reqObj.service_id, reqObj.price_id, pResult.insertId, reqObj.est_total_distance, reqObj.est_duration

                                        ], (err, result) => {

                                            if (err) {
                                                helper.ThrowHtmlError(err, res);
                                                return
                                            }

                                            if (result) {
                                                // UserBooking  Done

                                                db.query("SELECT `bd`.`booking_id`, `bd`.`driver_id`, `bd`.`user_id`, `bd`.`pickup_lat`, `bd`.`pickup_long`, `bd`.`pickup_address`, `bd`.`drop_lat`, `bd`.`drop_long`, `bd`.`drop_address`, `bd`.`pickup_date`, `bd`.`service_id`, `bd`.`price_id`, `bd`.`payment_id`, `bd`.`est_total_distance`, `bd`.`est_duration`,  `bd`.`created_date`, `bd`.`accpet_time`, `bd`.`start_time`, `bd`.`stop_time`, `bd`.`booking_status`, `bd`.`request_driver_id`, `pd`.`zone_id`, `pd`.`mini_km`, `sd`.`service_name`, `sd`.`color`, `sd`.`icon`, `ud`.`name`, `ud`.`mobile`, `ud`.`mobile_code`, `ud`.`push_token`, (CASE WHEN `ud`.`image` != ''  THEN CONCAT( '" + helper.ImagePath() + "' , `ud`.`image`  ) ELSE '' END) AS `image`, `ppd`.`amt`, `ppd`.`driver_amt`, `ppd`.`payment_type` FROM `booking_detail` AS `bd` " +
                                                    "INNER JOIN `user_detail` AS `ud` ON `ud`.`user_id` = `bd`.`user_id` " +
                                                    "INNER JOIN `price_detail` AS `pd` ON `pd`.`price_id` = `bd`.`price_id` " +
                                                    "INNER JOIN `payment_detail` AS `ppd` ON `ppd`.`payment_id` = `bd`.`payment_id` " +
                                                    "INNER JOIN `service_detail` AS `sd` ON `bd`.`service_id` = `sd`.`service_id` " +

                                                    //payment_detail
                                                    "WHERE `bd`.`booking_id` = ? AND `bd`.`booking_status` = ?",

                                                    [result.insertId, bs_pending], (err, result) => {

                                                        if (err) {
                                                            helper.ThrowHtmlError(err, res);
                                                            return
                                                        }


                                                        if (result.length > 0) {
                                                            driverNewRequestSend(result[0], (status, bookingInfo) => {

                                                                helper.Dlog("-------- new request send callback -------")
                                                                if (status == 1) {
                                                                    res.json({
                                                                        "status": "1",
                                                                        "payload": result[0],
                                                                        "message": "booking request send successfully"
                                                                    })
                                                                } else {
                                                                    res.json({
                                                                        "status": "2",
                                                                        "payload": result[0],
                                                                        "message": bookingInfo
                                                                    })
                                                                }

                                                            })

                                                        } else {
                                                            helper.Dlog("Not Booking info get")
                                                        }

                                                    })

                                            } else {
                                                res.json(
                                                    {
                                                        "status": "0",
                                                        "message": "booking fail"
                                                    }
                                                )
                                            }

                                        }
                                        )

                                    } else {
                                        res.json(
                                            {
                                                "status": "0",
                                                "message": "booking fail"
                                            }
                                        )
                                    }

                                })


                            } else {
                                res.json(
                                    {
                                        "status": "0",
                                        "message": "invalid service"
                                    }
                                )
                            }


                        } else {
                            res.json(
                                {
                                    "status": "0",
                                    "message": msg_all_ready_book
                                }
                            )
                        }
                    })


            })
        })
    })

    app.post('/api/update_location', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ["latitude", "longitude", "socket_id"], () => {
                var location = {

                    'latitude': reqObj.latitude,
                    'longitude': reqObj.longitude
                }
                socket_list["us_" + uObj.user_id.toString()] = {
                    'socket_id': reqObj.socket_id
                };

                userLocationInfoArray['us_' + uObj.user_id] = {
                    "location": location
                }
                // Tracking OP

                db.query("UPDATE `user_detail` SET `lati` = ? , `longi` = ? WHERE `user_id` = ? AND `user_type` = ? ", [
                    reqObj.latitude, reqObj.longitude, uObj.user_id, ut_driver
                ], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({
                            'status': "1",
                            "message": msg_success
                        })
                    } else {
                        res.json({
                            'status': "0",
                            "message": msg_fail
                        })
                    }
                })

            })
        })
    })

    app.post('/api/ride_request_accept', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ["booking_id", "request_token"], () => {
                db.query("SELECT `booking_status` FROM `booking_detail` WHERE `booking_id` = ? ", [reqObj.booking_id], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.length > 0) {

                        if (requestPendingArray[reqObj.request_token] == undefined || requestPendingArray[reqObj.request_token] == null) {
                            res.json({
                                "success": "2",
                                "message": "request token invalid"
                            })
                        } else {
                            if (result[0].booking_status == bs_cancel) {
                                res.json(
                                    {
                                        "success": "2",
                                        "message": "ride user cancel request"
                                    }
                                )
                            } else {
                                var otpCode = Math.floor(1000 + Math.random() * 9000);

                                db.query("UPDATE `booking_detail` AS `bd` " +
                                    "INNER JOIN  `user_detail` AS `ud` ON `bd`.`driver_id` = `ud`.`user_id` " +
                                    "INNER JOIN `user_detail` AS `rud` ON `bd`.`user_id` = `rud`.`user_id` " +
                                    "INNER JOIN `service_detail` AS `sd` ON `bd`.`service_id` = `sd`.`service_id` " +
                                    "SET `bd`.`booking_status` = '" + bs_go_user + "', `rud`.`status` = 2, `bd`.`accept_time` = NOW(), `bd`.`start_time` = NOW(), `bd`.`user_car_id` = `ud`.`car_id`, `ud`.`is_request_send` = ? , `bd`.`otp_code` = ? WHERE `bd`.`booking_id` = ? AND `bd`.`driver_id` = ? ", [2, otpCode, reqObj.booking_id, uObj.user_id
                                ], (err, result) => {
                                    if (err) {
                                        helper.ThrowHtmlError(err, res);
                                        return
                                    }

                                    if (result.affectedRows > 0) {
                                        removeRequestTokenPendingArr[reqObj.request_token];
                                        res.json({
                                            "status": "1",
                                            "message": "ride accepted successfully"
                                        })

                                        db.query("SELECT `ud`.`push_token`, `ud`.`user_id`, `bd`.`pickup_date`  FROM `booking_detail` AS `bd`" +
                                            "INNER JOIN `user_detail` AS `ud` ON `bd`.`user_id` = `bd`.`user_id` " +
                                            "WHERE `bd`.`booking_id` = ?", [reqObj.booking_id], (err, result) => {
                                                if (err) {
                                                    helper.ThrowHtmlError(err);
                                                    return
                                                }

                                                if (result.length > 0) {
                                                    var userSocket = controllerSocketList['us_' + result[0].user_id];
                                                    if (userSocket && controllerIO.sockets.sockets.get(userSocket.socket_id)) {

                                                        var response = {
                                                            "status": "1",
                                                            "payload": {
                                                                "booking_id": parseInt(reqObj.booking_id),
                                                                "booking_status": bs_accept,
                                                                "ride_cancel": userRideCancelTime
                                                            },
                                                            "message": "driver accepted your request"
                                                        }

                                                        controllerIO.sockets.sockets.get(userSocket.socket_id).emit("user_request_accept", response)
                                                    }

                                                    oneSignalPushFire('1', [result[0].push_token], nt_t_2_accpet_request, "driver ride are accepted", {
                                                        "booking_id": reqObj.booking_id,
                                                        "booking_status": bs_accept.toString(),
                                                        "ride_cancel": userRideCancelTime.toString(),
                                                        "notification_id": nt_id_2_accpet_request
                                                    })

                                                }
                                            }
                                        )

                                    } else {
                                        res.json(
                                            {
                                                "success": "0",
                                                "message": msg_fail
                                            }
                                        )
                                    }
                                })
                            }
                        }


                    } else {
                        res.json({
                            "success": "0",
                            "message": msg_fail
                        })
                    }
                })
            })
        }, ut_driver)

    })

    app.post('/api/ride_request_decline', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ["booking_id", "request_token"], () => {
                if (requestPendingArray[reqObj.request_token] == undefined || requestPendingArray[reqObj.request_token] == null) {
                    res.json({
                        "success": "2",
                        "message": "request token invalid"
                    })
                } else {
                    db.query("UPDATE `user_detail` SET `is_request_send` = ? WHERE `user_id` = ? ", [0, uObj.user_id], (err, result) => {
                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return
                        }

                        if (result.affectedRows > 0) {
                            removeRequestTokenPendingArr(
                                reqObj.request_token
                            );
                            res.json({
                                "status": "1",
                                "message": "ride request accept successfully"
                            })

                            driverNewRequestSendByBookingID(reqObj.booking_id);

                        } else {
                            res.json({
                                "status": "0",
                                "message": msg_fail
                            })
                        }
                    })
                }
            })
        }, ut_driver)

    })

    app.post('/api/driver_cancel_ride', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;
        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ["booking_id", "booking_status"], () => {
                if (reqObj.booking_status == bs_wait_user || reqObj.booking_status == bs_go_user) {
                    userRideCancel(reqObj.booking_id, reqObj.booking_status, uObj.user_id, ut_driver, false, (resObj) => {
                        res.json(resObj)
                    })
                } else {
                    res.json({
                        "success": "0",
                        "message": "Not Ride Cancelled! Only Recall Ride is available before starting of ride"
                    })
                }
            })
        }, ut_driver)
    })

    app.post('/api/user_cancel_ride', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;
        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ["booking_id", "booking_status"], () => {
                userRideCancel(reqObj.booking_id, reqObj.booking_status, uObj.user_id, ut_user, false, (resObj) => {
                    res.json(resObj)
                })
            })
        }, ut_user)
    })

    app.post('/api/user_cancel_ride_force', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;
        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ["booking_id", "booking_status"], () => {
                userRideCancel(reqObj.booking_id, reqObj.booking_status, uObj.user_id, ut_user, true, (resObj) => {
                    res.json(resObj)
                })
            })
        }, ut_user)
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

function driverNewRequestSend(bookingDetail, callback) {
    //`bd`.`pickup_lat`, `bd`.`pickup_long`,
    var latitude = parseFloat(bookingDetail.pickup_lat)
    var longitude = parseFloat(bookingDetail.pickup_long)

    helper.findNearByLocation(latitude, longitude, 20, (minLat, maxLat, minLng, maxLng) => {
        var allReadySendRequest = bookingDetail.request_driver_id
        if (allReadySendRequest == "") {
            allReadySendRequest = "''"
        }


        db.query(
            "SELECT `ud`.`user_id`, `ud`.`device_source`, `ud`.`push_token`, `ud`.`lati`, `ud`.`longi` FROM `user_detail` AS `ud` " +
            "INNER JOIN `zone_document` AS `zd` ON `zd`.`zone_id` = `ud`.`zone_id` AND `zd`.`service_id` = ? AND FIND_IN_SET(`zd`.`service_id`, `ud`.`select_service_id`) != 0 " +
            "INNER JOIN `price_detail` AS `pm` ON `pm`.`zone_id` = `zd`.`zone_id` AND `pm`.`price_id` = ?  " +
            "INNER JOIN `zone_wise_cars_service` AS `zwcs` ON `ud`.`car_id` = `zwcs`.`user_car_id` AND `zwcs`.`zone_doc_id` = `zd`.`zone_doc_id` " +
            "WHERE `ud`.`user_type` = 2 AND `ud`.`status` >= 1 AND `ud`.`is_request_send` = 0 AND `zwcs`.`expiry_date` >= ? AND `zwcs`.`status` = 1 AND `zwcs`.`service_provide` = 1 AND (`ud`.`lati` BETWEEN " + minLat + " AND " + maxLat + " ) AND (`ud`.`longi` BETWEEN " + minLng + " AND " + maxLng + " ) AND `ud`.`user_id` NOT IN (" + allReadySendRequest + " ) AND `ud`.`user_id` NOT IN (SELECT `driver_id` FROM `booking_detail` WHERE `pickup_date` BETWEEN ? AND ? AND `booking_status` < ? GROUP BY user_id  );  ", [bookingDetail.service_id, bookingDetail.price_id, helper.serverMySqlDate(bookingDetail.pickup_date, "YYYY-MM-DD"), helper.serverMySqlDate(bookingDetail.pickup_date, "YYYY-MM-DD HH:mm:ss"), helper.serverDateTimeAddMin(bookingDetail.pickup_date, "YYYY-MM-DD HH:mm:ss", newRequestTimeABC), bs_complete], (err, result) => {

                if (err) {
                    helper.ThrowHtmlError(err);
                    return
                }

                if (result.length > 0) {

                    result.forEach((driverInfo, index) => {
                        result[index].distance = helper.distance(latitude, longitude, driverInfo.lati, driverInfo.longi);
                    });

                    for (var i = 0; i < result.length; i++) {
                        for (var j = i; j < result.length; j++) {
                            if (result[i].distance > result[j].distance) {
                                result.swap(i, j)
                            }
                        }
                    }

                    //Driver List New Request Send Logic
                    //Driver For only Live Socket

                    for (var i = 0, len = result.length; i < len; i++) {

                        var driverSocket = controllerSocketList['us_' + result[0].user_id];
                        if (driverSocket && controllerIO.sockets.sockets.get(driverSocket.socket_id)) {

                            //Driver Push Notification Fire Logic

                            driverSendRequestFire(bookingDetail, result[i], true)

                            var response = {
                                "status": "1",
                                "payload": [bookingDetail]
                            }

                            controllerIO.sockets.sockets.get(driverSocket.socket_id).emit("new_ride_request", response)
                            return callback(1, bookingDetail);

                        } else {
                            helper.Dlog("driverSocket client not connected");
                            helper.Dlog(result[i]);
                        }

                    }

                    //Driver not live socket then New Request SendNear by first driver only notification
                    helper.Dlog("new request push notification fire");
                    driverSendRequestFire(bookingDetail, result[0], true)
                    return callback(1, bookingDetail)

                } else {
                    //no Driver Available
                    helper.Dlog(" No Driver Available : " + bookingDetail.accept_driver_id)

                    if (bookingDetail.accept_driver_id != undefined && bookingDetail.accept_driver_id != "") {
                        //Recall Driver Not Driver Found
                        db.query("UPDATE `booking_detail` SET `driver_id` = `accept_driver_id` WHERE `booking_id` = ? ", [bookingDetail.booking_id], (err, result) => {
                            if (err) {
                                helper.ThrowHtmlError(err);
                                return
                            }

                            if (result.affectedRows > 0) {
                                helper.Dlog("Recall Driver Near info not Driver available")
                            } else {
                                helper.Dlog("Recall Driver Near info not Driver available")
                            }

                            return callback(2, "recall driver not available")
                        })
                    } else {
                        //New Booking Request
                        db.query("UPDATE `booking_detail` SET `booking_status` = ?, `stop_time` = NOW() WHERE `booking_id` = ?", [bs_no_driver, bookingDetail.booking_id], (err, result) => {

                            if (err) {
                                helper.ThrowHtmlError(err);
                                return
                            }

                            if (result.affectedRows > 0) {
                                helper.Dlog("Booking Status " + bs_no_driver);
                                helper.Dlog("Near info not Driver available")
                            } else {
                                helper.Dlog("Near info not Driver available")
                            }

                            // user ride refund amount

                            return callback(2, "driver not available")
                        })
                    }

                }
            }
        )

    })

    //Driver Api



}

function driverSendRequestFire(bookingDetail, driverDetail, isSendNotification) {
    var requestToken = helper.createRequestToken()
    helper.Dlog(" --------- Request Token Create -------------");

    bookingDetail.driver_id = driverDetail.user_id;
    bookingDetail.request_token = requestToken;
    bookingDetail.request_accpet_time = requestAcceptTime

    var allReadySendRequest = bookingDetail.request_driver_id
    if (allReadySendRequest == "") {
        allReadySendRequest = driverDetail.user_id.toString()

    } else {
        allReadySendRequest = allReadySendRequest + ',' + driverDetail.user_id.toString()
    }

    db.query("UPDATE `booking_detail` SET `driver_id` = ?, `request_driver_id` = ? WHERE `booking_id` = ? ; " +
        "UPDATE `user_detail` SET `is_request_send` = ? WHERE `user_id` = ? ", [driverDetail.user_id, allReadySendRequest, bookingDetail.booking_id, '1', driverDetail.user_id], (err, result) => {
            if (err) {
                helper.ThrowHtmlError(err);
                return
            }

            helper.Dlog(" token:- " + requestToken + " d_id:-" + driverDetail.user_id);
            helper.Dlog(result);

            if (result[0].affectedRows > 0 && result[1].affectedRows > 0) {
                //DB Update Done
                helper.Dlog("DB Booking detail Update Successfully")

                // Corn Create Request => Get Feedback (accept, decline, timeout)
                driverSendRequestTimeOver(bookingDetail.booking_id, bookingDetail.driver_id, requestToken, requestWaitingAcceptTime)
            } else {
                //fail
                helper.Dlog("DB Booking detail Update fail")
            }

        })

    if (isSendNotification) {

        //`bd`.`drop_lat`, `bd`.`drop_long`, `bd`.`drop_address`, `bd`.`pickup_date`, `bd`.`service_id`, `bd`.`price_id`, `bd`.`payment_id`, `bd`.`est_total_distance`, `bd`.`est_duration`,  `bd`.`created_date`, `bd`.`accpet_time`, `bd`.`start_time`, `bd`.`stop_time`, `bd`.`booking_status`, `bd`.`request_driver_id`, `pd`.`zone_id`, `pd`.`mini_km`, `sd`.`service_name`, `sd`.`color`, `sd`.`icon`, `ud`.`name`, `ud`.`mobile`, `ud`.`mobile_code`, `ud`.`push_token`, (CASE WHEN `ud`.`image` != ''  THEN CONCAT( '" + helper.ImagePath() + "' , `ud`.`image`  ) ELSE '' END) AS `image`, `ppd`.`amt`, `ppd`.`amt`, `ppd`.`payment_type`
        // OneSignal Push
        oneSignalPushFire(ut_driver, [driverDetail.push_token], nt_t_1_new_request, 'pickup location: ' + bookingDetail.pickup_address, {
            "booking_id": bookingDetail.booking_id,
            "request_token": requestToken,
            "service_name": bookingDetail.service_name,
            "color": bookingDetail.color,
            "name": bookingDetail.name,
            "pickup_date": helper.isoDate(helper.serverMySqlDate(bookingDetail.pickup_date)),
            "pickup_lat": bookingDetail.pickup_lat,
            "pickup_long": bookingDetail.pickup_long,
            "pickup_date": helper.isoDate(helper.serverMySqlDate(bookingDetail.pickup_date)),
            "drop_lat": bookingDetail.pickup_lat,
            "drop_long": bookingDetail.pickup_long,
            "pickup_address": bookingDetail.pickup_address,
            "drop_address": bookingDetail.drop_address,
            "amt": bookingDetail.amt,
            "payment_type": bookingDetail.payment_type,
            "notification_id": nt_id_1_new_request,

            "est_total_distance": bookingDetail.est_total_distance, "est_duration": bookingDetail.est_duration,
            "pickup_accpet_time": bookingDetail.request_accpet_time,
            "request_time_out": helper.serverDateTimeAddMin(bookingDetail.request_accpet_time),

        });

    }

}

function driverSendRequestTimeOver(bookingId, driverId, requestToken, time) {

    var oneTimeCron = setTimeout(() => {
        helper.Dlog(" -------------- oneTime Cron Request Accept TimeOver(" + time + ")");
        db.query("UPDATE `user_detail` SET `is_request_send` = ? WHERE `user_id` = ? ", ['0', driverId], (err, result) => {
            if (err) {
                helper.ThrowHtmlError(err);
                return
            }

            if (result.affectedRows > 0) {
                helper.Dlog("Driver id change success : " + driverId);
                // Find New Driver And Send Request this booking id

                driverNewRequestSendByBookingID(bookingId);

            } else {
                helper.Dlog("Driver id change fail: " + driverId);
            }
            removeRequestTokenPendingArr(requestToken);
        })
    }, time * 1000)
    requestPendingArray[requestToken] = oneTimeCron;

}

function removeRequestTokenPendingArr(token) {
    clearTimeout(requestPendingArray[token]);
    delete requestPendingArray[token];
    helper.Dlog("Delete Request Token: " + token);
    helper.Dlog(requestPendingArray);
}

function driverNewRequestSendByBookingID(bookingID) {
    helper.Dlog("---------------- Other Driver Request Send Processing -----------------")
    db.query("SELECT `bd`.`booking_id`, `bd`.`driver_id`, `bd`.`user_id`, `bd`.`pickup_lat`, `bd`.`pickup_long`, `bd`.`pickup_address`, `bd`.`drop_lat`, `bd`.`drop_long`, `bd`.`drop_address`, `bd`.`pickup_date`, `bd`.`service_id`, `bd`.`price_id`, `bd`.`payment_id`, `bd`.`est_total_distance`, `bd`.`est_duration`,  `bd`.`created_date`, `bd`.`accpet_time`, `bd`.`start_time`, `bd`.`stop_time`, `bd`.`booking_status`, `bd`.`request_driver_id`, `pd`.`zone_id`, `pd`.`mini_km`, `sd`.`service_name`, `sd`.`color`, `sd`.`icon`, `ud`.`name`, `ud`.`mobile`, `ud`.`mobile_code`, `ud`.`push_token`, (CASE WHEN `ud`.`image` != ''  THEN CONCAT( '" + helper.ImagePath() + "' , `ud`.`image`  ) ELSE '' END) AS `image`, `ppd`.`amt`, `ppd`.`driver_amt`, `ppd`.`payment_type` FROM `booking_detail` AS `bd` " +
        "INNER JOIN `user_detail` AS `ud` ON `ud`.`user_id` = `bd`.`user_id` " +
        "INNER JOIN `price_detail` AS `pd` ON `pd`.`price_id` = `bd`.`price_id` " +
        "INNER JOIN `payment_detail` AS `ppd` ON `ppd`.`payment_id` = `bd`.`payment_id` " +
        "INNER JOIN `service_detail` AS `sd` ON `sd`.`service_id` = `bd`.`service_id` " +
        "WHERE `bd`.`booking_id` = ? AND ( `bd`.`booking_status` = ? OR (`bd`.`booking_status` < ? AND `bd`.`accept_driver_id` != '')) ",

        [bookingID, bs_pending, bs_start], (err, result) => {

            if (err) {
                helper.ThrowHtmlError(err);
                return
            }


            if (result.length > 0) {
                driverNewRequestSend(result[0], (status, bookingInfo) => {

                    if (status == 2) {

                        if (result[0].accept_driver_id == "") {
                            //New Booking Request No Driver Found

                            var userSocket = controllerSocketList['us_' + result[0].user_id];
                            if (userSocket && controllerIO.sockets.sockets.get(userSocket.socket_id)) {

                                var response = {
                                    "status": "1",
                                    "payload": {
                                        "booking_id": bookingID,
                                        "booking_status": bs_no_driver,
                                    },
                                    "message": "driver not available"
                                }

                                controllerIO.sockets.sockets.get(userSocket.socket_id).emit("driver_not_available", response)

                            }

                        } else {
                            //Recall Driver Not Found

                            var driverSocket = controllerSocketList['us_' + result[0].accept_driver_id];
                            if (driverSocket && controllerIO.sockets.sockets.get(driverSocket.socket_id)) {

                                var response = {
                                    "status": "1",
                                    "payload": {
                                        "booking_id": bookingID,
                                        "booking_status": bs_no_driver,
                                    },
                                    "message": "Recall driver not available"
                                }

                                controllerIO.sockets.sockets.get(driverSocket.socket_id).emit("driver_not_available", response)

                            }

                            db.query("SELECT `user_id`, `push_token` FROM `user_detail` WHERE `user_id` = ? ", [bookingInfo.accept_driver_id], (err, result) => {
                                if (err) {
                                    helper.ThrowHtmlError(err)
                                    return;
                                }

                                if (result.length > 0) {
                                    oneSignalPushFire(ut_driver, [result[0].push_token], nt_t_7_drive_no_available, "Recall driver not available", {

                                        "booking_id": bookingInfo.booking_id,
                                        "notification_id": nt_id_7_drive_no_available,
                                    })
                                }
                            })
                        }



                    }

                })

            } else {
                helper.Dlog("Not Booking info get")
            }

        })
}

function userRideCancel(booking_id, booking_status, user_id, user_type, isForce, callback) {
    var rideCancelTime = helper.serverYYYYMMDDHHmmss()
    var id = "user_id"
    var checkTime = "accept_time"
    var response = "";
    var isDriverCancel = '0';

    if (user_type == ut_driver) {
        id = "driver_id"
        checkTime = "start_time"
        isDriverCancel = "1"
    }

    var condition = ""

    if (isForce) {
        condition = ""
    } else {
        condition = " AND `bd`.`booking_status` = '" + booking_status + "' ";
    }

    var sql = ""

    if (booking_status == bs_go_user || booking_status == bs_wait_user) {
        sql = "UPDATE `booking_detail` AS `bd`" +
            "INNER JOIN `user_detail` AS `ud` ON `bd`.`driver_id` = `ud`.`user_id` " +
            "INNER JOIN `user_detail` AS `uud` ON `bd`.`user_id` = `ud`.`user_id` " +
            "SET `bd`.`booking_status` = ?, `bd`.`is_driver_cancel` = ?, `bd`.`stop_time` = NOW(), `ud`.`status` = '1', `uud`.`status` = '1' " +
            "WHERE `bd`.`booking_id` = ? AND `bd`.`" + id + "` = ? AND `bd`.`booking_status` = < ? " + condition;
    } else {
        sql = "UPDATE `booking_detail` AS `bd`" +
            "SET `bd`.`booking_status` = ?, `bd`.`is_driver_cancel` = ?, `bd`.`stop_time` = NOW() " +
            "WHERE `bd`.`booking_id` = ? AND `bd`.`" + id + "` = ? AND `bd`.`booking_status` = < ? " + condition;
    }

    helper.Dlog(sql);
    db.query(sql, [bs_cancel, isDriverCancel, booking_id, user_id, isForce ? "8" : booking_start], (err, result) => {
        if (err) {
            helper.ThrowHtmlError(err);
            return
        }

        if (result.affectedRows > 0) {
            if (booking_status > bs_pending) {
                //Accepted

                // Booking Info need
                //Socket.io  
                bookingInformation(booking_id, user_type, (status, result) => {
                    if (status == 1) {

                        helper.timeDuration(rideCancelTime, helper.serverMySqlDate(result[0][checkTime]), (totalMin, durationString) => {

                            if (booking_status >= bs_go_user && booking_status <= bs_wait_user) {
                                // User taking Remove All
                            }

                            var emit = "user_cancel_ride"
                            var driverSocket;
                            var notificationType = ut_driver
                            var noti_message = nt_t_6_ride_cancel

                            if (user_type == 2) {
                                emit = "driver_cancel_ride"
                                driverSocket = controllerSocketList['us_' + result[0].user_id];
                                notificationType = ut_user
                                var noti_message = nt_t_6_ride_cancel
                            } else {
                                var driverSocket = controllerSocketList['us_' + result[0].driver_id];
                            }

                            response = {
                                'status': "1",
                                "payload": {
                                    "booking_id": parseInt(booking_id),
                                    "booking_status": bs_cancel,
                                },
                                "message": noti_message
                            }

                            if (driverSocket && controllerIO.sockets.sockets.get(driverSocket.socket_id)) {

                                controllerIO.sockets.sockets.get(driverSocket.socket_id).emit(emit, response)
                                helper.Dlog("Ride Cancel Node Notification send -----" + emit)
                            } else {
                                helper.Dlog("Ride Cancel Node Notification User not connect -----" + emit)
                            }

                            oneSignalPushFire(notificationType, [result[0].push_token], nt_t_6_ride_cancel, noti_message, {
                                "booking_id": parseInt(booking_id).toString(),
                                "booking_status": bs_cancel.toString(),
                                "notification_id": nt_id_6_ride_cancel
                            })

                            return callback({
                                "status": "1", "message": "Ride Cancel successfully", "payload": {
                                    "booking_id": parseInt(booking_id),
                                    "booking_status": bs_cancel,
                                }
                            })

                        })

                    } else {
                        return callback({
                            "status": "0", "message": "ride cancel fail"
                        })
                    }
                })

                return callback({
                    "status": "1", "message": "Ride Cancel successfully", "payload": {
                        "booking_id": parseInt(booking_id),
                        "booking_status": bs_cancel,
                    }
                })

            } else {
                //Ride Not Accepted
                return callback({
                    "status": "1", "message": "Ride Cancel successfully", "payload": {
                        "booking_id": parseInt(booking_id),
                        "booking_status": bs_cancel,
                    }
                })
            }

        } else {
            return callback({
                "status": "0",
                "message": "ride cancel fail"
            })
        }
    })

}

function bookingInformation(booking_id, user_type, callback) {
    var userId = "user_id"

    switch (user_type) {
        case 1, '1':
            userId = "driver_id"
            break;
        case 2, '2':
            userId = "user_id"
            break;
        default:
            serId = "driver_id"
            break;
    }

    db.query("SELECT `bd`.*, `sd`.*, `pd`. *, `pm`.*, `zl`.*, `ud`.`name`, `ud`.`gender`, `uud`.`email`, `ud`.`mobile`, `ud`.`lati`, `ud`.`longi`, `ud`.`user_type`, `ud`.`push_token`, `cs`.`series_name`, `cm`.`model_name`, `cb`.`brand_name`, `ucd`.`car_number`, `pd`.`status` AS `payment_status` FROM `booking_detail`AS `bd` " +

        "INNER JOIN `user_detail` AS `ud` ON `ud`.`user_id` = `bd`.`'" + userId + "` " +
        "INNER JOIN `user_detail` AS `uud` ON `ud`.`user_id` = `bd`.`user_id` " +
        "INNER JOIN `service_detail` AS `sd` ON `sd`.`service_id` = `bd`.`service_id` " +
        "INNER JOIN `payment_detail` AS `pd` ON `pd`.`payment_id` = `bd`.`payment_id` " +
        "INNER JOIN `price_detail` AS `pm` ON `pm`.`price_id` = `bd`.`price_id`" +
        "INNER JOIN `zone_list` AS `zl` ON `pm`.`zone_id` = `zl`.`zone_id` " +
        "LEFT JOIN `user_car_detail` AS `ucd` ON `ucd`.`user_car_id` = `bd`.`user_car_id` " +
        "LEFT JOIN `car_series` AS `cs` ON `cs`.`series_id` = `ucd`.`series_id`  " +
        "LEFT JOIN `car_model` AS `cm` ON `cm`.`model_id` = `cs`.`model_id` " +
        "LEFT JOIN `car_brand` AS `cb`ON `cb`.`brand_id` = `cs`.`brand_id` " +
        "WHERE `bd`.`booking_id` IN (" + booking_id + ")", [], (err, result) => {
            if (err) {
                helper.ThrowHtmlError(err);
                return
            }

            if (result.length > 0) {
                return callback(1, result)
            } else {
                return callback(0, "No Booking Information")
            }

        });

}

function oneSignalPushFire(userType, token, title, message, messageDate = {}) {

}
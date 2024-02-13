var moment = require('moment-timezone');
var fs = require('fs');
const { format } = require('path');

const app_debug_mode = true;
const timezone_name = "Asia/Kolkata";
const msg_server_internal_error = "Server Internal Error"

module.exports = {

    ImagePath:() => {
        return "http://localhost:3001/img/";
    },

    ThrowHtmlError: (err, res) => {

        Dlog("---------------------------- App is Helpers Throw Crash(" + serverYYYYMMDDHHmmss() + ") -------------------------" )
        Dlog(err.stack);

        fs.appendFile('./crash_log/Crash' + serverDateTime('YYYY-MM-DD HH mm ss ms') + '.txt', err.stack, (err) => {
            if(err) {
                Dlog(err);
            }
        })

        if(res) {
            res.json({'status': '0', "message": msg_server_internal_error  })
            return
        }
    },

    ThrowSocketError: (err, client, eventName ) => {

        Dlog("---------------------------- App is Helpers Throw Crash(" + serverYYYYMMDDHHmmss() + ") -------------------------")
        Dlog(err.stack);

        fs.appendFile('./crash_log/Crash' + serverDateTime('YYYY-MM-DD HH mm ss ms') + '.txt', err.stack, (err) => {
            if (err) {
                Dlog(err);
            }
        })

        if (client) {
            client.emit(eventName, { 'status': '0', "message": msg_server_internal_error } )
            return
        }
    },

    CheckParameterValid: (res, jsonObj, checkKeys, callback) => {

        var isValid = true;
        var missingParameter = "";

        checkKeys.forEach( (key, indexOf)  => {
            if(!Object.prototype.hasOwnProperty.call(jsonObj, key)) {
                isValid = false;
                missingParameter += key + " ";
            }
        });


        if(!isValid) {

            if(!app_debug_mode) {
                missingParameter = "";
            }
            res.json({ 'status': '0', "message": "Missing parameter (" + missingParameter +")"  })
        }else{
            return callback()
        }
    },

    CheckParameterValidSocket: (client, eventName, jsonObj, checkKeys, callback) => {

        var isValid = true;
        var missingParameter = "";

        checkKeys.forEach((key, indexOf) => {
            if (!Object.prototype.hasOwnProperty.call(jsonObj, key)) {
                isValid = false;
                missingParameter += key + " ";
            }
        });


        if (!isValid) {

            if (!app_debug_mode) {
                missingParameter = "";
            }
            client.emit(eventName, { 'status': '0', "message": "Missing parameter (" + missingParameter + ")" })
        } else {
            return callback()
        }
    },

    createRequestToken: () => {
        var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        var result = '';
        for (let i = 20; i > 0; i--) {
            result += chars[Math.floor(Math.random() * chars.length)];

        }

        return result;
    },

    fileNameGenerate: (extension) => {
        var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        var result = '';
        for (let i = 10; i > 0; i--) result += chars[Math.floor(Math.random() * chars.length)];
        return serverDateTime('YYYYMMDDHHmmssms') + result + '.' + extension;
    },

    Dlog: (log) => {
        return Dlog(log);
    },

    serverDateTime:(format) => {
        return serverDateTime(format);
    },

    serverMySqlDate: (date, format = 'YYYY-MM-DD HH:mm:ss' ) => {
        return serverDateTimeFormat(date, format);
    },

    serverYYYYMMDDHHmmss:()=>{
        return serverYYYYMMDDHHmmss();
    },

    isoDate:(date) => {
        return moment.tz(date, 'YYYY-MM-DD HH:mm:ss', timezone_name ).toISOString();
    },
    //serverDateTimeAddMin(bookingDetail.pickup_date, "YYYY-MM-DD HH:mm:ss", newRequestTimeABC)
    serverDateTimeAddMin: (date, format = 'YYYY-MM-DD HH:mm:ss', add_minutes = 0 ) => {
        var jun = moment(new Date(date)).add(add_minutes, 'm');
        jun.tz(timezone_name).format();
        //Dlog("server_datetime_add_minutes :- " + jun.format(format));
        return jun.format(format);;
    },
    findNearByLocation: (lat, long, radius_km, callback) => {
        var latitude = parseFloat(lat);
        var longitude = parseFloat(long);
        var distance_find = parseFloat(radius_km); // value is km convent 1 miles = 1.60934 km
        //Dlog("latitude : " + latitude+ "longitude : "+longitude +"distance_find : " +distance_find);
        var radius = 6371;
        var maxlat = latitude + ((distance_find / radius) * 180 / Math.PI);
        var minlat = latitude - ((distance_find / radius) * 180 / Math.PI);
        var maxlng = longitude + ((distance_find / radius / Math.cos(latitude * Math.PI / 180)) * 180 / Math.PI);
        var minlng = longitude - ((distance_find / radius / Math.cos(latitude * Math.PI / 180)) * 180 / Math.PI);
        Dlog("minlat : " + minlat + "minmaxlatlat : " + maxlat + "minlng : " + minlng + "maxlng : " + maxlng);
        return callback(minlat, maxlat, minlng, maxlng);
    },

    distance: (lat1, lon1, lat2, lon2) => {
        return distance(lat1, lon1, lat2, lon2);
    },

    timeDuration:(date1, date2, callback) => {
        var now = moment(date1);
        var end = moment(date2);
        var duration = moment.duration(now.diff(end));
        var totalMin = duration.asMinutes();
        var durationString = moment.utc(duration.asMilliseconds()).format("mm:ss")
        if(totalMin > 60) {
            durationString = moment.utc(duration.asMilliseconds()).format("HH:mm:ss")
        }
        return callback(totalMin, durationString)

    }

}


function serverDateTime(format) {
    var jun = moment(new Date());
    jun.tz(timezone_name).format();
    return jun.format(format);
}

function serverDateTimeFormat(date,format) {
    var jun = moment(date);
    jun.tz(timezone_name).format();
    return jun.format(format);
}

function Dlog(log) {
    if (app_debug_mode) {
        console.log(log);
    }
}

function serverYYYYMMDDHHmmss() {
    return serverDateTime('YYYY-MM-DD HH:mm:ss');
}

function distance(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * parseFloat(lat1) / 180;
    var radlat2 = Math.PI * parseFloat(lat2) / 180;
    var theta = parseFloat(lon1) - parseFloat(lon2);
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;
    //Dlog(dist);
    if (isNaN(dist)) {
        //Dlog("Nan :- "+lat1+","+lon1+","+lat2+","+lon2+",");
        dist = 0;
    }
    //Dlog("dist :-"+dist);
    return dist;
}

process.on('uncaughtException', (err) => {

})
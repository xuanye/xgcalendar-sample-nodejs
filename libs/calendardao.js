var pg      = require('pg');

function GetConnection()
{
    var config ;
   
    config = {
                host:"ec2-54-247-175-38.eu-west-1.compute.amazonaws.com",
                database:"d7ot1oli315mal",
                user:"fwhkvbfknfgrqq",
                port:5432,
                password:"FSA5y28Xaiw7Qv_kl40qZsCO1p",
                ssl:true
    };
   
    /*
    else
    {
        config ={
                    host:"192.168.57.186",
                    database:"xgcalendar",
                    user:"pguser",
                    port:5432,
                    password:"cjchnws"                    
                };
    }
   */
   
    console.log(config);
    var db = new pg.Client(config);
    return db;
}

exports.GetCalendar = function(id,userid,datacb,errcb) {
    var db  = GetConnection(true);
    db.connect();
    var sql = "SELECT * FROM calendar where \"Id\"=$1 and \"UPAccount\"=$2 order by \"StartTime\",\"EndTime\"";
    db.query(sql,[id,userid],
        function(err,r){ //数据放回来
            db.end();
            if(err)
            {
                console.log(err);
                if(errcb)
                {
                    errcb(err);
                }
                return;
            }          
            if(r  && r.rows && datacb)
            {        
                if(datacb)
                    datacb(r.rows);                
            }
           
    });
    //console.log(q.sql);
}
exports.QueryCalendar = function(qstart,qend,userId,zonediff,datacb,errcb) {
    var db  = GetConnection(true);
    db.connect();
    var sql = "SELECT * FROM calendar where \"StartTime\"<$2 and \"EndTime\">$1 and \"UPAccount\"=$3 order by \"StartTime\",\"EndTime\"";
    db.query(sql,[qstart,qend,userId],
        function(err,r){ //数据放回来
            db.end();
            if(err)
            {
                console.log(err);
                if(errcb)
                {
                    errcb(err);
                }
                return;
            }          
            if(r && r.rows && datacb)
            {        
                if(datacb)
                    datacb(r.rows);                
            }
           
    });
    //console.log(q.sql);
}
exports.addCalendar = function(calendar,cb,errcb){
    var db = GetConnection(true);
    db.connect();
    var sql = "INSERT INTO calendar"+
        "(\"Subject\",\"Location\",\"MasterId\",\"Description\",\"CalendarType\",\"StartTime\",\"EndTime\""+
    ",\"IsAllDayEvent\",\"HasAttachment\",\"Category\",\"InstanceType\",\"Attendees\",\"AttendeeNames\""+
    ",\"OtherAttendee\",\"UPAccount\",\"UPName\",\"UPTime\",\"RecurringRule\",\"Id\") "+
    "VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) "
    //console.log(calendar);
    db.query(sql,[calendar.Subject,calendar.Location,calendar.MasterId,calendar.Description,
        calendar.CalendarType,calendar.StartTime,calendar.EndTime,calendar.IsAllDayEvent?1:0,
        calendar.HasAttachment?1:0,calendar.Category,calendar.InstanceType,calendar.Attendees,
        calendar.AttendeeNames,calendar.OtherAttendee,calendar.UPAccount,calendar.UPName,
        calendar.UPTime,calendar.RecurringRule,calendar.Id],function(err,result){
        db.end();
        if(err)
        {
            console.log(err);
            if(errcb)
            {
                errcb(err);
            }
            return;
        }
        if(cb)
        {
            cb();
        }
    });
   //console.log(q.sql);
}
exports.UpdateCalendar = function(id,userid,calendar,cb,errcb){
    var db = GetConnection();
    db.connect(); 
    var sqlupdate_h= "UPDATE calendar SET ";
    var sqlupdate_f= " WHERE \"Id\"='"+id+"' and \"UPAccount\"='"+userid+"'";
    var arrsql = [];
    var arrparams = [];   
    for(var p in calendar){
        arrsql.push(" \""+p+"\"=$"+(arrsql.length+1));
        if(p == "IsAllDayEvent" || p=="HasAttachment"){
            arrparams.push(calendar[p]?1:0);
        }
        else{
            arrparams.push(calendar[p]);
        }
    }
    var sql = sqlupdate_h + arrsql.join(",") +sqlupdate_f;
   // console.log(sql);
   // console.log(arrparams);
    db.query(sql,arrparams,function(err,result){
        db.end();
        if(err)
        {
            console.log(err);
            if(errcb)
            {
                errcb(err);
            }
            return;
        }
        if(cb)
        {
            
            cb();
        }
    });
    //console.log(q.sql);
}
exports.DeleteCalendar =  function(id,userid,cb,errcb){
    var db = GetConnection();
    db.connect();
    var sql = "DELETE FROM calendar WHERE \"Id\"='"+id+"' and \"UPAccount\"='"+userid+"'";
    db.query(sql,function(err,result){
        db.end();
        if(err)
        {
            console.log(err);
            if(errcb)
            {
                errcb(err);
            }
            return;
        }
        if(cb)
        {          
            cb();
        }
    });
}
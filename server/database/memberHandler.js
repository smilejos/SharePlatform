"use strict";
module.exports = function(){
	let employees = [],
		members = [],
		sql = require('mssql'),
		config = require('../config/database');

	function _getRawDataFromDatabase (callback){
        let sqlString = " select Emp_Id as worker_no, RTRIM(Micron_UserName) as user_name, Legacy_ID_No as legacy_Id_No, card_na, RTRIM(Tel_o) as tel_no, Title_no as title_na, RTRIM(EDept_funa) as dept_na, e_mail as email " +
                        " from HRIS.dbo.SAP_Nemployee a " +
                        " left join HRIS.dbo.SAP_NSection b on a.Dept_no = b.Dept_no  where a.Dept_no in ('70130800', '70130852')";
        
        let connection = new sql.Connection(config, function (err) {
            console.log(err);
            let request = connection.request();
            request.query(sqlString, function (err, recordset) {
                console.log(err);
	    		employees = recordset;
	    		callback();
	    		recordset = null;
	    	});
		});
	}

	function _getBizMemberFromDatabase (callback){
        let sqlString = " select Emp_Id as worker_no, RTRIM(Micron_UserName) as user_name, Legacy_ID_No as legacy_Id_No, card_na, RTRIM(Tel_o) as tel_no, Title_no as title_na, RTRIM(EDept_funa) as dept_na, e_mail as email " +
                        " from HRIS.dbo.SAP_Nemployee a " +
                        " left join HRIS.dbo.SAP_NSection b on a.Dept_no = b.Dept_no where a.Dept_no in ('70130800', '70130852')";
        
        let connection = new sql.Connection(config, function (err) {
            let request = connection.request();
            console.log(err);
            request.query(sqlString, function (err, recordset) {
                console.log(err);
	    		members = recordset;
	    		callback();
	    		recordset = null;
	    	});
		});
	}

	return {
		initialize: function(){
			_getRawDataFromDatabase( () => {
				console.log('employees', employees.length);
			});

			_getBizMemberFromDatabase( () => {
				console.log('members', members.length);
			});
        },
        getAccount: function(loginInfo) {
            console.log('start to transfer', loginInfo);
            let member = null;
            if (loginInfo.DomainName.toUpperCase() == "INOTERA") {
                member = employees.filter((item) => {
                    return item.legacy_Id_No.toUpperCase().trim() === loginInfo.UserName.toUpperCase();
                })[0];
            } else {
                member = employees.filter((item) => {
                    return item.user_name.toUpperCase().trim() === loginInfo.UserName.toUpperCase();
                })[0];
            }   
            
            if (member != null) {
                loginInfo.WorkerNo = member.worker_no;
                loginInfo.DomainName = "WINNTDOM";    
                return loginInfo;
            } else {
                return null;
            }
        },
		getMembers : function(callback){
			if( !members || members.length == 0 ) {
				_getBizMemberFromDatabase(function(){
					callback(members);
				})
			} else  {
				callback(members);
			}
		},
		getEmployees : function(callback){
			if( !employees || employees.length == 0 ) {
				_getRawDataFromDatabase(function(){
					callback(employees);
				})
			} else  {
				callback(employees);
			}
		},
		getEmployee : function(worker_no){
			return employees.filter( (item) => {
				return item.worker_no == worker_no;
			})[0];
        },

        // We don't use below function, wait to real-time chat or something feature.
		setOnline: function(worker_no, Socket_Id) {
            let member = employees.filter((item) => {
				return item.worker_no == worker_no;
			})[0];
			member.OnlineState = true;
			member.SocketId = Socket_Id;
			return member;
		},
		setOffline: function(worker_no) {
			employees.filter( (item) => {
				return item.worker_no == worker_no;
			})[0].OnlineState = false;
		},
		getOnlineList: function() {
			let onlineList = employees.filter( (item) => {
				if(item.OnlineState) {
					return true;
				} else {
					return false;
				}
			});
			return onlineList;
		}
	}
}();
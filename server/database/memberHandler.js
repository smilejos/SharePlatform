"use strict";
module.exports = function(){
	let employees = [],
		members = [],
		sql = require('mssql'),
		config = require('../config/database');

	function _getRawDataFromDatabase (callback){
		console.log('get employee');
        let sqlString = " select a.Id_No, a.card_na, d.username as user_na, a.e_mail, a.Tel_O as tel_no, b.ETitle_na as title_na, a.dept_no, c.EDept_Na1 as dept_na, c.EDept_FuNa as dept_fullName" +
                        " from HRIS.dbo.Nemployee a " +
                        " left join HRIS.dbo.ztitle b on a.Title_no = b.Title_no" +
                        " left join HRIS.dbo.NSection c on a.Dept_no = c.Dept_no" +
                        " left join HRIS.dbo.GED_Xref d on a.Id_No = d.Id_No" +
                        " where d.username is not null";
                
		let connection = new sql.Connection(config, function(err) {
			let request = connection.request();
	    	request.query(sqlString, function(err, recordset) {
	    		employees = recordset;
	    		callback();
	    		recordset = null;
	    	});
		});
	}

	function _getBizMemberFromDatabase (callback){
		console.log('get biz member');
        let sqlString = " select a.Id_No, a.card_na, d.username as user_na, a.e_mail, a.Tel_O as tel_no, b.ETitle_na as title_na, a.dept_no, c.EDept_Na1 as dept_na, c.EDept_FuNa as dept_fullName" +
                        " from HRIS.dbo.Nemployee a " +
                        " left join HRIS.dbo.ztitle b on a.Title_no = b.Title_no" +
                        " left join HRIS.dbo.NSection c on a.Dept_no = c.Dept_no" +
                        " left join HRIS.dbo.GED_Xref d on a.Id_No = d.Id_No" +
                        " where a.dept_no in ('1131', '1133') order by a.dept_no ASC, a.G_Code DESC";

		let connection = new sql.Connection(config, function(err) {
			let request = connection.request();
	    	request.query(sqlString, function(err, recordset) {
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
        getAccount: function (Account) {
            if (Account.DomainName == "WINNTDOM") {
                let member = employees.filter( (item) => {
                    return item.user_na.toUpperCase() == Account.UserName.toUpperCase();
                })[0];
                Account.UserName = member.Id_No; 
                Account.DomainName = "INOTERA";
                return Account;
            } else {
                return Account;
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
		getEmployee : function(Id_No){
			return employees.filter( (item) => {
				return item.Id_No.toUpperCase() == Id_No.toUpperCase();
			})[0];
		},
		setOnline: function(Id_No, Socket_Id) {
			let member = employees.filter( (item) => {
				return item.Id_No.toUpperCase() == Id_No.toUpperCase();
			})[0];
			member.OnlineState = true;
			member.SocketId = Socket_Id;
			return member;
		},
		setOffline: function(Id_No) {
			employees.filter( (item) => {
				return item.Id_No.toUpperCase() == Id_No.toUpperCase();
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
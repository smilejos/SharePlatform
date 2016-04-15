"use strict";
module.exports = function(){
	let employees = [],
		sql = require('mssql'),
		config = {
		    user: 'admTest',
		    password: 'zzzzzzzz',
		    server: 'TSQL00',
		    database: 'HRIS'
		};

	function _getRawDataFromDatabase (callback){
		let sqlString = " select a.Id_No, a.Card_Na, a.E_Mail, a.Tel_O as Tel_No, b.ETitle_na as Title_na, a.Dept_No, c.EDept_Na1 as Dept_Name, c.EDept_FuNa as Dept_FullName" +
						" from HRIS.dbo.Nemployee a " + 
						" left join HRIS.dbo.ztitle b on a.Title_no = b.Title_no" +
						" left join HRIS.dbo.NSection c on a.Dept_no = c.Dept_no";
		sql.connect(config, function(err) {
			let request = new sql.Request();
	    	request.query(sqlString, function(err, recordset) {
	    		employees = recordset;
	    		callback();
	    	});
		});
	}

	return {
		initialize: function(){
			_getRawDataFromDatabase( () => {
				console.log('employees', employees.length);
			});
		},
		getEmployees : function(callback){
			if( !employees || employees.length == 0 ) {
				getRawDataFromDatabase(function(){
					callback(employees);
				})
			} else  {
				callback(employees);
			}
		},
		getEmployee : function(Id_No){
			return employees.filter( (item) => {
				return item.Id_No == Id_No;
			})[0];
		},
		setOnline: function(Id_No, Socket_Id) {
			let member = employees.filter( (item) => {
				return item.Id_No == Id_No;
			})[0];
			member.OnlineState = true;
			member.SocketId = Socket_Id;
			return member;
		},
		setOffline: function(Id_No) {
			employees.filter( (item) => {
				return item.Id_No == Id_No;
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
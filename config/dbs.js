
const mysql = require('mysql') // 调用MySQL模块
// 创建一个connection
function query(sql, arr, callback){
	const connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'hua',
		password : '980710',
		database : 'information_schema'
	})
	/*
	 node连接数据库  连接到关闭需要在一个函数内执行 否则无法二次执行报错
	*/
	//尝试连接
	connection.connect(function (err) {
	  if (err) {
	    console.log('[mysql_query] - :' + err)
	    return
	  }
	  console.log('mysql_success')
	})
	connection.query(sql,arr,function (err,result,fields) {
		callback && callback(result,fields);
	})
	connection.end();				//操作完此断开连接
}
module.exports = query

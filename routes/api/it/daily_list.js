/*
 * @Author: ecitlm
 * @Date:   2017-12-01 21:02:46
 * @Last Modified by: ecitlm
 * @Last Modified time: 2018-06-29 22:12:54
 */

const express = require('express')
const cheerio = require('cheerio')					//类似jq选择器
const app = express()								
const request = require('request')					//请求
const Iconv = require('iconv-lite')					//转码


function Mysql(req,res){
	/*
	 node连接数据库  连接到关闭需要在一个函数内执行 否则无法二次执行报错
	*/
	var data = []
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'hua',
	  password : '980710',
	  database : 'test'
	});
	var  sql = 'SELECT * FROM user';
	connection.connect();
	var name = req.query.name;
	connection.query(sql,function (err, result) {
		data = {result,name}
		res.send({
          code: 200,
          data:data,
          msg: '连接成功'
       })
	})
	connection.end();				//操作完此断开连接
}

function list (req, res) {
  let url = 'http://caibaojian.com/c/news'
  console.log(url)
  request(
    {
      url: url,
      encoding: null
    },
    function (error, response, body) {
      let links = []
      if (response && response.statusCode === 200) {
        body = Iconv.decode(body, 'utf-8')
        let $ = cheerio.load(body)
        $('#content article ').each(function () {
          let title = $(this)
            .find('.entry-title span')
            .text()
          let description = $(this)
            .find('.entry-content p')
            .text()
          let href = $(this)
            .find('.read-more')
            .attr('href')
          let date = $(this)
            .find('.entry-date')
            .text()
          let tmp = {
            title: title,
            id: parseInt(title),
            description: description,
            date: date,
            url: href
          }
          links.push(tmp)
        })
        res.send({
          code: 666,
          data: links,
          msg: ''
        })
      } else {
        console.log(error)
        res.send({
          code: 404,
          msg: '网络好像有，点问题'
        })
      }
    }
  )
}

app.get('/', function (req, res) {
	Mysql(req, res)
  	//list(req, res)
})
module.exports = app

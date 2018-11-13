const express = require('express')
const cheerio = require('cheerio')					//类似jq选择器
const app = express()					
const dbs = require('../../../config/dbs')
const request = require('request')					//请求
const Iconv = require('iconv-lite')					//转码
//const connection = require('../../../config/dbs')


//
function Mysql(req,res){
	//获取前台传参
	console.log(req.body)
	var name = JSON.stringify(req.body);
	var sql = 'SELECT * FROM USER_PRIVILEGES ';
	dbs(sql,[],function(result,fields){
		res.send({
			code: 200,
        	data:req.body,
         	msg: '连接成功'
		})
	})
	

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

app.post('/', function (req, res) {
	Mysql(req, res)
  	//list(req, res)
})
module.exports = app

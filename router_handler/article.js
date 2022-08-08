
// 导入数据库操作模块
const db = require('../db/index')
// 导入处理路径的 path 核心模块
const path = require('path')



exports.addArticle =  (req, res) => {
    // 手动判断是否上传了文章封面
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')

    const articleInfo = {
        // 标题、内容、状态、所属的分类Id
        ...req.body,
        // 文章封面在服务器端的存放路径
        cover_img: path.join('/uploads', req.file.filename),
        // 文章发布时间
        pub_date: new Date(),
        // 文章作者的Id
        author_id: req.user.id,
    }

    const sql = `insert into ev_articles set ?`
    // 执行 SQL 语句
    db.query(sql, articleInfo, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) return res.cc('发布文章失败！')

    // 发布文章成功
    res.cc('发布文章成功', 0)
    })



    // res.send('ok')
  }

  const URL = require('url') 
  // 获取文章基本信息的基本函数
exports.articleinfo =  (req, res) => {
    // 解析 url 传递过来的的值http://127.0.0.1:3007/my/article/list?pagenum=1&pagesize=2&cate_id=1&state=
    const p = URL.parse(req.url,true).query;
    console.log("articleinfo============",p.cate_id,p.state)
    if(p.state.length === 0 && p.cate_id.length !==0) 
    {
        const sql = `select * from ev_articles,ev_article_cate  where ev_articles.cate_id=ev_article_cate.Id and ev_articles.cate_id=?`
            // // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
        db.query(sql,p.cate_id, (err, results) => {
            // 1. 执行 SQL 语句失败
        if(err){ return res.cc(err) }
        // 执行 SQL 语句成功，但是查询到数据条数不等于 1
        // if (results.length !== 1) return res.cc('登录失败！')
        // 3. 将用户信息响应给客户端
        res.send({
            status: 0,
            message: '获取文章基本信息articleinfo成功！',
            data: results,
        })
    })
    }

    if(p.state.length !== 0 && p.cate_id.length === 0) 
    {
        // p.state可能加密了
        const sql = `select * from ev_articles,ev_article_cate  where ev_articles.cate_id=ev_article_cate.Id and ev_articles.cate_id=?`
            // // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
        db.query(sql,p.state, (err, results) => {
            // 1. 执行 SQL 语句失败
        if(err){ return res.cc(err) }
        // 执行 SQL 语句成功，但是查询到数据条数不等于 1
        // if (results.length !== 1) return res.cc('登录失败！')
        // 3. 将用户信息响应给客户端
        res.send({
            status: 0,
            message: '获取文章基本信息articleinfo成功！',
            data: results,
        })
    })
    }

    if(p.state.length === 0 && p.cate_id.length ===0) 
    {
        // p.state可能加密了
        const sql = `select * from ev_articles,ev_article_cate  where ev_articles.cate_id=ev_article_cate.Id `
            // // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
        db.query(sql,(err, results) => {
            // 1. 执行 SQL 语句失败
        if(err){ return res.cc(err) }
        // 执行 SQL 语句成功，但是查询到数据条数不等于 1
        // if (results.length !== 1) return res.cc('登录失败！')
        // 3. 将用户信息响应给客户端
        res.send({
            status: 0,
            message: '获取文章基本信息articleinfo成功!',
            data: results,
        })
    })
    }
    


    // res.send("ok")
}

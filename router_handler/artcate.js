// 导入数据库操作模块
const db = require('../db/index')
// 获取文章
exports.getArticleCates = (req, res) => {
    const sql = `SELECT * from ev_article_cate where is_delete=0 order by id asc`
    db.query(sql, (err, results) => {
        // 1. 执行 SQL 语句失败
      if(err){ return res.cc(err) }
       // 2.执行 SQL 语句成功， 将用户信息响应给客户端
      res.send({
          status: 0,
          message: '获取文章分类列表成功！',
          data: results,
      })
  })
  }

// 新增文章分类
exports.addArticleCates = (req, res) => {
    const article = req.body
    // res.send("addArticleCates ok")
    // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    const sql = `select * from ev_article_cate where name=? or alias=?`
    
    // 执行查重操作
    db.query(sql, [article.name, article.alias], (err, results) => {
        // 1.执行 SQL 语句失败
        if (err) return res.cc(err)
        // 2.分类名称 和 分类别名 都被占用
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
        // 3.分类名称 或 分类别名 被占用
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
        // addQuery(article)
        const addAtricleSql = `insert into ev_article_cate set ?`
        db.query(addAtricleSql, [article], (err, results) => {
            // SQL 语句执行失败
            if (err) return res.cc(err)
          
            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('新增文章分类失败！')
          
            // 新增文章分类成功
            res.cc('新增文章分类成功！', 0)
          })

        // TODO：新增文章分类
    })
}

// 更新文章is_delete状态，0是不删除，1是删除
exports.updateDeleteCateById = (req, res) => {
    // res.send("deleteCateById ok")
    const sql = `update ev_article_cate set is_delete=1 where id=?`
    // 在postman中的params填写数据
    // 通过 req.params 对象，可以访问到 URL 中，通过 : 匹配到的动态参数：
    db.query(sql, req.params.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
      
        // SQL 语句执行成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败！')
      
        // 删除文章分类成功
        res.cc('更新文章s_delete状态成功！', 0)
      })

}

// 根据 Id 获取文章分类的处理函数
exports.getArtCateById = (req, res) => {
    // res.send('getArtCateById ok')
    const sql = `select * from ev_article_cate where id=?`

    db.query(sql, req.params.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
      
        // SQL 语句执行成功，但是没有查询到任何数据
        if (results.length !== 1) return res.cc('获取文章分类数据失败！')
      
        // 把数据响应给客户端
        res.send({
          status: 0,
          message: '获取文章分类数据成功！',
          data: results[0],
        })
      })
  }

// 更新文章分类的处理函数
exports.updateCateById = (req, res) => {
    // res.send('updateCateById ok')
    // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    const sql = `select * from ev_article_cate where Id<>? and (name=? or alias=?)`
    const article = req.body
  // 执行查重操作
    db.query(sql, [article.Id, article.name, article.alias], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
    
        // 分类名称 和 分类别名 都被占用
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
        // 分类名称 或 分类别名 被占用
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
            // TODO：更新文章分类
        const usql = `update ev_article_cate set ? where Id=?`
        db.query(usql, [article, article.Id], (err, results) => {
            // 执行 SQL 语句失败
            if (err) return res.cc(err)
          
            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')
          
            // 更新文章分类成功
            res.cc('更新文章分类成功！', 0)
          })
            

    })
  }



// 不行
// const addQuery = (article) => {
//     const addAtricleSql = `insert into ev_article_cate set ?`
//     db.query(addAtricleSql, [article], (err, results) => {
//         // SQL 语句执行失败
//         if (err) return res.cc(err)
      
//         // SQL 语句执行成功，但是影响行数不等于 1
//         if (results.affectedRows !== 1) return res.cc('新增文章分类失败！')
      
//         // 新增文章分类成功
//         // res.cc('新增文章分类成功！', 0)
//         res.send("sss")
//       })
// }
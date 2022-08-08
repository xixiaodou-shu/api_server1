// 导入数据库操作模块
const db = require('../db/index')

// 在头部区域导入 bcryptjs 后，
// 即可使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
// compareSync() 函数的返回值为布尔值，true 表示密码正确，false 表示密码错误
const bcrypt = require('bcryptjs')

// 获取用户信息的基本函数
exports.userinfo =  (req, res) => {
    const sql = `select id, username, nick, email, user_pic from ev_users where id=?`

    // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
    db.query(sql, req.user.id, (err, results) => {
          // 1. 执行 SQL 语句失败
        if(err){ return res.cc(err) }
         // 执行 SQL 语句成功，但是查询到数据条数不等于 1
        if (results.length !== 1) return res.cc('登录失败！')
        // 3. 将用户信息响应给客户端
        res.send({
            status: 0,
            message: '获取用户基本信息userinfo成功！',
            data: results[0],
        })

    })
}

// 更新用户信息
exports.updateUserInfo = (req, res) => {
    const user = req.body
    // 需要在postman里面 body中的x-www 输入id，nick,email
    console.log("updateUserInfo",user)
    const sql = `update ev_users set nick=?,email=?  where id=?`
    db.query(sql, [user.nick,user.email, user.id], (err, results) => {
        // 1. 执行 SQL 语句失败
      if(err){ return res.cc(err) }
       // 2.执行 SQL 语句成功，但影响行数不为 1
      if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败！')
      // 3. 将用户信息响应给客户端
       return res.cc('修改用户基本信息成功！', 0)
  })
}

// 修改密码
exports.updatePassword = (req, res) => {
    // 定义根据 id 查询用户数据的 SQL 语句
    const sql = `select * from ev_users where id=?`
    // req.user.id从token获取用户的id
    db.query(sql, req.user.id, (err, results) => {
          // 1. 执行 SQL 语句失败
        
        if(err){ return res.cc(err) }
        // 2. 执行 SQL 语句成功，但是查询到数据条数不等于 1
        if (results.length !== 1) return res.cc('用户不存在')

        // res.send({
        //     status: 0,
        //     message: 'updatePassword 获取用户基本信息成功！',
        //     data: results[0],
        // })
        console.log(" results[0]", results[0])
        // 判断提交的旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('原密码错误！')
        const updatepwdSql = `update ev_users set password=? where id=?`
        // 对新密码进行 bcrypt 加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        console.log("newPwd",newPwd, req.user.id)
        // 执行 SQL 语句，根据 id 更新用户的密码
        db.query(updatepwdSql, [newPwd, req.user.id], (err, results) => {
            // SQL 语句执行失败
            if (err) return res.cc(err)
        
            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('更新密码失败！')
        
            // 更新密码成功
            res.cc('更新密码成功！', 0)
        })

    })

    // return res.send("updatePassword OK")
}

//更新头像
exports.updateAvatar = (req, res) => {
    const sql = 'update ev_users set user_pic=? where id=?'
    // console.log("====",req.user.id)

    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // console.log(req.body.avatar,req.user.id)
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
      
        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('更新头像失败！')
      
        // 更新用户头像成功
        return res.cc('更新头像成功！', 0)
      })
    // res.send('updateAvatar ok')
}
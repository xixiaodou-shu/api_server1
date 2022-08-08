// 导入数据库操作模块
const db = require('../db/index')
const bcrypt = require('bcryptjs')
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')
// 调入全局配置文件
const config = require('../config')
// 抽离 注册
exports.reguser = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    const userinfo = req.body
    console.log("userinfo数据",userinfo)

    // // 对表单校验中的数据进行判断 数据是否合法
    // if (!userinfo.username || !userinfo.password) {
    //     return res.send({ status: 1, message: '用户名或密码不能为空！' })
    // }

    // 定义SQL语句，查询用户名是否被占用
    const sqlStr = `select * from ev_users where username=?`
    db.query(sqlStr,userinfo.username, (err, results) => {
        if(err){
            // return res.send({ status: 1 , message: err.message })
            res.cc(err)
        }
        // 判断用户名是否被占用
        if(results.length > 0) {
            // return res.send({ status: 2 , message: '用户名被占用，请更换其他用户名' })
            return res.cc('用户名被占用，请更换其他用户名')
        }
       
        // TODO：用户名可以用
         // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
         userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        //  定义插入语句
        const sql = `insert into ev_users set ?`
        db.query(sql, {username: userinfo.username, password: userinfo.password}, (err, results) => {
            if(err){
                // return res.send({ status: 1 , message: err.message })
                return res.cc(err)
            }
            // 判断用户名是否被占用  SQL 语句执行成功，但影响行数不为 1
            if(results.affectedRows !== 1 ) {
                // return res.send({ status: 1 , message: '注册用户失败，请稍后再试' })
                return res.cc('注册用户失败，请稍后再试')
            }
            // 注册用户成功
            res.send({ status: 0, message: '注册成功！' })

        } )
         
    })
    // 次数不能再有resend
    // res.send("login OK")
}

// 登录
exports.login = (req, res) => {
    // 接收表单数据
    const userinfo = req.body
    // 定义sql语句
    const sql = `select * from ev_users where username=?`
    // 执行 results数组
    db.query(sql, userinfo.username, (err, results) => {
        if(err){
            return res.cc(err)
        }
        if(results.length !== 1) {
            return res.cc('登录失败')
        }
    // TODO 密码是否正确
    const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
    if(!compareResult) return res.cc('登录失败')
    // TODO 
    // res.send("登录成功")
    const user = { ...results[0], password: '', user_pic: '' }
    // console.log(user)
    //   id: 2,
    //   username: 'admin1',
    //   password: '$2a$10$mT4xUw76jW5t6n40G8VOJO55nYTbyTfl8LeXTgZFT1.TcR3N/RyTy',
    //   nick: null,
    //   email: null,
    //   user_pic: null
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {expiresIn: config.expiresIn})
    // console.log("tokenStr",tokenStr)
    // 服务端生成的token
    // tokenStr eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJhZG1pbjEiLCJwYXNzd29yZCI6IiIsIm5pY2siOm51bGwsImVtYWlsIjpudWxsLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTY1OTYwOTQ0OCwiZXhwIjoxNjU5NjQ1NDQ4fQ.D1sQTW5wVb0SZHdcYUkavYCrjxmF-UF3H_dKdiLLnts
    res.send({
        status: 0,
        message: '登录成功',
        token: 'Bearer ' + tokenStr,
    })
})


}
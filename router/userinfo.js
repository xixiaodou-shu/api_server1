// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入用户路由处理函数模块
const userinfo_Handler = require('../router_handler/userinfo')

// 1.导入中间件进行 校验
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require('../schema/user')


// 获取用户信息
router.get('/userinfo', userinfo_Handler.userinfo)
// / 更新用户的基本信息

// 更新用户
// 3. 在注册新用户的路由中，声明局部中间件，对当前请求中携带的数据进行验证
// 3.1 数据验证通过后，会把这次请求流转给后面的路由处理函数
// 3.2 数据验证失败后，终止后续代码的执行，并抛出一个全局的 Error 错误，进入全局错误级别中间件中进行处理
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_Handler.updateUserInfo)

//  修改密码/updatepwd是路径，任意起一个名字 /my/updatepwd
router.post('/updatepwd',expressJoi(update_password_schema),userinfo_Handler.updatePassword)
// 更新用户头像的路由
router.post('/update/avatar',expressJoi(update_avatar_schema), userinfo_Handler.updateAvatar)

// 向外共享路由对象
module.exports = router
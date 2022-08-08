// 导入express
const express = require('express')
// 创建服务器的实例对象
const app = express()

const joi = require('@hapi/joi')



// 在 app.js 中导入并配置 cors 中间件：跨域问题
// 导入 cors 中间件
const cors = require('cors')

// 将 cors 注册为全局中间件
app.use(cors())
// 挂载路由 回调函数


// 配置解析表单数据数据中间件 智能配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件：
// 解析 URL-encoded 格式的请求体数据
app.use(express.urlencoded({ extended: false }))

// 托管静态资源文件
// 通过如下代码就可以将 uploads 目录下的图片、CSS 文件、JavaScript 文件对外开放访问了：
// 通过带有 /uploads 前缀地址来访问 uploads 目录中的文件了：
// 如访问：http://localhost:3007/uploads/0b961f7aa77380ee873b7cc7acc65fdd
app.use('/uploads', express.static('./uploads'))


// 一定在之前定义中间件函数，声明一个全局中间件，为 res 对象挂载一个 res.cc() 函数 ：给router_handler中的user
// 注意：中间件函数的形参列表中，必须包含 next 参数。而路由处理函数中只包含 req 和 res。
// next 函数是实现多个中间件连续调用的关键，它表示把流转关系转交给下一个中间件或路由。
// 通过调用 app.use(中间件函数)，即可定义一个全局生效的中间件
// 一定要在路由之前注册中间件

app.use( (req, res, next) => {
    // status默认值1 代表失败
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
        })
    }
    // 这个不能少
    next()
})

const expressJWT = require('express-jwt')
// 导入配置文件
const config = require('./config')

// /api接口不进行token验证
app.use(
    expressJWT({secret: config.jwtSecretKey}).unless({ path: [/^\/api\//] })
)
// 1.导入并使用路由模块 用户登录注册
const userRouter = require('./router/user')
// 2.使用app.use注册路由模块，并添加统一访问前缀/api  如 http://127.0.0.1:3007/api/login
app.use('/api', userRouter )

// 用户信息路由模块 注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
// userinfo下面的路由都以/my开头/my/updatepwd  /my/userinfo
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter )

// 导入并使用文章分类路由模块
const artCateRouter = require('./router/artcate')
// 为文章分类的路由挂载统一的访问前缀 /my/article
app.use('/my/article', artCateRouter )

// 导入并使用文章分类路由模块
const articleRouter = require('./router/article')
// 为文章分类的路由挂载统一的访问前缀 /my/article
app.use('/my/article', articleRouter )





// 定义错误级别的中间件
// 注意：中间件函数的形参列表中，必须包含 next 参数。而路由处理函数中只包含 req 和 res。
app.use((err, req, res, next) => {
      // 数据验证失败
    if(err instanceof joi.ValidationError){
        return res.cc(err)
    }
    // 身份认证失败
    if(err.name === 'UnauthorizedError') res.cc('身份认证失败')
      // 未知错误
    res.cc(err)
})

// 启动服务器  回调函数
app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007')
})

// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入用户路由处理函数模块
const artcate_Handler = require('../router_handler/artcate')

// 1.导入中间件进行 校验
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { add_cate_schema,update_delete_cate_schema ,get_cate_schema,update_cate_schema} = require('../schema/artcate')



// 获取文章分类的列表数据
router.get('/cates',artcate_Handler.getArticleCates )

// 新增文章分类
router.post('/addcates',expressJoi(add_cate_schema),artcate_Handler.addArticleCates )

// 更新is_delete状态 文章分类
// 注意 使用的是get
router.get('/updatedeletecate/:id',expressJoi(update_delete_cate_schema), artcate_Handler.updateDeleteCateById)
// 根据 Id 获取文章分类数据
// 动态参数通过 req.params 对象，可以访问到 URL 中，通过 : 匹配到的动态参数：
router.get('/cates/:id', expressJoi(get_cate_schema),artcate_Handler.getArtCateById)

// 更新文章分类的路由
router.post('/updatecate', expressJoi(update_cate_schema),artcate_Handler.updateCateById)


// 向外共享路由对象
module.exports = router
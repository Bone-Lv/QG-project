# <font style="color:#DF2A3F;">文件上传</font>
## 写了一个<font style="color:#117CEE;">工具类</font>专门存储上传的照片到 oss 仓库中，还写了<font style="color:#117CEE;">删除逻辑</font>，与前端相互配合避免上传垃圾文件到 oss 仓库当中
# <font style="color:#DF2A3F;">token</font>
## 实现方式：我专门写了一个<font style="color:#117CEE;">工具类</font>来专门负责关于 tokne 的所有操作，包括 token 的生成解析以及刷新机制
## 存储方式：是由前端存储到<font style="color:#117CEE;"> localStorage</font> 中，然后通过 request 拦截器每一次请求时从 localStorage 中取出并放到 request 中的 <font style="color:#117CEE;">tokne 请求头</font>中
# <font style="color:#DF2A3F;">环境变量存储敏感数据</font>
## 将一些敏感的数据存储到了<font style="color:#117CEE;">.env 文件</font>，然后设置 idea <font style="color:#117CEE;">自动读取</font>该文件的内容并且赋值到相应的位置，并把.env 文件放入<font style="color:#117CEE;">.gitignore 文件</font>中，到时候上传仅提供.env 的<font style="color:#117CEE;">配置模板</font>，让用户自行填写并配置到 idea 当中
# <font style="color:#DF2A3F;">HTTP 响应体结构</font>
## 我全部统一封装到了<font style="color:#117CEE;"> Result</font> 里面，<font style="color:#117CEE;">code</font> 判断响应是否成功，<font style="color:#117CEE;">msg</font> 传递信息，<font style="color:#117CEE;">data</font> 负责封装数据
# <font style="color:#DF2A3F;">异常的统一拦截</font>
## 专门写了一个类用了 <font style="color:#117CEE;">RestControllerAdvice</font> 注解标注，不过我只写了两个方法，一个是<font style="color:#117CEE;">拦截所有异常</font>的，还有一个是拦截数据库中<font style="color:#117CEE;">数据重复异常</font>的
# <font style="color:#DF2A3F;">日志持久化</font>
## 我用了 <font style="color:#117CEE;">SLF4J</font> 的日志框架实现，并且在其配置文件中配置其在控制台和输出到<font style="color:#117CEE;">根目录的.log 文件</font>当中，最多存储 30 天的日志
# <font style="color:#DF2A3F;">管理端的日志查询功能</font>
## 专门写了对应的控制层，服务层和数据访问层的代码，与其他功能的实现大体相同，前端的页面直接复用其他的页面然后进行一定的修改。因为查询操作太过频繁而且参考价值并不大，所以在<font style="color:#117CEE;">拦截器中将其设置为get 方法之外的请求才会被记录下来</font>。
# <font style="color:#DF2A3F;">token 的持久化上文已提及</font>
# <font style="color:#DF2A3F;">token 的过期与刷新逻辑</font>
## 每次请求时拦截器均会<font style="color:#117CEE;">检查</font>一遍当前 token 的<font style="color:#117CEE;">过期时间</font>，如果剩余时间<font style="color:#117CEE;">少于 30 分钟</font>的话就会<font style="color:#117CEE;">刷新</font> token 并且设置到<font style="color:#117CEE;">响应体</font>里面<font style="color:#117CEE;">带出</font>，前端用<font style="color:#117CEE;">拦截器</font>获取每次响应，如果有<font style="color:#117CEE;">新的 token</font> 的话就传给 <font style="color:#117CEE;">localStorage</font> 中并且<font style="color:#117CEE;">覆盖</font>，如果过期的话就响应 <font style="color:#117CEE;">401</font> 状态码给前端，然后跳转至登陆页面。
# <font style="color:#DF2A3F;">接口鉴权</font>
## 采用了<font style="color:#117CEE;">注解</font>的方式，写了一个注解属性是一个数组，里面装需要的权限，拦截器拦截时检验当前角色是否有该权限，如果没有权限响应 <font style="color:#117CEE;">403</font> 状态码，有则放行
# <font style="color:#DF2A3F;">axios 拦截器</font>
## request 和 response 的拦截器都写了，request 负责<font style="color:#117CEE;">携带 token</font>，response 负责处理 <font style="color:#117CEE;">401</font> 和 <font style="color:#117CEE;">403</font> 状态码，并且<font style="color:#117CEE;">检验</font>是否有<font style="color:#117CEE;">新的 token</font>


# <font style="color:#DF2A3F;">AI 使用与个人贡献说明</font>
## AI 做了什么
### 前端页面的代码大部分是我通过自学知识仅仅运用简单的 <font style="color:#117CEE;">elementPlus 组件</font>完成的，AI 主要帮我解决了一些<font style="color:#117CEE;">报错还有不懂的底层原理</font>，遇到不太懂的<font style="color:#117CEE;">标签</font>或者其<font style="color:#117CEE;">属性</font>就会通过<font style="color:#117CEE;">询问 ai </font>获得其具体的作用
### <font style="color:#117CEE;">css 样式</font>大多由前端完成，因为对这块内容相当不熟练，不过用了组件，css 代码也才几行，大多用来<font style="color:#117CEE;">控制按钮大小</font>
## 自己改了什么
### 大部分页面为我手搓，仅仅只有一些重复性的工作，如设置表单数据的全部属性为 空字符串这种重复性工作用了 ai 自动补全的功能，<font style="color:#117CEE;">页面的逻辑与交互</font>主要由我实现
## 遇到什么坑
### 对前端的知识点不太了解，所以会经常碰到一些<font style="color:#117CEE;">小 bug</font> 自己不太懂怎么解决的，比如<font style="color:#117CEE;">表单数据</font>必须要再设置一个响应式对象去<font style="color:#117CEE;">绑定表单</font>，只有绑定之后才有校验功能，而且表单里的 prop 属性是对应表单绑定对象的属性值的，他们的名字必须相同，还有表单校验规则也是。还有就是后端写的<font style="color:#117CEE;">请求头</font>哪怕有大写的，传送到前端之后也会<font style="color:#117CEE;">自动转化成全小写</font>
## 如何解决
### 遇到未知的 bug 一般我会先尝试<font style="color:#117CEE;">自己捋一遍</font>，如果还是找不到 bug 的话就会去<font style="color:#117CEE;">问 ai </font>怎么做，有时候 ai 也做不出来就会<font style="color:#117CEE;">再仔细去看一遍</font>，一般这样就几乎没什么错误了。如果 ai 找出错误了，并且还是一些比较<font style="color:#117CEE;">琐碎的小细节</font>我就会<font style="color:#117CEE;">加到笔记</font>对应的部分，下次如果还有错误的话就去翻笔记

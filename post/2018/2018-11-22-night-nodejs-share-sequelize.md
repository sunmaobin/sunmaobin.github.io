# Node ORM 框架 Sequelize 使用心得分享

## 一、数据库基础知识

### 1.1 什么是ORM？

对象-关系映射（Object-Relational Mapping，简称ORM），ORM框架主要的作用就是把数据库中的关系数据映射称为程序中的对象，也就是说你操作数据库不用直接写SQL，而是直接操作对象就可以。

Java中主流的ORM框架有：Hibernate、Mybatis、iBatis等。

Node中主流的ORM框架有：Sequelize、TypeORM、LoopBack、Mongoose、Waterline等。

### 1.2 关系数据库都有哪些关系？

两个对象A和B之间只有哪些可能存在的关系？

1. `1:1`  1个A对应1个B（一夫一妻）。有2张表，A表中有一个外键关联B表；
2. `1:N`  1个A对应多个B（一夫多妻）。有2张表，B表中有一个外键关联A表；
3. `M:N` 1个A对应多个B，一个B也可能对应多个A（多夫多妻）。有3张表，C表中有2个外键，分别关联A表、B表；

### 1.3 关系数据库都有哪些查询？

1. 单表查询

   ```sql
   select * from t1;
   ```

2. 关联查询

   ```sql
   /*
    * 1、内连接查询
    * inner join
    * 取2个表的交集
    */
   select * from t1 
   inner join t2
   on t1.lid = t2.lid
   
   /*
    * 2、左外连接查询
    * left outer join 或简写 left join
    * 以左表数据量为基准，右表未匹配的字段，用NULL代替
    */
   select * from t1 
   left join t2
   on t1.lid = t2.lid
   
   /*
    * 3、右外连接联查询
    * right outer join 或简写 right join
    * 已右表数据量为基准，左表未匹配的字段，用NULL代替
    */
   select * from t1 
   right join t2
   on t1.lid = t2.lid
   
   /*
    * 4、全外连接查询
    * full outer join 或简写 full join
    * 已右表数据量为基准，左表未匹配的字段，用NULL代替
    * 注意：Mysql不支持，使用 uion 代替
    */
   select * from t1 
   right join t2
   on t1.lid = t2.lid
   
   /*
    * 5、交叉查询
    * cross join
    * N x M 的结果返回
    */
   select * from t1 
   cross join t2
   ```

3. 结果集操作

   ```sql
   /*
    * 1、合并
    * union
    * 对两个结果集进行并集操作，不包括重复行，同时进行默认规则的排序
    */
    select t1.id,t1.name from t1
    union
    select t2.id,t1.name from t2
    
    /*
    * 2、合并全部
    * union all
    * 对两个结果集进行并集操作，包括重复行，不进行排序
    */
    select t1.id,t1.name from t1
    union all
    select t2.id,t1.name from t2
    
    /*
    * 3、求交集
    * intersect
    * 对两个结果集进行交集操作，不包括重复行，同时进行默认规则的排序
    * 注意：Mysql 不支持
    */
    select t1.id,t1.name from t1
    intersect
    select t2.id,t1.name from t2
    
   /*
    * 4、求差集
    * minus
    * 对两个结果集进行差操作，不包括重复行，同时进行默认规则的排序
    * 注意：Mysql 不支持
    */
    select t1.id,t1.name from t1
    minus
    select t2.id,t1.name from t2
   ```

## 二、Sequelize 使用心得

### 2.1 Sequelize 的ORM特性

* Sequelize 可以通过 Model 创建数据库、表和字段（对象 -> 库）
* Sequelize 也可以将数据库表通过CLI工具，导出生成 Model 对象 （库 -> 对象）

考虑到对代码的侵入性和以后的扩展性，我在使用 Sequelize 的时候，仅用了它的（库 -> 对象）这一层。

### 2.2 Sequelize 的高级特性

* 支持分库分表、读写分离的配置
* 支持事务、回滚机制
* 支持字段校验，以及自己写校验规则
* 支持各种钩子（Hooks），如：`beforeCreate` `afterCreate` 等，可以作为全局拦截处理
* 支持作用域（Scopes）,以规定全局默认的查询范围，如：所有接口默认携带当前userId作为查询参数
* 支持各种关系查询，如：`1:1`、`1:N`、`1:M` 等

### 2.3 Sequelize 脚本片段

#### 安装

```js
// 使用 NPM
$ npm install --save sequelize

# 还有以下之一:
$ npm install --save pg pg-hstore
$ npm install --save mysql2
$ npm install --save sqlite3
$ npm install --save tedious // MSSQL

// 使用 Yarn
$ yarn add sequelize

# 还有以下之一:
$ yarn add pg pg-hstore
$ yarn add mysql2
$ yarn add sqlite3
$ yarn add tedious // MSSQL
```

#### 建立连接

```js
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  define:{
    timestamps: false //数据库表中可以没有 createdAt、updatedAt 这2个字段。
  }
});

// 或者你可以简单地使用 uri 连接
const sequelize = new Sequelize('mysql://user:pass@example.com:5432/dbname');
```

#### 测试连接

```js
sequelize
  .authenticate()
  .then(() => {
    console.log('恭喜，数据库已连接！');
  })
  .catch(err => {
    console.error('糟糕，数据库连接失败！', err);
  });
```

#### Model生成表

```js
const User = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  }
});

// force: true 如果表已经存在，将会丢弃表
User.sync({force: true}).then(() => {
  // 表已创建
});
```

#### 表生成Model

```js
// 使用 NPM 安装cli工具
$ npm install --save mysql2
$ npm install --save sequelize-auto

//使用cli工具将表结构生成Model文件到指定目录下
$ sequelize-auto -h localhost -u username -x password -p 3306 -e mysql -d database -o "dirpath" -t "table" -C
```

#### 基本的增删改查（CRUD）

```js
//增
User.create({
    userName: '张三',
    userCreateTime : new Date()
}).then((user) => {
    console.log(user);
})

//删
User.destory({
    where : {
        userId : 1
    }
}).then((result) => {
    console.log(result);
})

//改
User.update({
    userName : '李四'
},{
    where : {
        userId : 1
    }
}).then((result) => {
    console.log(result);
})

//查全部
User.findAll().then((users) => {
  	console.log(users)
})

//查详情
let userId = 1;
User.findById(userId).then((user) => {
  	console.log(user)
})

//分页查询
User.findAndCountAll({
    limit : 10,
    offset : 0
}).then((result) => {
    //result包含：count 和 rows
  	console.log(result)
})

//原始查询
sequelize.query("SELECT * FROM `users`", {type: sequelize.QueryTypes.SELECT})
	.then(function(users) {
    	console.log(users)
	})
```

#### where 条件

```js
//条件 [Op.or]
User.findAll({
    where : {
        userId : 1,
        [Op.or] : [
            {userId: 12}, 
            {userId: 13}
        ]
    }
}).then((result) => {
  	console.log(result)
})

//简写 $or
User.findAll({
    where : {
        userId : 1,
        $or : {
            userName : {
                $like : '%张%'
            },
            userNickName : {
                $like : '%张%'
            }
        }
    }
}).then((result) => {
  	console.log(result)
})
```

更多 `where` 关键词

```js
const Op = Sequelize.Op

[Op.and]: {a: 5}           // 且 (a = 5)
[Op.or]: [{a: 5}, {a: 6}]  // (a = 5 或 a = 6)
[Op.gt]: 6,                // id > 6
[Op.gte]: 6,               // id >= 6
[Op.lt]: 10,               // id < 10
[Op.lte]: 10,              // id <= 10
[Op.ne]: 20,               // id != 20
[Op.eq]: 3,                // = 3
[Op.not]: true,            // 不是 TRUE
[Op.between]: [6, 10],     // 在 6 和 10 之间
[Op.notBetween]: [11, 15], // 不在 11 和 15 之间
[Op.in]: [1, 2],           // 在 [1, 2] 之中
[Op.notIn]: [1, 2],        // 不在 [1, 2] 之中
[Op.like]: '%hat',         // 包含 '%hat'
[Op.notLike]: '%hat'       // 不包含 '%hat'
[Op.iLike]: '%hat'         // 包含 '%hat' (不区分大小写)  (仅限 PG)
[Op.notILike]: '%hat'      // 不包含 '%hat'  (仅限 PG)
[Op.regexp]: '^[h|a|t]'    // 匹配正则表达式/~ '^[h|a|t]' (仅限 MySQL/PG)
[Op.notRegexp]: '^[h|a|t]' // 不匹配正则表达式/!~ '^[h|a|t]' (仅限 MySQL/PG)
[Op.iRegexp]: '^[h|a|t]'    // ~* '^[h|a|t]' (仅限 PG)
[Op.notIRegexp]: '^[h|a|t]' // !~* '^[h|a|t]' (仅限 PG)
[Op.like]: { [Op.any]: ['cat', 'hat']} // 包含任何数组['cat', 'hat'] - 同样适用于 iLike 和 notLike
[Op.overlap]: [1, 2]       // && [1, 2] (PG数组重叠运算符)
[Op.contains]: [1, 2]      // @> [1, 2] (PG数组包含运算符)
[Op.contained]: [1, 2]     // <@ [1, 2] (PG数组包含于运算符)
[Op.any]: [2,3]            // 任何数组[2, 3]::INTEGER (仅限PG)

[Op.col]: 'user.organization_id' // = 'user'.'organization_id', 使用数据库语言特定的列标识符, 本例使用 PG

// 所有上述相等和不相等的操作符加上以下内容:
[Op.contains]: 2           // @> '2'::integer (PG range contains element operator)
[Op.contains]: [1, 2]      // @> [1, 2) (PG range contains range operator)
[Op.contained]: [1, 2]     // <@ [1, 2) (PG range is contained by operator)
[Op.overlap]: [1, 2]       // && [1, 2) (PG range overlap (have points in common) operator)
[Op.adjacent]: [1, 2]      // -|- [1, 2) (PG range is adjacent to operator)
[Op.strictLeft]: [1, 2]    // << [1, 2) (PG range strictly left of operator)
[Op.strictRight]: [1, 2]   // >> [1, 2) (PG range strictly right of operator)
[Op.noExtendRight]: [1, 2] // &< [1, 2) (PG range does not extend to the right of operator)
[Op.noExtendLeft]: [1, 2]  // &> [1, 2) (PG range does not extend to the left of operator)
```

#### order排序

```js
//按userUpdateTime和userCreateTime倒序
User.findAll({
    order : [['userUpdateTime','DESC'],['userCreateTime','DESC']]
}).then((result) => {
  	console.log(result)
})
```

#### 事务

什么时候用到事务？比如：你删除一个Link，连同Link的所有记录一起删掉。删除Link和删除LinkLog，这2步要不同时成功，要不同时失败，不存在一个删除，一个保留的情况，这时候就得用到事务。

```js
/**
 * 不使用事务的写法
 * 这种写法的问题：可能删除了Link，但是由于数据库异常，导致LinkLog删除失败。
 */

//1. 先删除Link
Link.destory({
    where : {
        linkId : linkId
    }
}).then(() => {
    //2. 再删除LinkLog
    LinkLog.destory({
        where : {
            linkLogLinkId : linkId
        }
    }).then((result) => {
        console.log(result);
    })
})

/**
 * 使用事务包裹
 */
sequelize.transaction((t) => {
    //1. 先删除Link
    Link.destory({
        where : {
            linkId : linkId
        },
        transaction: t //关联事务
    }).then(() => {
        //2. 再删除LinkLog
        LinkLog.destory({
            where : {
                linkLogLinkId : linkId
            },
            transaction: t //关联事务
        }).then((result) => {
            console.log(result);
        })
    })
});
```

#### 关联关系 belongsTo 1:1

```js
//belongsTo 1:1
//比如：1个链接对应唯一的1个用户
//在Link这一侧建立关系

//1. 需要在links表中拥有字段link_user_id，作为外键关联users表
//2. 在Link模型中建立关系
Link.belongsTo(user,{
    as : 'linkUser',
    foreignKey: 'linkUserId',
    targetKey:'userId'
});

//3. 关联查询当前链接对应的用户信息linkUser
Link.findById(linkId,{
    include:[{
        model: user,
        as : 'linkUser', //与上面关系中的as名称相同
        required: false, //使用inner关联，还是outer关联
        where : {//可以添加关联条件
            userStatus : 0
        },
        attributes: ['userId','userName']//关联的对象只会查询这2个字段
    }]
})

//4.返回结果
{
    linkId : 12,
    linkName : '测试链接',
    linkCreateTime : '2018-11-04 11:22:55',
    linkUser : {
		userId : 100,
        userName : '张三'
    }
}

```

#### 关联关系 hasMany 1:N

```js
//hasMany 1:N
//比如：1个链接对应多个链接记录
//在Link这一侧建立关系

//1. 需要在link_logs表中拥有字段link_log_link_id，作为外键关联links表
//2. 在Link模型中建立关系
Link.hasMany(linkLog,{
    as : 'linkLogList',
    foreignKey: 'linkLogLinkId'
});

//3. 关联查询当前链接对应的所有记录数据linkLogList
Link.findById(linkId,{
    include:[{
        model: linkLog,
        as : 'linkLogList',
        required: false
    }]
})

//4.返回结果
{
    linkId : 12,
    linkName : '测试链接',
    linkCreateTime : '2018-11-04 11:22:55',
    linkLogList : [{
		linkLogId : 1,
        linkLogName : '记录1',
        ...//其它字段
    }]
}
```

#### 关联关系 belongsToMany M:N

```js
//belongsToMany M:N
//比如：1个链接对应多个链接规则，1个链接规则对应多个链接
//在Link这一侧建立关系

//1. 需要有3张表，links、rules 和 link_rule_refs，在link_rule_refs中需要有2个字段，1个字段link_id作为外键和links表关联，另1个字段rule_id作为外键和rules表关联

//2. 在Link模型中建立关系
Link.belongsToMany(rule,{
    as : 'linkRuleList',
    through: ruleLink,//ruleLink就是第3张表的Model
    foreignKey: 'linkId',
    otherKey: 'ruleId'
});

//3. 关联查询当前链接对应的所有记录数据linkRuleList
Link.findById(linkId,{
    include:[{
        model: this.rule,
        as : 'linkRuleList',
        required: false,
        attributes: ['ruleId','ruleName'],//rule表的字段
    	through: {//关联表
        	attributes: []//可以指定关联表中的返回字段
        }
    }]
})

//4.返回结果
{
    linkId : 12,
    linkName : '测试链接',
    linkCreateTime : '2018-11-04 11:22:55',
    linkLogList : [{
		linkLogId : 1,
        linkLogName : '记录1',
        ...//其它字段
    }]
}
```





## 三、文档相关

### 3.1 API相关文档

1. [Sequelize 官网英文文档](http://docs.sequelizejs.com/manual/installation/getting-started.html)
2. [Sequelize 中文API文档](https://itbilu.com/nodejs/npm/VkYIaRPz-.html)
3. [Sequelize 中文文档 v4 ](https://segmentfault.com/a/1190000011583367)

#### 3.2 Model所有查询API

<img src="https://i.imgur.com/bqIqJCl.png" width="400px">




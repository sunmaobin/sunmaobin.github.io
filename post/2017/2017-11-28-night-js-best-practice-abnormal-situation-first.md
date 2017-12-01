# JS最佳实践-条件语句if使用技巧

## 最佳实践

在书写代码时，如果 `if(condition)` 中的语句太长，那么就应该转换为 `if(!condition)`。

## 好处

将代码少的逻辑放到if中，而更多的逻辑当成正常系处理，更有利于阅读和理解。

## 方法

```js
//原始代码
if(condition){
    //中间有100行代码
}else{
    //这里只有1行代码！
};
```

以上逻辑最好的书写规范是：

```js
if(!condition){
    //1行代码！
    return;
};

//剩余100行代码
```

### 案例

原始代码：

```js
selectCategory : function(categoryId, isRedirect) {
    if (categoryId) {
        $('#userPersonasTagDrop .input-group').hide();
        $('#tagSubCategory').addClass('subcategory-not-all').show();
        
        walleUtilStorage.setItem(this.storageLocalCategoryId, categoryId);
        walleUtilStorage.setItem(this.storageLocalTagId, '');
        
        isRedirect      // 比如从收藏夹跳转过来
            ? $('#tagSubCategory span:first').text(this.model.queryParam.tagName)
            : $('#tagSubCategory span:first').text('请选择标签');
        isRedirect || this._getPersonasTagList(categoryId, '', true);
        
    } else {
        $('#userPersonasTagDrop .input-group').show();
        $('#tagSubCategory').hide();
        $('#collectBtn').attr('disabled');
        $('.item-group-search').attr('disabled');
    }
}
```

优化后：

```js
selectCategory : function(categoryId, isRedirect) {
    //优化1
    if (!categoryId) {
        $('#userPersonasTagDrop .input-group').show();
        $('#tagSubCategory').hide();
        $('#collectBtn').attr('disabled');
        $('.item-group-search').attr('disabled');
        return;
    };
    
    $('#userPersonasTagDrop .input-group').hide();
    $('#tagSubCategory').addClass('subcategory-not-all').show();
    
    walleUtilStorage.setItem(this.storageLocalCategoryId, categoryId);
    walleUtilStorage.setItem(this.storageLocalTagId, '');
    
    //优化2
    if(!isRedirect){
        $('#tagSubCategory span:first').text('请选择标签');
        return;
    };
    
    $('#tagSubCategory span:first').text(this.model.queryParam.tagName)
    this._getPersonasTagList(categoryId, '', true);
}
```

（全文完）

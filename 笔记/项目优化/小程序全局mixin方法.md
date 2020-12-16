# 小程序全局mixin方法

## 需求

最近接到一个需求，希望我这边可以后台配置微信小程序的导航栏颜色，但是目前小程序还不支持全局修改导航栏的颜色，只支持修改单个页面的导航栏颜色，所以我就想着能不能在所有的页面的onload函数中手动设置一下导航栏的颜色，但是这样一来就需要改每个页面，效率太低。我查了微信小程序的文档也没有提供全局混入onload的方法，所以想着能否实现一下小程序的混入功能。

## 问题

在vue当中我们可以使用mixin来混入全局的配置，方便我们进行业务开发。但是微信小程序并未提供类似的mixin功能，使得在某些全局修改的业务场景下，增加了我们的任务量。下面介绍一种可以小程序中使用的全局mixin方案。

## 原理

原理也很简单，通过修改Page函数来实现全局的mixin。因为微信小程序中创建页面是使用Page构造函数来创建的,如下：

```
Page({
  data: {
    text: "This is page data."
  },
  onLoad: function(options) {
    // Do some initialize when page load.
  },
  onShow: function() {
    // Do something when page show.
  },
  onReady: function() {
    // Do something when page ready.
  }
  //省略部分代码 ... ...
})
```

那么我们可以将Page改为我们自定义的对象，通过下面的混入的方式，实现在不同的钩子函数中mixin我们的全局的配置

### page.js 
``` 
const page = Page;
import app from '../../app.js';

module.exports = (options = {}) => {
  const { onLoad, onShow, onReady, data } = options; // 解构传入的page数据
  const mountOptions = {
    data: {
      ...data,
      isIPX: app.globalData.comonData.isIphoneX, // ipx适配
      isIME: app.globalData.comonData.isMomentEnter, // 是否朋友圈进入
    },
    onLoad(...res) {
      // 在这里添加 onLoad 前mixin的代码 

      const opts = res[0];
      const $opts = {};
      this.$opts = $opts;
      if (onLoad) {
        onLoad.apply(this, res);
      }

      // 在这里添加 onLoad 后mixin的代码 
    },
    onShow() {
      // onShow before
      if (onShow) {
        onShow.apply(this);
      }
      // onShow after
    },
    onReady() {
      if (onReady) {
        onReady.apply(this);
      }
    },
  };

  return page(Object.assign({}, options, mountOptions)); // 调用原生的Page构造函数
};

```

编写统一的全局配置挂载函数


### index.js

```
const page = require('./page.js');

module.exports = {
  mount() {
    Page = page;
  },
};

```

执行挂载函数，注意必须要在App()之前调用

### app.js

```
//省略部分代码

require('./mixins/global/index.js').mount(); // 就是上面的index.js文件位置

App({

    //省略部分代码

}）

```

同样的道理我们还可以添加组件全局Mixin的功能，同样也是要改写Component函数，这里只给一个思路，目前项目中还没有这样的业务场景

## 总结
微信小程序中App、Page和Component都是全局的对象，就像是浏览器环境中的window对象，我们可以对其进行扩展来满足业务的开发需求，但是要谨慎考虑清楚再改，不然会为日后的开发留下隐患

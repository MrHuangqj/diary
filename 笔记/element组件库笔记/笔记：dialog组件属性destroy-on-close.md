# 笔记：dialog组件属性destroy-on-close

|       参数       |                                          说明                                          |  类型   | 可选值 | 默认值 |
| :--------------: | :------------------------------------------------------------------------------------: | :-----: | :----: | :----: |
| destroy-on-close | <span class="Apple-tab-span" style="white-space:pre"></span>关闭时销毁 Dialog 中的元素 | boolean |   —    | false  |

这里的情况比较特殊，因为element的dialog组件的隐藏与展示是是使用了v-show来做的，所以组件隐藏只是单纯的将display：none，里面的元素是不会被销毁的，但是它没有用v-if去做销毁而是使用了一个很有意思的方法，这个destroy-on-close属性实际上是改变绑定的key值，利用了Vue在patch过程中比对key值来把旧的元素删除掉。至于为什么不用v-if，我还没想通。

具体做法
1. 首先在data中定义key
2. 在template模板中绑定key值
3. 在watch的visible的处理函数中，当触发关闭的时候让key++

**这样vue在diff运算中使用key去判断比较元素时就会找不到原本的数据，这样就欺骗Vue把我们之前那些数据删除掉，又学到一招👍**

```
data() {
  return {
    closed: false,
    /**********第一步**********/
    key: 0
    /**********第一步**********/
  };
},
```

```
<template>
  <transition
    name="dialog-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave">
    <div
      v-show="visible"
      class="el-dialog__wrapper"
      @click.self="handleWrapperClick">
      <div
        role="dialog"
        /**********第二步**********/
        :key="key"
        /**********第二步**********/
        aria-modal="true"
        :aria-label="title || 'dialog'"
        :class="['el-dialog', { 'is-fullscreen': fullscreen, 'el-dialog--center': center }, customClass]"
        ref="dialog"
        :style="style">
        <div class="el-dialog__header">
          <slot name="title">
            <span class="el-dialog__title">{{ title }}</span>
          </slot>
          <button
            type="button"
            class="el-dialog__headerbtn"
            aria-label="Close"
            v-if="showClose"
            @click="handleClose">
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <div class="el-dialog__body" v-if="rendered"><slot></slot></div>
        <div class="el-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

```

```
watch: {
  visible(val) {
    if (val) {
      this.closed = false;
      this.$emit('open');
      this.$el.addEventListener('scroll', this.updatePopper);
      this.$nextTick(() => {
        this.$refs.dialog.scrollTop = 0;
      });
      if (this.appendToBody) {
        document.body.appendChild(this.$el);
      }
    } else {
      this.$el.removeEventListener('scroll', this.updatePopper);
      if (!this.closed) this.$emit('close');
      if (this.destroyOnClose) {
        /**********第三步**********/
        this.$nextTick(() => {
          this.key++;
        });
        /**********第三步**********/
      }
    }
  }
},
```

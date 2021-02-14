# 实现退出时发送信令

Agora.io 提供了监听用户退出频道的能力，你只需要监听`MemberLeft`事件，就可以监听到用户离开。

但`MemberLeft`事件的触发需要满足以下两者中任一条件：

1. 用户调用 leave 方法离开频道
2. 用户由于网络原因与 Agora RTM 系统断开连接达到 30 秒都会触发此回调


在 Web 浏览器中，有些时候用户的行为我们是无法监测到的，因此，此行为可能会比较缓慢，如果你希望获得一个更高效，更快的退出显示，则可以考虑组织浏览器退出，并发送退出信令给频道。

```js
window.addEventListener("unload", function (event) {
    event.preventDefault();
    event.returnValue = '';
    // 发送退出的信令
});
```
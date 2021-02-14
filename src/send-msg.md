# 实现信令传递与解析

Agora.io 提供的 API 是比较基础的，直接发送文本消息或者是图片消息。对于实际作为控制系统的信令系统，显然是无法满足业务需要的，需要根据自己的实际诉求来设计信令。

根据实际的应用场景，你可以根据你的需要来设计信令，比如我一般使用的有两种。

1. **JSON**
2. **简单信令**


## JSON 信令

JSON 信令顾名思义，将信令转换为 JSON 格式，从而方便进行传递和解析，比如，你可以构建这样的函数用于对信令格式化。

```js
function encode(id, cmd) {
    return JSON.stringify({
        id, cmd
    })
}
function decode(data) {
    return JSON.parse(data)
}
```

则在实际的发送信息和接受消息时，就可以这样处理

```js
// 发送信息
channel.sendMessage({ text: encode(userId,"THIS_IS_COMMAND") }).then(() => {
  /* 频道消息发送成功的处理逻辑 */
}).catch(error => {
  /* 频道消息发送失败的处理逻辑 */
});

// 接收信息
channel.on('ChannelMessage', ({ text }, senderId) => { // text 为收到的频道消息文本，senderId 为发送方的 User ID
    const cmd = decode(text)
    // 判断 cmd.cmd 来进行操作。
  /* 收到频道消息的处理逻辑 */
});
```


## 简单信令

JSON 信令很常用，但问题是在信令传递的过程中，会传递一些无用的数据，比如其间的引号等信息。如果希望信令进一步简化，则可以考虑使用简单信令。

简单信令则是使用不同的符号来切割信令，从而实现最大化的利用信令传递的数据空间。

比如，我们可以定义 `,` 用于分隔不同的参数;`|` 用于分隔不同的信令，则我们可以编写这样的函数来构建信令。

```js
function encode(id,cmd){
    return cmd + "," + id
}
function decode(cmd){
    return cmd.split(",")
}
```

则你可以使用 `THIS_IS_COMMAND,1` 来替代 JSON 信令中的 `{"cmd":"THIS_IS_COMMAND","id":1}`，大大的减少了需要传递的信令字符，提升系统的运行效率。
# 在 Web 应用中接入实时消息能力

在 Agora.io 官方文档中，给出了一个详细的接入说明，但在我看来，对开发者依然不够友好，因此，这里给出一个 MVP 版本的代码，帮助你快速理解你需要在页面中实现的逻辑。


## 1. 安装 SDK

根据你的开发经验不同，你可以选择使用包管理器安装 Agora 的 SDK， 或者直接加载 CDN 的 JS 文件来快速接入。

### 1.1 使用包管理器接入

**安装 SDK**

```bash
npm install agora-rtm-sdk --save
# yarn add agora-rtm-sdk
```

**在项目中引入依赖文件**

```js
import AgoraRTM from 'agora-rtm-sdk'
```
### 1.2 下载 SDK 并接入

不同于 RTC，Agora 并未给 RTM 提供 CDN 版本的 SDK（*这里有点奇怪*），因此你需要从[官网下载页面](https://docs.agora.io/cn/Real-time-Messaging/downloads)下载最新版 SDK 的 ZIP 包。

解压 ZIP 包后，你可以从项目中提取出 `libs/agora-rtm-sdk-x.y.z.js` 文件，并将这个文件放置在你的项目中，使用 script 标签引入。

```html
 <script src="/path/to/agora-rtm-sdk-1.4.1.js"></script>
```

## 2.  接入 Agora

如下这段代码是接入实时消息的最简代码，你可以先大体看一下，理解一下逻辑，稍后我们详细讲解其中的一些细节。

```js

/*
 * 初始化客户端
 */
const client = AgoraRTM.createInstance('<APPID>');
// 监听链接状态变化
client.on('ConnectionStateChanged', (newState, reason) => {
  console.log('on connection state changed to ' + newState + ' reason: ' + reason);
});
// 登陆用户，必需
client.login({ token: '<TOKEN>', uid: '<UID>' }).then(() => {
  console.log('AgoraRTM client login success');
}).catch(err => {
  console.log('AgoraRTM client login failure', err);
});

/*
 * 发送点对点消息，非必需
 */
client.sendMessageToPeer(
    { text: 'test peer message' }, // 符合 RtmMessage 接口的参数对象
    '<PEER_ID>', // 远端用户 ID
).then(sendResult => {
  if (sendResult.hasPeerReceived) {
    /* 远端用户收到消息的处理逻辑 */
  } else {
    /* 服务器已接收、但远端用户不可达的处理逻辑 */
  }
}).catch(error => {
  /* 发送失败的处理逻辑 */
});
client.on('MessageFromPeer', ({ text }, peerId) => { // text 为消息文本，peerId 是消息发送方 User ID
  /* 收到点对点消息的处理逻辑 */
});

/*
 * 发送频道消息，非必需
 */
const channel = client.createChannel('<CHANNEL_ID>'); // 此处传入频道 ID
channel.join().then(() => {
  /* 加入频道成功的处理逻辑 */
}).catch(error => {
  /* 加入频道失败的处理逻辑 */
});
channel.sendMessage({ text: 'test channel message' }).then(() => {
  /* 频道消息发送成功的处理逻辑 */
}).catch(error => {
  /* 频道消息发送失败的处理逻辑 */
});
channel.on('ChannelMessage', ({ text }, senderId) => { // text 为收到的频道消息文本，senderId 为发送方的 User ID
  /* 收到频道消息的处理逻辑 */
});
channel.leave();

client.logout();
```

上述代码中，可以分为三块：初始化、点对点消息、频道消息。

**初始化部分**是整个实时消息的基础部分，你需要使用 APPID 来初始化客户端，并登陆用户。

> 这里的 token 根据你选择的不同的项目鉴权方式，可以选择性的传递。

```js
const client = AgoraRTM.createInstance('<APPID>');
// 登陆用户，必需
client.login({ token: '<TOKEN>', uid: '<UID>' }).then(() => {
  console.log('AgoraRTM client login success');
}).catch(err => {
  console.log('AgoraRTM client login failure', err);
});
```


**点对点消息**可以根据你的实际业务需求来进行接入，如果不需要相关的功能，则可以不编写此部分的代码。

```js
client.sendMessageToPeer(
    { text: 'test peer message' }, // 符合 RtmMessage 接口的参数对象
    '<PEER_ID>', // 远端用户 ID
).then(sendResult => {
  if (sendResult.hasPeerReceived) {
    /* 远端用户收到消息的处理逻辑 */
  } else {
    /* 服务器已接收、但远端用户不可达的处理逻辑 */
  }
}).catch(error => {
  /* 发送失败的处理逻辑 */
});
client.on('MessageFromPeer', ({ text }, peerId) => { // text 为消息文本，peerId 是消息发送方 User ID
  /* 收到点对点消息的处理逻辑 */
});
```

**频道消息**可以根据你的实际业务需求来进行接入，如果不需要相关的功能，则可以不编写此部分代码

```js
const channel = client.createChannel('<CHANNEL_ID>'); // 此处传入频道 ID
channel.join().then(() => {
  /* 加入频道成功的处理逻辑 */
}).catch(error => {
  /* 加入频道失败的处理逻辑 */
});
channel.sendMessage({ text: 'test channel message' }).then(() => {
  /* 频道消息发送成功的处理逻辑 */
}).catch(error => {
  /* 频道消息发送失败的处理逻辑 */
});
channel.on('ChannelMessage', ({ text }, senderId) => { // text 为收到的频道消息文本，senderId 为发送方的 User ID
  /* 收到频道消息的处理逻辑 */
});
channel.leave();
```

## 3. 实现你自己的业务逻辑

当你完成了上述的代码逻辑后，你就实现了在页面中接入 Agora 的功能，接下来你要做的就是实现自己的业务逻辑即可。

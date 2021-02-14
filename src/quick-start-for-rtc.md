# 在 Web 应用中接入语音通话能力

Agora.io 在其官网文档中有[一些基础的说明](https://docs.agora.io/cn/Voice/start_call_audio_web_ng?platform=Web)，但对于一些具体的细节，我认为描述的并不够清楚，因此这里给出一个 MVP 版本的接入指南。


## 1. 安装 SDK

根据你的开发经验不同，你可以选择使用包管理器安装 Agora 的 SDK， 或者直接加载 CDN 的 JS 文件来快速接入。

### 1.1 使用包管理器接入

**安装 SDK**

```bash
npm install agora-rtc-sdk-ng --save
# yarn add agora-rtc-sdk-ng
```

**在项目中引入依赖文件**

```js
import AgoraRTC from "agora-rtc-sdk-ng"
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
```

### 1.2 使用 CDN 接入

使用 CDN 接入相对简单，你只需要将如下代码放在你的项目 HTML 中即可

```html
<script src="https://download.agora.io/sdk/release/AgoraRTC_N-4.3.0.js"></script>
```

## 2.  接入 Agora

如下这段代码是接入语音聊天的最简代码，你可以先大体看一下，理解一下逻辑，稍后我们详细讲解其中的一些细节。

```js
var rtc = {
  // 用来放置本地客户端。
  client: null,
  // 用来放置本地音频轨道对象。
  localAudioTrack: null,
};

var options = {
  // 替换成你自己项目的 App ID。
  appId: "<YOUR APP ID>",
  // 传入目标频道名。
  channel: "demo_channel_name",
  // 如果你的项目开启了 App 证书进行 Token 鉴权，这里填写生成的 Token 值。
  token: null,
};

async function startBasicCall() {
    
  // 初始化代码逻辑，必需
  rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  const uid = await rtc.client.join(options.appId, options.channel, options.token, null);
  
  /**
   * 以下逻辑用于订阅频道中的用户音轨，从而可以收听其他用户的声音，必需
   */
  rtc.client.on("user-published", async (user, mediaType) => {
    // 开始订阅远端用户。
    await rtc.client.subscribe(user, mediaType);
    console.log("subscribe success");

    // 表示本次订阅的是音频。
    if (mediaType === "audio") {
        // 订阅完成后，从 `user` 中获取远端音频轨道对象。
        const remoteAudioTrack = user.audioTrack;
        // 播放音频因为不会有画面，不需要提供 DOM 元素的信息。
        remoteAudioTrack.play();
    }
  });

  /**
   *  以下部分代码用于发布自己的音轨到频道中，一般应用于发言人的逻辑，非必需，根据实际业务需求来完成
   */
  
  // 通过麦克风采集的音频创建本地音频轨道对象。
  rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  // 将这些音频轨道对象发布到频道中。
  await rtc.client.publish([rtc.localAudioTrack]);
  console.log("publish success!");

  
}
async function leaveCall() {
  // 销毁本地音频轨道。
  rtc.localAudioTrack.close();

  // 离开频道。
  await rtc.client.leave();
}

startBasicCall();
leaveCall();
```

在上述这段代码中，最为核心的是 *startBasicCall* 中的三块代码，我们按照顺序来看。

第一段代码用于初始化一个 AgoraRTC 的客户端，并使用 Appid、Channel、Token 等信息，加入到频道中，从而获得后续和频道交互的能力。**这部分代码为必需的代码，无论你的应用是什么样的，都首先需要完成初始化，才能进行后续的操作。**

> 这里的 token 根据你选择的不同的项目鉴权方式，可以选择性的传递。

```js
rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
const uid = await rtc.client.join(options.appId, options.channel, options.token, null);
```

第二段代码则是用于订阅频道音频。在实际开发过程中，无论你的业务是什么样的，每一个人一定都需要先订阅频道，收听其他人的声音。因此，这部分代码也需要放在前面，且必需加入相关代码。

```js
rtc.client.on("user-published", async (user, mediaType) => {
    // 开始订阅远端用户。
    await rtc.client.subscribe(user, mediaType);
    console.log("subscribe success");

    // 表示本次订阅的是音频。
    if (mediaType === "audio") {
        // 订阅完成后，从 `user` 中获取远端音频轨道对象。
        const remoteAudioTrack = user.audioTrack;
        // 播放音频因为不会有画面，不需要提供 DOM 元素的信息。
        remoteAudioTrack.play();
    }
  });
```

第三段代码则是发布自己的声音，你可以通过下面的两行代码，实现使用麦克风采集音频，并发布到频道中，从而实现让用户说话的能力。这部分功能在实际的业务开发过程中，会根据不同的业务类型，选择性开启，因此，非必需的，这里放在了最后。

```js
  // 通过麦克风采集的音频创建本地音频轨道对象。
  rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  // 将这些音频轨道对象发布到频道中。
  await rtc.client.publish([rtc.localAudioTrack]);
  console.log("publish success!");
```

## 3. 实现你自己的业务逻辑

当你完成了上述的代码逻辑后，你就实现了在页面中接入 Agora 的功能，接下来你要做的就是实现自己的业务逻辑即可。

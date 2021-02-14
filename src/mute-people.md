# 实现用户静音

## 使用 setVolume

在实际的开发过程中，我们会希望设定管理员可以禁言/静音某些用户，这个时候我们就可以借助于 `setVolume` 来控制麦克风的收音音量，来实现**类似于静音的效果**。


```js
// 静音用户
rtc.localAudioTrack.setVolume(0)
// 恢复正常发言
rtc.localAudioTrack.setVolume(100)
```

setVolume 的好处是不会重新触发 user-published 事件，相对来说，可以更加实时的表现出静音/取消静音的特质。你可以使用这个功能来完成管理员的强制禁言，或者是用户主动的闭麦。

## 使用 setEnabled

如果你认为 setVolume 不够安全，则可以使用 `setEnabled` 来实现静音的效果。`setEnabled` 可以将本地的轨道关闭，从而实现完全的停止收音。

```js
// 静音用户
rtc.localAudioTrack.setEnabled(false)
// 恢复正常发言
rtc.localAudioTrack.setEnabled(true)
```

setEnabled 的好处是可以更加完全的关闭音轨，但坏处是当你开启后，会重新触发 `user-published` 事件[^setEnable]，存在一定的延时。

[^setEnable]: 相关文档查看[这里](https://docs.agora.io/cn/Voice/API%20Reference/web_ng/interfaces/imicrophoneaudiotrack.html#setenabled)
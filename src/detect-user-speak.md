# 实现用户说话监听

我们在开发应用的时候，会希望标记出哪个用户在发言，这个时候，我们可以通过 Agora 自己提供的 [enableAudioVolumeIndicator](https://docs.agora.io/cn/Voice/API%20Reference/web_ng/interfaces/iagorartcclient.html#enableaudiovolumeindicator) 方法来实现该功能。

当你完成初始化后，获得了 RTCClient 的实例后， 就可以在该实例上调用 `enableAudioVolumeIndicator` 方法，并监听`volume-indicator`事件，从而获得系统传递的事件。

```
client.enableAudioVolumeIndicator();
client.on("volume-indicator", volumes => {
  volumes.forEach((volume, index) => {
      // 此处可以拿到发言用户的 UID 和 level。
      // 如果 level >= 5 ，则可以视为该用户正在说话
    console.log(`${index} UID ${volume.uid} Level ${volume.level}`);
  });
})
```

在使用时，如果你检测到用户的 Level 超过了 5 ，则可以视为该用户正在发言[^level]

在实际使用的时候，需要注意，该事件每 2 秒传递一次数据[^level]，如果你需要更实时的状态展示，则需要通过其他的方法来完成

[^level]: 相关文档见[这里](https://docs.agora.io/cn/Voice/API%20Reference/web_ng/interfaces/iagorartcclient.html#event_volume_indicator
)
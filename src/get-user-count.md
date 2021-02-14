# 实现显示用户人数

Agroa.io 提供了 [getChannelMemberCount](https://docs.agora.io/cn/Real-time-Messaging/API%20Reference/RTM_web/classes/rtmclient.html#getchannelmembercount) 方法来获取频道中的人数。

不过，你也可以通过监听 [MemberCountUpdated](https://docs.agora.io/cn/Real-time-Messaging/API%20Reference/RTM_web/interfaces/rtmevents.rtmchannelevents.html#membercountupdated) 事件来获得频道内的用户人数。后者在频道成员人数 ≤ 512 时，触发频率为每秒 1 次；频道成员人数超过 512 时，触发频率为每 3 秒 1 次。
# README.md

* [Show Time](http://zorozeng.com/ComputeX/)  
* [设备仿真器](bin/python3)
* [Policy自动生成器](bin/python2)：记得绑定策略
* [Backend Code](https://github.com/Aplexchenfl/mqtt_message)

## MQTT Topic

* `computex/+/iot/+/ledBackend`：专门为反控Led控制
  * `computex/{{city}}/iot/{{device}}/ledBackend`
* `computex/+/iot/+/numBackend`：专门为反控数码管控制
  * `computex/{{city}}/iot/{{device}}/numBackend`
* `computex/+/iot/+/btnData`：专门给按键数据传输
  * `computex/{{city}}/iot/{{device}}/btnData`
* `computex/+/iot/+/tempData`：专门给温度显示数据传输
  * `computex/{{city}}/iot/{{device}}/tempData`
* `computex/+/iot/+/backend`：兼容以前版本(已经不使用)
  * `computex/{{city}}/iot/{{device}}/backend`
* `computex/+/iot/+/DataTransfer`：兼容以前数据传输(已经不使用)
  * `computex/{{city}}/iot/{{device}}/DataTransfer`

为了让新连接的设备能够获取到当前最新的消息，所有发送的消息带上`retained = true`;

## Simulation

[Python3 Code](https://github.com/ZengjfOS/ComputeX/tree/master/bin/python3)

## Data Format

```JSON
{
    "gateway_id":"5100",        // 网关设备id
    "device_id":1,              // 连接到网关的设备id
    "funcode":2,                // 功能码
    "value":1                   // 对应功能码的值
}
```

### Button

* `funcode`: `0x01`；
* `value`: 
  * 一个bit代表一个按键；
  * 一共6 bit；
  * 低位为第一个按键；

### Led

* `funcode`: `0x02`；
* `value`:
  * 全亮: `0x01`;
  * 全灭: `0x02`;
  * 闪烁: `0x03`;
  * 流水: `0x04`;

### Num

* `funcode`: `0x03`；
* `value`:
  * 显示0: `0x00`;
  * 显示1: `0x01`;
  * 显示2: `0x02`;
  * 显示3: `0x03`;
  * 显示4: `0x04`;
  * 显示5: `0x05`;
  * 显示6: `0x06`;
  * 显示7: `0x07`;
  * 显示8: `0x08`;
  * 显示9: `0x09`;

### 温度

* `funcode`: `0x04`；
* `value`: 温度对应的值；

## 演示效果

![./img/ComputeX.gif](./img/ComputeX.gif)

## 物可视（时序数据库）

* 时序数据库：``SELECT funcode AS metric, `value` AS _value, `timestamp` AS _timestamp, gateway_id, device_id, city FROM computex/+/iot/+/tempData WHERE funcode=4``
* 展示页面HTML内容：[IoTViz.html](./IoTViz.html)
* 数据显示：  
  ![./img/IoTViz.png](./img/IoTViz.png)

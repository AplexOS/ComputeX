# README.md

* [Show Time](http://zorozeng.com/ComputeX/)  
* [设备仿真器](bin/python3)
* [Policy自动生成器](bin/python2)：记得绑定策略
* [Backend Code](https://github.com/Aplexchenfl/mqtt_message)

## MQTT Topic

* `computex/+/iot/+/backend`：兼容以前版本
  * `computex/{{city}}/iot/{{device}}/backend`
* `computex/+/iot/+/ledBackend`：专门为反控Led控制
  * `computex/{{city}}/iot/{{device}}/backend`
* `computex/+/iot/+/numBackend`：专门为反控数码管控制
  * `computex/{{city}}/iot/{{device}}/backend`
* `computex/+/iot/+/DataTransfer`：专门给数据传输
  * `computex/{{city}}/iot/{{device}}/DataTransfer`

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

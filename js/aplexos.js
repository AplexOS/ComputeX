class Context{
    constructor() {
        this.mqtt = null;                       // mqtt client
        this.topic = null;
        this.device = null;
    }
}

class BaiduIoTHubMQTT {
    constructor(address, port, username, passwd, topic) {
        // Create a client instance
        this.client = new Paho.MQTT.Client(address, port, "DeviceId-" + Math.random().toString(36).substring(7));
        this.username = username;
        this.passwd = passwd;
        this.topic = topic;
        this.serverConnected = false;
        
        // set callback handlers
        this.client.onConnectionLost = this.onConnectionLost;
        this.client.onMessageArrived = this.onMessageArrived;
        this.connect();
    }

    connect() {
        // connect the client
        this.client.connect({onSuccess:this.onConnect, onFailure:this.onConnectError, userName:this.username, password:this.passwd, useSSL:true});
    }

    // called when the client connects
    onConnect() {
        // Once a connection has been made, make a subscription and send a message.
        this.serverConnected = true;
        console.log("mqtt connect");
    }

    subscribe(topic) {
        console.log("subscribe topic:" + topic);
        if (this.client.isConnected()) {
            this.client.subscribe(topic);
            this.topic = topic;
        }
    }

    unsubscribe(topic) {
        console.log("unsubscribe topic:" + topic);
        if (this.client.isConnected()) {
            this.client.unsubscribe(this.topic);
        }
    }

    // called when the client connects
    onConnectError() {
        console.log("mqtt connect error");
    }
    
    // called when the client loses its connection
    onConnectionLost(responseObject) {
        console.log(responseObject);
    }
    
    // called when a message arrives
    onMessageArrived(message) {
        var stminfo = JSON.parse(message.payloadString);

        for (var i = 0; i < 6; i++)
        {
            if ((stminfo["value"] >> i) & 0x01) {
                $("[name='light_led_" + (i + 1) + "']").attr("src","img/led_green.png");
                console.log(1);
            } else {
                $("[name='light_led_" + (i + 1) + "']").attr("src","img/led_gray.png");
                console.log(0);
            } 
        }

        console.log(stminfo);
    }
}

function getFileName(filePath){  
    var pos = filePath.lastIndexOf("/");  
    return filePath.substring(pos+1);    
}  

function randomPowerStatus(img) {

    var fileName = getFileName(img[0].src);
    var imgName = img[0].name;
    
    if (((Math.random() * (10 - 1) + 1) / 5) > 1) {
        if (fileName == "led_green.png" || fileName == "led_orange.png" || fileName == "led_blue.png" || fileName == "led_white.png") {
            img[0].src = "img/led_gray.png"
        } else {
            var moduleColor = imgName.substring(imgName.lastIndexOf("_") + 1);    
            img[0].src = "img/led_" + moduleColor + ".png";
        }
    }
}

function deviceOptionOnChange(object) {
    console.log(object.value)
    console.log($("#ledSelect").val());
    console.log($("#numSelect").val());

    context.device = object.value;

    // computex/iot/+/DataTransfer
    if (context.topic != null) {
        console.log(context.topic);
        context.mqtt.unsubscribe(context.topic);
    } 
        
    var current_topic = "computex/iot/" + context.device + "/DataTransfer";
    context.mqtt.subscribe(current_topic);
    context.topic = current_topic;

    cur_payload = {};
    cur_payload["gateway_id"] = context.device;
    cur_payload["device_id"] = 1
    cur_payload["funcode"] = 2
    cur_payload["value"] = parseInt($("#ledSelect").val());

    // console.log(JSON.stringify(cur_payload));
    message = new Paho.MQTT.Message(JSON.stringify(cur_payload));
    message.destinationName = "computex/iot/" + context.device + "/backend";
    context.mqtt.client.send(message);

    cur_payload["gateway_id"] = context.device;
    cur_payload["device_id"] = 1
    cur_payload["funcode"] = 3
    cur_payload["value"] = parseInt($("#numSelect").val());

    // console.log(JSON.stringify(cur_payload));
    message = new Paho.MQTT.Message(JSON.stringify(cur_payload));
    message.destinationName = "computex/iot/" + context.device + "/backend";
    context.mqtt.client.send(message);
}

function ledOptionOnChange(object) {
    console.log(object.value)

    cur_payload = {};
    cur_payload["gateway_id"] = context.device;
    cur_payload["device_id"] = 1
    cur_payload["funcode"] = 2
    cur_payload["value"] = parseInt(object.value);

    // console.log(JSON.stringify(cur_payload));
    message = new Paho.MQTT.Message(JSON.stringify(cur_payload));
    message.destinationName = "computex/iot/" + context.device + "/backend";
    context.mqtt.client.send(message);
}

function numOptionOnChange(object) {
    console.log(object.value)

    cur_payload["gateway_id"] = context.device;
    cur_payload["device_id"] = 1
    cur_payload["funcode"] = 3
    cur_payload["value"] = parseInt(object.value);

    // console.log(JSON.stringify(cur_payload));
    message = new Paho.MQTT.Message(JSON.stringify(cur_payload));
    message.destinationName = "computex/iot/" + context.device + "/backend";
    context.mqtt.client.send(message);
}
$(function(){
    function footerPosition(){
        $("footer").removeClass("fixed-bottom");
        var contentHeight = document.body.scrollHeight,//网页正文全文高度
            winHeight = window.innerHeight;//可视窗口高度，不包括浏览器顶部工具栏
        if(!(contentHeight > winHeight)){
            //当网页正文高度小于可视窗口高度时，为footer添加类fixed-bottom
            $("footer").addClass("fixed-bottom");
        }
    }

    footerPosition();
    $(window).resize(footerPosition);

    // auto to center
    if (document.documentElement.clientHeight > 738) {
        $("#sp_spacing_div").height((document.documentElement.clientHeight / 2) - (738 / 2));
    }

    context = new Context();
    context.mqtt = new BaiduIoTHubMQTT("baidumap.mqtt.iot.gz.baidubce.com", 8884, "baidumap/iotmap", "bjBb+EUd5rwfo9fBaZUMlwG8psde+abMx35m/euTUfE=", "DataTransfer");

});

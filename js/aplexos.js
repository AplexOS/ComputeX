class Context{
    constructor() {
        this.mqtt = null;                       // mqtt client
        this.tempDataTopic = null;
        this.btnDataTopic = null;
        this.ledBackendTopic = null;
        this.numBackendTopic = null;
        this.device = null;
        this.city = null;
    }
}

class BaiduIoTHubMQTT {
    constructor(address, port, username, passwd, topic) {
        // Create a client instance
        this.client = new Paho.MQTT.Client(address, port, "DeviceId-" + Math.random().toString(36).substring(7));
        this.username = username;
        this.passwd = passwd;
        this.tempDataTopic = topic;
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
        $("#subscribeBut").prop("disabled", false);
        $("#subscribeBut").html("Subscribe");
        console.log("mqtt connect");
    }

    subscribe(topic) {
        console.log("subscribe topic:" + topic);
        if (this.client.isConnected()) {
            this.client.subscribe(topic);
            this.tempDataTopic = topic;
        }
    }

    unsubscribe(topic) {
        console.log("unsubscribe topic:" + topic);
        if (this.client.isConnected()) {
            this.client.unsubscribe(topic);
        }
    }

    // called when the client connects
    onConnectError() {
        console.log("mqtt connect error");
    }
    
    // called when the client loses its connection
    onConnectionLost(responseObject) {
        console.log(responseObject);
        this.connect();
    }
    
    // called when a message arrives
    onMessageArrived(message) {
        var stminfo = JSON.parse(message.payloadString);

        if (stminfo["funcode"] == 1) {
            for (var i = 0; i < 6; i++)
            {
                if ((stminfo["value"] >> i) & 0x01) {
                    $("[name='light_led_" + (i + 1) + "']").attr("src","img/led_green.png");
                } else {
                    $("[name='light_led_" + (i + 1) + "']").attr("src","img/led_gray.png");
                } 
            }
        }

        if (stminfo["funcode"] == 2) {
            $("#ledSelect").val(stminfo["value"]);

            led_status = stminfo["value"];
            led_value = 1;
        }

        if (stminfo["funcode"] == 3) {
            $("#numSelect").val(stminfo["value"]);

            var data={
                char:1,
                // dot=false,
                // colon=false,
                color:'#00e',
            }
            data.char = stminfo["value"];
            nd1.inner(data);
            nd2.inner(data);
            nd3.inner(data);
            nd4.inner(data);
        }

        if (stminfo["funcode"] == 4) {
            gaugeElement.setAttribute('data-value', stminfo["value"]);
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
    context.device = object.value;
    console.log(context.device)
}

function cityOptionOnChange(object) {
    context.city = object.value;
    console.log(context.city)
}

function connectButton(object) {
    console.log("connect Button");

    console.log(object.innerHTML);

    if (object.innerHTML == "Subscribe") {
        if (context.device == null || context.city == null) 
            return;

        $("#deviceOptionAddress").attr('disabled', 'disabled');
        $("#deviceOptionDevice").attr('disabled', 'disabled');

        var tempDataTopic = "computex/" + context.city + "/iot/" + context.device + "/tempData";
        context.mqtt.subscribe(tempDataTopic);
        context.tempDataTopic = tempDataTopic;

        var ledBackendTopic = "computex/" + context.city + "/iot/" + context.device + "/ledBackend";
        context.mqtt.subscribe(ledBackendTopic);
        context.ledBackendTopic = ledBackendTopic;

        var numBackendTopic = "computex/" + context.city + "/iot/" + context.device + "/numBackend";
        context.mqtt.subscribe(numBackendTopic);
        context.numBackendTopic = numBackendTopic;

        var btnDataTopic = "computex/" + context.city + "/iot/" + context.device + "/btnData";
        context.mqtt.subscribe(btnDataTopic);
        context.btnDataTopic = btnDataTopic;

        object.innerHTML = "Unsubscribe";
    } else {

        $("#deviceOptionAddress").removeAttr('disabled');
        $("#deviceOptionDevice").removeAttr('disabled');

        if (context.tempDataTopic != null) {
            console.log(context.tempDataTopic);
            context.mqtt.unsubscribe(context.tempDataTopic);
            context.tempDataTopic = null;
            context.mqtt.unsubscribe(context.ledBackendTopic);
            context.ledBackendTopic = null;
            context.mqtt.unsubscribe(context.numBackendTopic);
            context.numBackendTopic = null;
            context.mqtt.unsubscribe(context.btnDataTopic);
            context.btnDataTopic = null;
        } 

        object.innerHTML = "Subscribe";
    }
}

function ledOptionOnChange(object) {
    console.log(object.value)

    if (object.value == -1)
        return;

    led_status = object.value;
    led_value = 1;

    cur_payload = {};
    cur_payload["gateway_id"] = context.device;
    cur_payload["device_id"] = 1
    cur_payload["funcode"] = 2
    cur_payload["value"] = parseInt(object.value);

    // console.log(JSON.stringify(cur_payload));
    message = new Paho.MQTT.Message(JSON.stringify(cur_payload));
    // message.destinationName = "computex/" + context.city + "/iot/" + context.device + "/ledBackend";
    message.destinationName = context.ledBackendTopic;
    message.retained = true;
    context.mqtt.client.send(message);

    console.log("send over");
}

function numOptionOnChange(object) {
    console.log(object.value)

    if (object.value == -1)
        return;

    var data={
        char:1,
        // dot=false,
        // colon=false,
        color:'#00e',
    }
    data.char = object.value;
    nd1.inner(data);
    nd2.inner(data);
    nd3.inner(data);
    nd4.inner(data);

    cur_payload = {};
    cur_payload["gateway_id"] = context.device;
    cur_payload["device_id"] = 1
    cur_payload["funcode"] = 3
    cur_payload["value"] = parseInt(object.value);

    // console.log(JSON.stringify(cur_payload));
    message = new Paho.MQTT.Message(JSON.stringify(cur_payload));
    // message.destinationName = "computex/" + context.city + "/iot/" + context.device + "/numBackend";
    message.destinationName = context.numBackendTopic;
    message.retained = true;
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

    gaugeElement = document.getElementsByTagName('canvas')[0];
    gaugeElement.setAttribute('data-value', 25);

    context = new Context();
    context.mqtt = new BaiduIoTHubMQTT("baidumap.mqtt.iot.gz.baidubce.com", 8884, "baidumap/iotmap", "bjBb+EUd5rwfo9fBaZUMlwG8psde+abMx35m/euTUfE=", "DataTransfer");

    led_status = 0;
    led_value = 1;
    setInterval(function(){
        if (led_status == 0) {
            return;
        } else if (led_status == 1) {
            for (var i = 0; i < 8; i++)
            {
                $("[name='led_led_" + (i + 1) + "']").attr("src","img/led_green.png");
            }
        } else if (led_status == 2) {
            for (var i = 0; i < 8; i++)
            {
                $("[name='led_led_" + (i + 1) + "']").attr("src","img/led_gray.png");
            }
        } else if (led_status == 3) {
            if (led_value > 0) {
                for (var i = 0; i < 8; i++)
                {
                    $("[name='led_led_" + (i + 1) + "']").attr("src","img/led_gray.png");
                }
                led_value = 0;
            } else {
                for (var i = 0; i < 8; i++)
                {
                    $("[name='led_led_" + (i + 1) + "']").attr("src","img/led_green.png");
                }
                led_value = 1;
            }
        } else if (led_status == 4) {
            for (var i = 0; i < 8; i++)
            {
                if ((led_value >> i) == 1)
                    $("[name='led_led_" + (i + 1) + "']").attr("src","img/led_green.png");
                else 
                    $("[name='led_led_" + (i + 1) + "']").attr("src","img/led_gray.png");
            }

            led_value <<= 1;
            if (led_value > 0x80)
                led_value = 1;

        }
    },500)

});

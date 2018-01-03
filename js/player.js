var bPlaying = false;
var timer;

var videoEl = null;
var queryDict = {};


var signalingServer;
var registerServer;

if(location.search===''){
    signalingServer = webrtcServer+":8888";
    registerServer = webrtcServer+":8889";
}else{
    signalingServer = "http://127.0.0.1:8888";
    registerServer = "http://127.0.0.1:8889"; 
}

var room;
var targetId;

var canvas;
var ctx;
var webrtc;

$.ajax({
    type: "get",
    url: registerServer + "/get_service_id",
    async : false,
    crossDomain: true, 
    success: function (service_id) {
        if(service_id && service_id.length > 0) {

            var arr = service_id.split("@");
            room = arr[0];

            targetId = arr[1];

            canvas = document.createElement('canvas');
            ctx = canvas.getContext('2d');
            
            // create webrtc connection
            webrtc = new SimpleWebRTC({
                target: targetId,
                url: signalingServer,
                stunServer: 'stun:stun.l.google.com:19302',
                localVideoEl: '',
                remoteVideosEl: '',
                autoRequestMedia: false,
                debug: false,
                detectSpeakingEvents: true,
                autoAdjustMic: false
            });
            
            // when it's ready, join if we got a room from the URL
            webrtc.on('readyToCall', function () {
    
                webrtc.setInfo('', webrtc.connection.connection.id, ''); // Store strongId
    
                if (room) {

                    webrtc.joinRoom(room);
                    
                    
                }
            });
    
            //Handle incoming video from target peer
            webrtc.on('videoAdded', function (video, peer) {
                //console.log('video added', peer);
                var container = document.getElementById('ocx');
                if (peer.id == targetId || peer.strongID == targetId || peer.nickName == targetId) {
    
                    videoEl = video;
                    while (container.hasChildNodes())
                        container.removeChild(container.lastChild);
    
                    videoEl.addEventListener('loadedmetadata', initCanvas, false);
                    videoEl.addEventListener('timeupdate', drawFrame, false);
                    videoEl.addEventListener('ended', onend, false);
            
                    container.appendChild(video);
                    webrtc.stopLocalVideo();
                    PLAYER.observer.trigger('webrtcPlayer',true); //发布工程数据
                }
            });
    
            //Handle removing video by target peer
            webrtc.on('videoRemoved', function (video, peer) {
                //console.log('video removed ', peer);
                var container = document.getElementById('ocx');
                if (peer.id == targetId || peer.strongId == targetId || peer.nickName == targetId) {
    
                    videoEl = null;
                    while (container.hasChildNodes())
                        container.removeChild(container.lastChild);
    
                    var videoStub = document.createElement('video');
                    container.appendChild(videoStub);
                }
            });
    
            //Handle message from target peer
            webrtc.on('channelMessage', function (peer, label, data) {
                if (data.type == 'custommessage') {
                    
                    PLAYER.VUMeterInfo=JSON.parse(data.payload).params.value;
                    //console.log(PLAYER.VUMeterInfo);
                }
            });
            //////////////////////////////////
        } else {
            alert("没有可用的服务器");
        }
        
    },
    error:function () {      
        alert("请求失败");
    }
 });
function initCanvas(e) {
    canvas.width = this.videoWidth;
    canvas.height = this.videoHeight;
}

function drawFrame(e) {
    //console.log('ffds',this.videoWidth)
    canvas.width = this.videoWidth;
    canvas.height = this.videoHeight;

    //Draw image to canvas
    ctx.drawImage(this, 0, 0, this.videoWidth, this.videoHeight);

    var idata = ctx.getImageData(0, 0, this.videoWidth, this.videoHeight);
    var data = idata.data;

    //We have an rgba bufer with bitdepth=32 (4 b/px)
    var rowSize = idata.width * 4;
    var lastRowPos = (idata.width * idata.height - idata.width) * 4;
    //Row is splitted to 34 chunks. First and last are not used
    var chunkLength = (idata.width * 4) / 34;
    var firstChunkPos = lastRowPos + Math.round(chunkLength + chunkLength / 2);
    var currentPos = firstChunkPos;
    var binary = 0;
    var n = 7;
    var frames = "";
    var seconds = "";
    var minutes = "";
    var hours = "";
    for (i = 1; i < 33; i++) {
        //Move to the beginning of the pixel
        if (!(data[currentPos + 3] == 253 || data[currentPos + 3] == 254 || data[currentPos + 3] == 255)) {
            for (j = 0; j < 3; j++) {
                if (data[currentPos] == 253 || data[currentPos] == 254 || data[currentPos] == 255) {
                    currentPos = currentPos + 1;
                    break;
                }
                currentPos++;
            }
        }
        //Chek if chunk is white and set appropriate bit
        if (data[currentPos] > 50 && data[currentPos + 1] > 50 && data[currentPos + 2] > 50)
            binary |= 1 << n;
        n--;

        if (i == 8) {
            hours = binary.toString();
            binary = 0;
            n = 7;
        }
        if (i == 16) {
            minutes = binary.toString();
            binary = 0;
            n = 7;
        }
        if (i == 24) {
            seconds = binary.toString();
            binary = 0;
            n = 7;
        }
        if (i == 32) {
            frames = binary.toString();
        }
        currentPos = Math.round(firstChunkPos + i * chunkLength);
    }
    $('#timecode').val(("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2) + "." + ("0" + frames).slice(-2));
   
    PLAYER.currentTime = (parseInt(hours)*3600000 + parseInt(minutes)*60000 + parseInt(seconds)*1000) + parseInt(frames)*40;
    if(bPlaying) {
        $( "#seekbar" ).slider( "value" , PLAYER.currentTime);
    }
}

function onend(e) {
}

//发布订阅设计模式
PLAYER.observer=(function(){
    var clientList={},
        listen,
        remove,
        trigger;

    listen=function(key,fn){
        if(!clientList[key]){
            clientList[key]=[];
        }
        clientList[key].push(fn);
    };
    trigger=function(){
        var key=Array.prototype.shift.call(arguments);
        var fns=clientList[key];
        if(!fns || fns.length===0){
            return false;
        }else{
            for(var i=0,fn;fn=fns[i++];){
                fn.apply(this,arguments);
            }
        }
    };
    remove=function(key,fn){
        var fns=clientList[key];
        if(!fns){
            return false;
        }
        if(!fn){
            fns && (fns.length=0);
        }else{
            for(var l=fns.length-1;l>=0;l--) {
                
                var _fn=fns[l];
                if(_fn===fn){
                    fns.splice(l,1);
                }
            }
        }
    };

    return {
        listen:listen,
        remove:remove,
        trigger:trigger
    }
})();
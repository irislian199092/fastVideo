PLAYER.playerFunction=function(){
    function constructor(){
        this.config={
            targetObj:'time_ruler',
            hasTrack:true
        }
        this.playerConfig={
            targetObj:'player_time_ruler',
            hasTrack:false,
            rulerHeight: 35,
            trimHeight:15
        }
        PLAYER.TR = new PLAYER.timeRuler(this.config);
        PLAYER.PTR = new PLAYER.timeRuler2(this.playerConfig);
        PLAYER.OCX=new PLAYER.ocxFunction();
        PLAYER.documentEvent.addHandler('keydown',publicKeyDownEvent);  //公共键盘事件

        setInterval(function() {
            var s=PLAYER.TR.config.seekComandTimesMonitor.length;
            if(s!== 0){
                var lastSeekTime = PLAYER.TR.config.seekComandTimesMonitor[s - 1];
                PLAYER.TR.config.seekComandTimesMonitor = [];

                PLAYER.TR.currTime=lastSeekTime;

                PLAYER.TR.fixArrowCurrentTime(lastSeekTime);
                PLAYER.OCX.seek(lastSeekTime);

                if(lastSeekTime>=PLAYER.PTR.config.maxTime){
                    lastSeekTime=PLAYER.PTR.config.maxTime;
                }
                PLAYER.PTR.currTime=lastSeekTime;
                PLAYER.PTR.fixArrowCurrentTime(lastSeekTime);
            }
        }, 10);
        setInterval(function() {
            var s=PLAYER.PTR.config.seekComandTimesMonitor.length;
            if(s!== 0){
                var lastSeekTime = PLAYER.PTR.config.seekComandTimesMonitor[s - 1];
                PLAYER.PTR.config.seekComandTimesMonitor = [];

                if(!PLAYER.dbClick){
                    PLAYER.TR.currTime=lastSeekTime;
                    PLAYER.TR.fixArrowCurrentTime(lastSeekTime);
                    if(lastSeekTime>=PLAYER.PTR.config.maxTime){
                        lastSeekTime=PLAYER.PTR.config.maxTime;
                    }
                }
                PLAYER.OCX.seek(lastSeekTime);
                PLAYER.PTR.currTime=lastSeekTime;
                PLAYER.PTR.fixArrowCurrentTime(lastSeekTime);
            }
        }, 10);
    }
    constructor.prototype={
        play:function(){//点击播放暂停
            if(PLAYER.isPlaying){
                PLAYER.OCX.doPause();
                $("#js_play").removeClass("stop")
                $("#js_play").attr("title", "播放");
                PLAYER.isPlaying=false;

            }else{
                PLAYER.isPlaying=true;
                PLAYER.OCX.doPlay(40*parseInt(PLAYER.TR.currTime), 100000000000);
                $("#js_play").addClass("stop")
                $("#js_play").attr("title", "停止");

                setPlayer();
                setVuInfo();
            }
        },
        setIntervalPlay:function(){//点击设置循环播放(测试有bug)
            var triminFrame=parseInt(PLAYER.TR.trimInCurrTime);
            var trimoutFrame=parseInt(PLAYER.TR.trimOutCurrTime);
            var interOrNo=$('#js_setInterval').parent('li').hasClass('active');

            if(PLAYER.isPlaying){
                PLAYER.OCX.doPause();
                $("#js_play").removeClass("stop")
                $("#js_play").attr("title", "播放");
                PLAYER.isPlaying=false;
            }else{
                PLAYER.OCX.seek(triminFrame);
                PLAYER.OCX.doPlay();
                $("#js_play").addClass("stop")
                $("#js_play").attr("title", "停止");
                PLAYER.isPlaying=true;
                setTimeout(function(){
                    var s=PLAYER.OCX.getPosition();
                    console.log('s',s);
                    PLAYER.TR.fixArrowCurrentTime(s);
                    PLAYER.TR.currTime=s;
                    PLAYER.PTR.fixArrowCurrentTime(s);
                    PLAYER.PTR.currTime=s;
                    $('#js_player_nowTime').html(PLAYER.getDurationToString(s));
                    $('#js_time_ruler_title_nowTime').html(PLAYER.getDurationToString(s));
                    if(PLAYER.loadState&&PLAYER.isPlaying){
                        console.log('trimoutFrame',trimoutFrame);
                        if(s!==trimoutFrame){
                            console.log('没有到出点');
                            setTimeout(arguments.callee,40);
                        }else{
                            console.log('到出点',triminFrame);
                            PLAYER.OCX.doPause();
                            //PLAYER.isPlaying=false;

                            PLAYER.OCX.seek(triminFrame);
                            PLAYER.OCX.doPlay();
                            PLAYER.isPlaying=true;
                            $("#js_play").addClass("stop")
                            $("#js_play").attr("title", "停止");
                            setTimeout(arguments.callee,40);
                        }
                    }
                },40);
            }
        },
        setTrimIn:function(){//点击设置入点
            if(PLAYER.isPlaying){
                PLAYER.OCX.doPause();
                PLAYER.isPlaying=false;
                $("#js_play").removeClass("stop")
                $("#js_play").attr("title", "播放");
            }
            if(!PLAYER.dbClick){
                PLAYER.TR.fixTrimInByCurrentTime(parseInt(PLAYER.TR.currTime));
            }
            PLAYER.PTR.fixTrimInByCurrentTime(parseInt(PLAYER.PTR.currTime));
        },
        setTrimOut:function(){//点击设置出点
            if(PLAYER.isPlaying){
                PLAYER.OCX.doPause();
                PLAYER.isPlaying=false;
                $("#js_play").removeClass("stop")
                $("#js_play").attr("title", "播放");
            }
            if(!PLAYER.dbClick){
                PLAYER.TR.fixTrimOutByCurrentTime(parseInt(PLAYER.TR.currTime));
            }
            PLAYER.PTR.fixTrimOutByCurrentTime(parseInt(PLAYER.PTR.currTime));
        },
        moveTrimIn:function(){//点击移动到入点
            if(PLAYER.isPlaying){
                PLAYER.OCX.doPause();
                PLAYER.isPlaying=false;
                $("#js_play").removeClass("stop")
                $("#js_play").attr("title", "播放");
            }
            if($('.time_ruler_trimInOut').width()){
                if(!PLAYER.dbClick){
                    PLAYER.TR.fixArrowCurrentTime(parseInt(PLAYER.TR.trimInCurrTime));
                }
                PLAYER.PTR.fixArrowCurrentTime(parseInt(PLAYER.PTR.trimInCurrTime));
                PLAYER.OCX.seek(parseInt(PLAYER.PTR.trimInCurrTime));
            }else{
                return false;
            }
        },
        moveTrimOut:function(){//点击移动到出点
            if(PLAYER.isPlaying){
                PLAYER.OCX.doPause();
                PLAYER.isPlaying=false;
                $("#js_play").removeClass("stop")
                $("#js_play").attr("title", "播放");
            }
            if($('.time_ruler_trimInOut').width()){
                if(!PLAYER.dbClick){
                    PLAYER.TR.fixArrowCurrentTime(parseInt(PLAYER.TR.trimOutCurrTime));
                }
                PLAYER.PTR.fixArrowCurrentTime(parseInt(PLAYER.PTR.trimOutCurrTime));
                PLAYER.OCX.seek(parseInt(PLAYER.PTR.trimOutCurrTime));
            }else{
                return false;
            }
        },
        prevFrame:function(){//点击前一帧
            if(PLAYER.isPlaying){
                PLAYER.OCX.doPause();
                PLAYER.isPlaying=false;
                $("#js_play").removeClass("stop")
                $("#js_play").attr("title", "播放");
            }
            if(!PLAYER.dbClick){
                PLAYER.TR.moveToPrevFrame();
            }
            PLAYER.PTR.moveToPrevFrame();
            PLAYER.OCX.seek(parseInt(PLAYER.PTR.currTime));
        },
        nextFrame:function(){//点击后一帧
            if(PLAYER.isPlaying){
                PLAYER.OCX.doPause();
                PLAYER.isPlaying=false;
                $("#js_play").removeClass("stop")
                $("#js_play").attr("title", "播放");
            }
            if(!PLAYER.dbClick){
                PLAYER.TR.moveToNextFrame();
            }
            PLAYER.PTR.moveToNextFrame();
            PLAYER.OCX.seek(parseInt(PLAYER.PTR.currTime));
        },
        toFirstFrame:function(){//点击到序列头
            if(!PLAYER.dbClick){
                if(PLAYER.isPlaying){
                    PLAYER.OCX.doPause();
                    PLAYER.isPlaying=false;
                    $("#js_play").removeClass("stop")
                    $("#js_play").attr("title", "播放");
                }
                var time=PLAYER.operateJson.getFirstFrame();
                console.log('time',time)

                PLAYER.TR.fixArrowCurrentTime(time);
                PLAYER.PTR.fixArrowCurrentTime(time);
                PLAYER.OCX.seek(parseInt(time));
            }else{
                return false;
            }
        },
        toLastFrame:function(){//点击到序列尾
            if(!PLAYER.dbClick){
                if(PLAYER.isPlaying){
                    PLAYER.OCX.doPause();
                    PLAYER.isPlaying=false;
                    $("#js_play").removeClass("stop")
                    $("#js_play").attr("title", "播放");
                }
                if($('.time_ruler_bar').children().length){
                    var time=PLAYER.operateJson.getLastFrame();
                    PLAYER.TR.fixArrowCurrentTime(time);
                    PLAYER.PTR.fixArrowCurrentTime(time);
                    PLAYER.OCX.seek(time);
                }
            }else{
                return false;
            }
        },
        toolbar_choose:function(){//工具条(v)
            if(!PLAYER.dbClick){
               PLAYER.keyNum=86;
                $('.time_ruler_toolbar').children('span').removeClass('active');
                $('#js_toolbar_select').addClass('active');
                PLAYER.TR.config.$clipTrackBar.css({cursor:"default"});
            }
        },
        toolbar_preSelect:function(){//工具条向前选择(g)
            if(!PLAYER.dbClick){
                console.log('向前选择','A');
                PLAYER.keyNum=71;
                $('.time_ruler_toolbar').children('span').removeClass('active');
                $('#js_toolbar_select_pre').addClass('active');
                PLAYER.TR.config.$clipTrackBar.css({cursor:"url(images/cur/select_back.cur),default"});
            }
        },
        toolbar_nextSelect:function(){//工具条向后选择(shiftg)
            if(!PLAYER.dbClick){
                console.log('向后选择','shift+A');
                PLAYER.keyNum=7100;
                $('.time_ruler_toolbar').children('span').removeClass('active');
                $('#js_toolbar_select_back').addClass('active');
                PLAYER.TR.config.$clipTrackBar.css({cursor:"url(images/cur/select_pre.cur),default"});
            }
        },
        toolbar_cut:function(){//工具条cut(u)
            if(!PLAYER.dbClick){
                PLAYER.keyNum=85;
                $('.time_ruler_toolbar').children('span').removeClass('active');
                $('#js_toolbar_cut').addClass('active');
                PLAYER.TR.config.$clipTrackBar.css({cursor:"url(images/cur/cut_disable.cur),default"});
                PLAYER.TR.config.$clipTrackBar.find('.edit_box').css({cursor:"url(images/cur/cut.cur),default"});
            }
        },
        toolbar_uCut:function(){//时码线cut(shift+u)
            if(!PLAYER.dbClick){
                PLAYER.keyNum=8500;
                $('.time_ruler_toolbar').children('span').removeClass('active');
                $('#js_toolbar_uCut').addClass('active');
                if(PLAYER.TR.currTime===0){
                    return;
                }
                PLAYER.TR.cutArrowCurrentTime();
            }
        },
        toolbar_zoom_plus:function(){//工具条放大(++)
            if(!PLAYER.dbClick){
                PLAYER.keyNum=187;
                $('.time_ruler_toolbar').children('span').removeClass('active');
                $('#js_toolbar_zoom_plus').addClass('active');
                PLAYER.TR.config.$clipTrackBar.css({cursor:"url(images/cur/zoom_plus.cur),default"});
            }
        },
        toolbar_zoom_minus:function(){//工具条缩小(--)
            if(!PLAYER.dbClick){
                PLAYER.keyNum=189;
                $('.time_ruler_toolbar').children('span').removeClass('active');
                $('#js_toolbar_zoom_minus').addClass('active');
                PLAYER.TR.config.$clipTrackBar.css({cursor:"url(images/cur/zoom_minus.cur),default"});
            }
        },
        toolbar_ungroup:function(){
            var s=$('#js_time_ruler_bar_box .onselected').length;
            if(s===0){
                return false;
            }else{

                $('#js_time_ruler_bar_box .onselected').each(function(i,n){
                    $(n).attr('data-interleaved',false);
                    var time=$(n).attr('data-time');
                    var attr={
                        interleaved:false
                    }
                    PLAYER.operateJson.updateClipAttr(attr,time);
                });
            }
            console.log('解组',PLAYER.jsonObj.rootBin.sequence[0].tracks);
        },
        toolbar_group:function(){
            var s=$('#js_time_ruler_bar_box .onselected').length;
            if(s===0){
                return false;
            }else{
                var time=$('.edit_box_v.onselected').attr('data')
                $('.edit_box_v.onselected').each(function(i,n){
                    var time=$(n).attr('data-time');
                    var attr={
                        interleaved:true
                    }
                    PLAYER.operateJson.updateClipAttr(attr,time);
                    $(n).attr('data-interleaved',true);


                    var initId=$(n).attr('data-intid');
                    var initIdElem=$(n).parent().siblings().children('.edit_box_a[data-intid="'+initId+'"]');
                    var InitTime=initIdElem.attr('data-time');
                    PLAYER.operateJson.updateClipAttr(attr,InitTime);
                    initIdElem.attr('data-interleaved',true);
                });


               /* $('#js_time_ruler_bar_box .onselected').each(function(i,n){
                    var time=$(n).attr('data-time');
                    var attr={
                        interleaved:true
                    }
                    PLAYER.operateJson.updateClipAttr(attr,time);

                    $(n).attr('data-interleaved',true);
                });*/
            }
            console.log('编组',PLAYER.jsonObj.rootBin.sequence[0].tracks);
        }
    }
    //设置播放暂停

    function setPlayer(){
        var timer=setInterval(function(){
            var lastFrame=PLAYER.operateJson.getLastFrame();//拖拽素材时候的最后一帧

            if(PLAYER.loadState&&PLAYER.isPlaying){
                var s=PLAYER.OCX.getPosition();
                if(s>lastFrame){
                    s=0;
                }
                if(s===lastFrame){
                    PLAYER.OCX.doPause();
                    PLAYER.isPlaying=false;
                    $("#js_play").removeClass("stop")
                    $("#js_play").attr("title", "播放");
                    clearInterval(timer);
                }
                PLAYER.TR.fixArrowCurrentTime(s);
                PLAYER.TR.currTime=s;
                PLAYER.PTR.fixArrowCurrentTime(s);
                PLAYER.PTR.currTime=s;
                $('#js_time_ruler_title_nowTime').html(PLAYER.getDurationToString(PLAYER.TR.currTime));
            }
        },40);
    }
    //设置vu表
    function setVuInfo(){
        setTimeout(function(){
            var str = PLAYER.OCX.getVUMeterInfo();
            var voiceTest = parseFloat(str.split(",")[1]/100)+0.99;
            if(str){
                drawVoiceTable(str.split(","),true);
            }
            if(PLAYER.loadState&&PLAYER.isPlaying){
                if(str!=""){
                   setTimeout(arguments.callee,100);
                }
                if(voiceTest<0){
                    drawVoiceTable("",false)
                }
            }
        },100);
        function drawVoiceTable(arr,isDraw){
            var c1 = document.getElementById("js_voCanvas");
            var _h=$("#js_time_ruler_voiceBox").height()-21;

            if(c1.getContext('2d')){

                var ctx = c1.getContext("2d");
                ctx.clearRect(0,0,100,500);
                if(isDraw){
                    var i=0;
                    var height = _h;
                    var x=3;
                    for(var i=0;i<parseInt(arr[0]);i++){
                        var voice = parseFloat(arr[i+1]/100)+0.99;
                        canvasGradient=ctx.createLinearGradient(x,height,x,0);
                        canvasGradient.addColorStop(0,'#33FF00');
                        canvasGradient.addColorStop(0.4,'#33FF00');
                        canvasGradient.addColorStop(1,'red');

                        ctx.fillStyle = canvasGradient;
                        ctx.fillRect(x,height*(1-voice),30,height*voice);
                        ctx.fillRect(x,height*(1-voice),30,height*voice);
                        x=x+35;
                    }
                }
            }
        }
    }
    //键盘快捷键
    function publicKeyDownEvent(e){
        var key=e.code;
        var target=e.target;
        if(key===16&&e.shift){ //shift(按下)
            PLAYER.keyNum=1600;
        }
        else if(key===86&&!e.shift){//v
            PLAYER.player.toolbar_choose();
        }
        else if(key===71&&!e.shift){  //g
            PLAYER.player.toolbar_preSelect();
        }
        else if(key===71&&e.shift){//shift+g
            PLAYER.player.toolbar_nextSelect();
        }
        else if(key===85&&!e.shift){ //u
            PLAYER.player.toolbar_cut();
        }
        else if(key===85&&e.shift){ //shift+u
            PLAYER.player.toolbar_uCut();
        }
        else if(key===73&&e.shift){//shift+i
            PLAYER.player.moveTrimIn();
        }
        else if(key===79&&e.shift){//shift+o
            PLAYER.player.moveTrimOut();
        }
        else if(key===32&&!e.shift){    //space
            var lastFrame=PLAYER.operateJson.getLastFrame();
            if(PLAYER.TR.currTime>=lastFrame){//如果seek位置大于素材长度，则跳到0处开始播放
                return false;
            }
            else{
                PLAYER.player.play();
            }
        }
        else if(key===36&&!e.shift){//home
            PLAYER.player.toFirstFrame();
        }
        else if(key===35&&!e.shift){//end
            PLAYER.player.toLastFrame();
        }
        else if(key===39&&!e.shift){//-->
            PLAYER.player.nextFrame();
        }
        else if(key===37&&!e.shift){//<--
            PLAYER.player.prevFrame();
        }
        else if(key===73&&!e.shift){//i
            PLAYER.keyNum=73;
            PLAYER.player.setTrimIn();
        }
        else if(key===79&&!e.shift){//o
            PLAYER.keyNum=79;
            PLAYER.player.setTrimOut();
        }
        else if(key===49&&e.shift){//shift+1 //编组
            PLAYER.keyNum=4900;
            PLAYER.player.toolbar_group();
        }
        else if(key===50&&e.shift){//shift+2 //解组
            PLAYER.keyNum=5000;
            PLAYER.player.toolbar_ungroup();
        }

    }
    return constructor;
}();
PLAYER.ocxFunction=function(){
    function constructor() {
        var self=this;
        self.positionValue=0;
    }
    constructor.prototype ={
        updateProjectJson:function(projStr){
            var projStr1 = PLAYER.operateJson.translateFfpToMS(JSON.stringify(projStr));
            try {
                var jsonObj = {
                    command: "updateproject",
                    params:{
                        projectInfo:projStr1
                    }
                };
                var jsonStr = JSON.stringify(jsonObj);
                webrtc.sendDataChannelMessageToPeer(targetId, jsonStr);
                PLAYER.loadState=true;
            } catch (e) {
                console.log('拖拽轨道更新json文件失败',e);
                return false;
            }
        },
        adjustEffect:function(obj){
            var jsonObj = {
                    command: "adjustEffect",
                    params:obj
            };
            var jsonStr = JSON.stringify(jsonObj);
            webrtc.sendDataChannelMessageToPeer(targetId, jsonStr);
        },
        updateFileJson:function(projStr){
            var projStr1 = JSON.stringify(projStr);
            try {
                form1.TestActiveX.UpdateFileJson(projStr1);
                PLAYER.loadState=true;
                console.log('双击素材更新json文件成功',projStr);
            } catch (e) {
                console.log('双击素材更新json文件失败',e);
                return false;
            }
        },
        unloadPlayer:function(){
            try {
                var str = form1.TestActiveX.Close();
            } catch (e) {
                console.log('关闭播放器时出错！');
            }
        },
        //播放
        doPlay:function(fromTimePos, toTimePos){

            try {
                var jsonObj = {
                    command: "play",
                    params: {
                        from: fromTimePos,
                        to: toTimePos
                    }
                };
                var jsonStr = JSON.stringify(jsonObj);
                webrtc.sendDataChannelMessageToPeer(targetId, jsonStr);

            } catch (e) {
                console.log('播放失败！',e);
                return false;
            }
        },
        //暂停
        doPause:function(){
            var point=PLAYER.ffToNm(PLAYER.TR.currTime);
            try {
                var jsonObj = {
                    command: "pause",
                    params:{
                        pos:point
                    }
                };
                var jsonStr = JSON.stringify(jsonObj);
                webrtc.sendDataChannelMessageToPeer(targetId, jsonStr);
            } catch (e) {
                console.log('暂停失败！');
                return false;
            }
        },
        //停止
        doStop:function(){
            try {
                form1.TestActiveX.Seek(0);
            } catch (e) {
                console.log('停止失败！');
                return;
            }
        },
        getPosition:function() {//return 0;
            try {
               return PLAYER.nmToFf(PLAYER.postTime);
            } catch (e) {
                console.log('获取当前时码时出错！');
            }
        },
        seek:function(point){
            try {
                var point=PLAYER.ffToNm(point);
                var jsonObj = {
                    command: "seek",
                    params: {
                        pos: point
                    }
                };
                var jsonStr = JSON.stringify(jsonObj);
                webrtc.sendDataChannelMessageToPeer(targetId, jsonStr);
            } catch (e) {
                console.log('seek当前时码时出错！');
            }
        },
        getVUMeterInfo:function(){
            try {
                return PLAYER.VUMeterInfo;
            } catch (e) {
                //console.log('error');
                return;
            }
        },
        coverStationLogo:function(projStr){
            try {
                console.log('提交声音',projStr);
                var s1=form1.TestActiveX.CoverStationLogo(JSON.stringify(projStr));
                console.log('s1',s1);
                return s1;

            } catch (e) {
                console.log('error');
                return;
            }
        },
        clearWindow:function(){
            try {
                form1.TestActiveX.ClearWindow();
            } catch (e) {
                console.log('error','ClearWindow');
                return;
            }
        },
        getImageBase64:function(){
            try {
                var res=form1.TestActiveX.GetImageBase64(4);
                console.log('获取画面成功！',res);
                return res;
            } catch (e) {
                console.log('error','获取画面失败');
                return;
            }
        },
        sendProType:function(_type){
            try {
                var jsonObj = {
                    command: "setProjectType",
                    params: {
                       type:_type
                    }
                };
                var jsonStr = JSON.stringify(jsonObj);
                webrtc.sendDataChannelMessageToPeer(targetId, jsonStr);
            } catch (e) {
                console.log('播放失败！',e);
                return false;
            }
        }
    }
    return constructor;
}();
PLAYER.operateJson={
    sendJson:function(){
        PLAYER.operateJson.sortClipAttr();
        //更新时间轴
        PLAYER.operateJson.updateRulerMaxTime();
        PLAYER.operateJson.pushCancelArray(PLAYER.jsonObj.rootBin.sequence[0]);

        console.log('PLAYER.jsonObj',PLAYER.jsonObj)
        PLAYER.OCX.updateProjectJson(PLAYER.jsonObj);
        PLAYER.OCX.seek(parseInt(PLAYER.TR.currTime));
    },
    translateFfpToMS:function(json){
        //转换帧到毫秒
        var json=JSON.parse(json);
        var pWidth;
        json.rootBin.sequence[0].maxDuration=40*json.rootBin.sequence[0].maxDuration;
        for (var i = 0;i<json.rootBin.sequence[0].tracks.length;i++) {
            var track=json.rootBin.sequence[0].tracks[i];
            $.each(track.subclip,function(i,n){
                if(n){
                    n.trimIn=40*n.trimIn;
                    n.trimOut=40*n.trimOut;
                    n.sequenceTrimIn=40*n.sequenceTrimIn;
                    n.sequenceTrimOut=40*n.sequenceTrimOut;
                    if(n.effect &&n.effect.length!==0){
                        $.each(n.effect,function(index,item){
                            item.trimIn=40*item.trimIn;
                            item.trimOut=40*item.trimOut;
                            item.duration=40*item.duration;
                        });
                    }
                    if(n.frame){
                        n.duration=40*n.duration;
                    }
                }
            });
        }
        for (var i = 0; i<json.reference.material.length;i++) {
            var mas=json.reference.material[i];
            mas.duration=40*mas.duration;
        }
        var elem = document.getElementById("ocx");
        var oStyle = elem.currentStyle?elem.currentStyle:window.getComputedStyle(elem, null);
        var height = parseFloat(oStyle.height);

        if(json.height==='576'&&json.width==='720'){
            pWidth=parseFloat(1.25*height);
        }else{
            pWidth=parseFloat((16*height/9));
        }
        json.pHeight=height;
        json.pWidth=pWidth;
        return json;
    },
    translateMsToFfp:function(json){
        //转毫秒到帧数
        var json=JSON.parse(json);
        json.rootBin.sequence[0].maxDuration=json.rootBin.sequence[0].maxDuration/40;

        for (var i = 0;i<json.rootBin.sequence[0].tracks.length;i++) {
            var track=json.rootBin.sequence[0].tracks[i];

            $.each(track.subclip,function(i,n){
                if(n){
                    n.trimIn=n.trimIn/40;
                    n.trimOut=n.trimOut/40;
                    n.sequenceTrimIn=n.sequenceTrimIn/40;
                    n.sequenceTrimOut=n.sequenceTrimOut/40;
                    if(n.effect &&n.effect.length!==0){
                        $.each(n.effect,function(index,item){
                            item.trimIn=item.trimIn/40;
                            item.trimOut=item.trimOut/40;
                            item.duration=item.duration/40;
                        });
                    }
                }
            });
        }
        for (var i = 0; i<json.reference.material.length;i++) {
            var mas=json.reference.material[i];
            mas.duration=mas.duration/40;
        }
        return json;
    },
    clearMaterial:function(json){
        var materialIdArray=[]; //存储切片中有的资源ID
        for (var i = 0;i<json.rootBin.sequence[0].tracks.length;i++) {
            var track=json.rootBin.sequence[0].tracks[i];
            $.each(track.subclip,function(i,n){
                if(n){
                    materialIdArray.push(n.assetid);
                }
            });
        }
        if(materialIdArray.length===0){
            json.reference.material=[];
        }else{
            //清理下material
            materialIdArray=Array.from(new Set(materialIdArray));
            console.log('materialIdArray',materialIdArray)
            //去重
            var hash={};
            var newMaterial=json.reference.material.reduce(function(item, next) {
                hash[next.assetid] ? '' : hash[next.assetid] = true && item.push(next);
                return item;
            }, []);
            //判断切片中有没有这个素材，没有删除
            newMaterial.forEach(function(item,index){
                var id=item.assetid;
                newMaterial.forEach(function(n,i){
                    console.log('n---',n)
                    if(n.assetid!==id){
                        newMaterial.slice(i,1);
                    }
                })

            });
            json.reference.material=newMaterial;
            PLAYER.jsonObj=json;
        }

    },
    addVideoClipAttr:function(subClipAttr,_index){
        for (var i = 0;i<PLAYER.jsonObj.rootBin.sequence[0].tracks.length;i++) {
            var track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i];
            if(track.type==='v'&&track.index===_index){
               track.subclip.push(subClipAttr);
            }
        }
    },
    addAudioClipAttr:function(subClipAttr,_index){
        for (var i = 0;i<PLAYER.jsonObj.rootBin.sequence[0].tracks.length;i++) {
            var track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i];
            if(track.type==='a'&&track.index===_index){
               track.subclip.push(subClipAttr);
            }
        }
    },
    getdAudioClipAttr:function(time,_index){
        var arr=null;
        for (var i = 0;i<PLAYER.jsonObj.rootBin.sequence[0].tracks.length;i++) {
            var track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i];
            if(track.type==='a'&&track.index===_index){
                $.each(track.subclip,function(i,n){
                    if(n && n.subclipId===time){
                        arr=n;
                    }
                });
            }
        }
        return JSON.stringify(arr);
    },
    updateAudioClipVolume:function(time,value){
        for (var i = 0;i<PLAYER.jsonObj.rootBin.sequence[0].tracks.length;i++) {
            var track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i];
            $.each(track.subclip,function(index,elem){
                if(elem){
                    if(elem.subclipId===time){
                        $.extend(track.subclip[index],{
                            volume:value
                        });
                    }
                }
            });
        }
    },
    addSubtitleClipAttr:function(subClipAttr,_index){
        for (var i = 0;i<PLAYER.jsonObj.rootBin.sequence[0].tracks.length;i++) {
            var track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i];
            if(track.type==='t'&&track.index===_index){
                track.subclip.push(subClipAttr);
            }
        }
    },
    getSubtitleClip:function(time,_index){
        var arr=null;
        for (var i = 0;i<PLAYER.jsonObj.rootBin.sequence[0].tracks.length;i++) {
            var track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i];
            if(track.type==='t'&&track.index===_index){
                $.each(track.subclip,function(i,n){
                    if(n && n.subclipId===time){
                        arr=n;
                    }
                });
            }
        }
        return JSON.stringify(arr);
    },
    updateSubtitleClip:function(jsonObj,moveX,moveY){
        var _index=jsonObj.trackIndex;
        var time=jsonObj.subClipId;
        for (var i = 0;i<PLAYER.jsonObj.rootBin.sequence[0].tracks.length;i++) {
            var track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i];
            if(track.type==='t'&&track.index===_index){
                $.each(track.subclip,function(i,n){
                    if(n && n.subclipId===time){
                        if(jsonObj.params.frame){
                            $.extend(n.frame,jsonObj.params.frame);
                        }
                        if(jsonObj.params.object){
                            n.object=jsonObj.params.object;
                        }

                        /* if(jsonObj.params.object){
                            $.extend(n.object,jsonObj.params.object);
                        } */
                    }
                });
            }
        }
        //console.log('更新字幕',PLAYER.jsonObj.rootBin.sequence[0].tracks);
    },
    updateSubtitleObject:function(old_object,targetId,params){
        let res;
        old_object.map((item,index)=>{
            if(targetId===item.objectId){
                $.extend(item.attr,params);
            }
        });
        return old_object;
    },
    sortClipAttr:function(){
        function comparison(propertyName){
            return function(obj1,obj2){
                var value1=obj1[propertyName];
                var value2=obj2[propertyName];
                if(value1<value2){
                    return -1;
                }else if(value1>value2){
                    return 1;
                }else{
                    return 0;
                }
            }
        }
        for (var i = 0;i<PLAYER.jsonObj.rootBin.sequence[0].tracks.length;i++) {
            var track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i];
            track.subclip.sort(comparison('sequenceTrimIn'));
        }
    },
    addProjectMaterial:function(materialAttr){
        if(PLAYER.jsonObj.reference.material.length===0){
            PLAYER.jsonObj.reference.material.push(materialAttr);
        }else{
            $.each(PLAYER.jsonObj.reference.material,function(i,n){
                if(materialAttr.assetid===n.assetid){
                    return;
                }else{
                    PLAYER.jsonObj.reference.material.push(materialAttr);
                }
            });
        }
    },
    pushCancelArray:function(attr){
        var str=JSON.stringify(attr);
        PLAYER.goBackJson.push(str);
    },
    updateClipAttr:function(subClipAttr,time,effectAttr){
        for (var i = 0;i<PLAYER.jsonObj.rootBin.sequence[0].tracks.length;i++) {
            var track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i];
            $.each(track.subclip,function(index,elem){
                if(elem){
                    if(elem.subclipId===time){
                        $.extend(track.subclip[index],subClipAttr||{});

                        if(effectAttr){
                            track.subclip[index].effect=effectAttr;
                        }
                    }
                }
            });
        }
        console.log('更新切片',PLAYER.jsonObj.rootBin.sequence[0].tracks);
    },
    changeIndexClipAttr:function(type,index,time){
        var obj=null;
        for (var i = 0;i<PLAYER.jsonObj.rootBin.sequence[0].tracks.length;i++) {
            var track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i];
            $.each(track.subclip,function(i,n){
                if(n){
                    if(n.subclipId===time){
                        obj=JSON.stringify(track.subclip[i]);
                        track.subclip.splice(i,1);
                    }
                }
            });
        }
        for (var i = 0;i<PLAYER.jsonObj.rootBin.sequence[0].tracks.length;i++) {
            var track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i];
            if(track.type===type&&track.index===index){
                track.subclip.push(JSON.parse(obj));
            }
        }
    },
    deleteClipAttr:function(time){
        for (var i = 0;i<PLAYER.jsonObj.rootBin.sequence[0].tracks.length;i++) {
            var track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i];
            var materials=PLAYER.jsonObj.reference.material;
            $.each(track.subclip,function(index,elem){
                if(elem){
                    if(elem.subclipId===time){
                        track.subclip.splice(index,1);
                    }
                }
            });
        }
        console.log('删除切片',PLAYER.jsonObj.rootBin.sequence[0]);
    },
    checkCoverEvent:function(dragging,intid){
        var config=PLAYER.TR.config;
        var add_subclip;        //新增的切片对象
        var add_subclip_attr;   //新增的切片对象属性
        var s0_in= parseInt(dragging.attr('data-sequencetrimin'));
        var s0_out= parseInt(dragging.attr('data-sequencetrimout'));
        var t0_in= parseInt(dragging.attr('data-trimin'));
        var t0_out= parseInt(dragging.attr('data-trimout'));

        //左右拖拽素材时候，dragging为拖拽助手，兄弟节点应该去掉target
        var time=dragging.attr('data-time');
        var arr=[];
        $.each(dragging.siblings(),function(i,n){
            if(!$(n).hasClass('onselected') && !$(n).hasClass('changeHelp')){
                arr.push($(n));
            }
        });

        $.each(arr,function(i,n){
            var sn_in=parseInt($(n).attr('data-sequencetrimin'));
            var sn_out= parseInt($(n).attr('data-sequencetrimout'));
            var tn_in=parseInt($(n).attr('data-trimin'));
            var tn_out= parseInt($(n).attr('data-trimout'));
            if(s0_in<=sn_in&&s0_out>sn_in){
                if(s0_out<sn_out){
                    var time=$(n).attr('data-time');
                    $(n).attr('data-sequencetrimin',s0_out);
                    $(n).attr('data-sequencetrimout',sn_out);
                    $(n).attr('data-trimout',tn_out);
                    $(n).attr('data-trimin',tn_out-sn_out+s0_out);
                    $(n).css('left',s0_out/config.framePerPixel);
                    $(n).width((sn_out-s0_out)/config.framePerPixel);


                    if($(n).find('.effect_box_l')){
                        $(n).find('.effect_box_l').remove();
                    }
                    subClipAttr={
                        sequenceTrimIn:s0_out,
                        sequenceTrimOut:sn_out,
                        trimIn: tn_out-sn_out+s0_out,
                        trimOut:tn_out,
                    }

                    var e_attr2=PLAYER.operateJson.getCoverOldEffectClip(time,tn_out-sn_out+s0_out,tn_out);
                    PLAYER.operateJson.updateClipAttr(subClipAttr,time,e_attr2);

                    //PLAYER.operateJson.updateClipAttr(subClipAttr,time);
                }
                else{
                    var time=$(n).attr('data-time');
                    PLAYER.operateJson.deleteClipAttr(time);
                    $(n).remove();
                }
                PLAYER.operateJson.sortClipAttr();
            }
            else if(s0_in>=sn_in&&sn_out>s0_in){
                $(n).attr('data-sequencetrimin',sn_in);
                $(n).attr('data-sequencetrimout',s0_in);
                $(n).attr('data-trimout',tn_in+s0_in-sn_in);
                $(n).attr('data-trimin',tn_in);
                $(n).width((s0_in-sn_in)/config.framePerPixel);

                var v_dataId=$(n).attr('data-id');
                var v_dataTime=$(n).attr('data-time');
                var v_interleaved=$(n).attr('data-interleaved');
                var v_type=$(n).attr('data-type');
                var v_index=parseInt($(n).parent('.time_ruler_bar').attr('data-index'));


                if($(n).find('.effect_box_r')){
                    $(n).find('.effect_box_r').remove();
                }
                if($(n).find('.effect_box_all')){
                    $(n).find('.effect_box_all').attr('data-trimin',tn_in);
                    $(n).find('.effect_box_all').attr('data-trimout',tn_in+s0_in-sn_in);
                    $(n).find('.effect_box_all').attr('data-duration',s0_in-sn_in);
                }

                //原兄弟节点切片属性
                subClipAttr={
                    trimIn: tn_in,
                    trimOut:tn_in+s0_in-sn_in,
                    sequenceTrimIn:sn_in,
                    sequenceTrimOut:s0_in
                }
                var e_attr2=PLAYER.operateJson.getCutOldEffectClip(v_dataTime,tn_in,tn_in+s0_in-sn_in);
                PLAYER.operateJson.updateClipAttr(subClipAttr,v_dataTime,e_attr2);

                if(s0_out<sn_out){
                    var subclipId=v_type+'_'+PLAYER.genNonDuplicateID(12);

                    vcut_sequenceTrimIn=s0_out;
                    vcut_sequenceTrimOut=sn_out;
                    vcut_trimIn=tn_out-sn_out+s0_out;
                    vcut_trimOut=tn_out;

                    vcut_width=(sn_out-s0_out)/config.framePerPixel;
                    vcut_left=s0_out/config.framePerPixel;

                    add_subclip=$(n).clone();

                    if(add_subclip.find('.effect_box_l')){
                        add_subclip.find('.effect_box_l').remove();
                    }
                    if(add_subclip.find('.effect_box_all')){
                        add_subclip.find('.effect_box_all').attr('data-trimin',vcut_trimIn);
                        add_subclip.find('.effect_box_all').attr('data-trimout',vcut_trimOut);
                        add_subclip.find('.effect_box_all').attr('data-duration',vcut_trimOut-vcut_trimIn);
                    }

                    add_subclip.removeClass('onselected');
                    add_subclip.attr('data-trimin',vcut_trimIn);
                    add_subclip.attr('data-trimout',vcut_trimOut);
                    add_subclip.attr('data-sequencetrimin',vcut_sequenceTrimIn);
                    add_subclip.attr('data-sequencetrimout',vcut_sequenceTrimOut);
                    add_subclip.attr('data-time',subclipId);
                    add_subclip.attr('data-intid',intid);
                    add_subclip.attr('width',vcut_width);
                    add_subclip.attr('left',vcut_left);
                    $(n).parent('.time_ruler_bar').append(add_subclip);

                    if($(n).parent('.time_ruler_bar').hasClass('bar_v')){
                        var e_attr=PLAYER.operateJson.getCutNewEffectClip(v_dataTime,vcut_trimIn,vcut_trimOut);

                        if(e_attr.length!==0){
                            $.each(e_attr,function(i,n){
                                if($(n).type==='mosaic'){
                                    $(n).trimIn=vcut_trimIn;
                                    $(n).trimOut=vcut_trimOut;
                                }
                            });
                        }

                        add_subclip_attr={
                            "assetid": v_dataId,
                            "trimIn": vcut_trimIn,
                            "trimOut":vcut_trimOut,
                            "sequenceTrimIn": vcut_sequenceTrimIn,
                            "sequenceTrimOut":vcut_sequenceTrimOut,
                            "effect":e_attr,
                            "type":v_type,
                            "subclipId":subclipId,
                            "interleaved_id":intid
                        }
                        if(dragging.attr('data-interleaved')==='true'&&v_interleaved==='true'){
                            add_subclip_attr.interleaved=true;
                        }else{
                            add_subclip_attr.interleaved=false;
                        }


                        PLAYER.operateJson.addVideoClipAttr(add_subclip_attr,v_index);

                    }else if($(n).parent('.time_ruler_bar').hasClass('bar_a')){
                        add_subclip_attr={
                            "assetid": v_dataId,
                            "trimIn": vcut_trimIn,
                            "trimOut":vcut_trimOut,
                            "sequenceTrimIn": vcut_sequenceTrimIn,
                            "sequenceTrimOut":vcut_sequenceTrimOut,
                            "volume":100,
                            "type":v_type,
                            "subclipId":subclipId,
                            "interleaved_id":intid
                        }
                        if(dragging.attr('data-interleaved')==='true'&&v_interleaved==='true'){
                            add_subclip_attr.interleaved=true;
                        }else{
                            add_subclip_attr.interleaved=false;
                        }

                        PLAYER.operateJson.addAudioClipAttr(add_subclip_attr,v_index);

                    }else if($(n).parent('.time_ruler_bar').hasClass('bar_t')){

                        var msg=JSON.parse(PLAYER.operateJson.getSubtitleClip(v_dataTime,v_index));
                        var subClipAttr_cut={
                            "trimIn": vcut_trimIn,
                            "trimOut":vcut_trimOut,
                            "sequenceTrimIn":vcut_sequenceTrimIn,
                            "sequenceTrimOut":vcut_sequenceTrimOut,
                            "type":v_type,
                            "subclipId":subclipId,
                            "interleaved":false,
                            "interleaved_id":intid
                        }
                        $.extend(msg,subClipAttr_cut);
                        PLAYER.operateJson.addSubtitleClipAttr(msg,v_index);
                    }
                }
            }
            else{
                console.log('不重合');
            }
        });
    },
    getAllsequenceTrimIn:function(dragging,time,sin){
        //获取要吸附的素材
        var _s;
         var s_point;
        if(sin){
            s_point=sin;
        }else{
            s_point=parseInt(dragging.attr('data-sequencetrimin'));
        }

        var arr=dragging.siblings();
        if(time){
            $.each(arr,function(i,n){
                if($(n).attr('data-time')===time){
                    arr.splice(i,1);
                }
            });
        }

        arr.each(function(){
            var offset1=Math.abs(s_point-parseInt($(this).attr('data-sequencetrimin')))/PLAYER.TR.config.framePerPixel;
            var offset2=Math.abs(s_point-parseInt($(this).attr('data-sequencetrimout')))/PLAYER.TR.config.framePerPixel;

            if(offset1<=10){
                _s=parseInt($(this).attr('data-sequencetrimin'));
            }
            if(offset2<=10){
                _s=parseInt($(this).attr('data-sequencetrimout'));
            }
        });

        return _s;
    },
    showAdhere:function(dragging,dir){
        if(dragging.find('.point')){
            dragging.find('.point').remove();
        }
        var _line=$('<div class="point"></div>');
        if(dir==='forward'){
            _line.css('left',-5);
        }
        if(dir==='backward'){
           _line.css('left',(dragging.width()-5));
        }

        _line.appendTo(dragging);
        console.log('point',dragging.find('.point').length);
    },
    hideAdhere:function(dragging){
        if(dragging.find('.point')){
            dragging.find('.point').remove();
        }
    },
    chooseInterleavedElem:function(dragging){
        var element=null;
        var time=dragging.attr('data-time');
        var intid=dragging.attr('data-intid');
        $.each(dragging.parent('.time_ruler_bar').siblings().children('.edit_box'),function(i,n){
            if($(n).attr('data-interleaved')==='true' && $(n).attr('data-intid')===intid && !$(n).hasClass('changeHelp')){
               element=$(n);
            }
        });
        return element;
    },
    chooseGroupElem:function(dragging){
        var element=null;
        var arr=[];
        var time=dragging.attr('data-time');
        var groupId=dragging.attr('data-group');

        $.each($('.edit_box'),function(i,n){
            if($(this).attr('data-group')===groupId){
               element=$(this);
               arr.push(element);
            }
        });
        arr.forEach(function(n,i){
            if(arr[i].attr('data-time')===time){
                arr.splice(i,1);
            }
        });
        return arr;
    },
    chooseSelectedElem:function(dragging){
        var element=null;
        var arr=[];
        var time=dragging.attr('data-time');

        $.each($('#js_time_ruler_bar_box .onselected'),function(i,n){

            arr.push($(this));
        });
        arr.forEach(function(n,i){
            if(arr[i].attr('data-time')===time){
                arr.splice(i,1);
            }
        });
        return arr;
    },
    mouseDownState:function(dragging){

        if(PLAYER.keyNum!==17 && PLAYER.keyNum!==71 && PLAYER.keyNum!==7100){
            $('#js_time_ruler_bar_box .draggable').removeClass('onselected');
        }
        dragging.addClass('onselected');
        if(dragging.hasClass('edit_box_a')){
            var time=dragging.attr('data-time');
            var index=parseInt(dragging.parent().attr('data-index'));
            var audioAttr=JSON.parse(PLAYER.operateJson.getdAudioClipAttr(time,index));
            var volume=audioAttr.volume;
            $('#js_toolbar_icon_volume_track').val(volume);
            $('#js_toolbar_icon_volume_track').attr('title',volume);
        }

        if(dragging.attr('data-interleaved')==="true"){
            PLAYER.operateJson.chooseInterleavedElem(dragging).addClass('onselected');

            if(PLAYER.operateJson.chooseInterleavedElem(dragging).hasClass('edit_box_a')){
                var time=PLAYER.operateJson.chooseInterleavedElem(dragging).attr('data-time');
                var index=parseInt(dragging.parent().attr('data-index'));
                var audioAttr=JSON.parse(PLAYER.operateJson.getdAudioClipAttr(time,index));
                var volume=audioAttr.volume;
                $('#js_toolbar_icon_volume_track').val(volume);
                $('#js_toolbar_icon_volume_track').attr('title',volume);
            }
        }
    },
    mouseMoveState:function(dragging,clipDir){//mousemove事件状态
        dragging.css('z-index',50);
        if(clipDir==='middle'){
            dragging.css('cursor','url(images/cur/resize.cur),default');
            dragging.css('boxShadow','4px 4px 2px #888888');
            dragging.removeClass('onselected');
            dragging.css('opacity','0.6');
        }
        else if(clipDir==='left'){
            dragging.addClass('zoomLeft');
        }
        else if(clipDir==='right'){
            dragging.addClass('zoomRight');
        }
    },
    checkCorsorhasClip:function(currTime){
        var hasClip=false;
        //检查游标处是否有切片
        for (var i = 0;i<PLAYER.jsonObj.rootBin.sequence[0].tracks.length;i++) {
            var track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i];
            if(track.type==='a' && (track.subclip.length>0)){
                $.each(track.subclip,function(index,elem){
                    if(elem.sequenceTrimIn<currTime && elem.sequenceTrimOut>currTime){
                       return  hasClip=true;
                    }

                });
            }
        }
        return hasClip;
    },
    checkNoClip:function(){
        for (var i = 0;i<PLAYER.jsonObj.rootBin.sequence[0].tracks.length;i++) {
            var track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i];
            if(track.subclip.length===0){
                return true;
           }else{
                return false;
           }
        }
    },
    checkPrevSubClip:function(s_in){
        var obj=null;
        $('#js_time_ruler_bar_box .edit_box_v').each(function(i,n){
            if(parseInt($(n).attr('data-sequencetrimout'))===s_in){
                obj=$(n);
            }
        });

        return obj;
    },
    checkNextSubClip:function(s_out){
        var obj=null;
        $('.edit_box_v').each(function(i,n){
            if(parseInt($(n).attr('data-sequencetrimin'))===s_out){
                obj=$(n);
            }
        });
        return obj;
    },
    addEffectClip:function(time,obj){
        for (var i = 0;i<PLAYER.jsonObj.rootBin.sequence[0].tracks.length;i++) {
            var track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i];

            if(track.type==='v'){
                $.each(track.subclip,function(index,elem){
                    if(elem){
                        if(elem.subclipId===time){
                            track.subclip[index].effect.push(obj);
                        }
                    }
                });
            }
        }
    },
    getEffectClip:function(time){
        var arr=null;
        for (var i = 0;i<PLAYER.jsonObj.rootBin.sequence[0].tracks.length;i++) {
            var track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i];
            $.each(track.subclip,function(index,elem){
                if(elem && elem.subclipId===time && elem.effect){
                    arr=JSON.stringify(elem.effect);
                }
            });
        }

        return arr;
    },
    getCutNewEffectClip:function(v_dataTime,vcut_trimIn,vcut_trimOut){
        var e_attr=JSON.parse(PLAYER.operateJson.getEffectClip(v_dataTime));
        if(e_attr&&e_attr.length!==0){
            var arr_footer=e_attr.filter(function(t){
                return (t.pos!=='header' && t.pos!=='header-middle');
            });

            for (var i = 0; i < arr_footer.length; i++) {
                if(arr_footer[i].pos==='all'){
                    arr_footer[i].trimIn=vcut_trimIn;
                    arr_footer[i].trimOut=vcut_trimOut;
                    arr_footer[i].duration=vcut_trimOut-vcut_trimIn;
                }
            }
            e_attr=arr_footer;
        }
        console.log('cut后新加切片特技',e_attr)
        return e_attr;
    },
    getCutOldEffectClip:function(v_dataTime,v0_trimIn,v0_trimOut){
        var e_attr=JSON.parse(PLAYER.operateJson.getEffectClip(v_dataTime));
        if(e_attr&&e_attr.length!==0){
            var arr_header=e_attr.filter(function(t){
                return (t.pos!=='footer' && t.pos!=='footer-middle');
            });

            for (var i = 0; i < arr_header.length; i++) {
                if(arr_header[i].pos==='all'){
                    arr_header[i].trimIn=v0_trimIn;
                    arr_header[i].trimOut=v0_trimOut;
                    arr_header[i].duration=v0_trimOut-v0_trimIn;
                }
            }
            e_attr=arr_header;
        }
        if(e_attr){
            return e_attr;
        }
    },
    getCoverOldEffectClip:function(v_dataTime,v0_trimIn,v0_trimOut){
        var e_attr=JSON.parse(PLAYER.operateJson.getEffectClip(v_dataTime));
        if(e_attr&&e_attr.length!==0){
            var arr_header=e_attr.filter(function(t){
                return (t.pos!=='header' && t.pos!=='header-middle');
            });

            for (var i = 0; i < arr_header.length; i++) {
                if(arr_header[i].pos==='all'){
                    arr_header[i].trimIn=v0_trimIn;
                    arr_header[i].trimOut=v0_trimOut;
                    arr_header[i].duration=v0_trimOut-v0_trimIn;
                }
            }
            e_attr=arr_header;
        }
        if(e_attr){
            return e_attr;
        }
    },
    updateEffectClip:function(time,attr){
        for (var i = 0;i<PLAYER.jsonObj.rootBin.sequence[0].tracks.length;i++) {
            var track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i];
            $.each(track.subclip,function(index,elem){
                if(elem && elem.subclipId===time && elem.effect){
                    $.each(elem.effect,function(i,n){
                        if(n.type==='mosaic'){
                            $.extend(n.attr,attr);
                        }else if(n.type==='2D'){
                            $.extend(n.attr,attr);
                        }
                    });

                }
            });
        }
        console.log('更新特技',PLAYER.jsonObj.rootBin.sequence[0].tracks);
    },
    removeOtherEffectClip:function(time,type,pos){
        for (var i = 0;i<PLAYER.jsonObj.rootBin.sequence[0].tracks.length;i++) {
            var track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i];
            $.each(track.subclip,function(index,elem){
                if(elem && elem.subclipId===time && elem.effect){
                    elem.effect.forEach(function(n,i){
                        if(n.type===type&&n.pos===pos){
                            elem.effect.splice(i,1);
                        }
                    });
                }
            });
        }
        console.log("删除淡入淡出等的切片",PLAYER.jsonObj.rootBin.sequence[0].tracks)
    },
    emptyTrack:function(type,index){
        $.each($('.time_ruler_bar'),function(i,n){
            if($(n).attr('data-type')===type&&parseInt($(n).attr('data-index'))===index){
                $(n).empty();
            }
        });
    },
    getTrack:function(type,index){
        var s;
        $.each($('.time_ruler_bar'),function(i,n){
            if($(n).attr('data-type')===type&&parseInt($(n).attr('data-index'))===index){
                return s=$(n);
            }
        });
        return s;
    },
    getMaterialInfo:function(id,callback){
        if(id==='subtitle_01'){
            var attr=JSON.parse(PLAYER.operateJson.getSubtitleTemp(id));
            callback(attr);
        }else{
            PLAYER.jsonObj.reference.material.forEach(function(item,index){
                if(id===item.assetid){
                    callback(item);
                }
            })

        }

    },
    getSubtitleDuration:function(id,callback){
        //获取字幕
        var msg=PLAYER.subJsonTem[id];
        callback(msg);
    },
    getFirstFrame:function(){
        var arr=[];
        for (var i = 0;i<PLAYER.jsonObj.rootBin.sequence[0].tracks.length;i++) {
            var track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i];
            $.each(track.subclip,function(index,elem){
                if(elem){
                    arr.push(track.subclip[index].sequenceTrimIn);
                }
            });
        }
        if(arr.length===0){
            return 0;
        }else{
            var s=Math.min.apply(null,arr);
            return s;
        }
    },
    getLastFrame:function(){
        var arr=[];
        for (var i = 0;i<PLAYER.jsonObj.rootBin.sequence[0].tracks.length;i++) {
            var track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i];
            if(track.subclip.length!==0){
                $.each(track.subclip,function(i,n){
                    arr.push(n.sequenceTrimOut);
                });
            }
        }
        if(arr.length!==0){
            return (Math.max.apply(null,arr));
        }
    },
    updateMaxDuration:function(maxDuration){
        PLAYER.jsonObj.rootBin.sequence[0].maxDuration=maxDuration;
    },
    updateRulerMaxTime:function(){
        //更新轨道最大时常
        var n=Math.max(PLAYER.TR.config.maxTime,PLAYER.operateJson.getLastFrame()+15000 || 1000);
        PLAYER.TR.updateEvent(n);

        PLAYER.TR.fixClipWidth();
        //更新json最大时常
        PLAYER.operateJson.updateMaxDuration(n);
        //更新轨道最大时常
        PLAYER.PTR.config.maxTime=(PLAYER.operateJson.getLastFrame()|| 1000);
        $('#js_player_totalTime').html(PLAYER.getDurationToString(PLAYER.operateJson.getLastFrame()||1000));
        PLAYER.PTR.updateEvent(PLAYER.PTR.config);
    },
    getAudioIndex:function(time){
        var _index=0;
        $.each(PLAYER.jsonObj.rootBin.sequence[0].track[1].subclip,function(index,elem){
            if(elem.subclipId===time){
                _index=index;
            }
        });
        return  _index;
    },
    addDraggingInfo:function(dragging,initAttr){
        var id=dragging.attr('data-time');
        var subclipId='helpElem_'+PLAYER.genNonDuplicateID(12);
        var helpElem=dragging.clone().addClass('changeHelp');

        helpElem.removeClass('onselected');
        helpElem.attr('data-time',subclipId);
        dragging.parent().append(helpElem);
        helpElem.hide();

        var obj={
            id:id,
            initAttr:initAttr,
            helpElem:helpElem
        };
        PLAYER.storeDraggingInfo.push(obj);
    },
    getDraggingAttr:function(id){
        var obj=null;
        $.each(PLAYER.storeDraggingInfo,function(i,n){
            if(n.id===id){
                obj=n.initAttr;
            }
        });
        return obj;
    },
    getDraggingHelp:function(id){
        var obj=null;
        $.each(PLAYER.storeDraggingInfo,function(i,n){
            if(n.id===id){
                obj=n.helpElem;
            }
        });
        return obj;
    },
    removeDraggingInfo:function(id){
        var obj=null;

        for (var i = 0; i < PLAYER.storeDraggingInfo.length; i++) {
            if(PLAYER.storeDraggingInfo[i].id===id){
                PLAYER.storeDraggingInfo.splice(i,1);
            }
        }
    },
    checkNewWindow:function(data,new_height,new_width){
        var data=JSON.parse(data);
        var old_height=data.pHeight;
        var old_width=data.pWidth;

        var scale_y=new_height/old_height;
        var scale_x=new_width/old_width;

        for (var i = 0;i<data.rootBin.sequence[0].tracks.length;i++) {
            var track=data.rootBin.sequence[0].tracks[i];

            if(track.type==='v'){
                $.each(track.subclip,function(index,elem){
                    if(elem && elem.effect){
                        $.each(elem.effect,function(i,n){
                            if(n.type==='mosaic'){
                                n.attr.x1*=scale_x;
                                n.attr.y1*=scale_y;
                                n.attr.width*=scale_x;
                                n.attr.height*=scale_x;
                            }
                        });
                    }
                });
            }
            if(track.type==='t'){
                $.each(track.subclip,function(index,elem){
                   elem.frame.x*=scale_x;
                   elem.frame.y*=scale_y;
                   elem.frame.width*=scale_x;
                   elem.frame.height*=scale_y;
                });
            }
        }
        return data;
    },
    getSubtitleTemp:function(id){
        var player_w=$('#ocx').width();
        var player_h=$('#ocx').height();
        var project_w=PLAYER.jsonObj.width;
        var project_h=PLAYER.jsonObj.height;
        PLAYER.subJsonTem={
            "subtitle_01":{
                "assetid":"subtitle_01",
                "name":"subtitle_01",
                "duration":125, //帧数
                "tempWidth":1920,
                "tempHeight":1080,
                "frame":{
                    "x":0,
                    "y":0,
                    "width":player_w,
                    "height":player_h,
                    "orientation":0
                },
                "object":[
                    {
                        "objectId": "000",
                        "type": "text",
                        "z-index": 0,
                        "x1": 545,
                        "y1": 873,
                        "clipStart": 600,
                        "clipDuraiton": 6640,
                        "attr": {
                          "type": "fade",
                          "text": "TITLE",
                          "fontFamily": "黑体",
                          "fontSize": 100,
                          "fillStyle": "#ffffff",
                          "align": "left",
                          "vertical-align": "top",
                          "fadeInTime": 240,
                          "fadeOutTime": 240
                        }
                    },
                    {
                        "objectId": "001",
                        "type": "piantou",
                        "x": 0,
                        "y": 0,
                        "width": 1920,
                        "height": 1080,
                        "z-index": 1,
                        "actionIn": null,
                        "actionOut": null,
                        "clipStart": 0,
                        "clipDuraiton": 4040,
                        "filePath": `${subtitleServer}/test01/01-1.mov`
                    },
                    {
                        "objectId": "002",
                        "type": "remain",
                        "x": 0,
                        "y": 0,
                        "width": 1920,
                        "height": 1080,
                        "z-index": 1,
                        "actionIn": null,
                        "actionOut": null,
                        "clipStart": 4040,
                        "clipDuraiton": 2960,
                        "filePath": `${subtitleServer}/test01/01-2.png`
                    },
                    {
                        "objectId": "003",
                        "type": "pianwei",
                        "x": 0,
                        "y": 0,
                        "width": 1920,
                        "height": 1080,
                        "z-index": 1,
                        "actionIn": null,
                        "actionOut": null,
                        "clipStart": 7000,
                        "clipDuraiton": 240,
                        "filePath":`${subtitleServer}/test01/01-3.mov`
                    }
                ]
            },
            "subtitle_02":{
                "assetid":"subtitle_02",
                "name":"subtitle_02",
                "duration":101, //帧数
                "tempWidth":1920,
                "tempHeight":1080,
                "frame":{
                    "x":0,
                    "y":0,
                    "width":player_w,
                    "height":player_h,
                    "orientation":0
                },
                "object":[
                    {
                        "objectId":"000",
                        "type":"text",
                        "z-index":0,
                        "x1":-1000 ,
                        "y1":862,
                        "x2":0 ,
                        "y2":860,
                        "x3":1970,
                        "y3":862,
                        "clipStart":560,
                        "clipDuraiton":3480,
                        "attr":{
                            "type":"move",
                            "text":"TITLE HERE ",
                            "fontFamily": "黑体",
                            "fontSize":100,
                            "fillStyle":"#ffffff",
                            "align":"left",
                            "vertical-align":"top",
                            "moveInTime":120,
                            "moveOutTime":40
                        }
                    },
                    {
                        "objectId":"001",
                        "type":"piantou",
                        "x": 0,
                        "y": 0,
                        "width": 1920,
                        "height": 1080,
                        "z-index":1,
                        "actionIn":null,
                        "actionOut":null,
                        "clipStart":0,
                        "clipDuraiton":1000,
                        "filePath":`${subtitleServer}/test02/02-1.mov`
                    },
                    {
                        "objectId":"003",
                        "type":"remain",
                        "x": 0,
                        "y": 0,
                        "width": 1920,
                        "height": 1080,
                        "z-index":1,
                        "actionIn":null,
                        "actionOut":null,
                        "clipStart":1000,
                        "clipDuraiton":2800,
                        "filePath":`${subtitleServer}/test02/02-2.png`
                    },
                    {
                        "objectId":"004",
                        "type":"pianwei",
                        "x": 0,
                        "y": 0,
                        "width": 1920,
                        "height": 1080,
                        "z-index":1,
                        "actionIn":null,
                        "actionOut":null,
                        "clipStart":3800,
                        "clipDuraiton":240,
                        "filePath":`${subtitleServer}/test02/02-3.mov`
                    }
                ]
            },
            "subtitle_04":{
                "assetid":"subtitle_04",
                "name":"subtitle_04",
                "duration":139, //帧数
                "tempWidth":1920,
                "tempHeight":1080,
                "frame":{
                    "x":0,
                    "y":0,
                    "width":player_w,
                    "height":player_h,
                    "orientation":0
                },
                "object":[
                    {
                        "objectId":"000",
                        "type":"text",
                        "z-index":0,
                        "x1":393,
                        "y1":835,
                        "clipStart":680,
                        "clipDuraiton":4520,
                        "attr":{
                            "type":"fade",
                            "text":"TITLE HERE",
                            "fontFamily": "黑体",
                            "fontSize":100,
                            "fillStyle":"#000000",
                            "align":"left",
                            "vertical-align":"top",
                            "fadeInTime":160,
                            "fadeOutTime":160
                        }
                    },
                    {
                        "objectId":"001",
                        "type":"text",
                        "title":null,
                        "z-index":1,
                        "x1":397,
                        "y1":929,
                        "clipStart":680,
                        "clipDuraiton":4520,
                        "attr":{
                            "type":"fade",
                            "text":"SUBTITLE",
                            "fontFamily": "黑体",
                            "fontSize":70,
                            "fillStyle":"#ffffff",
                            "align":"left",
                            "vertical-align":"top",
                            "fadeInTime":160,
                            "fadeOutTime":160
                        }
                    },
                    {
                        "objectId":"002",
                        "type":"piantou",
                        "x": 0,
                        "y": 0,
                        "width": 1920,
                        "height": 1080,
                        "z-index":2,
                        "actionIn":null,
                        "actionOut":null,
                        "clipStart":0,
                        "clipDuraiton":3040,
                        "filePath":`${subtitleServer}/test04/04-1.mov`
                    },
                    {
                        "objectId":"003",
                        "type":"remain",
                        "x": 0,
                        "y": 0,
                        "width": 1920,
                        "height": 1080,
                        "z-index":2,
                        "actionIn":null,
                        "actionOut":null,
                        "clipStart":3040,
                        "clipDuraiton":2000,
                        "filePath":`${subtitleServer}/test04/04-2.png`
                    },
                    {
                        "objectId":"004",
                        "type":"pianwei",
                        "x": 0,
                        "y": 0,
                        "width": 1920,
                        "height": 1080,
                        "z-index":2,
                        "actionIn":null,
                        "actionOut":null,
                        "clipStart":5040,
                        "clipDuraiton":520,
                        "filePath":`${subtitleServer}/test04/04-3.mov`
                    }
                ]
            },
            "subtitle_05":{
                "assetid":"subtitle_05",
                "name":"subtitle_05",
                "duration":106,     //帧数,其他为ms
                "tempWidth":1920,
                "tempHeight":1080,
                "frame":{
                    "x":0,
                    "y":0,
                    "width":player_w,
                    "height":player_h,
                    "orientation":0
                },
                "object":[
                    {
                        "objectId":"000",
                        "type":"text",
                        "title":null,
                        "z-index":0,
                        "x1":81,
                        "y1":837,
                        "clipStart":450,
                        "clipDuraiton":3840,
                        "attr":{
                            "type":"fade",
                            "text":"TITLE",
                            "fontFamily": "黑体",
                            "fontSize":100,
                            "fillStyle":"#ffffff",
                            "align":"left",
                            "vertical-align":"top",
                            "fadeInTime":160,
                            "fadeOutTime":160
                        }
                    },
                    {
                        "objectId":"001",
                        "type":"text",
                        "title":null,
                        "z-index":1,
                        "x1":77,
                        "y1":951,
                        "clipStart":450,
                        "clipDuraiton":3840,
                        "attr":{
                            "type":"fade",
                            "text":"SUBTITLE",
                            "fontFamily": "PingFang Heavy",
                            "fontSize":100,
                            "fillStyle":"#ffffff",
                            "align":"left",
                            "vertical-align":"top",
                            "fadeInTime":160,
                            "fadeOutTime":160
                        }
                    },

                    {
                        "objectId":"002",
                        "type":"piantou",
                        "x": 0,
                        "y": 0,
                        "width": 1920,
                        "height": 1080,
                        "z-index":2,
                        "actionIn":null,
                        "actionOut":null,
                        "clipStart":0,
                        "clipDuraiton":1000,
                        "filePath":`${subtitleServer}/test05/05-1.mov`
                    },
                    {
                        "objectId":"003",
                        "type":"remain",
                        "x": 0,
                        "y": 0,
                        "width": 1920,
                        "height": 1080,
                        "z-index":2,
                        "actionIn":null,
                        "actionOut":null,
                        "clipStart":1000,
                        "clipDuraiton":3040,
                        "filePath":`${subtitleServer}/test05/05-2.png`
                    },
                    {
                        "objectId":"004",
                        "type":"pianwei",
                        "x": 0,
                        "y": 0,
                        "width": 1920,
                        "height": 1080,
                        "z-index":2,
                        "actionIn":null,
                        "actionOut":null,
                        "clipStart":4040,
                        "clipDuraiton":200,
                        "filePath":`${subtitleServer}/test05/05-3.mov`
                    }
                ]
            },
            "subtitle_09":{
                "assetid":"subtitle_09",
                "name":"subtitle_09",
                "duration":166,     //帧数,其他为ms
                "tempWidth":1920,
                "tempHeight":1080,
                "frame":{
                    "x":0,
                    "y":0,
                    "width":player_w,
                    "height":player_h,
                    "orientation":0
                },
                "object":[
                    {
                        "objectId":"000",
                        "type":"text",
                        "z-index":0,
                        "x1":99,
                        "y1":853,
                        "clipStart":1320,
                        "clipDuraiton":5160,
                        "attr":{
                            "type":"fade",
                            "text":"TITLE HERE",
                            "fontFamily": "黑体",
                            "fontSize":100,
                            "fillStyle":"#ffffff",
                            "align":"left",
                            "vertical-align":"top",
                            "fadeInTime":40,
                            "fadeOutTime":200
                        }
                    },
                    {
                        "objectId":"001",
                        "type":"piantou",
                        "x": 0,
                        "y": 0,
                        "width": 100,
                        "height": 100,
                        "z-index":1,
                        "actionIn":null,
                        "actionOut":null,
                        "clipStart":0,
                        "clipDuraiton":2400,
                        "filePath":`${subtitleServer}/test09/09-1.mov`
                    },
                    {
                        "objectId":"002",
                        "type":"remain",
                        "x": 0,
                        "y": 0,
                        "width": 100,
                        "height": 100,
                        "z-index":1,
                        "actionIn":null,
                        "actionOut":null,
                        "clipStart":2400,
                        "clipDuraiton":3840,
                        "filePath":`${subtitleServer}/test09/09-2.png`
                    },
                    {
                        "objectId":"003",
                        "type":"pianwei",
                        "x": 0,
                        "y": 0,
                        "width": 100,
                        "height": 100,
                        "z-index":1,
                        "actionIn":null,
                        "actionOut":null,
                        "clipStart":6240,
                        "clipDuraiton":400,
                        "filePath":`${subtitleServer}/test09/09-3.mov`
                    }
                ]
            },
            "subtitle_11":{
                "assetid":"subtitle_11",
                "name":"subtitle_11",
                "duration":100,     //帧数,其他为ms
                "tempWidth":1920,
                "tempHeight":1080,
                "frame":{
                    "x":0,
                    "y":0,
                    "width":player_w,
                    "height":player_h,
                    "orientation":0
                },
                "object":[
                    {
                        "objectId":"001",
                        "type":"remain",
                        "x": 0,
                        "y": 0,
                        "width": 1920,
                        "height": 1080,
                        "z-index":1,
                        "actionIn":null,
                        "actionOut":null,
                        "clipStart":0,
                        "clipDuraiton":4000,
                        "filePath":`${subtitleServer}/test11/11-2.png`
                    }
                ]
            }
        };
        return JSON.stringify(PLAYER.subJsonTem[id]);
    }
}
/*------自定义事件开始------*/
PLAYER.EventTarget = function() {
    function constructor() {
        this.handlers = {};
    }
    constructor.prototype = {
        addHandler: function(type, handler) {
            if (typeof this.handlers[type] == "undefined") {
                this.handlers[type] = [];
            }
            this.handlers[type].push(handler);
        },
        fire: function(event) {
            if (!event.target) {
                event.target = this;
            }
            if (this.handlers[event.type] instanceof Array) {
                var handlers = this.handlers[event.type];
                for (var i = 0, len = handlers.length; i < len; i++) {
                    handlers[i](event);
                }
            }
        },
        removeHandler: function(type, handler) {
            if (this.handlers[type] instanceof Array) {
                var handlers = this.handlers[type];
                for (var i = 0, len = handlers.length; i < len; i++) {
                    if (handlers[i] === handler) {
                        break;
                    }
                }
                handlers.splice(i, 1);
            }
        }
    };
    return constructor;
}();
/*------轨道时间线开始------*/
PLAYER.timeRuler = function() {
    var trimInOrginPos = 0;
    var trimOutOrginPos = 0;
    var trimInCurrPos = 0;
    var trimOutCurrPos = 0;
    var trimInOutStartPos = 0;

    var currPos = 0;                //指针的left值
    var newTotalBtnScollLeft=0;     //新的整体滑块left值
    var newtotalScrollWidth;        //新的整体滑块的wi
    var scrollBtnMovableDistance;   //整体滚动条可滚动距离
    var containerMovableDistance;   //整体刻度条可滚动距离
    var scrollLeftWidth=0;          //左滚动宽度
    var scrollRightWidth=0;         //右滚动宽度

    var initContainerMarginLeft=0;  //初始化刻度条相对于刻度容器的left值
    var newContainerMarginLeft=0;   //新的刻度条相对于刻度容器的left值
    var newContainerWidth=0;        //新的刻度容器宽度

    var boxWidth; //刻度容器可视区的宽度
    var self = this;

    var trimIn=0;                   //素材入点
    var trimOut=0;                  //素材出点
    var sequenceTrimIn=0;           //序列入点
    var sequenceTrimOut=0;          //序列出点
    var subClipAttr=null;           //存储切片属性

    var subClipAttr_video=null;     //cut后切片视频数据
    var subClipAttr_audio=null;     //cut后切片音频数据

    var indexCancel=0;

    /*------精度数组开始------*/
    var unitTablePal=[
        {
            smallScaleFrame:1,    //  1f:1f
            smallScaleNumsPerLargeScale:1
        },
        {
            smallScaleFrame:1,    //  1f:2f
            smallScaleNumsPerLargeScale:2
        },
        {
            smallScaleFrame:1,    //  1f:5f
            smallScaleNumsPerLargeScale:5
        },
        {
            smallScaleFrame:1,    //  1f:10f
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:5,    //  5f:1s
            smallScaleNumsPerLargeScale:5
        },
        {
            smallScaleFrame:5,    //  5f:2s
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:10,    //  10f:4s
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:25,       //  1s:10s
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:25*3,     //  3s:30s
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:25*6,     //  6s:1min
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:25*12,     //  12s:2min
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:25*30,     //  30s:5min
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:25*60,     //  1min:10min
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:25*60*3,   //  3min:30min
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:25*60*6,     //  6min:1h
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:25*60*30,     //  30min:5h
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:25*60*60,     //  1h:10h
            smallScaleNumsPerLargeScale:10
        }];
    /*------默认配置开始------*/
    var defaultConfig = {
        hasTrack:true,                      //是否含轨道
        maxTime: 1000,                      //1000f
        min_largeScaleWidth: 80,            //每个大格宽度80px
        framePerPixel:0,                    //默认比率
        max_fpp:0,
        min_fpp:0.125,
        smallScaleNumsPerLargeScale: 10,    //每个大格包含多少小格
        smallScaleFrame:0,                  //每小格帧数
        smallScaleWidth: 0,                 //每小格宽度
        largeScaleWidth: 0,                 //每大格代表的宽度
        largeScaleMillisecondInterval: 0,   //每大格代表的毫秒数

        seekComandTimesMonitor:[],
        largeScaleHeight: 30,       //每个大格高度
        smallScaleHeight: 12.5,     //每个小个高度
        backgroundColor: "#262626", //刻度背景颜色
        trimHeight: 67,             //出入点高度
        scaleColor: "#929293",      //线性样式
        fontColor: "#929293",       //字体样式
        fontSize: 12,               //字体大小
        fontFamily: "微软雅黑",     //字体样式
        $container :null,           //刻度容器
        $ruler :null,               //刻度尺
        $cursor :null,              //刻度指针
        $trimInOut: null,           //出入点
        $trimIn : null,             //入点
        $trimOut:null,              //出点

        $sliderTrack:null,          //滚动槽
        $sliderBar:null,            //滚动条
        $sliderBarLeft:null,        //滚动条左
        $sliderBarMiddle:null,      //滚动条中
        $sliderBarRight:null,       //滚动条右

        $clipTrackContainer:null,   //切片槽容器
        $clipTrack:null,            //切片槽

        $clipVideo:null,
        $clipAudio1:null,
        $clipAudio2:null,
        $clipSubTitle:null,
        $clipEffect:null,
        targetObj:'time_rule'
    };
    function constructor(playerConfig) {
        self = this;
        self.config = $.extend(defaultConfig,playerConfig);
        self.targetObj = self.config.targetObj;
        self.trimInCurrTime = 0;    //入点目前毫秒数
        self.trimOutCurrTime=0;     //出点目前帧数
        self.currTime=0;            //指针目前毫秒数

        drawRuler();//初始化一些配置参数、初始化HTML、初始化时间刻度
        handleDocumentEvent(); //执行文档事件

        this.config.$rulerWrap.addEventListener("mousedown", seekToCursorFrame);
        this.config.$rulerWrap.addEventListener("mousemove", getVideoCurrFrame);

        this.config.$trimIn.addEventListener("mousemove", getVideoTrimInCurrMsec);
        this.config.$trimOut.addEventListener("mousemove", getVideoTrimOutCurrMsec);

        this.DragDrop.addHandler('clipDragstart',handleClipDragStartEvent);
        this.DragDrop.addHandler('clipDrag',handleClipDragEvent);
        this.DragDrop.addHandler('clipDragend',handleClipDragEndEvent);
        this.DragDrop.addHandler('clipClick',handleClipClickEvent);

        this.DragDrop.addHandler('clipCheckDir',handleClipCheckDirEvent);

        this.DragDrop.addHandler('clipDblclick',handleClipDblclickEvent);

        this.DragDrop.addHandler('sequenceClick',handleSequenceClickEvent);
        this.DragDrop.addHandler('effectClick',handleEffectClickEvent);

        //this.DragDrop.addHandler('mousewheel',privateMousewheelEvent);//私人滚轮事件
        this.DragDrop.addHandler('keydown',privateKeyDownEvent);    //私人键盘事件

        //this.DragDrop.addHandler('contextmenu',handleClipContextmenuEvent);//音频切片右键菜单

        window.addEventListener("resize", handleplayerResizeEvent);

        PLAYER.EventUtil.addHandler($('.time_ruler_edit_box')[0],'click',toolbarZoomInOut);//点击工具条放大镜
    };
    constructor.prototype = {
        updateRuler: function(newConfig) {
            //配置新的参数
            var config = self.config;
            var targetObj = self.targetObj;
            //设置新的参数
            config.framePerPixel=newConfig.framePerPixel;//初始化比率(1f/px)
            config.smallScaleFrame=newConfig.smallScaleFrame;//初始化一小格帧数
            config.smallScaleNumsPerLargeScale=newConfig.smallScaleNumsPerLargeScale;//初始化大格里面小格数
            config.smallScaleWidth=config.smallScaleFrame/config.framePerPixel;//初始化一小格宽度
            config.largeScaleWidth=config.smallScaleWidth*config.smallScaleNumsPerLargeScale;//初始化一大格宽度
            config.largeScaleMillisecondInterval=config.smallScaleFrame*config.smallScaleNumsPerLargeScale*40;//初始化一大格代表的毫秒数
            config.max_fpp=Math.min(config.maxTime/$("." + self.targetObj).width(),25*60.0*60*10.0/80);
        },
        updateEvent:function(maxTime,initDrag){
            var config = self.config;
            var targetObj = self.targetObj;

            config.maxTime=maxTime;
            config.max_fpp=Math.min(config.maxTime/config.$headerRight.width(),25*60.0*60*10.0/80);

            if(initDrag){
                newContainerWidth=2*config.$headerRight.width();
                config.framePerPixel=config.maxTime/newContainerWidth;
                var s=getUnitInfo(config.framePerPixel);

                letFramePerPixelValid(config.framePerPixel);
                zoomRulerConfig(s.smallScaleFrame,s.smallScaleNumsPerLargeScale,config.framePerPixel);
                newtotalScrollWidth=0.5*config.$sliderTrack.width();

                newTotalBtnScollLeft=0;
                newContainerMarginLeft=0;

                config.$rulerWrap.width(newContainerWidth);
                config.$sliderBar.css('width',newtotalScrollWidth);
                config.$sliderBar.css('left',newTotalBtnScollLeft);
                config.$sliderBarMiddle.css("width", newtotalScrollWidth-2*scrollRightWidth);
                config.$sliderBarMiddle.css("left",scrollRightWidth);
                config.$sliderBarLeft.css('left',0);
                config.$sliderBarRight.css('left',newtotalScrollWidth-scrollRightWidth);

            }else{

                newContainerWidth=config.maxTime/config.framePerPixel;
                newContainerMarginLeft=Math.abs(parseInt(config.$rulerWrap.css('marginLeft')));

                newtotalScrollWidth=config.$sliderBar.width();
                if(newtotalScrollWidth===config.$sliderTrack.width()){
                    newtotalScrollWidth=config.$headerRight.width()*config.$sliderTrack.width()/newContainerWidth;
                }

                scrollBtnMovableDistance = parseInt(config.$sliderTrack.width()-newtotalScrollWidth);
                containerMovableDistance = parseInt(newContainerWidth - config.$headerRight.width());
                newTotalBtnScollLeft=newContainerMarginLeft*scrollBtnMovableDistance/containerMovableDistance;

                config.$rulerWrap.width(newContainerWidth);
                config.$sliderBar.css('width',newtotalScrollWidth);
                config.$sliderBar.css('left',newTotalBtnScollLeft);
                config.$sliderBarMiddle.css("width", newtotalScrollWidth-2*scrollRightWidth);
                config.$sliderBarMiddle.css("left",scrollRightWidth);
                config.$sliderBarLeft.css('left',0);
                config.$sliderBarRight.css('left',newtotalScrollWidth-scrollRightWidth);
            }

            self.fixArrowCurrentTime(self.currTime);
            self.fixTrimInByCurrentTime(self.trimInCurrTime);
            self.fixTrimOutByCurrentTime(self.trimOutCurrTime);
            drawCanvas(newContainerMarginLeft);
        },
        fixArrowCurrentTime: function(time) {
            var config = this.config;
            var targetObj = this.targetObj;
            currPos = time/config.framePerPixel;

            var ml=Math.abs(parseFloat(config.$rulerWrap.css("margin-left")));
            var w=config.$headerRight.width();
            if(currPos<=0){
                currPos=0;
            }
            if(currPos>=config.$rulerWrap.width()){
                currPos=config.$rulerWrap.width();
            }
            if(currPos-ml>w){
                newContainerMarginLeft = currPos - w;
                scrollBtnMovableDistance = parseFloat(config.$sliderTrack.width() -config.$sliderBar.width());//滚动条可滚动距离
                containerMovableDistance = parseFloat(config.$rulerWrap.width() - w); //刻度可滚动距离

                newTotalBtnScollLeft=newContainerMarginLeft*scrollBtnMovableDistance/containerMovableDistance;

                //重新滚动条
                config.$sliderBar.css('left',newTotalBtnScollLeft);
                //重新计算刻度容器
                config.$rulerWrap.css("margin-left", -newContainerMarginLeft);
                config.$ruler.css("left", newContainerMarginLeft);
                config.$clipTrackBar.css("margin-left", -newContainerMarginLeft);
                config.$line.css("margin-left", -newContainerMarginLeft);
                //更新canvas画布
                drawCanvas(newContainerMarginLeft);
            }
            /*if(currPos<ml){
                console.log('2')
                newContainerMarginLeft = currPos;
                newTotalBtnScollLeft=newContainerMarginLeft*config.$sliderTrack.width()/config.$rulerWrap.width();

                config.$sliderBar.css('left',newTotalBtnScollLeft);
                config.$rulerWrap.css("margin-left", -newContainerMarginLeft);
                config.$ruler.css("left", newContainerMarginLeft);
                drawCanvas(newContainerMarginLeft);
                //重新滚动条
                config.$sliderBar.css('left',newTotalBtnScollLeft);
                //重新计算刻度容器
                config.$rulerWrap.css("margin-left", -newContainerMarginLeft);
                config.$ruler.css("left", newContainerMarginLeft);
                config.$clipTrackBar.css("margin-left", -newContainerMarginLeft);

                //更新canvas画布
                drawCanvas(newContainerMarginLeft);
            }*/
            self.currTime=time;
            $('#js_time_ruler_title_nowTime').html(PLAYER.getDurationToString(self.currTime));
            config.$cursor.css("left",currPos);
            config.$line.css("left",currPos);

        },
        fixTrimInByCurrentTime: function(time) {
            var config = this.config;
            this.trimInCurrTime = time;
            trimInCurrPos = this.trimInCurrTime /config.framePerPixel;
            trimOutCurrPos = this.trimOutCurrTime/config.framePerPixel;


            /*if(PLAYER.keyNum===73&&this.trimInCurrTime===0){
                trimOutCurrPos = config.maxTime/config.framePerPixel;
                this.trimOutCurrTime=config.maxTime;
                trimOutCurrPos = parseInt(trimOutCurrPos*config.framePerPixel)/config.framePerPixel;
            }*/
            if(trimInCurrPos>trimOutCurrPos){
                trimOutCurrPos = config.maxTime/config.framePerPixel;
                this.trimOutCurrTime=config.maxTime;
                trimOutCurrPos = parseInt(trimOutCurrPos*config.framePerPixel)/config.framePerPixel;
            }
            config.$trimInOut.css("left", trimInCurrPos);
            config.$trimInOut.css("width", trimOutCurrPos + 2 - trimInCurrPos);

            var timeHtml=PLAYER.getDurationToString((parseInt(self.trimOutCurrTime)-parseInt(self.trimInCurrTime)));
            $('#js_player_trimInOutTime').html(timeHtml);
        },
        initTime:function(){
            var config = this.config;
            var targetObj = this.targetObj;

            config.$sliderBar.css('left',0);
            config.$sliderBarMiddle.css("width", newtotalScrollWidth-scrollLeftWidth-scrollRightWidth);
            config.$sliderBarMiddle.css("left", scrollLeftWidth);
            config.$sliderBarLeft.css('left',0);
            config.$sliderBarRight.css('left',newtotalScrollWidth-scrollRightWidth);

            config.$rulerWrap.css("margin-left", 0);
            config.$ruler.css("left", 0);
            config.$clipTrackBar.css("margin-left", 0);
            drawCanvas(0);
            self.fixArrowCurrentTime(0);
        },
        fixTrimOutByCurrentTime: function(time) {
            var config = this.config;
            this.trimOutCurrTime = time;
            trimInCurrPos = this.trimInCurrTime/config.framePerPixel;
            trimOutCurrPos = this.trimOutCurrTime /config.framePerPixel;

            if(trimOutCurrPos<trimInCurrPos){
               trimInCurrPos=0;
               this.trimInCurrTime=0;
            }
            config.$trimInOut.css("left", trimInCurrPos);
            config.$trimInOut.css("width", trimOutCurrPos + 2 - trimInCurrPos);

            var timeHtml=PLAYER.getDurationToString((parseInt(self.trimOutCurrTime)-parseInt(self.trimInCurrTime)));
            $('#js_player_trimInOutTime').html(timeHtml);
        },
        cutArrowCurrentTime:function(){
            var config = self.config;
            var targetObj = self.targetObj;
            var currFrame= self.currTime; //时码线帧数

            var intId='interleaved_id_'+PLAYER.genNonDuplicateID(12);
            PLAYER.checkPlaying();

            PLAYER.cutIndex++;
            $.each($('.onselected'),function(i,n){
                v0_sequenceTrimIn=parseInt($(n).attr('data-sequencetrimin'));
                v0_sequenceTrimOut=parseInt($(n).attr('data-sequencetrimout'));

                if(v0_sequenceTrimIn<currFrame&&v0_sequenceTrimOut>currFrame){
                    //执行函数
                    cutSubclip($(n));
                    function cutSubclip(v_target){

                        //原素材
                        var v0_sequenceTrimIn=0;
                        var v0_sequenceTrimOut=0;
                        var v0_trimIn=0;
                        var v0_trimOut=0;
                        //切后添加素材
                        var vcut_sequenceTrimIn=0;
                        var vcut_sequenceTrimOut=0;
                        var vcut_trimIn=0;
                        var vcut_trimOut=0;
                        //原素材属性
                        var v_dataId=v_target.attr('data-id');
                        var v_dataName=v_target.attr('data-name');
                        var v_dataTime=v_target.attr('data-time');
                        var v_dataDuration=parseInt(v_target.attr('data-duration'));
                        var v_interleaved=v_target.attr('data-interleaved');
                        var v_interleaved_id=v_target.attr('data-intid');
                        var v_index=parseInt(v_target.parent('.time_ruler_bar').attr('data-index'));
                        var v_class=v_target.attr('class');
                        var v_type=v_target.attr('data-type');
                        var v_offsetLeft=parseInt(v_target.offset().left);
                        //切后素材属性
                        var add_subclip;
                        var add_subclip_attr;
                        var subclipId=v_type+'_'+PLAYER.genNonDuplicateID(12);

                        //加状态
                        PLAYER.checkPlaying();
                        v_target.css('cursor','url(images/cur/cut.cur),default');
                        v_target.removeClass('onselected');
                        //计算原素材属性

                        v0_sequenceTrimIn=parseInt(v_target.attr('data-sequencetrimin'));
                        v0_sequenceTrimOut=parseInt(currFrame);
                        v0_trimIn=parseInt(v_target.attr('data-trimin'));
                        v0_trimOut=v0_trimIn+v0_sequenceTrimOut-v0_sequenceTrimIn;

                        //切后节点属性

                        vcut_trimIn=v0_trimOut;
                        vcut_sequenceTrimIn=currFrame;
                        vcut_sequenceTrimOut=parseInt(v_target.attr('data-sequencetrimout'));
                        vcut_trimOut=parseInt(v_target.attr('data-trimout'));

                        //切片后新加切片
                        add_subclip=v_target.clone();
                        //除了马赛克其他特技不存在
                        if(add_subclip.find('.effect_box_l')){
                            add_subclip.find('.effect_box_l').remove();
                        }
                        if(add_subclip.find('.effect_box_r')){
                            v_target.find('.effect_box_r').remove();
                        }
                        var intId=v_interleaved_id+'_'+PLAYER.cutIndex;
                        add_subclip.removeClass('onselected');
                        add_subclip.attr('data-trimin',vcut_trimIn);
                        add_subclip.attr('data-trimout',vcut_trimOut);
                        add_subclip.attr('data-sequencetrimin',vcut_sequenceTrimIn);
                        add_subclip.attr('data-sequencetrimout',vcut_sequenceTrimOut);
                        add_subclip.attr('data-time',subclipId);
                        add_subclip.attr('data-intid',intId);


                        add_subclip.css('width',(vcut_sequenceTrimOut-vcut_sequenceTrimIn)/config.framePerPixel);
                        add_subclip.css('left',vcut_sequenceTrimIn/config.framePerPixel);

                        v_target.parent('.time_ruler_bar').append(add_subclip);

                        if(v_target.parent('.time_ruler_bar').hasClass('bar_v')){
                            var e_attr=PLAYER.operateJson.getCutNewEffectClip(v_dataTime,vcut_trimIn,vcut_trimOut);
                            add_subclip_attr={
                                "assetid": v_dataId,
                                "trimIn": vcut_trimIn,
                                "trimOut":vcut_trimOut,
                                "sequenceTrimIn": vcut_sequenceTrimIn,
                                "sequenceTrimOut":vcut_sequenceTrimOut,
                                "effect":e_attr,
                                "subclipId":subclipId,
                                "type":v_type,
                                "interleaved_id":intId
                            }
                            if(v_interleaved==='true'){
                                add_subclip_attr.interleaved=true;
                            }else{
                                add_subclip_attr.interleaved=false;
                            }

                            PLAYER.operateJson.addVideoClipAttr(add_subclip_attr,v_index);

                        }else if(v_target.parent('.time_ruler_bar').hasClass('bar_a')){
                            add_subclip_attr={
                                "assetid": v_dataId,
                                "trimIn": vcut_trimIn,
                                "trimOut":vcut_trimOut,
                                "sequenceTrimIn": vcut_sequenceTrimIn,
                                "sequenceTrimOut":vcut_sequenceTrimOut,
                                "volume":100,
                                "subclipId":subclipId,
                                "type":v_type,
                                "interleaved_id":intId
                            }
                            if(v_interleaved==='true'){
                                add_subclip_attr.interleaved=true;
                            }else{
                                add_subclip_attr.interleaved=false;
                            }

                            PLAYER.operateJson.addAudioClipAttr(add_subclip_attr,v_index);

                        }else if(v_target.parent('.time_ruler_bar').hasClass('bar_t')){
                            var msg= JSON.parse(PLAYER.operateJson.getSubtitleClip(v_dataTime,v_index));
                            var subClipAttr_cut={
                                "trimIn": vcut_trimIn,
                                "trimOut":vcut_trimOut,
                                "sequenceTrimIn":vcut_sequenceTrimIn,
                                "sequenceTrimOut":vcut_sequenceTrimOut,
                                "subclipId":subclipId,
                                "type":v_type,
                                "interleaved_id":intId
                            }

                            $.extend(msg,subClipAttr_cut);
                            PLAYER.operateJson.addSubtitleClipAttr(msg,v_index);
                        }

                        v_target.attr('data-trimout',v0_trimOut);
                        v_target.attr('data-sequencetrimout',v0_sequenceTrimOut);
                        v_target.width((v0_sequenceTrimOut-v0_sequenceTrimIn)/config.framePerPixel);

                        //更新原素材属性
                        var v0_subClipAttr={
                            trimIn: v0_trimIn,
                            trimOut:v0_trimOut,
                            sequenceTrimIn:v0_sequenceTrimIn,
                            sequenceTrimOut:v0_sequenceTrimOut
                        }
                        var e_attr2=PLAYER.operateJson.getCutOldEffectClip(v_dataTime,v0_trimIn,v0_trimOut);
                        PLAYER.operateJson.updateClipAttr(v0_subClipAttr,v_dataTime,e_attr2);
                    }
                }
            });
            //更新json
            PLAYER.operateJson.sendJson();
        },
        fixEffectWidth:function(dragging){
            if(dragging.children('.effect_box')){
                $.each(dragging.children('.effect_box'),function(index,item){
                    var _w=($(item).attr('data-trimout')-$(item).attr('data-trimin'))/PLAYER.TR.config.framePerPixel;
                    $(item).width(_w);
                })
            }
        },
        fixClipWidth:function(){
            var config = self.config;

            $.each($('.edit_box_v'),function(i,n){
                var newWidth=($(n).attr('data-trimout')-$(n).attr('data-trimin'))/config.framePerPixel;
                newLeft=(parseInt($(n).attr('data-sequencetrimin')))/config.framePerPixel;
                $(n).width(newWidth);
                $(n).css('left',newLeft);
                self.fixEffectWidth($(n));
            });
            $.each($('.edit_box_a'),function(i,n){
                var newWidth=($(n).attr('data-trimout')-$(n).attr('data-trimin'))/config.framePerPixel;
                newLeft=(parseInt($(n).attr('data-sequencetrimin')))/config.framePerPixel;
                $(n).width(newWidth);
                $(n).css('left',newLeft);
            });
            $.each($('.edit_box_t'),function(i,n){
                var newWidth=($(n).attr('data-trimout')-$(n).attr('data-trimin'))/config.framePerPixel;
                newLeft=(parseInt($(n).attr('data-sequencetrimin')))/config.framePerPixel;
                $(n).width(newWidth);
                $(n).css('left',newLeft);
            });
        },
        moveToNextFrame:function(){
            PLAYER.keyNum=39;
            var config = self.config;
            self.currTime+=1;
            if(self.currTime>=config.maxTime){
                self.currTime=config.maxTime;
            }
            self.fixArrowCurrentTime(self.currTime);
            self.fixTrimInByCurrentTime(self.trimInCurrTime);
            self.fixTrimOutByCurrentTime(self.trimOutCurrTime);
        },
        moveToPrevFrame:function(){
            PLAYER.keyNum=37;
            var config = self.config;
            self.currTime-=1;
            if(self.currTime<=0){
                self.currTime=0;
            }
            self.fixArrowCurrentTime(self.currTime);
            self.fixTrimInByCurrentTime(self.trimInCurrTime);
            self.fixTrimOutByCurrentTime(self.trimOutCurrTime);
        },
        DragDrop:function(){
            var targetObj = this.targetObj;
            var dragdrop=new PLAYER.EventTarget(),
                v0_dragging=null,   //元拖拽素材
                vi_dragging=null,   //联动拖拽素材
                trimInDragging=null,
                mouseing=null,
                clipping=null;

            var initClientX=0;
            //游标
            var cursoring=null;
            var offsetX=0;

            var arr_left=[]; //存储编组切片的left值
            var arr_right=[];//存储编组切片的right值
            var arr_in=[]; //存储编组切片的sin值
            var arr_out=[];//存储编组切片的sout值

            var min_left=0;//存储编组切片的最小in值
            var max_right=0;//存储编组切片的最大out值
            var min_in=0;//存储编组切片的最小in值
            var max_out=0;//存储编组切片的最大out值

            var v0_dir;     //存储按下切片是初始化方向
            var v0_attr;    //存储按下切片是初始化信息
            var vd_attr;

            function getInitDir(target,attr){
                var dir=getClipDir(JSON.parse(attr));
                target.attr('data-clipdir',dir);
                return dir;
            }
            function getInitLeft(attr){
                var left=JSON.parse(attr).clipInitLeft;
                return left;
            }
            function getInitRight(attr){
                var left=JSON.parse(attr).clipInitLeft+JSON.parse(attr).clipInitWidth;
                return left;
            }
            function getInitIn(attr){
                var left=JSON.parse(attr).clipInitSequenceTrimIn;
                return left;
            }
            function getInitOut(attr){
                var left=JSON.parse(attr).clipInitSequenceTrimOut;
                return left;
            }
            function getIndex(v0_attr,clientY){
                var clipInitType=JSON.parse(v0_attr).clipInitType;
                var clipInitOffsetTop=JSON.parse(v0_attr).clipInitOffsetTop;
                var clipInitIndex=JSON.parse(v0_attr).clipInitIndex;
                var clipInitClientY=JSON.parse(v0_attr).clipInitClientY;
                var cal_index;
                if(clipInitType==='v'){
                    if(clipInitIndex>=1&&clientY-clipInitClientY<-10){
                        cal_index=clipInitIndex+Math.ceil((clipInitOffsetTop-clientY)/70);
                    }
                    else if(clipInitIndex>=2&&clientY-clipInitClientY>10){
                        cal_index=clipInitIndex-Math.ceil((clientY-clipInitClientY)/70);
                    }else if(Math.abs(clientY-clipInitClientY)<5){
                        cal_index=clipInitIndex;
                    }
                }
                else if(clipInitType==='t' || clipInitType==='a'){
                    if(clipInitIndex>=1&&clientY-clipInitClientY>10){
                        cal_index=clipInitIndex+Math.ceil((clientY-clipInitOffsetTop)/70);
                    }
                    else if(clipInitIndex>=2&&clientY-clipInitClientY<-10){
                        cal_index=clipInitIndex-Math.ceil((clipInitClientY-clientY)/70);
                    }else if(Math.abs(clientY-clipInitClientY)<5){
                        cal_index=clipInitIndex;
                    }
                }
                if(cal_index){
                    return cal_index;
                }

            }
            function handleEvent(event){
                event=PLAYER.EventUtil.getEvent(event);
                var target=PLAYER.EventUtil.getTarget(event);
                switch(event.type){
                    case 'mousedown':
                        if(target.className.indexOf('draggable')>-1){
                            PLAYER.EventUtil.preventDefault(event);
                            PLAYER.clickOrMove=false;
                            v0_dragging=$(target);
                            initClientX=event.clientX;

                            PLAYER.operateJson.mouseDownState(v0_dragging);

                            //存储初始化信息
                            v0_attr=getDragInfo(v0_dragging,event);
                            v0_dir=getInitDir(v0_dragging,v0_attr);

                            PLAYER.operateJson.addDraggingInfo(v0_dragging,v0_attr);
                            arr_left.push(getInitLeft(v0_attr));
                            arr_right.push(getInitRight(v0_attr));
                            arr_in.push(getInitIn(v0_attr));
                            arr_out.push(getInitOut(v0_attr));

                            dragdrop.fire({
                                type:'clipDragstart',
                                target:v0_dragging,
                                x:event.clientX,
                                y:event.clientY
                            });

                            if(v0_dir==='middle'){
                                var seleElem=PLAYER.operateJson.chooseSelectedElem(v0_dragging);
                                if(seleElem.length!==0){
                                    for (var  i = 0; i<seleElem.length;i++) {
                                        var dragging=seleElem[i];
                                        vd_attr=getDragInfo(dragging,event);
                                        dragging.attr('data-clipdir',v0_dir);

                                        PLAYER.operateJson.addDraggingInfo(dragging,vd_attr);
                                        arr_left.push(getInitLeft(vd_attr));
                                        arr_right.push(getInitRight(vd_attr));
                                        arr_in.push(getInitIn(vd_attr));
                                        arr_out.push(getInitOut(vd_attr));

                                        dragdrop.fire({
                                            type:'clipDragstart',
                                            target:dragging,
                                            x:event.clientX,
                                            y:event.clientY
                                        });
                                    }
                                }
                            }
                            else if(v0_dir==='left' || v0_dir==='right'){
                                var dragging=PLAYER.operateJson.chooseInterleavedElem(v0_dragging);
                                if(dragging){
                                    vd_attr=getDragInfo(dragging,event);
                                    dragging.attr('data-clipdir',v0_dir);

                                    PLAYER.operateJson.addDraggingInfo(dragging,vd_attr);

                                    arr_left.push(getInitLeft(vd_attr));
                                    arr_right.push(getInitRight(vd_attr));
                                    arr_in.push(getInitIn(vd_attr));
                                    arr_out.push(getInitOut(vd_attr));

                                    dragdrop.fire({
                                        type:'clipDragstart',
                                        target:dragging,
                                        x:event.clientX,
                                        y:event.clientY
                                    });
                                }
                            }

                            min_left=Math.min.apply(null,arr_left);
                            max_right=Math.max.apply(null,arr_right);
                            min_in=Math.min.apply(null,arr_in);
                            max_out=Math.max.apply(null,arr_out);
                        }
                        break;
                    case 'mousemove':
                        if(v0_dragging!==null){
                            var s=Math.abs(event.clientX-initClientX);

                            if(s<=1){
                                PLAYER.clickOrMove=false; //click
                            }else{
                                PLAYER.clickOrMove=true; //move
                                var cal_index=getIndex(v0_attr,event.clientY);

                                dragdrop.fire({
                                    type:'clipDrag',
                                    target:v0_dragging,
                                    x:event.clientX,
                                    y:event.clientY,
                                    min_left:min_left,
                                    max_right:max_right,
                                    min_in:min_in,
                                    max_out:max_out,
                                    cal_index:cal_index
                                });
                                if(v0_dir==='middle'){
                                    //移动可以全体移动
                                    var seleElem=PLAYER.operateJson.chooseSelectedElem(v0_dragging);
                                    if(seleElem.length!==0){
                                        for (var i = 0; i<seleElem.length;i++) {
                                        var dragging=seleElem[i];
                                            dragdrop.fire({
                                                type:'clipDrag',
                                                target:dragging,
                                                x:event.clientX,
                                                y:event.clientY,
                                                min_left:min_left,
                                                max_right:max_right,
                                                min_in:min_in,
                                                max_out:max_out,
                                                cal_index:cal_index
                                            });
                                        }
                                    }
                                }else if(v0_dir==='left' || v0_dir==='right'){
                                    //缩放只能联动一起缩放
                                    var dragging=PLAYER.operateJson.chooseInterleavedElem(v0_dragging);
                                    if(dragging){
                                        dragdrop.fire({
                                            type:'clipDrag',
                                            target:dragging,
                                            x:event.clientX,
                                            y:event.clientY,
                                            min_left:min_left,
                                            max_right:max_right,
                                            min_in:min_in,
                                            max_out:max_out,
                                            cal_index:cal_index
                                        });
                                    }

                                }
                            }
                        }
                        if(target.className.indexOf('draggable')>-1){
                            mouseing=$(target);
                            mouseing.css({cursor:"default"});
                            dragdrop.fire({
                                type:'clipCheckDir',
                                target:mouseing,
                                x:event.clientX,
                                y:event.clientY
                            });
                            mouseing=null;
                        }
                        break;
                    case 'mouseup':
                            var s=Math.abs(event.clientX-initClientX);
                            if(s<=3){
                                PLAYER.clickOrMove=false; //click
                            }else{
                                PLAYER.clickOrMove=true; //move
                            }


                            if(PLAYER.clickOrMove&&v0_dragging){

                                if( v0_dragging.hasClass('draggable') || v0_dragging.hasClass('time_ruler_bar') ){
                                    dragdrop.fire({
                                        type:'clipDragend',
                                        target:v0_dragging,
                                        x:event.clientX,
                                        y:event.clientY

                                    });

                                    if(v0_dir==='middle'){
                                        var seleElem=PLAYER.operateJson.chooseSelectedElem(v0_dragging);
                                        if(seleElem.length!==0){
                                            for (var  i = 0; i<seleElem.length;i++) {
                                                var dragging=seleElem[i];
                                                dragdrop.fire({
                                                    type:'clipDragend',
                                                    target:dragging,
                                                    x:event.clientX,
                                                    y:event.clientY
                                                });
                                            }
                                        }
                                    }else if(v0_dir==='left' || v0_dir==='right'){
                                        var dragging=PLAYER.operateJson.chooseInterleavedElem(v0_dragging);
                                        if(dragging){
                                            dragdrop.fire({
                                                type:'clipDragend',
                                                target:dragging,
                                                x:event.clientX,
                                                y:event.clientY
                                            });
                                        }

                                    }

                                    PLAYER.operateJson.sendJson();
                                }


                            }
                            //click结束
                            if(!PLAYER.clickOrMove&&v0_dragging&&v0_dragging.hasClass('draggable')){
                                var id="interleaved_id"+PLAYER.genNonDuplicateID(12);
                                dragdrop.fire({
                                    type:'clipClick',
                                    target:v0_dragging,
                                    x:event.clientX,
                                    y:event.clientY,
                                    intId:id
                                });


                                if(v0_dir==='middle'){
                                    var seleElem=PLAYER.operateJson.chooseSelectedElem(v0_dragging);
                                    if(seleElem.length!==0){
                                        for (var  i = 0; i<seleElem.length;i++) {
                                        var dragging=seleElem[i];
                                            dragdrop.fire({
                                                type:'clipClick',
                                                target:dragging,
                                                x:event.clientX,
                                                y:event.clientY,
                                                intId:id
                                            });
                                        }
                                    }
                                }
                                else if(v0_dir==='left' || v0_dir==='right'){
                                    var dragging=PLAYER.operateJson.chooseInterleavedElem(v0_dragging);
                                    if(dragging){
                                        dragdrop.fire({
                                            type:'clipClick',
                                            target:dragging,
                                            x:event.clientX,
                                            y:event.clientY,
                                            intId:id
                                        });
                                    }


                                }

                                if(PLAYER.keyNum===85){
                                    PLAYER.operateJson.sendJson();
                                }

                            }

                            v0_dragging=null;
                            dragging=null;
                            min_left=0;
                            max_right=0;
                            min_in=0;
                            max_out=0;
                            arr_left=[];
                            arr_right=[];
                            arr_in=[];
                            arr_out=[];
                        break;
                    case 'click':
                        if(target.className.indexOf('effect_box_l')>-1 || target.className.indexOf('effect_box_r')>-1){
                            var clicking=$(target);
                            dragdrop.fire({
                                type:'effectClick',
                                target:clicking,
                                x:event.clientX,
                                y:event.clientY
                            })
                        }
                        break;
                    case 'dblclick':
                        if(target.className.indexOf('time_ruler_bar')>-1){
                            var clicking=$(target);
                            dragdrop.fire({
                                type:'sequenceClick',
                                target:clicking,
                                x:event.clientX,
                                y:event.clientY
                            })
                        }
                        if(target.className.indexOf('edit_box_t')>-1){
                            mouseing=$(target);
                            dragdrop.fire({
                                type:'clipDblclick',
                                target:mouseing,
                                x:event.clientX,
                                y:event.clientY
                            })
                        }
                        break;
                    case 'mousewheel':
                        var mousewheeling=$(target);
                        dragdrop.fire({
                            type:'mousewheel',
                            target:mousewheeling,
                            wheelDelta:event.wheelDelta
                        });
                        break;
                    case 'keydown':
                        var keydowning=$(target);
                        PLAYER.EventUtil.preventDefault(event);
                        dragdrop.fire({
                            type:'keydown',
                            target:keydowning,
                            code:event.keyCode,
                            shift:event.shiftKey,
                            ctrl:event.ctrlKey
                        });
                        break;
                    /*case 'contextmenu':
                        if(target.className.indexOf('draggable')>-1){
                            PLAYER.EventUtil.preventDefault(event);
                            var contextmenuing=$(target);
                            dragdrop.fire({
                                type:'contextmenu',
                                target:contextmenuing,
                                x:event.clientX,
                                y:event.clientY
                            });
                        }
                        break;*/
                }
            }
            dragdrop.enable=function(){
                PLAYER.EventUtil.addHandler(document,'mousedown',handleEvent);
                PLAYER.EventUtil.addHandler(document,'mousemove',handleEvent);
                PLAYER.EventUtil.addHandler(document,'mouseup',handleEvent);
                PLAYER.EventUtil.addHandler(document,'click',handleEvent);
                PLAYER.EventUtil.addHandler(document,'dblclick',handleEvent);
                PLAYER.EventUtil.addHandler(document,'mousewheel',handleEvent);
                PLAYER.EventUtil.addHandler(document,'keydown',handleEvent);
                //PLAYER.EventUtil.addHandler(document,'contextmenu',handleEvent);
            };
            dragdrop.disable=function(){
                PLAYER.EventUtil.removeHandler(document,'mousedown',handleEvent);
                PLAYER.EventUtil.removeHandler(document,'mousemove',handleEvent);
                PLAYER.EventUtil.removeHandler(document,'mouseup',handleEvent);
                PLAYER.EventUtil.removeHandler(document,'click',handleEvent);
                PLAYER.EventUtil.removeHandler(document,'dblclick',handleEvent);
                PLAYER.EventUtil.removeHandler(document,'mouseover',handleEvent);
                PLAYER.EventUtil.removeHandler(document,'mouseout',handleEvent);
                PLAYER.EventUtil.removeHandler(document,'mousewheel',handleEvent);
                PLAYER.EventUtil.removeHandler(document,'keydown',handleEvent);
                //PLAYER.EventUtil.removeHandler(document,'contextmenu',handleEvent);
            };
            return dragdrop;
        }()
    }
    /*初始化整个结构函数*/
    function drawRuler() {
        var config = self.config;
        var targetObj = self.targetObj;
        /*-----------------添加头部-----------------*/
        config.$header = $('<div class="' + targetObj + '_header"></div>');

        config.$headerLeft=$('<div class="' + targetObj + '_header_left fl">'
                +'<div class="time_ruler_title_nowTime" id="js_time_ruler_title_nowTime">00:00:00:00</div>'
                +'<div class="time_ruler_title_toolbar">'
                    /*+'<span class="toolbar_insert_model add_audio_track" title="添加音频轨道" id="js_add_audio_track">'
                        +'<a class="fa fa-plus"></a>'
                    +'</span>'
                    +'<span class="toolbar_insert_model add_audio_track" title="添加音频轨道" id="js_add_audio_track">'
                        +'<a class="fa fa-plus"></a>'
                    +'</span>'
                    +'<span class="toolbar_insert_model add_subtitle_track" title="添加字幕轨道" id="js_add_subtitle_track">'
                        +'<a class="fa fa-plus"></a>'
                    +'</span>'
                    +'<span class="toolbar_insert_model add_point" title="添加标记">'
                        +'<a class="fa fa-plus"></a>'
                    +'</span>'*/
                +'</div>'
            +'</div>');
        config.$headerRight = $('<div class="' + targetObj + '_header_right fr"></div>');

        config.$rulerWrap=$('<div class="' + targetObj + '_canvas_wrap"></div>');
        config.$ruler = $('<canvas class="' + targetObj + '_canvas"></canvas>');
        config.$ruler.attr("width", config.$headerRight.width());
        config.$rulerWrap.append(config.$ruler);

        config.$headerRight.append(config.$rulerWrap);
        config.$header.append(config.$headerLeft);
        config.$header.append(config.$headerRight);
        newContainerWidth=config.$headerRight.width();
        //添加出入点
        config.$trimInOut = $('<div class="' + targetObj + '_trimInOut"></div>');
        config.$trimInOut.css("height", config.trimHeight-2);
        config.$trimInOut.css("width", "0px");
        config.$trimInOut.appendTo(config.$rulerWrap);

        config.$trimIn = $('<div class="' + targetObj + '_trimIn"></div>');
        config.$trimIn.css("height", config.trimHeight-2);
        config.$trimIn.appendTo(config.$trimInOut);

        config.$trimOut = $('<div class="' + targetObj + '_trimOut"></div>');
        config.$trimOut.css("height", config.trimHeight-2);
        config.$trimOut.appendTo(config.$trimInOut);

        //添加刻度的指针
        config.$cursor = $('<div class="' + targetObj + '_cursor"></div>');
        config.$cursor.css("height", $('.'+targetObj).height()-70);
        config.$cursor.appendTo(config.$rulerWrap);
        var cursorTop = $('<div class="' + targetObj + '_cursor_top"></div>');
        cursorTop.appendTo(config.$cursor);
        config.$header.appendTo($("." + targetObj));

        /*------------------添加身体------------------*/
        config.$body=$('<div class="' + targetObj + '_body"></div>');
        //添加素材编辑区
        config.$clipTrackContainer=$('<div class="' + targetObj + '_track_box" id="js_' + targetObj + '_track_box">');

        config.$clipTrackLeft=$('<div class="time_ruler_title_box fl" id="js_time_ruler_title_box"></div>');
        config.$clipTrackLeft.html(
                    '<div class="time_ruler_title_list" data-type="t1">T1</div>'
                +'<div class="time_ruler_title_list" data-type="t2">T2</div>'
                +'<div class="time_ruler_title_list" data-type="v2">V2</div>'
                +'<div class="time_ruler_title_list" data-type="v1">V1</div>'
                +'<div class="time_ruler_title_list" data-type="a1">A1</div>'
                +'<div class="time_ruler_title_list" data-type="a2">A2</div>');

        config.$clipTrackLeftRight=$('<div class="time_ruler_edit_box fr"></div>');
        config.$clipTrackBar=$('<div class="time_ruler_bar_box" id="js_time_ruler_bar_box"></div>');
        config.$clipTrackBar.html(
            '<div class="'  + targetObj + '_bar bar_t"data-type="t" data-index="1"></div>'
            +'<div class="' + targetObj + '_bar bar_t"data-type="t" data-index="2"></div>'
            +'<div class="' + targetObj + '_bar bar_v"data-type="v" data-index="2"></div>'
            +'<div class="' + targetObj + '_bar bar_v"data-type="v" data-index="1"></div>'
            +'<div class="' + targetObj + '_bar bar_a"data-type="a" data-index="1"></div>'
            +'<div class="' + targetObj + '_bar bar_a"data-type="a" data-index="2"></div>'
        );

        config.$line=$('<div class="'+targetObj+'_line">');
        config.$clipTrackLeftRight.append(config.$clipTrackBar);
        config.$clipTrackLeftRight.append(config.$line);


        config.$clipTrackContainer.append(config.$clipTrackLeft);
        config.$clipTrackContainer.append(config.$clipTrackLeftRight);

        config.$scrollBar=$('<div class="'+targetObj+'_track">'
                +'<div class="'+targetObj+'_scroll"></div>'
            +'</div>');

        config.$body.append(config.$clipTrackContainer);
        config.$body.append(config.$scrollBar);



        /*---------添加滚动条---------*/
        config.$footer=$('<div class="' + targetObj + '_footer">');
        config.$sliderTrack=$('<div class="' + targetObj + '_slider_track">');        //滑动槽
        config.$sliderBar=$('<div class="' + targetObj + '_slider_scroll_total">');    //滑动条
        config.$sliderBarLeft=$('<div class="' + targetObj + '_slider_scroll_left">');
        config.$sliderBarMiddle=$('<div class="' + targetObj + '_slider_scroll_middle">');
        config.$sliderBarRight=$('<div class="' + targetObj + '_slider_scroll_right">');

        config.$sliderBarLeft.appendTo(config.$sliderBar);
        config.$sliderBarMiddle.appendTo(config.$sliderBar);
        config.$sliderBarRight.appendTo(config.$sliderBar);
        config.$sliderBar.appendTo(config.$sliderTrack);
        config.$footer.append(config.$sliderTrack);

        $("." + targetObj).append(config.$header);
        $("." + targetObj).append(config.$body);
        $("." + targetObj).append(config.$footer);

        initTargetObjectConfig();
        drawCanvas(0);  //初始化时间轴
        initScrollWidth();    //初始化滚动条宽度
    }
    /*初始化config配置*/
    function initTargetObjectConfig() {
        var config = self.config;
        var targetObj = self.targetObj;
        boxWidth=config.$headerRight.width();

        config.framePerPixel=config.maxTime/boxWidth;//初始化比率(1f/px)
        config.smallScaleFrame=getUnitInfo(config.framePerPixel).smallScaleFrame;//初始化一小格帧数
        config.smallScaleNumsPerLargeScale=getUnitInfo(config.framePerPixel).smallScaleNumsPerLargeScale;//初始化大格里面小格数
        config.smallScaleWidth=config.smallScaleFrame/config.framePerPixel;  //初始化一小格宽度
        config.largeScaleWidth=config.smallScaleWidth*config.smallScaleNumsPerLargeScale;//初始化一大格宽度
        config.largeScaleMillisecondInterval=config.smallScaleFrame*config.smallScaleNumsPerLargeScale*40;//初始化一大格代表的毫秒数
        config.max_fpp=Math.min(config.maxTime/boxWidth,25*60.0*60*10.0/80);
    }
    /*初始化精度函数*/
    function getUnitInfo(_m){
        var config = self.config;
        var arr=[];
        var obj={};
        for (var i = 0; i < unitTablePal.length; i++) {
            var dMinFPP=(unitTablePal[i].smallScaleFrame*unitTablePal[i].smallScaleNumsPerLargeScale)/80;
            if(_m<=dMinFPP){
                arr.push(i);
            }
        }
        obj.smallScaleFrame=unitTablePal[arr[0]].smallScaleFrame;
        obj.smallScaleNumsPerLargeScale=unitTablePal[arr[0]].smallScaleNumsPerLargeScale;
        return obj;
    }
    /*初始化滚动条宽度函数*/
    function initScrollWidth(){
        var config = self.config;
        var targetObj = self.targetObj;
        var inittotalScrollWidth;
        //初始化滚动条宽度和左右放大按钮的位置
        scrollLeftWidth=config.$sliderBarLeft.width();
        scrollRightWidth=config.$sliderBarRight.width();
        inittotalScrollWidth= (config.$headerRight.width() * config.$sliderTrack.width() / config.$rulerWrap.width());  //843

        //滚动条可滚动距离
        scrollBtnMovableDistance = parseInt(config.$sliderTrack.width() -inittotalScrollWidth);
        //刻度可滚动距离
        containerMovableDistance = parseInt(config.$rulerWrap.width() - config.$headerRight.width());

        if (inittotalScrollWidth>=config.$sliderTrack.width()) {
            inittotalScrollWidth =config.$sliderTrack.width();
        }
        config.$sliderBar.css('width',inittotalScrollWidth);
        config.$sliderBar.css('left',0);
        config.$sliderBarMiddle.css("width", inittotalScrollWidth-scrollLeftWidth-scrollRightWidth);
        config.$sliderBarMiddle.css("left", scrollLeftWidth);
        config.$sliderBarLeft.css('left',0);
        config.$sliderBarRight.css('left',inittotalScrollWidth-scrollRightWidth);
    }
    /*初始化画布函数*/
    function drawCanvas(scrollLeft) {
        var config = self.config;
        var targetObj = self.targetObj;
        scrollLeft = parseInt(scrollLeft);

        var rulerWidth = config.$headerRight.width();
        var rulerHeight = config.$headerRight.height();

        config.$ruler.attr("width", rulerWidth);
        config.$ruler.attr("height", rulerHeight);

        var ctx = config.$ruler[0].getContext("2d");
        ctx.clearRect(0, 0, rulerWidth, rulerHeight); //清除画布
        ctx.fillStyle = config.backgroundColor;
        ctx.fillRect(0, 0, rulerWidth, rulerHeight);  //画正方形

        var linePosition = rulerHeight;

        //设置画笔线性样式
        ctx.lineWidth = 1;
        ctx.strokeStyle = config.scaleColor;
        ctx.fillStyle = config.fontColor;
        ctx.font = config.fontSize + "px " + config.fontFamily;
        ctx.textAlign = "center";

        //添加画笔路径
        ctx.beginPath();

        //画时间轴下边线
       /* ctx.moveTo(0, linePosition);
        ctx.lineTo(rulerWidth, linePosition);*/

        var textPos = parseInt(scrollLeft / config.largeScaleWidth) * config.largeScaleMillisecondInterval;  //0

        var offsetNums = parseInt(scrollLeft / config.smallScaleWidth) + 1; //1

        var offsetLeft = offsetNums * config.smallScaleWidth - scrollLeft; //20

        var beginIndex = offsetNums % config.smallScaleNumsPerLargeScale;   //1

        var lastTopRulerPos = 0;

        var index = 0;

        while (lastTopRulerPos < rulerWidth) {

            lastTopRulerPos = index * config.smallScaleWidth + .3 + offsetLeft;   //10.5-20.5-30.5-40.5.......800.5


            if (beginIndex % config.smallScaleNumsPerLargeScale == 0) {
                //每隔100 画一大格
                ctx.moveTo(lastTopRulerPos, linePosition - 1);                       //(100.5,25)
                ctx.lineTo(lastTopRulerPos, linePosition - config.largeScaleHeight); //(100.5,12.5)

                textPos += config.largeScaleMillisecondInterval;   //1e4,2e4,3e4,.....
                var nTime = PLAYER.$millisecondsToTimeFrame(textPos);      //大格上时间文本

                ctx.fillText(nTime, lastTopRulerPos, linePosition - config.largeScaleHeight - 3);  //(text,x,27.5)
            } else {
                //每隔10距离画小格
                ctx.moveTo(lastTopRulerPos, linePosition - 1);                         //(10.5,25)
                ctx.lineTo(lastTopRulerPos, linePosition - config.smallScaleHeight);   //(10.5,18.5)

            }
            index++;
            beginIndex++;
        }
        ctx.stroke();
    }
    /*总的文档事件函数*/
    function handleDocumentEvent() {
        handleArrowEvent();     //刻度指针监听鼠标按下、点击、移动事件
        handleTrimEvent();      //刻度出入点事件
        handleScrollBtnEvent(); //滚动条事件
    }
    /*全屏事件函数*/
    function handleplayerResizeEvent(){
        var config = self.config;
        var targetObj=self.targetObj;
        config.$headerRight.width(config.$headerRight.parent().width()-151);
        self.updateEvent(self.config.maxTime,true);

        //随着窗口变化播放器宽高跟着变化
        var elem = document.getElementById("ocx");
		var oStyle = elem.currentStyle?elem.currentStyle:window.getComputedStyle(elem, null);
		var height = parseFloat(oStyle.height);
        var playerWidth=parseFloat((16*height/9));
        $('#ocx').width(playerWidth);
        $('#ocx').css('marginLeft',($('.player').width()-playerWidth)/2);

        $('#js_dragger_subtitle_wrap').width(playerWidth);
        $('#js_dragger_subtitle_wrap').css('marginLeft',($('.player').width()-playerWidth)/2);

    }
    /*关于移动游标事件函数开始*/
    function handleArrowEvent() {
        var config = self.config;
        config.$rulerWrap.addEventListener = function(type, callback) {
            if (type == "mousedown") {
                config.$rulerWrap.mousedown(function(e) {

                    e.stopPropagation();
                    fixArrowPosition(e.clientX, e.clientY, callback);
                    document.onmousemove = e_move;
                    document.onmouseup = undrag;
                    function e_move(e) {
                        fixArrowPosition(e.clientX, e.clientY,callback);
                    }
                    function undrag(e) {
                        this.onmousemove = null;
                        this.onmouseup = null;
                    }
                });
            } else if (type == "click") {

                e.stopPropagation();
                if ($(this) != config.$ruler) {
                    return;
                }
                fixArrowPosition(e.clientX, e.clientY, callback);
            } else if (type == "mousemove") {
                //设置刻度指针的拖动事件
                __drag(config.$cursor, callback);
            }
        };
    }
    function __drag(title, callback) {
        var x, y, _left, _top;
        title.mousedown(function(e) {
            e.stopPropagation();
            e = e || event;
            x = e.clientX;
            y = e.clientY;
            _left = title.offsetLeft;
            _top = title.offsetTop;
            this.ondragstart = function() {
                return false;
            };
            document.onmousemove = e_move;
            document.onmouseup = undrag;
        });
        function e_move(e) {
            e = e || event;
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            fixArrowPosition(e.clientX, e.clientY, callback);
        }
        function undrag(e) {
            this.onmousemove = null;
            this.onmouseup = null;
        }
    }
    function fixArrowPosition(mouseX, mouseY, callback) {
        PLAYER.checkPlaying();

        var config = self.config;
        var targetObj = self.targetObj;
        var w=boxWidth;
        //求出鼠标距离容器left值
        var cursorX = mouseX - config.$headerRight.offset().left;
        var ml=Math.abs(parseFloat(config.$rulerWrap.css("margin-left")));

        currPos = cursorX + ml;
        currPos = parseFloat(currPos*config.framePerPixel)/config.framePerPixel; //获得整数位帧数的位置

        if(currPos<=0){
            currPos=0;
        }
        if(currPos>=config.$rulerWrap.width()){
            currPos=config.$rulerWrap.width();
        }

        if(currPos-ml>w){
            newContainerMarginLeft = currPos - w;
            scrollBtnMovableDistance = parseFloat(config.$sliderTrack.width() -config.$sliderBar.width());//滚动条可滚动距离
            containerMovableDistance = parseFloat(config.$rulerWrap.width() - w); //刻度可滚动距离

            newTotalBtnScollLeft=newContainerMarginLeft*scrollBtnMovableDistance/containerMovableDistance;

            config.$sliderBar.css('left',newTotalBtnScollLeft);
            config.$rulerWrap.css("margin-left", -newContainerMarginLeft);
            config.$ruler.css("left", newContainerMarginLeft);
            drawCanvas(newContainerMarginLeft);
            //重新滚动条
            config.$sliderBar.css('left',newTotalBtnScollLeft);
            //重新计算刻度容器
            config.$rulerWrap.css("margin-left", -newContainerMarginLeft);
            config.$ruler.css("left", newContainerMarginLeft);

            config.$clipTrackBar.css("margin-left", -newContainerMarginLeft);
            //更新canvas画布
            drawCanvas(newContainerMarginLeft);
        }
        if(currPos<ml){
            newContainerMarginLeft = currPos;
            newTotalBtnScollLeft=newContainerMarginLeft*config.$sliderTrack.width()/config.$rulerWrap.width();

            config.$sliderBar.css('left',newTotalBtnScollLeft);
            config.$rulerWrap.css("margin-left", -newContainerMarginLeft);
            config.$ruler.css("left", newContainerMarginLeft);
            drawCanvas(newContainerMarginLeft);
            //重新滚动条
            config.$sliderBar.css('left',newTotalBtnScollLeft);
            //重新计算刻度容器
            config.$rulerWrap.css("margin-left", -newContainerMarginLeft);
            config.$ruler.css("left", newContainerMarginLeft);
            config.$clipTrackBar.css("margin-left", -newContainerMarginLeft);

            //更新canvas画布
            drawCanvas(newContainerMarginLeft);
        }

        config.$cursor.css("left", currPos);
        config.$line.css("left", currPos);

        var preSeekTime = self.currTime;
        self.currTime =  Math.round(currPos*config.framePerPixel);
        if (callback !== null && preSeekTime !==self.currTime) {
            callback(self.currTime);
        }
    }
    function seekToCursorFrame(time) {
        PLAYER.buffHas=false;
        PLAYER.checkPlaying();
        self.currTime=time;
        self.fixArrowCurrentTime(time);

        PLAYER.OCX.seek(time);   //必须seek在播放器轨道前，因为播放器最大时常不加15000帧

        if(time>=PLAYER.PTR.config.maxTime){
            time=PLAYER.PTR.config.maxTime;
        }
        PLAYER.PTR.currTime=time;
        PLAYER.PTR.fixArrowCurrentTime(time);

        var s=PLAYER.operateJson.checkCorsorhasClip(self.currTime);

        if(!s){
            var c1 = document.getElementById("js_voCanvas");
            var ctx = c1.getContext("2d");
            ctx.clearRect(0,0,100,500)
        }
    }
    function getVideoCurrFrame(time){
        PLAYER.checkPlaying();
        var config=self.config;
        config.seekComandTimesMonitor.push(time);
    }
    function getDragInfo(target,ev){
        var attr={};
        attr.clipInitTime=target.attr('data-time');

        attr.clipInitWidth=parseInt(target.outerWidth());
        attr.clipInitLeft=parseInt(target.position().left);
        attr.clipInitClientX=ev.x;


        attr.clipInitOffsetLeft=parseInt(target.parent().offset().left);

        attr.clipInitTop=parseInt(target.position().top);
        attr.clipInitClientY=ev.y;
        attr.clipInitOffsetTop=parseInt(target.parent().offset().top);
        attr.clipInitIndex=parseInt(target.parent().attr('data-index'));
        attr.clipInitType=target.parent().attr('data-type');

        attr.clipInitTrimIn=parseInt(target.attr('data-trimin'));
        attr.clipInitTrimOut=parseInt(target.attr('data-trimout'));
        attr.clipInitSequenceTrimIn=parseInt(target.attr('data-sequencetrimin'));
        attr.clipInitSequenceTrimOut=parseInt(target.attr('data-sequencetrimout'));
        attr.clipMaxFrame=parseInt(target.attr('data-duration'))||0;

        if(target.find('.effect_box_r').length>=1 && PLAYER.operateJson.checkNextSubClip(attr.clipInitSequenceTrimOut)){
            attr.nextClip=PLAYER.operateJson.checkNextSubClip(attr.clipInitSequenceTrimOut).attr('data-time');
        }
        if(target.find('.effect_box_l').length>=1 && PLAYER.operateJson.checkPrevSubClip(attr.clipInitSequenceTrimIn)){
            attr.prevClip=PLAYER.operateJson.checkPrevSubClip(attr.clipInitSequenceTrimIn).attr('data-time');
        }

        return JSON.stringify(attr);
    }
    function getClipDir(attr){
        var clipInitWidth=attr.clipInitWidth;
        var clipInitLeft=attr.clipInitLeft;
        var clipInitClientX=attr.clipInitClientX;
        var clipInitOffsetLeft=attr.clipInitOffsetLeft;
        var clipDir='';
        //判断拖拽位置
        if(clipInitClientX<=clipInitLeft+clipInitOffsetLeft+8){
            clipDir='left';
        }
        else if(clipInitClientX>=clipInitLeft+clipInitOffsetLeft+clipInitWidth-8){
            clipDir='right';
        }else{
            clipDir='middle';
        }
        return clipDir;
    }
    //开始拖拽clip
    function handleClipDragStartEvent(ev){
        var config=self.config;
        dragging=ev.target;
        PLAYER.checkPlaying();
        if($('.space').size()!==0){
           $('.space').remove();
        }
    }
    var help_index;
    //拖拽中clip
    function handleClipDragEvent(ev){
        var config=self.config;
        var target=$(ev.target);
        var parentWidth=config.$header.width();

        var id=target.attr('data-time');
        var cal_index;

        var helpElem=PLAYER.operateJson.getDraggingHelp(id); //联动助手

        helpElem.show();
        var initAttr=JSON.parse(PLAYER.operateJson.getDraggingAttr(id));

        clipInitWidth=initAttr.clipInitWidth;
        clipInitLeft=initAttr.clipInitLeft;
        clipInitClientX=initAttr.clipInitClientX;
        clipInitOffsetLeft=initAttr.clipInitOffsetLeft;

        clipInitTop=initAttr.clipInitTop;
        clipInitClientY=initAttr.clipInitClientY;
        clipInitOffsetTop=initAttr.clipInitOffsetTop;
        clipInitIndex=initAttr.clipInitIndex;
        clipInitType=initAttr.clipInitType;



        clipInitTrimIn=initAttr.clipInitTrimIn;
        clipInitTrimOut=initAttr.clipInitTrimOut;
        clipInitSequenceTrimIn=initAttr.clipInitSequenceTrimIn;
        clipInitSequenceTrimOut=initAttr.clipInitSequenceTrimOut;
        clipMaxFrame=initAttr.clipMaxFrame;

        //移动状态
        var clipDir=target.attr('data-clipdir');
        PLAYER.operateJson.mouseMoveState(helpElem,clipDir);


        if(clipDir==='middle'){
            var move=(ev.x-clipInitClientX);
            var moveFrame=Math.floor((ev.x-clipInitClientX)*config.framePerPixel);

            sequenceTrimIn=clipInitSequenceTrimIn+moveFrame;
            if(ev.min_in+moveFrame<=0){
                moveFrame=-ev.min_in;
                sequenceTrimIn=clipInitSequenceTrimIn-ev.min_in;
            }
            if(sequenceTrimIn<=0){
                sequenceTrimIn=0;
            }

            sequenceTrimOut=sequenceTrimIn+(helpElem.attr('data-trimout')-helpElem.attr('data-trimin'));
            nowLeft=sequenceTrimIn/config.framePerPixel;

            checkAdhereMiddle(helpElem,moveFrame);
            PLAYER.help_index=ev.cal_index;
            if(PLAYER.help_index && PLAYER.help_index>=1){
                addHelpObj(helpElem,clipInitType,PLAYER.help_index);
            }

            helpElem.attr('data-sequencetrimin',sequenceTrimIn);
            helpElem.attr('data-sequencetrimout',sequenceTrimOut);
            helpElem.css('left',nowLeft);

        }
        else if(clipDir==='left'){
            var nowWidth=clipInitWidth-(ev.x-clipInitClientX);
            var nowLeft=clipInitLeft+(ev.x-clipInitClientX);
            var _offset=(ev.x-clipInitClientX)*config.framePerPixel/config.framePerPixel;
            var moveFrame=Math.round(_offset*config.framePerPixel);//求得移动的帧数

            trimIn=clipInitTrimIn+moveFrame;
            sequenceTrimIn=clipInitSequenceTrimOut-clipInitTrimOut+trimIn;

            if(target.attr('data-type')!=='subtitle'&&target.attr('data-type')!=='video'){
                if(trimIn<=0){
                    trimIn=0;
                    sequenceTrimIn=clipInitSequenceTrimOut-clipInitTrimOut;
                    moveFrame= trimIn-clipInitTrimIn;
                    _offset= moveFrame/config.framePerPixel;
                    nowLeft=clipInitLeft+_offset;
                    nowWidth=clipInitWidth-_offset;
                }
            }
            if(trimIn>=clipInitTrimOut-1){
                trimIn=clipInitTrimOut-1;

                sequenceTrimIn=clipInitSequenceTrimOut-1;
                moveFrame= trimIn-clipInitTrimIn;
                _offset= moveFrame/config.framePerPixel;
                nowLeft=clipInitLeft+_offset;
                nowWidth=clipInitWidth-_offset;
            }
            if(nowLeft<=0){
                nowLeft=0;
                sequenceTrimIn=0;
                trimIn=clipInitTrimOut-clipInitSequenceTrimOut;
                nowWidth=clipInitWidth+clipInitLeft;
            }
            checkAdhereLeft(helpElem,moveFrame);

            helpElem.attr('data-trimin',trimIn);
            helpElem.attr('data-sequencetrimin',sequenceTrimIn);
            helpElem.css('width',nowWidth);
            helpElem.css('left',nowLeft);
        }
        else if(clipDir==='right'){
            var nowWidth=clipInitWidth+(ev.x-clipInitClientX);
            var _offset=(ev.x-clipInitClientX)*config.framePerPixel/config.framePerPixel;
            var moveFrame=Math.round(_offset*config.framePerPixel);//求得移动的帧数

            trimOut=clipInitTrimOut+moveFrame;
            sequenceTrimOut=clipInitSequenceTrimIn+trimOut-clipInitTrimIn;

            if(target.attr('data-type')!=='subtitle'&&target.attr('data-type')!=='video'){
                if(trimOut>=clipMaxFrame){
                    trimOut=clipMaxFrame;

                    sequenceTrimOut=clipInitSequenceTrimIn+trimOut-clipInitTrimIn;
                    moveFrame=trimOut-clipInitTrimOut;
                    _offset=moveFrame/config.framePerPixel;
                    nowWidth=clipInitWidth+_offset;
                }
            }
            if(trimOut<=clipInitTrimIn+1){
                trimOut=clipInitTrimIn+1;
                sequenceTrimOut=clipInitSequenceTrimIn+trimOut-clipInitTrimIn;
                moveFrame=trimOut-clipInitTrimOut;
                _offset=moveFrame/config.framePerPixel;
                nowWidth=clipInitWidth+_offset;
            }
            if(nowWidth+clipInitLeft>=config.$rulerWrap.width()){
                nowWidth=config.$rulerWrap.width()-clipInitLeft;
                _offset=nowWidth-clipInitWidth;
                moveFrame=Math.round(_offset*config.framePerPixel);
                trimOut=clipInitTrimOut+moveFrame;
                sequenceTrimOut=clipInitSequenceTrimIn+trimOut-clipInitTrimIn;
            }
            checkAdhereRight(helpElem,moveFrame);

            helpElem.attr('data-trimout',trimOut);
            helpElem.attr('data-sequencetrimout',sequenceTrimOut);
            helpElem.css('width',nowWidth);
        }

        function getOut(max_out){
            var _s;

            $.each(helpElem.siblings(),function(i,n){
                if(!$(n).hasClass('onselected') && !$(n).hasClass('changeHelp')){

                    var offset1=Math.abs(max_out-parseInt($(this).attr('data-sequencetrimin')))/PLAYER.TR.config.framePerPixel;
                    var offset2=Math.abs(max_out-parseInt($(this).attr('data-sequencetrimout')))/PLAYER.TR.config.framePerPixel;
                    if(Math.abs(offset1)<=10){
                        _s=parseInt($(this).attr('data-sequencetrimin'));
                    }
                    if(Math.abs(offset2)<=10){
                        _s=parseInt($(this).attr('data-sequencetrimout'));
                    }
                }
            });


            if(!_s){
                var intid=helpElem.attr('data-intid');
                var elem;
                $.each(helpElem.parent().siblings().children('.changeHelp'),function(i,n){
                    if($(n).attr('data-intid')===intid){
                       elem= $(n);

                        $.each(elem.siblings(),function(i,n){
                            if(!$(n).hasClass('onselected') && !$(n).hasClass('changeHelp')){

                                var offset1=Math.abs(max_out-parseInt($(this).attr('data-sequencetrimin')))/PLAYER.TR.config.framePerPixel;
                                var offset2=Math.abs(max_out-parseInt($(this).attr('data-sequencetrimout')))/PLAYER.TR.config.framePerPixel;
                                if(Math.abs(offset1)<=10){
                                    _s=parseInt($(this).attr('data-sequencetrimin'));
                                }
                                if(Math.abs(offset2)<=10){
                                    _s=parseInt($(this).attr('data-sequencetrimout'));
                                }
                            }
                        });
                    }
                });
            }

            return _s;
        }
        function getIn(min_in){
            var _s;
            $.each(helpElem.siblings(),function(i,n){
                if(!$(n).hasClass('onselected') && !$(n).hasClass('changeHelp')){

                    var offset1=Math.abs(min_in-parseInt($(this).attr('data-sequencetrimin')))/PLAYER.TR.config.framePerPixel;
                    var offset2=Math.abs(min_in-parseInt($(this).attr('data-sequencetrimout')))/PLAYER.TR.config.framePerPixel;
                    if(Math.abs(offset1)<=10){
                        _s=parseInt($(this).attr('data-sequencetrimin'));
                    }
                    if(Math.abs(offset2)<=10){
                        _s=parseInt($(this).attr('data-sequencetrimout'));
                    }
                }
            });

            if(!_s){
                var intid=helpElem.attr('data-intid');
                var elem;
                $.each(helpElem.parent().siblings().children('.changeHelp'),function(i,n){
                    if($(n).attr('data-intid')===intid){
                        elem= $(n);
                        $.each(elem.siblings(),function(i,n){
                            if(!$(n).hasClass('onselected') && !$(n).hasClass('changeHelp')){

                                var offset1=Math.abs(min_in-parseInt($(this).attr('data-sequencetrimin')))/PLAYER.TR.config.framePerPixel;
                                var offset2=Math.abs(min_in-parseInt($(this).attr('data-sequencetrimout')))/PLAYER.TR.config.framePerPixel;
                                if(Math.abs(offset1)<=10){
                                    _s=parseInt($(this).attr('data-sequencetrimin'));
                                }
                                if(Math.abs(offset2)<=10){
                                    _s=parseInt($(this).attr('data-sequencetrimout'));
                                }
                            }
                        });
                    }
                });
            }
            return _s;
        }
        function checkAdhereMiddle(helpElem,moveFrame){
            if(move>0){
                var max_sout=ev.max_out+moveFrame;
                var adhere_point=getOut(max_sout);   //获取所有切片的吸附点


                var offset=Math.abs(max_sout-adhere_point)/config.framePerPixel;

                if(Math.abs(offset)<=10){
                    //更具吸附点设置切片位置属性
                    max_sout=adhere_point;
                    sequenceTrimOut=clipInitSequenceTrimOut+max_sout-ev.max_out;

                    sequenceTrimIn=sequenceTrimOut-(helpElem.attr('data-trimout')-helpElem.attr('data-trimin'));
                    nowLeft=Math.round(sequenceTrimIn/config.framePerPixel);
                    //显示吸附线
                    PLAYER.operateJson.showAdhere(helpElem,'backward');


                }else{
                    //隐藏吸附线
                    PLAYER.operateJson.hideAdhere(helpElem);
                }
            }else{
                var min_sIn=ev.min_in+moveFrame;
                var adhere_point=getIn(min_sIn);   //获取所有切片的吸附点
                console.log('adhere_point',adhere_point)
                var offset=Math.abs(min_sIn-adhere_point)/config.framePerPixel;

                if(Math.abs(offset)<=10){
                    //更具吸附点设置切片位置属性
                    min_sIn=adhere_point;

                    sequenceTrimIn=clipInitSequenceTrimIn+min_sIn-ev.min_in;
                    sequenceTrimOut=sequenceTrimIn+(helpElem.attr('data-trimout')-helpElem.attr('data-trimin'));
                    nowLeft=Math.round(sequenceTrimIn/config.framePerPixel);
                    //显示吸附线
                    PLAYER.operateJson.showAdhere(helpElem,'forward');
                }else{
                    //隐藏吸附线
                    PLAYER.operateJson.hideAdhere(helpElem);
                }
            }
        }
        function checkAdhereLeft(helpElem,moveFrame){

            var min_sIn=ev.min_in+moveFrame;
            var adhere_point=getIn(min_sIn);   //获取所有切片的吸附点

            var offset=Math.abs(min_sIn-adhere_point)/config.framePerPixel;

            if(Math.abs(offset)<=10){
                //更具吸附点设置切片位置属性
                min_sIn=adhere_point;

                sequenceTrimIn=clipInitSequenceTrimIn+min_sIn-ev.min_in;
                trimIn=clipInitTrimIn+min_sIn-ev.min_in;
                nowLeft=Math.round(sequenceTrimIn/config.framePerPixel);
                nowWidth=(clipInitSequenceTrimOut-sequenceTrimIn)/config.framePerPixel;

                //显示吸附线
                PLAYER.operateJson.showAdhere(helpElem,'forward');
            }else{
                //隐藏吸附线
                PLAYER.operateJson.hideAdhere(helpElem);
            }

        }
        function checkAdhereRight(helpElem,moveFrame){
            var max_sout=ev.max_out+moveFrame;
            var adhere_point=getOut(max_sout);   //获取所有切片的吸附点
            var offset=(max_sout-adhere_point)/config.framePerPixel;

            if(Math.abs(offset)<=10){
                //更具吸附点设置切片位置属性
                max_sout=adhere_point;

                sequenceTrimOut=clipInitSequenceTrimOut+max_sout-ev.max_out;

                trimOut=clipInitTrimOut+(sequenceTrimOut-clipInitSequenceTrimOut);
                nowWidth=Math.round((sequenceTrimOut-clipInitSequenceTrimIn)/config.framePerPixel);
                //显示吸附线
                PLAYER.operateJson.showAdhere(helpElem,'backward');
            }else{
                //隐藏吸附线
                PLAYER.operateJson.hideAdhere(helpElem);
            }
        }

    }
    function addHelpObj(obj,clipInitType,cal_index){
        $.each($('.time_ruler_bar[data-type="'+clipInitType+'"]'),function(i,n){
            if(parseInt($(n).attr('data-index'))===cal_index){
                $(this).append(obj);
            }
        });
        return obj;
    }
    //拖拽结束clip
    function handleClipDragEndEvent(ev){

        var config=self.config;
        var target=ev.target;
        var id=target.attr('data-time');
        var initAttr=JSON.parse(PLAYER.operateJson.getDraggingAttr(id));
        var dir=target.attr('data-clipdir');
        var helpElem=PLAYER.operateJson.getDraggingHelp(id); //联动助手

        var sequenceTrimIn=parseInt(helpElem.attr('data-sequencetrimin'));
        var sequenceTrimOut=parseInt(helpElem.attr('data-sequencetrimout'));
        var trimIn=parseInt(helpElem.attr('data-trimin'));
        var trimOut=parseInt(helpElem.attr('data-trimout'));
        var left=helpElem.css('left');
        var width=helpElem.width();

        var subClipAttr={
            sequenceTrimIn:sequenceTrimIn,
            sequenceTrimOut:sequenceTrimOut,
            trimIn:trimIn,
            trimOut:trimOut
        };
        target.attr('data-sequencetrimin',sequenceTrimIn);
        target.attr('data-sequencetrimout',sequenceTrimOut);
        target.attr('data-trimin',trimIn);
        target.attr('data-trimout',trimOut);
        target.css('left',left);
        target.css('width',width);

        //判断对象是否有中间淡入淡出特技
        if(dir!=='left'&&initAttr.nextClip){

            var _type=target.find('.effect_box_r').attr('data-type');
            var _pos=target.find('.effect_box_r').attr('data-pos');
            PLAYER.operateJson.removeOtherEffectClip(id,_type,_pos);
            $('.edit_box_v').each(function(i,n){
                if($(n).attr('data-time')===initAttr.nextClip){

                    var _type=$(n).find('.effect_box_l').attr('data-type');
                    var _pos=$(n).find('.effect_box_l').attr('data-pos');
                    PLAYER.operateJson.removeOtherEffectClip(initAttr.nextClip,_type,_pos);

                    $(n).find('.effect_box_l').remove();
                }
            });
            target.find('.effect_box_r').remove();

        }else if(dir!=='right'&&initAttr.prevClip){
            var _type=target.find('.effect_box_l').attr('data-type');
            var _pos=target.find('.effect_box_l').attr('data-pos');
            PLAYER.operateJson.removeOtherEffectClip(id,_type,_pos);

            $('.edit_box_v').each(function(i,n){
                if($(n).attr('data-time')===initAttr.prevClip){
                    var _type=$(n).find('.effect_box_r').attr('data-type');
                    var _pos=$(n).find('.effect_box_r').attr('data-pos');
                    PLAYER.operateJson.removeOtherEffectClip(initAttr.prevClip,_type,_pos);
                    $(n).find('.effect_box_r').remove();
                }
            });
            target.find('.effect_box_l').remove();
        }

        var clipInitType=helpElem.parent().attr('data-type');
        var cal_index=parseInt(helpElem.parent().attr('data-index'));
        addHelpObj(target,clipInitType,cal_index);

        var arr=[];
        $.each(helpElem.siblings(),function(i,n){
            if(!$(n).hasClass('onselected') && !$(n).hasClass('changeHelp')){
                arr.push($(n));
            }
        });
        if(arr.length>=1){
            PLAYER.operateJson.checkCoverEvent(helpElem,helpElem.attr('data-intid'));
        }
        //更新json
        var _index=parseInt(helpElem.parent().attr('data-index'));
        var _type=helpElem.parent().attr('data-type');


        PLAYER.operateJson.updateClipAttr(subClipAttr,id);
        PLAYER.operateJson.changeIndexClipAttr(_type,_index,id);
        //移除助手
        PLAYER.operateJson.removeDraggingInfo(id);
        helpElem.remove();
    }
    function handleClipClickEvent(ev){
        var config=self.config;
        var v_target=ev.target;
        var id=v_target.attr('data-time');
        var helpElem=PLAYER.operateJson.getDraggingHelp(id); //联动助手
        PLAYER.operateJson.removeDraggingInfo(id);
        helpElem.remove();
        //click事件
        if(PLAYER.keyNum===85){//按下u后

            PLAYER.checkPlaying();
            v_target.removeClass('onselected');
            v_target.css('cursor','url(images/cur/cut.cur),default');
            cutSubclip(v_target,ev);
        }
        function cutSubclip(v_target,ev){

            //原素材
            var v0_sequenceTrimIn=0;
            var v0_sequenceTrimOut=0;
            var v0_trimIn=0;
            var v0_trimOut=0;
            //切后添加素材
            var vcut_sequenceTrimIn=0;
            var vcut_sequenceTrimOut=0;
            var vcut_trimIn=0;
            var vcut_trimOut=0;
            //原素材属性
            var v_dataId=v_target.attr('data-id');

            var v_dataTime=v_target.attr('data-time');
            var v_interleaved=v_target.attr('data-interleaved');
            var v_index=parseInt(v_target.parent('.time_ruler_bar').attr('data-index'));
            var v_type=v_target.attr('data-type');
            var subclipId=v_type+'_'+PLAYER.genNonDuplicateID(12);
            var v_offsetLeft=parseInt(v_target.offset().left);
            var v_width=parseInt(v_target.width());
            //切后素材属性
            var add_subclip;
            var add_subclip_attr;

            if(ev.x<=v_offsetLeft){
                return false;
            }
            if(ev.x>=v_offsetLeft+v_width){
                return false;
            }
            //计算原素材属性
            var _w = parseInt((ev.x-v_offsetLeft)*config.framePerPixel)/config.framePerPixel;

            v0_trimIn=parseInt(v_target.attr('data-trimin'));
            v0_trimOut=parseInt(v0_trimIn+Math.round(_w*config.framePerPixel));
            v0_sequenceTrimIn=parseInt(v_target.attr('data-sequencetrimin'));
            v0_sequenceTrimOut=parseInt(v0_sequenceTrimIn+Math.round(_w*config.framePerPixel));

            //切后节点属性
            vcut_trimIn=v0_trimOut;
            vcut_trimOut=parseInt(v_target.attr('data-trimout'));
            vcut_sequenceTrimIn=v0_sequenceTrimOut;
            vcut_sequenceTrimOut=parseInt(v_target.attr('data-sequencetrimout'));

            //切片后新加切片
            add_subclip=v_target.clone();
            //除了马赛克其他特技不存在
            if(add_subclip.find('.effect_box_l')){
                add_subclip.find('.effect_box_l').remove();
            }
            if(add_subclip.find('.effect_box_r')){
                v_target.find('.effect_box_r').remove();
            }

            add_subclip.removeClass('onselected');
            add_subclip.attr('data-trimin',vcut_trimIn);
            add_subclip.attr('data-trimout',vcut_trimOut);
            add_subclip.attr('data-sequencetrimin',vcut_sequenceTrimIn);
            add_subclip.attr('data-sequencetrimout',vcut_sequenceTrimOut);
            add_subclip.attr('data-time',subclipId);
            add_subclip.attr('data-intid',ev.intId);

            var _left=ev.x-v_target.parent().offset().left;
            var _width=v_target.outerWidth()-(ev.x-v_offsetLeft);
            add_subclip.css('left',_left);
            add_subclip.css('width',_width);
            v_target.parent('.time_ruler_bar').append(add_subclip);


            if(v_target.parent('.time_ruler_bar').hasClass('bar_v')){
                var e_attr=PLAYER.operateJson.getCutNewEffectClip(v_dataTime,vcut_trimIn,vcut_trimOut);
                add_subclip_attr={
                    "assetid": v_dataId,
                    "trimIn": vcut_trimIn,
                    "trimOut":vcut_trimOut,
                    "sequenceTrimIn": vcut_sequenceTrimIn,
                    "sequenceTrimOut":vcut_sequenceTrimOut,
                    "effect":e_attr,
                    "subclipId":subclipId,
                    "type":v_type,
                    "interleaved_id":ev.intId
                }
                if(v_interleaved==='true'){
                    add_subclip_attr.interleaved=true;
                }else{
                    add_subclip_attr.interleaved=false;
                }

                PLAYER.operateJson.addVideoClipAttr(add_subclip_attr,v_index);

            }else if(v_target.parent('.time_ruler_bar').hasClass('bar_a')){
                add_subclip_attr={
                    "assetid": v_dataId,
                    "trimIn": vcut_trimIn,
                    "trimOut":vcut_trimOut,
                    "sequenceTrimIn": vcut_sequenceTrimIn,
                    "sequenceTrimOut":vcut_sequenceTrimOut,
                    "volume":100,
                    "subclipId":subclipId,
                    "type":v_type,
                    "interleaved_id":ev.intId
                }
                if(v_interleaved==='true'){
                    add_subclip_attr.interleaved=true;
                }else{
                    add_subclip_attr.interleaved=false;
                }

                PLAYER.operateJson.addAudioClipAttr(add_subclip_attr,v_index);

            }else if(v_target.parent('.time_ruler_bar').hasClass('bar_t')){
                var msg= JSON.parse(PLAYER.operateJson.getSubtitleClip(v_dataTime,v_index));
                var subClipAttr_cut={
                    "trimIn": vcut_trimIn,
                    "trimOut":vcut_trimOut,
                    "sequenceTrimIn":vcut_sequenceTrimIn,
                    "sequenceTrimOut":vcut_sequenceTrimOut,
                    "subclipId":subclipId,
                    "type":v_type,
                    "interleaved_id":ev.intId
                }

                $.extend(msg,subClipAttr_cut);
                PLAYER.operateJson.addSubtitleClipAttr(msg,v_index);
            }

            v_target.attr('data-trimout',v0_trimOut);
            v_target.attr('data-sequencetrimout',v0_sequenceTrimOut);
            v_target.width(ev.x-v_offsetLeft);

            //更新原素材属性
            var v0_subClipAttr={
                trimIn: v0_trimIn,
                trimOut:v0_trimOut,
                sequenceTrimIn:v0_sequenceTrimIn,
                sequenceTrimOut:v0_sequenceTrimOut
            }
            var e_attr2=PLAYER.operateJson.getCutOldEffectClip(v_dataTime,v0_trimIn,v0_trimOut);

            PLAYER.operateJson.updateClipAttr(v0_subClipAttr,v_dataTime,e_attr2);
        }
        //console.log($('.onselected').hasClass('.edit_box_a '))
    }
    /*关于clip移入函数开始*/
    function handleClipCheckDirEvent(ev){
        var target=ev.target;
        var _l=parseInt(target.position().left);
        var _w=parseInt(target.outerWidth());
        var _s=target.parent('.time_ruler_bar').offset().left;

        var _x=ev.x;
        var off=_x-_s-_l;

        if(PLAYER.keyNum===85){
            target.css({cursor:"url(images/cur/cut.cur),default"});
        }
        else if(PLAYER.keyNum===71){
            target.css({cursor:"url(images/cur/select_back.cur),default"});
        }
        else if(PLAYER.keyNum===7100){
            target.css({cursor:"url(images/cur/select_pre.cur),default"});
        }
        else if(PLAYER.keyNum===187){
            target.css({cursor:"url(images/cur/zoom_plus.cur),default"});
        }
        else if(PLAYER.keyNum===189){
            target.css({cursor:"url(images/cur/zoom_minus.cur),default"});
        }
        else{

            if(Math.abs(_s+_l-_x)<=8){
                target.css({cursor:"url(images/cur/cursor1.cur),default"});
            }
            else if(Math.abs(_s+_l+_w-_x)<=8){
                target.css({cursor:"url(images/cur/cursor2.cur),default"});
            }else{
                target.css({cursor:"default"});
            }
        }

    }
    /*关于点击删除空隙事件开始*/
    function handleSequenceClickEvent(ev){

        var config=self.config;
        var targetObj = self.targetObj;
        var s=ev.target.children().length;

        if(s!==0){

            if($('.space').size()!==0){
               $('.space').remove(); //点击生成空隙前先删除所有的空隙
            }
            var _l=ev.x-ev.target.parent().offset().left;

            var offset_px = parseInt(_l*config.framePerPixel)/config.framePerPixel;
            var currFrame = Math.round(offset_px*config.framePerPixel);

            var arr_sequenceTrimOut=[];
            var arr_sequenceTrimIn=[];
            var arr_init_sequenceTrimOut=[];
            var arr_init_sequenceTrimIn=[];

            var min_in;
            var max_out;

            var space=$('<div class="space"></div>');
            $.each(ev.target.children('.edit_box'),function(i,n){
                if(parseInt($(n).attr('data-sequencetrimin'))>currFrame){
                    arr_sequenceTrimIn.push(parseInt($(n).attr('data-sequencetrimin')));
                }

                if($(n).attr('data-sequencetrimout')<currFrame){
                    arr_sequenceTrimOut.push(parseInt($(n).attr('data-sequencetrimout')));
                }
            });
            if(arr_sequenceTrimIn.length===0){
                return false;
            }
            if(arr_sequenceTrimOut.length===0){
                arr_sequenceTrimOut.push(0);
            }
            min_in=Math.min.apply(null,arr_sequenceTrimIn);
            max_out=Math.max.apply(null,arr_sequenceTrimOut);

            var right_dom=ev.target.children('.edit_box[data-sequencetrimin="'+min_in+'"]');
            var left_dom=ev.target.children('.edit_box[data-sequencetrimout="'+max_out+'"]');

            space.attr('data-sequencetrimin',max_out);
            space.attr('data-sequencetrimout',min_in);
            space.css('left',max_out/config.framePerPixel);
            space.css('width',(min_in-max_out)/config.framePerPixel);
            space.insertBefore(right_dom);


            if(right_dom.attr('data-interleaved')==="true"){

                var dragging=PLAYER.operateJson.chooseInterleavedElem(right_dom)

                arr_init_sequenceTrimIn.push(parseInt(dragging.attr('data-sequencetrimin')));
                if(parseInt(dragging.siblings().attr('data-sequencetrimout'))<=parseInt(dragging.attr('data-sequencetrimin'))){
                    arr_init_sequenceTrimOut.push(parseInt(dragging.siblings().attr('data-sequencetrimout')));
                }
            }
            var vcut_init_sequenceTrimIn;
            var vcut_init_sequenceTrimOut;
            if(arr_init_sequenceTrimOut.length===0){
                vcut_init_sequenceTrimIn=0;
            }else{
                vcut_init_sequenceTrimIn=Math.max.apply(null,arr_init_sequenceTrimOut);
            }

            if(arr_init_sequenceTrimIn.length===0){
                return false;
            }else{
                vcut_init_sequenceTrimOut=Math.min.apply(null,arr_init_sequenceTrimIn);
            }
            var vint_width=vcut_init_sequenceTrimOut-vcut_init_sequenceTrimIn;
            var vo_width=min_in-max_out;

            if(vo_width>=vint_width){
                space.attr('data-offset',vint_width);
            }
        }
    }
    function handleEffectClickEvent(ev){
        var config=self.config;
        var targetObj = self.targetObj;
        var target=ev.target;
        target.toggleClass('onEffect');

        if(target.attr('data-pos')==='footer-middle'){
            var sout=parseInt(target.parent().attr('data-sequencetrimout'));
            var nextClip=PLAYER.operateJson.checkNextSubClip(sout);
            nextClip.children('.effect_box_l').toggleClass('onEffect');
        }
        if(target.attr('data-pos')==='header-middle'){
            var sin=parseInt(target.parent().attr('data-sequencetrimin'));
            var nextClip=PLAYER.operateJson.checkPrevSubClip(sin);
            nextClip.children('.effect_box_r').toggleClass('onEffect');
        }
    }
    /*关于双击字幕事件开始*/
    function handleClipDblclickEvent(ev){
        PLAYER.TR.DragDrop.disable();
        PLAYER.PTR.DragDrop.disable();
        PLAYER.documentEvent.enable();

        var config=self.config;
        var targetObj = self.targetObj;
        var target=ev.target;
        var time=target.attr('data-time');
        var sIn=parseInt(target.attr('data-sequencetrimin'));
        var index=parseInt(target.parent().attr('data-index'));
        var type=target.parent().attr('data-type');
        var subtitleAttr=JSON.parse(PLAYER.operateJson.getSubtitleClip(time,index));
        var playerFrame=subtitleAttr.frame;
        var objectText=subtitleAttr.object.filter(item=>item.type==='text');
        PLAYER.showSubititleEdit();

        //添加参数编辑去
        _addSubtitleDom(subtitleAttr);
        //添加字幕颜色插件
        objectText.forEach(function(item,i){
            let targetId=item.objectId;
            let elm= $(".subtitle_color[data-id="+targetId+"]");
            let initColor=item.attr.fillStyle;
            _addSubtitleColor(elm,targetId,initColor,subtitleAttr,time,index,type,'subtitle');
        });
        //添加字幕编辑框
        _addSubtitleFrame(playerFrame);
         //操作字幕拖拽框
        _operateSubtitleFrame(playerFrame,time,index,type,'subtitle');
        //操作字幕编辑区
        _operateSubtitleDom(subtitleAttr,time,index,type,'subtitle');
    }
    /*字幕左侧编辑框*/
    function _addSubtitleDom(subtitleAttr){
        $('.conetent_tabs1 .subtitle_h_form').empty();
        $('.conetent_tabs2 .subtitle_h_form').empty();
        var id=subtitleAttr.id;
        var objectText=subtitleAttr.object.filter(data=>data.type==='text');
        $.each(objectText,function(i,n){
            var line1=$('<div class="form-group">'
                    +'<label class="col-md-2 control-label" for="fonttext" >内容</label>'
                    +'<div class="col-md-3">'
                        +'<input type="text" class="form-control subtitle_text" placeholder="你的字体" data-id="'+n.objectId+'" value="'+n.attr.text+'">'
                    +'</div>'
                    +'<label class="col-md-2 control-label" for="fontsize">字号</label>'
                    +'<div class="col-md-3">'
                        +'<input type="number" class="form-control subtitle_size"  data-id="'+n.objectId+'"  value="'+n.attr.fontSize+'">'
                    +'</div>'
                +'</div>');

            var line2=$('<div class="form-group">'
                    +'<label class="col-md-2 control-label" for="fontcolor">颜色</label>'
                    +'<div class="col-md-3">'
                        +'<input type="text" class="form-control subtitle_color"  data-id="'+n.objectId+'">'
                    +'</div>'
                    +'<label class="col-md-2 control-label" for="fontcolor">样式</label>'
                    +'<div class="col-md-3">'
                        +'<select name="" data-id="'+n.objectId+'" class="form-control subtitle_family" value="'+n.attr.fontFamily+'">'
                            +'<option value="微软雅黑">微软雅黑</option>'
                            +'<option value="宋体">宋体</option>'
                            +'<option value="黑体">黑体</option>'
                            +'<option value="楷体">楷体</option>'
                        +'</select>'
                    +'</div>'
                +'</div>');

            $('.conetent_tabs1 .subtitle_h_form').append(line1);
            $('.conetent_tabs1 .subtitle_h_form').append(line2);
        });
    }
    function _addSubtitleColor(elm,targetId,initColor,subtitleAttr,time,index,type,effectType){
        old_object=subtitleAttr.object;
        let jsonObj={
            trackType:type,
            trackIndex:index,
            subClipId:time,
            name:effectType,
            params:{object:old_object}
        };
        function updateBorders(color) {
            var hexColor = "transparent";
            if(color) {
                hexColor = color.toHexString();
                let new_object= PLAYER.operateJson.updateSubtitleObject(old_object,targetId,{fillStyle:hexColor});
                jsonObj.params.object=new_object;
                updateSubtitleJson(jsonObj);
            }
            $("#docs-content").css("border-color", hexColor);
        }
        elm.spectrum({
            allowEmpty:true,
            color: initColor,
            showInput: true,
            containerClassName: "full-spectrum",
            showInitial: true,
            showPalette: true,
            showSelectionPalette: true,
            maxPaletteSize: 10,
            preferredFormat: "hex",
            localStorageKey: "spectrum.demo",
            move: function (color) {
                //updateBorders(color);
            },
            hide: function (color) {
                updateBorders(color);
            },
            palette: [
                ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", /*"rgb(153, 153, 153)","rgb(183, 183, 183)",*/
                "rgb(204, 204, 204)", "rgb(217, 217, 217)", /*"rgb(239, 239, 239)", "rgb(243, 243, 243)",*/ "rgb(255, 255, 255)"],
                ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
                "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
                ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
                "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",
                "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
                "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",
                "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
                "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
                "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
                "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
                /*"rgb(133, 32, 12)", "rgb(153, 0, 0)", "rgb(180, 95, 6)", "rgb(191, 144, 0)", "rgb(56, 118, 29)",
                "rgb(19, 79, 92)", "rgb(17, 85, 204)", "rgb(11, 83, 148)", "rgb(53, 28, 117)", "rgb(116, 27, 71)",*/
                "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
                "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
            ]
        });
    }
    function _addSubtitleFrame(playerFrame){
        if($('.player').find('#js_dragger_subtitle_wrap').size()>0){
            $('.player').find('#js_dragger_subtitle_wrap').remove();
        }
        var elem=$(`<div id="js_dragger_subtitle_wrap">
            <div id="js_dragger_subtitle">
                <span class="coverLT" data-type="LT"></span>
                <span class="coverRT" data-type="RT"></span>
                <span class="coverLB" data-type="LB"></span>
                <span class="coverRB" data-type="RB"></span>
            </div>
        </div>`);
        elem.insertAfter($('#ocx'));

        let _w=$('#ocx').width();
        elem.width(_w);
        elem.css('margin-left',($('.player').width()-_w)/2);
        elem.find('#js_dragger_subtitle').width(playerFrame.width);
        elem.find('#js_dragger_subtitle').height(playerFrame.height);
        elem.find('#js_dragger_subtitle').css('left',playerFrame.x);
        elem.find('#js_dragger_subtitle').css('top',playerFrame.y);
    }
    function _operateSubtitleFrame(playerFrame,time,index,type,effectType){
        let s_playerFrame=JSON.stringify(playerFrame);
        let targetObj;
        let initLeft=0;
        let initTop=0;
        let initWidth=0;
        let initHeight=0;
        let initClientX=0;
        let initClientY=0;
        let offsetLeft=0;
        let offsetTop=0;

        let nowLeft=0;
        let nowTop=0;
        let nowWidth=0;
        let nowHeight=0;

        let jsonObj={
            trackType:type,
            trackIndex:index,
            subClipId:time,
            name:effectType,
            params:{frame:JSON.parse(s_playerFrame)}
        };

        $('#js_dragger_subtitle')[0].onmousedown=function(e){
            targetObj=$(e.target).attr('data-type');
            initClientX=e.clientX;
            initClientY=e.clientY;
            initLeft=parseFloat($(this).position().left);
            initTop=parseFloat($(this).position().top);
            initWidth=parseFloat($(this).outerWidth());
            initHeight=parseFloat($(this).outerHeight());
            document.onmousemove=function(e){
                e.preventDefault();
                offsetLeft=e.clientX-initClientX;
                offsetTop=e.clientY-initClientY;
                if(targetObj==='LT'){

                    nowTop=initTop+offsetTop;

                    nowHeight=initHeight-offsetTop;
                    nowWidth=16/9*nowHeight;

                    offsetLeft=initWidth-nowWidth;
                    nowLeft=initLeft+offsetLeft;

                }
                else if(targetObj==='LB'){
                    nowTop=initTop;
                    nowLeft=initLeft+offsetLeft;
                    nowWidth=initWidth-offsetLeft;
                    //nowHeight=initHeight+offsetTop;
                    nowHeight=9/16*nowWidth;

                }
                else if(targetObj==='RT'){
                    nowLeft=initLeft;
                    nowTop=initTop+offsetTop;
                    //nowWidth=initWidth+offsetLeft;
                    nowHeight=initHeight-offsetTop;
                    //nowHeight=9/16*nowWidth;
                    nowWidth=16/9*nowHeight;
                }
                else if(targetObj==='RB'){
                    nowTop=initTop;
                    nowLeft=initLeft;
                    nowWidth=initWidth+offsetLeft;
                    //nowHeight=initHeight+offsetTop;
                    nowHeight=9/16*nowWidth;
                }else{
                    nowLeft=initLeft+offsetLeft;
                    nowTop=initTop+offsetTop;
                    nowWidth=initWidth;
                    nowHeight=initHeight;
                }
                $('#js_dragger_subtitle').css('left',nowLeft);
                $('#js_dragger_subtitle').css('top',nowTop);
                $('#js_dragger_subtitle').css('width',nowWidth)
                $('#js_dragger_subtitle').css('height',nowHeight);

                $.extend(jsonObj.params.frame,{
                    x:nowLeft,
                    y:nowTop,
                    width:nowWidth,
                    height:nowHeight
                });
                updateSubtitleJson(jsonObj);
            };
            document.onmouseup=function(){
                document.onmousemove=null;
                document.onmouseup=null;
            }
        }

    }
    function _operateSubtitleDom(subtitleAttr,time,index,type,effectType){
        let old_object=subtitleAttr.object;
        let jsonObj={
            trackType:type,
            trackIndex:index,
            subClipId:time,
            name:effectType,
            params:{object:old_object}
        };
        $('.subtitle_text').on('change',function(e){
            let targetId=$(e.target).attr('data-id');
            let targetValue=$(e.target).val();
            let new_object= PLAYER.operateJson.updateSubtitleObject(old_object,targetId,{text:targetValue});
            jsonObj.params.object=new_object;
            updateSubtitleJson(jsonObj);
        });
        $('.subtitle_size').on('change',function(e){
            let targetId=$(e.target).attr('data-id');
            let targetValue=$(e.target).val();
            let new_object= PLAYER.operateJson.updateSubtitleObject(old_object,targetId,{fontSize:parseInt(targetValue)});
            jsonObj.params.object=new_object;
            updateSubtitleJson(jsonObj);
        });
        $('.subtitle_family').on('change',function(e){
            let targetId=$(e.target).attr('data-id');
            let targetValue=$(e.target).val();
            let new_object= PLAYER.operateJson.updateSubtitleObject(old_object,targetId,{fontFamily:targetValue});
            jsonObj.params.object=new_object;
            updateSubtitleJson(jsonObj);
        });
    }
    function updateSubtitleJson(jsonObj){
        PLAYER.OCX.adjustEffect(jsonObj);
        PLAYER.OCX.seek(parseInt(PLAYER.TR.currTime));
        console.log('更新字幕canshu',jsonObj)
        PLAYER.operateJson.updateSubtitleClip(jsonObj);
        console.log('更新字幕json',PLAYER.jsonObj.rootBin.sequence[0].tracks[0]);
    }
    /*键盘+-快捷键*/
    function privateKeyDownEvent(e){
        var config=self.config;
        var targetObj=self.targetObj;
        var old_scrollWidth=config.$sliderBar.width();          //按下时记住滚动条的宽和left
        var old_scrollLeft=config.$sliderBar.position().left;
        var old_marginLeft=Math.abs(parseFloat(config.$rulerWrap.css('marginLeft')));
        var old_fpp=config.framePerPixel;
        var key=e.code;

        var arr=[];             //存储选中对象left值
        var minLeft=0;          //获取选中对象最小的left值
        var offset=0;           //获取选中对象移动的距离
        var newLeft=0;          //选中对象新的left
        var sequenceTrimIn=0;   //选中对象sequenceTrimIn
        var sequenceTrimOut=0;  //选中对象sequenceTrimOut
        var time=0;             //每个切片的创建时间
        var subClipAttr=null;   //更新切片json
        var prevClipSequenceTrimOut=0;


        if(key===189){//--
            //PLAYER.keyNum=189;
            if(old_scrollWidth===config.$headerRight.width()){
                return;
            }
            changeFramePerPixel(10,old_fpp,old_scrollWidth,old_scrollLeft,old_marginLeft);
        }
        else if(key===187){//++
            //PLAYER.keyNum=187;
            if(old_scrollWidth===(2*scrollRightWidth+8)){
                return;
            }
            changeFramePerPixel(-10,old_fpp,old_scrollWidth,old_scrollLeft,old_marginLeft);
        }
        else if(key===46||key===8){//delete/backspace
            key=0;
            e.returnValue=false;
            PLAYER.checkPlaying();

            if(!e.target.hasClass('form-control')){
                if($('#js_time_ruler_bar_box .onselected').length>0){
                    $.each($('.onselected'),function(i,n){

                        var time=$(n).attr('data-time');
                        var sequenceTrimIn=parseInt($(n).attr('data-sequencetrimin'));
                        var sequenceTrimOut=parseInt($(n).attr('data-sequencetrimout'));

                        //判断对象是否有中间淡入淡出特技
                        if($(n).find('.effect_box_r').length>=1 && PLAYER.operateJson.checkNextSubClip(sequenceTrimOut)){
                            var nextClip=PLAYER.operateJson.checkNextSubClip(sequenceTrimOut).attr('data-time');

                            var _type=$('.edit_box_v[data-time="'+nextClip+'"]').find('.effect_box_l').attr('data-type');
                            var _pos=$('.edit_box_v[data-time="'+nextClip+'"]').find('.effect_box_l').attr('data-pos');
                            PLAYER.operateJson.removeOtherEffectClip(nextClip,_type,_pos);
                            $('.edit_box_v[data-time="'+nextClip+'"]').find('.effect_box_l').remove();

                        }
                        if($(n).find('.effect_box_l').length>=1 && PLAYER.operateJson.checkPrevSubClip(sequenceTrimIn)){
                            var prevClip=PLAYER.operateJson.checkPrevSubClip(sequenceTrimIn).attr('data-time');

                            var _type=$('.edit_box_v[data-time="'+prevClip+'"]').find('.effect_box_r').attr('data-type');
                            var _pos=$('.edit_box_v[data-time="'+prevClip+'"]').find('.effect_box_r').attr('data-pos');
                            PLAYER.operateJson.removeOtherEffectClip(prevClip,_type,_pos);
                            $('.edit_box_v[data-time="'+prevClip+'"]').find('.effect_box_r').remove();
                        }


                        PLAYER.operateJson.deleteClipAttr(time);
                        $(n).remove();

                    });

                    PLAYER.operateJson.pushCancelArray(PLAYER.jsonObj.rootBin.sequence[0]);

                    PLAYER.OCX.updateProjectJson(PLAYER.jsonObj);
                    PLAYER.OCX.seek(parseInt(self.currTime));


                    PLAYER.PTR.config.maxTime=(PLAYER.operateJson.getLastFrame()||1000);
                    $('#js_player_totalTime').html(PLAYER.getDurationToString(PLAYER.operateJson.getLastFrame()||0));
                    PLAYER.PTR.updateEvent(PLAYER.PTR.config);
                }
                if($('#js_time_ruler_bar_box .space').length>0){
                    var config = self.config;
                    var targetObj = self.targetObj;
                    var s_target=$('.space').siblings('.draggable');
                    var currFrame=parseInt($('.space').attr('data-sequencetrimin')); //空隙left
                    var spaceFrame;//移动的帧数
                    //原素材
                    var v0_sequencetrimin=0;
                    var v0_sequencetrimout=0;
                    //移动后素材
                    var vcut_sequenceTrimIn=0;
                    var vcut_sequenceTrimOut=0;

                    if($('.space').attr('data-offset')){
                        spaceFrame=parseInt($('.space').attr('data-offset'));
                    }else {
                        spaceFrame=parseInt($('.space').attr('data-sequencetrimout'))-parseInt($('.space').attr('data-sequencetrimin'));
                    }

                    $.each(s_target,function(i,n){
                        if($(n).attr('data-sequencetrimin')>=currFrame){
                            move($(n));
                            if($(n).attr('data-interleaved')==="true"){
                                var dragging=PLAYER.operateJson.chooseInterleavedElem($(n))

                                move(dragging);

                            }
                        }
                    });
                    function move(target){
                        var v_dataTime=target.attr('data-time');
                        //元数据
                        v0_sequencetrimin=parseInt(target.attr('data-sequencetrimin'));
                        v0_sequencetrimout=parseInt(target.attr('data-sequencetrimout'));

                        console.log('spaceFrame',spaceFrame)
                        console.log('v0_sequencetrimin',v0_sequencetrimin)
                        //移动后数据
                        vcut_sequenceTrimIn=v0_sequencetrimin-spaceFrame;
                        vcut_sequenceTrimOut=v0_sequencetrimout-spaceFrame;

                        target.attr('data-sequencetrimin',vcut_sequenceTrimIn);
                        target.attr('data-sequencetrimout',vcut_sequenceTrimOut);
                        target.css('left',vcut_sequenceTrimIn/config.framePerPixel);
                        subClipAttr={
                            "sequenceTrimIn":vcut_sequenceTrimIn,
                            "sequenceTrimOut":vcut_sequenceTrimOut
                        }
                        PLAYER.operateJson.updateClipAttr(subClipAttr,v_dataTime);
                    }

                    $('.space').remove();
                    PLAYER.operateJson.sendJson();
                }
                if($('#js_time_ruler_bar_box .onEffect').length>0){
                    $.each($('.onEffect'),function(i,n){
                        var time=$(n).parent('.edit_box_v').attr('data-time');
                        var _type=$(n).attr('data-type');
                        var _pos=$(n).attr('data-pos');

                        PLAYER.operateJson.removeOtherEffectClip(time,_type,_pos);
                        $(n).remove();
                    });
                    PLAYER.operateJson.sendJson();
                }
            }

        }
        else if(e.ctrl&&key===65){//ctrl+a(全选)
            if($('#js_time_ruler_bar_box').find('.draggable').length!==0){
                $('#js_time_ruler_bar_box').find('.draggable').addClass('onselected');
            }
        }
        else if(e.ctrl&&key===17){//ctrl(选duoge)
            PLAYER.keyNum=17;
        }
        else if(e.ctrl&&key===67){//ctrl+c
            PLAYER.copyOrcut='copy';
        }
        else if(e.ctrl&&key===88){//ctrl+x
            PLAYER.checkPlaying();
            PLAYER.copyOrcut='cut';
            var arr_sIn=[];

            $.each($('.onselected'),function(i,n){
                arr_sIn.push(parseInt($(this).attr('data-sequencetrimin')));
                PLAYER.clipboard.push($(this));
                PLAYER.clipboard.parent.push($(this).parent('.time_ruler_bar'))
                $(n).remove();
                var time=$(n).attr('data-time');
                PLAYER.operateJson.deleteClipAttr(time);
            });
            PLAYER.cut_min_sIn=Math.min.apply(null,arr_sIn);
            PLAYER.operateJson.pushCancelArray(PLAYER.jsonObj.rootBin.sequence[0]);
            PLAYER.OCX.updateProjectJson(PLAYER.jsonObj);
            PLAYER.OCX.seek(parseInt(self.currTime));

            //剪切切片不更新时间轴
            PLAYER.PTR.config.maxTime=(PLAYER.operateJson.getLastFrame()||1000);
            $('#js_player_totalTime').html(PLAYER.getDurationToString(PLAYER.operateJson.getLastFrame()||0));
            PLAYER.PTR.updateEvent(PLAYER.PTR.config);
        }
        else if(e.ctrl&&key===86&&PLAYER.copyOrcut==='copy'){//ctrl+v
            PLAYER.checkPlaying();
            var config = self.config;
            var targetObj = self.targetObj;
            var currFrame= self.currTime; //时码线帧数
            var checkId='check_interleaved_id_'+PLAYER.genNonDuplicateID(12);
            var arr_sIn=[];
            var min_sIn;
            $('.onselected').each(function(i,n){
                arr_sIn.push(parseInt($(n).attr('data-sequencetrimin')))
            });
            min_sIn=Math.min.apply(null,arr_sIn);
            $('.onselected').each(function(i,n){
                addClipboardClip($(n),$(n).parent('.time_ruler_bar'),checkId,min_sIn);
            });

            PLAYER.operateJson.sendJson();
        }
        else if(e.ctrl&&key===86&&PLAYER.copyOrcut==='cut'){//ctrl+v
            PLAYER.checkPlaying();
            var config = self.config;
            var targetObj = self.targetObj;
            var currFrame= self.currTime; //时码线帧数
            var checkId='check_interleaved_id_'+PLAYER.genNonDuplicateID(12);

            if(PLAYER.clipboard){
                for (var i = 0; i < PLAYER.clipboard.length; i++) {
                    addClipboardClip(PLAYER.clipboard[i],PLAYER.clipboard.parent[i],checkId,PLAYER.cut_min_sIn);
                }

                PLAYER.operateJson.sendJson();
            }
            PLAYER.clipboard=[];
            PLAYER.clipboard.parent=[];
        }
        else if(e.ctrl&&key===90){//ctrl+z撤销

           if((PLAYER.goBackJson.length-1)<=0){
                $('.time_ruler_bar').empty();
                PLAYER.goBackJson=[];

                $.each($('#js_time_ruler_bar_box .time_ruler_bar'),function(i,n){
                    var attr={
                        type:$(n).attr('data-type'),
                        index:parseInt($(n).attr('data-index')),
                        subclip:[]
                    };
                    PLAYER.jsonObj.rootBin.sequence[0].tracks.push(attr);
                });
                if(PLAYER.operateJson.checkNoClip()){//如果轨道上没有素材了，则不update
                    PLAYER.OCX.clearWindow();
                }
                return false;
            }else{
                //获取上一步json
                var prevObj=PLAYER.goBackJson[PLAYER.goBackJson.length-2];
                PLAYER.jsonObj.rootBin.sequence[0]=JSON.parse(prevObj);

                //渲染视频
                $('.time_ruler_bar').empty();

                for (var i = 0;i<PLAYER.jsonObj.rootBin.sequence[0].tracks.length;i++ ) {
                    var track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i];
                    var type=track.type;
                    var index=track.index;
                    if(track.subclip.length===0){
                        PLAYER.operateJson.emptyTrack(type,index);
                    }else{
                        //获取当前轨道
                        var current_track=PLAYER.operateJson.getTrack(type,index);
                        $.each(track.subclip,function(i,n){
                            var duration;
                            var name;
                            var _id=n.assetid;//素材ID
                            var _id2=n.id; //字幕ID
                            if(_id){
                                PLAYER.operateJson.getMaterialDuration(_id,function(msg){
                                    duration=msg.duration;
                                    name=msg.name;
                                });
                            }
                            if(_id2){
                                PLAYER.operateJson.getSubtitleDuration(_id2,function(msg){
                                    duration=msg.duration;
                                    name=msg.name;
                                });
                            }

                            var initWidth=(n.trimOut-n.trimIn)/PLAYER.TR.config.framePerPixel;//获取轨道切片宽度
                            var _left=n.sequenceTrimIn/PLAYER.TR.config.framePerPixel;

                            var subclipBox=$('<div class="edit_box draggable" data-trimin="'+n.trimIn+'" data-trimout="'+n.trimOut+'" data-sequencetrimin="'+n.sequenceTrimIn+'" data-sequencetrimout="'+n.sequenceTrimOut+'">'+name+'</div>');
                            subclipBox.attr('data-duration',duration ||2000);
                            subclipBox.attr('data-name',name);
                            subclipBox.attr('data-id',n.assetid || n.id);
                            subclipBox.attr('data-type',n.type);
                            subclipBox.attr('data-interleaved',n.interleaved);
                            subclipBox.attr('data-time',n.subclipId);
                            subclipBox.attr('data-intid',n.interleaved_id);
                            subclipBox.css('width',initWidth);
                            subclipBox.css('left',_left);
                            var className='edit_box_'+current_track.attr('data-type');
                            subclipBox.addClass(className);

                            if(n.effect&&n.effect.length!==0){
                                var effect_width;
                                var effectBox;
                                var _w;
                                $.each(n.effect,function(index,item){
                                    effectBox=$('<div class="effect_box"></div>');
                                    effectBox.attr('data-duration',item.duration);
                                    effectBox.attr('data-trimin',item.trimIn);
                                    effectBox.attr('data-trimout',item.trimOut);
                                    effectBox.attr('data-pos',item.pos);
                                    effectBox.attr('data-type',item.type);

                                    _w=(item.trimOut-item.trimIn)/PLAYER.TR.config.framePerPixel;
                                    effectBox.width(_w);
                                    if(item.type==='mosaic'){
                                        effectBox.addClass('effect_box_all');
                                    }else{
                                        if(item.trimOut===n.trimOut){
                                            effectBox.addClass('effect_box_r');
                                        }else if(item.trimIn===n.trimIn){
                                            effectBox.addClass('effect_box_l');
                                        }
                                    }
                                    subclipBox.append(effectBox);
                                });
                            }
                            current_track.append(subclipBox);
                        });

                        //更新播放器时间配置
                        $('#js_player_totalTime').html(PLAYER.getDurationToString(PLAYER.operateJson.getLastFrame()));
                        PLAYER.PTR.config.maxTime=PLAYER.operateJson.getLastFrame();
                        PLAYER.PTR.updateEvent(PLAYER.PTR.config);
                    }
                }

                PLAYER.goBackJson.pop();
                //提交json
                PLAYER.OCX.updateProjectJson(PLAYER.jsonObj);

                console.log('PLAYER.jsonObj',PLAYER.jsonObj)
                PLAYER.OCX.seek(parseInt(PLAYER.TR.currTime));
            }
        }

        function addClipboardClip(v_target,v_parent,checkId,min_sIn){
            var cloneBox;
            var add_subclip_attr,
                v_dataId,
                v_type,
                v_interleaved,
                v_index,
                v0_sequenceTrimIn,
                v0_sequenceTrimOut,
                v0_trimIn,
                v0_trimOut;

            var vcut_sequenceTrimIn,
                vcut_sequenceTrimOut,
                vcut_trimIn,
                vcut_trimOut;
            v_initId=v_target.attr('data-intid');
            intId=v_initId+1;
            v_dataId=v_target.attr('data-id');
            v_type=v_target.attr('data-type');
            v_interleaved=v_target.attr('data-interleaved');
            v_index=parseInt(v_parent.attr('data-index'));
            var subclipId=v_type+'_'+PLAYER.genNonDuplicateID(12);

            v0_trimIn=parseInt(v_target.attr('data-trimin'));
            v0_trimOut=parseInt(v_target.attr('data-trimout'));
            v0_sequenceTrimIn=parseInt(v_target.attr('data-sequencetrimin'));
            v0_sequenceTrimOut=parseInt(v_target.attr('data-sequencetrimout'));

            //复制后数据
            vcut_trimIn=v0_trimIn;
            vcut_trimOut=v0_trimOut;
            vcut_sequenceTrimIn=v0_sequenceTrimIn-min_sIn+currFrame;
            vcut_sequenceTrimOut=vcut_sequenceTrimIn+v0_trimOut-v0_trimIn;

            cloneBox=v_target.clone();
            cloneBox.css('left',vcut_sequenceTrimIn/config.framePerPixel);
            cloneBox.attr('data-sequencetrimin',vcut_sequenceTrimIn);
            cloneBox.attr('data-sequencetrimout',vcut_sequenceTrimOut);
            cloneBox.attr('data-time',subclipId);
            cloneBox.attr('data-intid',intId);

            v_parent.append(cloneBox);

            PLAYER.operateJson.checkCoverEvent(cloneBox,checkId);

            if(v_parent.hasClass('bar_v')){
                var time=v_target.attr('data-time');
                var e_attr=JSON.parse(PLAYER.operateJson.getEffectClip(time));
                if(e_attr&&e_attr.length!==0){
                    $.each(e_attr,function(i,n){
                        if($(this).pos==='all'){
                            $(this).trimIn=vcut_trimIn;
                            $(this).trimOut=vcut_trimOut;
                        }
                    });
                }else{
                    e_attr=[];
                }
                add_subclip_attr={
                    "assetid": v_dataId,
                    "trimIn": vcut_trimIn,
                    "trimOut":vcut_trimOut,
                    "sequenceTrimIn": vcut_sequenceTrimIn,
                    "sequenceTrimOut":vcut_sequenceTrimOut,
                    "effect":e_attr,
                    "subclipId":subclipId,
                    "type":v_type
                }
                if(v_interleaved==='true'){
                    add_subclip_attr.interleaved=true;
                    add_subclip_attr.interleaved_id=intId;
                }else{
                    add_subclip_attr.interleaved=false;
                    var i_id='interleaved_id_'+PLAYER.genNonDuplicateID(12);
                    add_subclip_attr.interleaved_id=i_id;
                }

                PLAYER.operateJson.addVideoClipAttr(add_subclip_attr,v_index);

            }else if(v_parent.hasClass('bar_a')){
                add_subclip_attr={
                    "assetid": v_dataId,
                    "trimIn": vcut_trimIn,
                    "trimOut":vcut_trimOut,
                    "sequenceTrimIn": vcut_sequenceTrimIn,
                    "sequenceTrimOut":vcut_sequenceTrimOut,
                    "volume":100,
                    "subclipId":subclipId,
                    "type":v_type,
                    "interleaved_id":intId
                }
                if(v_interleaved==='true'){
                    add_subclip_attr.interleaved=true;
                    add_subclip_attr.interleaved_id=intId;
                }else{
                    add_subclip_attr.interleaved=false;
                    var i_id='interleaved_id_'+PLAYER.genNonDuplicateID(12);
                    add_subclip_attr.interleaved_id=i_id;
                }

                PLAYER.operateJson.addAudioClipAttr(add_subclip_attr,v_index);

            }else if(v_parent.hasClass('bar_t')){
                add_subclip.css('background','pink');
                var msg= JSON.parse(PLAYER.subtitleAttr[v_dataId]);

                var i_id='interleaved_id_'+PLAYER.genNonDuplicateID(12);
                var subClipAttr_cut={
                    "trimIn": vcut_trimIn,
                    "trimOut":vcut_trimOut,
                    "sequenceTrimIn":vcut_sequenceTrimIn,
                    "sequenceTrimOut":vcut_sequenceTrimOut,
                    "subclipId":subclipId,
                    "type":v_type,
                    "interleaved_id":i_id
                }

                $.extend(msg,subClipAttr_cut);
                PLAYER.operateJson.addSubtitleClipAttr(msg,v_index);
            }
        }

    }
    /*工具条+-快捷键*/
    function toolbarZoomInOut(e){
        var e=PLAYER.EventUtil.getEvent(e);
        PLAYER.EventUtil.preventDefault(e);
        var config=self.config;
        var targetObj=self.targetObj;
        var old_scrollWidth=config.$sliderBar.width();          //按下时记住滚动条的宽和left
        var old_scrollLeft=config.$sliderBar.position().left;
        var old_marginLeft=Math.abs(parseFloat(config.$rulerWrap.css('marginLeft')));
        var old_fpp=config.framePerPixel;

        if(PLAYER.keyNum===187){
            $('.time_ruler_toolbar').children('span').removeClass('active');
            $('#js_toolbar_zoom_plus').addClass('active');
            if(old_scrollWidth===(2*scrollRightWidth+8)){
                return;
            }
            changeFramePerPixel(-10,old_fpp,old_scrollWidth,old_scrollLeft,old_marginLeft);
        }
        if(PLAYER.keyNum===189){//--
            $('.time_ruler_toolbar').children('span').removeClass('active');
            $('#js_toolbar_zoom_minus').addClass('active');
            if(old_scrollWidth===config.$headerRight.width()){
                return;
            }
            changeFramePerPixel(10,old_fpp,old_scrollWidth,old_scrollLeft,old_marginLeft);
        }
    }
    /*滚轮事件*/
    function privateMousewheelEvent(ev){
        var targetObj=self.targetObj;
        var config=self.config;
        var scrollTotalScollLeft = parseFloat(config.$sliderBar.position().left);
        var wheelStep = 2;

        scrollBtnMovableDistance = parseFloat(config.$sliderTrack.width() -config.$sliderBar.width());
        containerMovableDistance = parseFloat(config.$rulerWrap.width() - config.$headerRight.width());

        if(Math.floor(config.$sliderBar.width())===Math.floor(config.$sliderTrack.width())){
            return false;
        }
        if(ev.wheelDelta ===-120){//往下滚动
            newTotalBtnScollLeft = scrollTotalScollLeft + wheelStep;
            if (newTotalBtnScollLeft>=scrollBtnMovableDistance) {
                newTotalBtnScollLeft = scrollBtnMovableDistance;
                newContainerMarginLeft = containerMovableDistance;
            } else {
                newContainerMarginLeft=newTotalBtnScollLeft*containerMovableDistance/scrollBtnMovableDistance;
            }
            config.$sliderBar.css("left", newTotalBtnScollLeft);
            config.$rulerWrap.css("margin-left", -newContainerMarginLeft);
            config.$ruler.css("left", newContainerMarginLeft);
            config.$clipTrackBar.css("margin-left", -newContainerMarginLeft);
            drawCanvas(newContainerMarginLeft);
            return false;
        }else if(ev.wheelDelta ===120){ //往上滚动
            newTotalBtnScollLeft = scrollTotalScollLeft - wheelStep;
            if (newTotalBtnScollLeft <=0) {
                newTotalBtnScollLeft = 0;
                newContainerMarginLeft = 0;
            } else {
                newContainerMarginLeft=newTotalBtnScollLeft*containerMovableDistance/scrollBtnMovableDistance;
            }
            config.$sliderBar.css("left", newTotalBtnScollLeft);
            config.$rulerWrap.css("margin-left", -newContainerMarginLeft);
            config.$ruler.css("left", newContainerMarginLeft);
            config.$clipTrackBar.css("margin-left", -newContainerMarginLeft);
            drawCanvas(newContainerMarginLeft);
            return false;
        }
        return false;
    }
    /*关于出入点函数开始*/
    function handleTrimEvent() {
        var config = self.config;
        config.$trimIn.addEventListener = function(type, callback) {
            if (type == "mousemove") {
                config.$trimIn.mousedown(function(e) {
                    e.stopPropagation();
                    trimInOutStartPos = e.clientX;
                    trimInOrginPos = trimInCurrPos;
                    document.onmousemove = e_move;
                    document.onmouseup = undrag;
                });
                function e_move(e) {
                    fixTrimInPosition(e.clientX, e.clientY, callback);
                }
                function undrag() {
                    this.onmousemove = null;
                }
            }
        };
        config.$trimOut.addEventListener = function(type, callback) {
            if (type == "mousemove") {
                config.$trimOut.mousedown(function(e) {
                    e.stopPropagation();
                    trimInOutStartPos = e.clientX;
                    trimOutOrginPos = trimOutCurrPos;
                    document.onmousemove = e_move;
                    document.onmouseup = undrag;
                });
                function e_move(e) {
                    fixTrimOutPosition(e.clientX, e.clientY, callback);
                }
                function undrag() {
                    this.onmousemove = null;
                }
            }
        };
    }
    function fixTrimInPosition(mouseX, mouseY, callback) {
        var targetObj = self.targetObj;
        var config = self.config;
        if (mouseX < $("." + targetObj).offset().left) {
            mouseX = $("." + targetObj).offset().left;
        }
        var offset = mouseX - trimInOutStartPos;

        if(trimInOrginPos + offset > trimOutCurrPos - 3){
            return;
        }
        if(trimInOrginPos + offset < 0) {
            trimInCurrPos = 0;
        }else {
            trimInCurrPos = trimInOrginPos + offset;
        }
        trimInCurrPos = parseInt(trimInCurrPos*config.framePerPixel)/config.framePerPixel;
        self.trimInCurrTime = Math.round(trimInCurrPos*config.framePerPixel);

        var newWidth = trimOutCurrPos - trimInCurrPos;
        config.$trimInOut.css("left", trimInCurrPos);
        config.$trimInOut.css("width", newWidth);
        if (callback != null) {
            var currentTime = self.trimInCurrTime;
            callback(currentTime);
        }
    }
    function fixTrimOutPosition(mouseX, mouseY, callback) {
        var targetObj = self.targetObj;
        var config = self.config;
        if (mouseX < config.$headerRight.offset().left) {
            mouseX = config.$headerRight.offset().left;
        }
        var offset = mouseX - trimInOutStartPos;
        if (trimOutOrginPos + offset < trimInCurrPos + 3) {
            return;
        }
        if (trimOutOrginPos + offset > config.maxTime * config.perMsecWidth) {
            trimOutCurrPos = config.maxTime * config.perMsecWidth;
        }else {
            trimOutCurrPos = trimOutOrginPos + offset;
        }
        trimOutCurrPos =parseInt(trimOutCurrPos*config.framePerPixel)/config.framePerPixel;
        self.trimOutCurrTime = Math.round(trimOutCurrPos*config.framePerPixel);

        var newWidth = trimOutCurrPos - trimInCurrPos;
        config.$trimInOut.css("width", newWidth);
        if (callback != null) {
            var currentTime = self.trimOutCurrTime;
            callback(currentTime);
        }
    }
    /*入点函数*/
    function getVideoTrimInCurrMsec(currMsec) {
        self.trimInCurrTime=currMsec;
        PLAYER.PTR.trimInCurrTime=currMsec;
        PLAYER.PTR.fixTrimInByCurrentTime(currMsec);
    }
    /*出点函数*/
    function getVideoTrimOutCurrMsec(currMsec) {
        self.trimOutCurrTime=currMsec;
        PLAYER.PTR.trimOutCurrTime=currMsec;
        PLAYER.PTR.fixTrimOutByCurrentTime(currMsec);
    }
    //滚动条函数
    function handleScrollBtnEvent() {
        var targetObj = self.targetObj;
        var config = self.config;
        var oldTotalBtnScollLeft;       //旧的整体滑块的left值
        var oldtotalScrollWidth;
        var totalBtnScollMove;          //整体滑动范围
        var totalScrollStartX;          //整体鼠标开始点击值
        var old_marginLeft;      //刻度尺旧的left值

        var targertEvent;
        var b;
        var old_fpp;            //按下时帧率
        var offset;
        config.$sliderBarLeft.mousedown(function(e) {
            var e = e || window.event;
            config.$sliderBarMiddle.addClass("now");
            totalScrollStartX= e.clientX;
            oldtotalScrollWidth=config.$sliderBar.width();
            oldTotalBtnScollLeft = parseInt(config.$sliderBar.position().left);
            old_marginLeft=Math.abs(parseInt(config.$rulerWrap.css('marginLeft')));
            old_fpp=config.framePerPixel;
            $(document)[0].onmousemove = function(e) {
                var e = e || window.event;
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                var scale;
                e.preventDefault();
                $('body').css({cursor:"url(images/cur/hand_move.cur),default"});
                //滚动距离
                diff_move=totalScrollStartX-e.clientX;

                changeFramePerPixel(diff_move,old_fpp,oldtotalScrollWidth,oldTotalBtnScollLeft,old_marginLeft);
            };

            $(document)[0].onmouseup = function(e) {
                $('body').css({cursor:"default"});
                $(document)[0].onmousemove = null;
            };
        });
        config.$sliderBarRight.mousedown(function(e) {
            var e = e || window.event;
            config.$sliderBarMiddle.addClass("now");
            totalScrollStartX= e.clientX;
            oldtotalScrollWidth=config.$sliderBar.width();
            oldTotalBtnScollLeft = parseInt(config.$sliderBar.position().left);
            old_marginLeft=Math.abs(parseInt(config.$rulerWrap.css('marginLeft')));
            old_fpp=config.framePerPixel;
            $(document)[0].onmousemove = function(e) {
                var e = e || window.event;
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                var scale;
                e.preventDefault();

                $('body').css({cursor:"url(images/cur/hand_move.cur),default"});
                //滚动距离
                diff_move=e.clientX-totalScrollStartX;
                changeFramePerPixel(diff_move,old_fpp,oldtotalScrollWidth,oldTotalBtnScollLeft,old_marginLeft);
            };
            $(document)[0].onmouseup = function(e) {
                $('body').css({cursor:"default"});
                $(document)[0].onmousemove = null;
            };
        });

        config.$sliderBarMiddle.mousedown(function(e) {
            var e = e || window.event;
            config.$sliderBarMiddle.addClass("now");
            totalScrollStartX= e.clientX;
            oldtotalScrollWidth=config.$sliderBar.width();
            oldTotalBtnScollLeft = parseInt(config.$sliderBar.position().left);
            $(document)[0].onmousemove = function(e) {
                $('body').css({cursor:"move"});
                    //滚动条移动距离
                    totalBtnScollMove= e.clientX - totalScrollStartX;
                    newTotalBtnScollLeft = oldTotalBtnScollLeft+ totalBtnScollMove;
                    newtotalScrollWidth= oldtotalScrollWidth;
                    //限定滚动条滚动距离
                    if (newTotalBtnScollLeft < 0) {
                        newTotalBtnScollLeft = 0;
                    }
                    if (newTotalBtnScollLeft > scrollBtnMovableDistance) {
                        newTotalBtnScollLeft = scrollBtnMovableDistance;
                    }

                    config.$sliderBar.css('left',newTotalBtnScollLeft);
                    config.$sliderBarMiddle.addClass("now");

                    if (newtotalScrollWidth != config.$sliderTrack.width()) {

                        scrollBtnMovableDistance = parseInt(config.$sliderTrack.width() -newtotalScrollWidth);
                        containerMovableDistance = parseInt(config.$rulerWrap.width() - boxWidth);
                        //没有到中部前,$rulerWrap.width()不变

                        newContainerMarginLeft = Math.floor(parseInt(containerMovableDistance * newTotalBtnScollLeft / scrollBtnMovableDistance));
                    } else {
                        newContainerMarginLeft = 0;
                    }
                    //刻度条容器和刻度的left值
                    config.$rulerWrap.css("margin-left", parseInt(-newContainerMarginLeft));
                    config.$ruler.css("left", newContainerMarginLeft);
                    config.$clipTrackBar.css("margin-left", parseInt(-newContainerMarginLeft));
                    config.$line.css("margin-left", parseInt(-newContainerMarginLeft)+1);
                    //更新canvas画布
                    drawCanvas(newContainerMarginLeft);
                    return false;
            };
            $(document)[0].onmouseup = function(e) {
                config.$sliderBarMiddle.removeClass("now");
                $('body').css({cursor:"default"});
                $(document)[0].onmousemove = null;
            };
        });
    }
    //改变精度
    function changeFramePerPixel(diff_move,old_fpp,oldtotalScrollWidth,oldTotalBtnScollLeft,old_marginLeft){
        var config=self.config;
        var targetObj = self.targetObj;
        var middlePos=(config.$headerRight.width()/2);
        var scale;
        var offset;

        if(diff_move>0){//--

            if(config.max_fpp===old_fpp){
                offset=0;
            }else{
                scale=(config.$sliderTrack.width()-oldtotalScrollWidth)/((config.max_fpp/old_fpp)-1);
                offset=diff_move/scale;
            }

            newTotalBtnScollLeft=oldTotalBtnScollLeft-diff_move;
            newtotalScrollWidth=oldtotalScrollWidth+2*diff_move;
            config.framePerPixel=old_fpp*(offset+1);

            if(newTotalBtnScollLeft<=0){
                newTotalBtnScollLeft=0;
            }
            if(oldTotalBtnScollLeft+oldtotalScrollWidth+diff_move>=config.$headerRight.width()){
                newTotalBtnScollLeft=oldTotalBtnScollLeft-diff_move;
                newtotalScrollWidth=config.$sliderTrack.width()-newTotalBtnScollLeft;
            }
            if(newtotalScrollWidth>=config.$sliderTrack.width()){
                newtotalScrollWidth=config.$sliderTrack.width();
                config.framePerPixel=config.maxTime/config.$headerRight.width();
            }

            letFramePerPixelValid(config.framePerPixel);
        }
        else if(diff_move<0){//++

            if(config.min_fpp===old_fpp){
                offset=0;
            }else{
                scale=(oldtotalScrollWidth-(2*scrollRightWidth+8))/((old_fpp/config.min_fpp)-1);
                offset=diff_move/scale;
            }

            newTotalBtnScollLeft=oldTotalBtnScollLeft-diff_move;
            newtotalScrollWidth=oldtotalScrollWidth+2*diff_move;
            config.framePerPixel=old_fpp/(-offset+1);

            if(newtotalScrollWidth<=(2*scrollRightWidth+8)){
                newtotalScrollWidth=(2*scrollRightWidth+8);
                offset=0;
                newTotalBtnScollLeft=oldTotalBtnScollLeft-((2*scrollRightWidth+8)-oldtotalScrollWidth/2);
                config.framePerPixel=config.min_fpp;
            }

            letFramePerPixelValid(config.framePerPixel);

        }else{
           config.framePerPixel=old_fpp;
           letFramePerPixelValid(config.framePerPixel);
        }

        var middlePos=Math.floor(config.$headerRight.width()/2);
        //改变帧率
        var s=getUnitInfo(config.framePerPixel);
        zoomRulerConfig(s.smallScaleFrame,s.smallScaleNumsPerLargeScale,config.framePerPixel);

        //改变容器宽
        newContainerWidth=Math.floor(config.maxTime/config.framePerPixel);

        if(newContainerWidth<=config.$headerRight.width()){
            newContainerWidth=config.$headerRight.width();
        }
        //改变容器left

        scrollBtnMovableDistance = parseInt(config.$sliderTrack.width() -newtotalScrollWidth);//滚动条可滚动距离
        containerMovableDistance = parseInt(newContainerWidth - config.$headerRight.width()); //刻度可滚动距离
        //改变容器left
        if(self.currTime!=0){
            currPos=Math.floor(parseInt(self.currTime/config.framePerPixel));
            newContainerMarginLeft=currPos-middlePos;
            newTotalBtnScollLeft=newContainerMarginLeft*scrollBtnMovableDistance/containerMovableDistance;
            if(newTotalBtnScollLeft>=scrollBtnMovableDistance){
                newTotalBtnScollLeft=scrollBtnMovableDistance;
                newContainerMarginLeft=containerMovableDistance;
            }
            if(isNaN(newTotalBtnScollLeft)){
                newContainerMarginLeft=0;
                newTotalBtnScollLeft=0;
            }
        }else{
            newContainerMarginLeft = Math.floor(containerMovableDistance * newTotalBtnScollLeft / scrollBtnMovableDistance);
        }

        if(isNaN(newContainerMarginLeft)||newContainerMarginLeft<=0){
            newContainerMarginLeft=0;
            newTotalBtnScollLeft=0;
        }

        //重新滚动条
        config.$sliderBar.css('width',newtotalScrollWidth);
        config.$sliderBar.css('left',newTotalBtnScollLeft);
        config.$sliderBarMiddle.css('width',newtotalScrollWidth-2*scrollRightWidth);
        config.$sliderBarRight.css('left',newtotalScrollWidth-scrollRightWidth);

        //重新计算刻度容器
        config.$rulerWrap.css("margin-left", -newContainerMarginLeft);
        config.$rulerWrap.css("width", newContainerWidth);
        config.$ruler.css("left", newContainerMarginLeft);
        config.$clipTrackBar.css("margin-left", -newContainerMarginLeft);
        config.$line.css("margin-left", parseInt(-newContainerMarginLeft)+1);

        //更新canvas画布
        drawCanvas(newContainerMarginLeft);
        //更新计算游标位置和出入点
        self.fixArrowCurrentTime(self.currTime);
        self.fixTrimInByCurrentTime(self.trimInCurrTime);
        self.fixTrimOutByCurrentTime(self.trimOutCurrTime);
        self.fixClipWidth();
    }
    //让帧率再合适的范围
    function letFramePerPixelValid(fpp){
        var config=self.config;
        var targetObj = self.targetObj;

        var _max1=25*60.0*60*10.0/80;
        var _max2=config.maxTime/$("." + self.targetObj).width();
        var _max=Math.min(_max1,_max2);
        if(fpp<config.min_fpp){
            fpp=config.min_fpp;
        }
        else if(fpp>_max){
            fpp=_max;
        }
    }
    /*关于重新渲染配置开始*/
    function zoomRulerConfig(_smallScaleFrame,_smallScaleNumsPerLargeScale,_framePerPixel){
        var config = self.config;
        config.smallScaleFrame = _smallScaleFrame;
        config.smallScaleNumsPerLargeScale = _smallScaleNumsPerLargeScale;
        config.framePerPixel = _framePerPixel;
        self.updateRuler(config);
    }
    return constructor;
}();
/*------播放器时间线开始------*/
PLAYER.timeRuler2 = function() {
    var trimInOrginPos = 0;
    var trimOutOrginPos = 0;
    var trimInCurrPos = 0;
    var trimOutCurrPos = 0;
    var trimInOutStartPos = 0;

    var currPos = 0;                //指针的left值
    var newTotalBtnScollLeft=0;     //新的整体滑块left值
    var newtotalScrollWidth;        //新的整体滑块的wi
    var scrollBtnMovableDistance;   //整体滚动条可滚动距离
    var containerMovableDistance;   //整体刻度条可滚动距离
    var scrollLeftWidth=0;          //左滚动宽度
    var scrollRightWidth=0;         //右滚动宽度

    var initContainerMarginLeft=0;  //初始化刻度条相对于刻度容器的left值
    var newContainerMarginLeft=0;   //新的刻度条相对于刻度容器的left值
    var newContainerWidth=0;        //新的刻度容器宽度

    var boxWidth;
    var self = this;
    /*------精度数组开始------*/
    var unitTablePal=[
        {
            smallScaleFrame:1,    //  1f:1f
            smallScaleNumsPerLargeScale:1
        },
        {
            smallScaleFrame:1,    //  1f:2f
            smallScaleNumsPerLargeScale:2
        },
        {
            smallScaleFrame:1,    //  1f:5f
            smallScaleNumsPerLargeScale:5
        },
        {
            smallScaleFrame:1,    //  1f:10f
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:5,    //  5f:1s
            smallScaleNumsPerLargeScale:5
        },
        {
            smallScaleFrame:5,    //  5f:2s
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:10,    //  10f:4s
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:25,       //  1s:10s
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:25*3,     //  3s:30s
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:25*6,     //  6s:1min
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:25*12,     //  12s:2min
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:25*30,     //  30s:5min
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:25*60,     //  1min:10min
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:25*60*3,   //  3min:30min
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:25*60*6,     //  6min:1h
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:25*60*30,     //  30min:5h
            smallScaleNumsPerLargeScale:10
        },
        {
            smallScaleFrame:25*60*60,     //  1h:10h
            smallScaleNumsPerLargeScale:10
        }];
    /*------默认配置开始------*/
    var defaultConfig = {
        hasTrack:true,                      //是否含轨道
        maxTime: 1000,                      //1000f
        min_largeScaleWidth: 80,            //每个大格宽度80px
        framePerPixel:0,                    //默认比率
        max_fpp:0,
        min_fpp:0.125,
        smallScaleNumsPerLargeScale: 10,    //每个大格包含多少小格
        smallScaleFrame:0,                  //每小格帧数
        smallScaleWidth: 0,                 //每小格宽度
        largeScaleWidth: 0,                 //每大格代表的宽度
        largeScaleMillisecondInterval: 0,   //每大格代表的毫秒数
        seekComandTimesMonitor:[],

        largeScaleHeight: 20,       //每个大格高度
        smallScaleHeight: 12.5,     //每个小个高度
        backgroundColor: "#262626", //刻度背景颜色
        rulerHeight: 35,            //刻度容器高度
        trimHeight: 45,             //出入点高度
        scaleColor: "#929293",      //线性样式
        fontColor: "#929293",       //字体样式
        fontSize: 12,               //字体大小
        fontFamily: "微软雅黑",     //字体样式
        $header :null,           //刻度容器
        $ruler :null,               //刻度尺
        $cursor :null,              //刻度指针
        $trimInOut: null,           //出入点
        $trimIn : null,             //入点
        $trimOut:null,              //出点

        $sliderTrack:null,          //滚动槽
        $sliderBar:null,            //滚动条
        $sliderBarLeft:null,        //滚动条左
        $sliderBarMiddle:null,      //滚动条中
        $sliderBarRight:null,       //滚动条右
        targetObj:'player_time_ruler'
    };
    function constructor(playerConfig) {
        self = this;
        self.config = $.extend(defaultConfig,playerConfig);
        self.targetObj = self.config.targetObj;
        self.trimInCurrTime = 0;    //入点目前帧数
        self.trimOutCurrTime=0;     //出点目前帧数
        self.currTime=0;            //指针目前毫秒数
        boxWidth=$("." + this.targetObj).width();

        initTargetObjectConfig();//初始化一些配置参数、初始化HTML、初始化时间刻度
        handleDocumentEvent(); //执行文档事件

        this.config.$container.addEventListener("mousedown", seekToCursorFrame);
        this.config.$container.addEventListener("mousemove", getVideoCurrFrame);

        this.config.$trimIn.addEventListener("mousemove", getVideoTrimInCurrMsec);
        this.config.$trimOut.addEventListener("mousemove", getVideoTrimOutCurrMsec);

        this.DragDrop.addHandler('mousewheel',privateMousewheelEvent);//私人滚轮事件
        this.DragDrop.addHandler('keydown',privateKeyDownEvent);    //私人键盘事件

        window.addEventListener("resize", handleplayerResizeEvent);
    };
    constructor.prototype = {
        updateRuler: function(newConfig) {
            //配置新的参数
            var config = self.config;
            var targetObj = self.targetObj;
            //设置新的参数
            config.framePerPixel=newConfig.framePerPixel;//初始化比率(1f/px)
            config.smallScaleFrame=newConfig.smallScaleFrame;//初始化一小格帧数
            config.smallScaleNumsPerLargeScale=newConfig.smallScaleNumsPerLargeScale;//初始化大格里面小格数
            config.smallScaleWidth=config.smallScaleFrame/config.framePerPixel;//初始化一小格宽度
            config.largeScaleWidth=config.smallScaleWidth*config.smallScaleNumsPerLargeScale;//初始化一大格宽度
            config.largeScaleMillisecondInterval=config.smallScaleFrame*config.smallScaleNumsPerLargeScale*40;//初始化一大格代表的毫秒数
            config.max_fpp=Math.min(config.maxTime/$("." + self.targetObj).width(),25*60.0*60*10.0/80);
        },
        updateEvent:function(newConfig,init){
            //设置新的参数
            var config = $.extend(self.config,newConfig);
            var targetObj = self.targetObj;

            //设置容器宽
            config.max_fpp=Math.min(config.maxTime/$("." + self.targetObj).width(),25*60.0*60*10.0/80);
            //设置滚动条宽
            newtotalScrollWidth=parseInt(config.$sliderTrack.width());
            newContainerWidth= $("." + self.targetObj).width();
            config.framePerPixel=config.maxTime/newContainerWidth;

            //如果帧率变化改变精度
            var s=getUnitInfo(config.framePerPixel);
            zoomRulerConfig(s.smallScaleFrame,s.smallScaleNumsPerLargeScale,config.framePerPixel);

            config.$container.width(newContainerWidth);
            config.$sliderBar.css('width',newtotalScrollWidth);
            config.$sliderBar.css('left',0);
            config.$sliderBarMiddle.css("width", newtotalScrollWidth-2*scrollRightWidth);
            config.$sliderBarMiddle.css("left",scrollRightWidth);
            config.$sliderBarLeft.css('left',0);
            config.$sliderBarRight.css('left',newtotalScrollWidth-scrollRightWidth);

            self.fixArrowCurrentTime(self.currTime);
            self.fixTrimInByCurrentTime(self.trimInCurrTime);
            self.fixTrimOutByCurrentTime(self.trimOutCurrTime);
            drawCanvas(0);
        },
        fixArrowCurrentTime: function(time) {
            var config = this.config;
            var targetObj = this.targetObj;
            currPos = time/config.framePerPixel;

            var ml=Math.abs(parseFloat(config.$container.css("margin-left")));
            var w=$("." + targetObj).width();
            if(currPos<=0){
                currPos=0;
            }
            if(currPos>=config.$container.width()){
                currPos=config.$container.width();
            }
            if(currPos-ml>w){
                newContainerMarginLeft = currPos - w;
                scrollBtnMovableDistance = parseFloat(config.$sliderTrack.width() -config.$sliderBar.width());//滚动条可滚动距离
                containerMovableDistance = parseFloat(config.$container.width() - w); //刻度可滚动距离

                newTotalBtnScollLeft=newContainerMarginLeft*scrollBtnMovableDistance/containerMovableDistance;

                config.$sliderBar.css('left',newTotalBtnScollLeft);
                config.$container.css("margin-left", -newContainerMarginLeft);
                config.$ruler.css("left", newContainerMarginLeft);
                drawCanvas(newContainerMarginLeft);
                //重新滚动条
                config.$sliderBar.css('left',newTotalBtnScollLeft);
                //重新计算刻度容器
                config.$container.css("margin-left", -newContainerMarginLeft);
                config.$ruler.css("left", newContainerMarginLeft);
                //更新canvas画布
                drawCanvas(newContainerMarginLeft);
            }
            if(currPos<ml){
                newContainerMarginLeft = currPos;
                newTotalBtnScollLeft=newContainerMarginLeft*config.$sliderTrack.width()/config.$container.width();

                config.$sliderBar.css('left',newTotalBtnScollLeft);
                config.$container.css("margin-left", -newContainerMarginLeft);
                config.$ruler.css("left", newContainerMarginLeft);
                drawCanvas(newContainerMarginLeft);
                //重新滚动条
                config.$sliderBar.css('left',newTotalBtnScollLeft);
                //重新计算刻度容器
                config.$container.css("margin-left", -newContainerMarginLeft);
                config.$ruler.css("left", newContainerMarginLeft);
                //更新canvas画布
                drawCanvas(newContainerMarginLeft);
            }

            if(time>=config.maxTime){
                time=config.maxTime;
            }
            self.currTime=time;
            config.$cursor.css("left",currPos);

        },
        fixTrimInByCurrentTime: function(time) {
            var config = this.config;
            this.trimInCurrTime = time;
            trimInCurrPos = this.trimInCurrTime /config.framePerPixel;
            trimOutCurrPos = this.trimOutCurrTime/config.framePerPixel;

            /*if(PLAYER.keyNum===73&&this.trimInCurrTime===0){
                trimOutCurrPos = config.maxTime/config.framePerPixel;
                this.trimOutCurrTime=config.maxTime;
                trimOutCurrPos = parseInt(trimOutCurrPos*config.framePerPixel)/config.framePerPixel;
            }*/
            if(trimInCurrPos>trimOutCurrPos){
                trimOutCurrPos = config.maxTime/config.framePerPixel;
                this.trimOutCurrTime=config.maxTime;
                trimOutCurrPos = parseInt(trimOutCurrPos*config.framePerPixel)/config.framePerPixel;
            }
            config.$trimInOut.css("left", trimInCurrPos);
            config.$trimInOut.css("width", trimOutCurrPos + 2 - trimInCurrPos);
        },
        fixTrimOutByCurrentTime: function(time) {
            var config = this.config;
            this.trimOutCurrTime = time;
            trimInCurrPos = this.trimInCurrTime/config.framePerPixel;
            trimOutCurrPos = this.trimOutCurrTime /config.framePerPixel;
            if(trimOutCurrPos<trimInCurrPos){
               trimInCurrPos=0;
               this.trimInCurrTime=0;
            }
            config.$trimInOut.css("left", trimInCurrPos);
            config.$trimInOut.css("width", trimOutCurrPos + 2 - trimInCurrPos);
        },
        initTime:function(){
            var config = this.config;
            var targetObj = this.targetObj;

            config.$sliderBar.css('left',0);
            config.$sliderBarMiddle.css("width", newtotalScrollWidth-scrollLeftWidth-scrollRightWidth);
            config.$sliderBarMiddle.css("left", scrollLeftWidth);
            config.$sliderBarLeft.css('left',0);
            config.$sliderBarRight.css('left',newtotalScrollWidth-scrollRightWidth);

            config.$container.css("margin-left", 0);
            config.$ruler.css("left", 0);
            drawCanvas(0);

            self.fixArrowCurrentTime(0);
        },
        moveToNextFrame:function(){
            PLAYER.keyNum=39;
            var config = self.config;
            self.currTime+=1;
            if(self.currTime>=config.maxTime){
                self.currTime=config.maxTime;
            }
            self.fixArrowCurrentTime(self.currTime);
            self.fixTrimInByCurrentTime(self.trimInCurrTime);
            self.fixTrimOutByCurrentTime(self.trimOutCurrTime);
        },
        moveToPrevFrame:function(){
            PLAYER.keyNum=37;
            var config = self.config;
            self.currTime-=1;
            if(self.currTime<=0){
                self.currTime=0;
            }
            self.fixArrowCurrentTime(self.currTime);
            self.fixTrimInByCurrentTime(self.trimInCurrTime);
            self.fixTrimOutByCurrentTime(self.trimOutCurrTime);
        },
        DragDrop:function(){
            var dragdrop=new PLAYER.EventTarget(),
                clipDragging=null,
                trimInDragging=null,
                mouseing=null,
                clipping=null;
            var targetObj = this.targetObj;
            function handleEvent(event){
                event=PLAYER.EventUtil.getEvent(event);
                var target=PLAYER.EventUtil.getTarget(event);
                switch(event.type){
                    case 'mousewheel':
                        var mousewheeling=$(target);
                        dragdrop.fire({
                            type:'mousewheel',
                            target:mousewheeling,
                            wheelDelta:event.wheelDelta
                        });
                    case 'keydown':
                        var keydowning=$(target);
                        dragdrop.fire({
                            type:'keydown',
                            target:keydowning,
                            code:event.keyCode,
                            shift:event.shiftKey,
                            ctrl:event.ctrlKey
                        });
                    break;

                }
            }
            dragdrop.enable=function(){
                PLAYER.EventUtil.addHandler(document,'mousewheel',handleEvent);
                PLAYER.EventUtil.addHandler(document,'keydown',handleEvent);
            };
            dragdrop.disable=function(){
                PLAYER.EventUtil.removeHandler(document,'mousewheel',handleEvent);
                PLAYER.EventUtil.removeHandler(document,'keydown',handleEvent);
            };
            return dragdrop;
        }()
    }
    /*初始化config配置*/
    function initTargetObjectConfig() {
        var config = self.config;
        var targetObj = self.targetObj;
        config.framePerPixel=config.maxTime/$("." + targetObj).width();//初始化比率(1f/px)
        config.smallScaleFrame=getUnitInfo(config.framePerPixel).smallScaleFrame;//初始化一小格帧数
        config.smallScaleNumsPerLargeScale=getUnitInfo(config.framePerPixel).smallScaleNumsPerLargeScale;//初始化大格里面小格数
        config.smallScaleWidth=config.smallScaleFrame/config.framePerPixel;  //初始化一小格宽度
        config.largeScaleWidth=config.smallScaleWidth*config.smallScaleNumsPerLargeScale;//初始化一大格宽度
        config.largeScaleMillisecondInterval=config.smallScaleFrame*config.smallScaleNumsPerLargeScale*40;//初始化一大格代表的毫秒数
        config.max_fpp=Math.min(config.maxTime/$("." + targetObj).width(),25*60.0*60*10.0/80);
        newContainerWidth=$("." + targetObj).width();
        drawRuler();
    }
    /*初始化精度函数*/
    function getUnitInfo(_m){
        var config = self.config;
        var arr=[];
        var obj={};
        for (var i = 0; i < unitTablePal.length; i++) {
            var dMinFPP=(unitTablePal[i].smallScaleFrame*unitTablePal[i].smallScaleNumsPerLargeScale)/80;
            if(_m<=dMinFPP){
                arr.push(i);
            }
        }
        obj.smallScaleFrame=unitTablePal[arr[0]].smallScaleFrame;
        obj.smallScaleNumsPerLargeScale=unitTablePal[arr[0]].smallScaleNumsPerLargeScale;
        return obj;
    }
    /*初始化整个结构函数*/
    function drawRuler() {
        var config = self.config;
        var targetObj = self.targetObj;
        //添加刻度canvas
        config.$container = $('<div class="' + targetObj + '_container"></div>');
        config.$container.css("width", newContainerWidth);
        config.$container.css("height", config.rulerHeight);
        config.$ruler = $('<canvas class="' + targetObj + '_canvas"></canvas>');
        config.$ruler.attr("width", $("." + targetObj).width());
        config.$ruler.attr("height", config.rulerHeight-2);
        config.$ruler.css("height", config.rulerHeight-2);
        config.$ruler.appendTo(config.$container);
        //添加出入点
        config.$trimInOut = $('<div class="' + targetObj + '_trimInOut"></div>');
        config.$trimInOut.css("height", config.trimHeight-2);
        config.$trimInOut.css("width", "0px");
        config.$trimInOut.appendTo(config.$container);

        config.$trimIn = $('<div class="' + targetObj + '_trimIn"></div>');
        config.$trimIn.css("height", config.trimHeight-2);
        config.$trimIn.appendTo(config.$trimInOut);

        config.$trimOut = $('<div class="' + targetObj + '_trimOut"></div>');
        config.$trimOut.css("height", config.trimHeight-2);
        config.$trimOut.appendTo(config.$trimInOut);

        //添加刻度的指针
        config.$cursor = $('<div class="' + targetObj + '_cursor"></div>');
        config.$cursor.css("height", $('.'+targetObj).height()-66);
        config.$cursor.appendTo(config.$container);
        var cursorTop = $('<div class="' + targetObj + '_cursor_top"></div>');
        cursorTop.appendTo(config.$cursor);
        config.$container.appendTo($("." + targetObj));


        //添加滑块
        config.$sliderTrack=$('<div class="' + targetObj + '_slider_track">');        //滑动槽
        config.$sliderBar=$('<div class="' + targetObj + '_slider_scroll_total">');    //滑动条
        config.$sliderBarLeft=$('<div class="' + targetObj + '_slider_scroll_left">');
        config.$sliderBarMiddle=$('<div class="' + targetObj + '_slider_scroll_middle">');
        config.$sliderBarRight=$('<div class="' + targetObj + '_slider_scroll_right">');

        config.$sliderBarLeft.appendTo(config.$sliderBar);
        config.$sliderBarMiddle.appendTo(config.$sliderBar);
        config.$sliderBarRight.appendTo(config.$sliderBar);
        config.$sliderBar.appendTo(config.$sliderTrack);

        config.$sliderTrack.appendTo($("." + targetObj));

        drawCanvas(0);  //初始化时间轴
        initScrollWidth();    //初始化滚动条宽度
    }
    /*初始化滚动条宽度函数*/
    function initScrollWidth(){
        var config = self.config;
        var targetObj = self.targetObj;
        var inittotalScrollWidth;
        //初始化滚动条宽度和左右放大按钮的位置
        scrollLeftWidth=config.$sliderBarLeft.width();
        scrollRightWidth=config.$sliderBarRight.width();
        inittotalScrollWidth= ($("." + targetObj).width() * config.$sliderTrack.width() / config.$container.width());  //843

        //滚动条可滚动距离
        scrollBtnMovableDistance = parseInt(config.$sliderTrack.width() -inittotalScrollWidth);
        //刻度可滚动距离
        containerMovableDistance = parseInt(config.$container.width() - $("." + self.targetObj).width());

        if (inittotalScrollWidth>=config.$sliderTrack.width()) {
            inittotalScrollWidth =config.$sliderTrack.width();
        }
        config.$sliderBar.css('width',inittotalScrollWidth);
        config.$sliderBar.css('left',0);
        config.$sliderBarMiddle.css("width", inittotalScrollWidth-scrollLeftWidth-scrollRightWidth);
        config.$sliderBarMiddle.css("left", scrollLeftWidth);
        config.$sliderBarLeft.css('left',0);
        config.$sliderBarRight.css('left',inittotalScrollWidth-scrollRightWidth);
    }
    /*初始化画布函数*/
    function drawCanvas(scrollLeft) {
        var config = self.config;
        var targetObj = self.targetObj;
        scrollLeft = parseInt(scrollLeft);

        var rulerWidth = $("." + targetObj).width();

        config.$ruler.attr("width", rulerWidth);
        var ctx = config.$ruler[0].getContext("2d");
        ctx.clearRect(0, 0, rulerWidth, config.$ruler.height()); //清除画布
        ctx.fillStyle = config.backgroundColor;
        ctx.fillRect(0, 0, rulerWidth, config.$ruler.height());  //画正方形

        var linePosition = config.rulerHeight;

        //设置画笔线性样式
        ctx.lineWidth = 1;
        ctx.strokeStyle = config.scaleColor;
        ctx.fillStyle = config.fontColor;
        ctx.font = config.fontSize + "px " + config.fontFamily;
        ctx.textAlign = "center";

        //添加画笔路径
        ctx.beginPath();

        //画时间轴下边线
        ctx.moveTo(0, linePosition);
        ctx.lineTo(rulerWidth, linePosition);

        var textPos = parseInt(scrollLeft / config.largeScaleWidth) * config.largeScaleMillisecondInterval;  //0

        var offsetNums = parseInt(scrollLeft / config.smallScaleWidth) + 1; //1

        var offsetLeft = offsetNums * config.smallScaleWidth - scrollLeft; //20

        var beginIndex = offsetNums % config.smallScaleNumsPerLargeScale;   //1

        var lastTopRulerPos = 0;

        var index = 0;

        while (lastTopRulerPos < rulerWidth) {

            lastTopRulerPos = index * config.smallScaleWidth + .3 + offsetLeft;   //10.5-20.5-30.5-40.5.......800.5


            if (beginIndex % config.smallScaleNumsPerLargeScale == 0) {
                //每隔100 画一大格
                ctx.moveTo(lastTopRulerPos, linePosition - 1);                       //(100.5,25)
                ctx.lineTo(lastTopRulerPos, linePosition - config.largeScaleHeight); //(100.5,12.5)

                textPos += config.largeScaleMillisecondInterval;   //1e4,2e4,3e4,.....
                var nTime = PLAYER.$millisecondsToTimeFrame(textPos);      //大格上时间文本

                ctx.fillText(nTime, lastTopRulerPos, linePosition - config.largeScaleHeight - 3);  //(text,x,27.5)
            } else {
                //每隔10距离画小格
                ctx.moveTo(lastTopRulerPos, linePosition - 1);                         //(10.5,25)
                ctx.lineTo(lastTopRulerPos, linePosition - config.smallScaleHeight);   //(10.5,18.5)

            }
            index++;
            beginIndex++;
        }
        ctx.stroke();
    }
    /*总的文档事件函数*/
    function handleDocumentEvent() {
        handleArrowEvent();     //刻度指针监听鼠标按下、点击、移动事件
        handleTrimEvent();      //刻度出入点事件
        handleScrollBtnEvent(); //滚动条事件
    }
    /*全屏事件函数*/
    function handleplayerResizeEvent(){
        var config = self.config;
        var targetObj=self.targetObj;
        $("." + self.targetObj).width($("." + self.targetObj).parent().width());
        self.updateEvent(self.config);
    }
    /*关于移动游标事件函数开始*/
    function handleArrowEvent() {
        var config = self.config;
        config.$container.addEventListener = function(type, callback) {
            if (type == "mousedown") {
                config.$container.mousedown(function(e) {
                    e.stopPropagation();
                    fixArrowPosition(e.clientX, e.clientY, callback);
                    document.onmousemove = e_move;
                    document.onmouseup = undrag;
                    function e_move(e) {
                        fixArrowPosition(e.clientX, e.clientY, callback);
                    }
                    function undrag(e) {
                        this.onmousemove = null;
                        this.onmouseup = null;
                    }
                });
            } else if (type == "click") {
                e.stopPropagation();
                if ($(this) != config.$ruler) {
                    return;
                }
                fixArrowPosition(e.clientX, e.clientY, callback);
            } else if (type == "mousemove") {
                //设置刻度指针的拖动事件
                __drag(config.$cursor, callback);
            }
        };
    }
    function __drag(title, callback) {
        var x, y, _left, _top;
        title.mousedown(function(e) {
            e.stopPropagation();
            e = e || event;
            x = e.clientX;
            y = e.clientY;
            _left = title.offsetLeft;
            _top = title.offsetTop;
            this.ondragstart = function() {
                return false;
            };
            document.onmousemove = e_move;
            document.onmouseup = undrag;
        });
        function e_move(e) {
            e = e || event;
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            fixArrowPosition(e.clientX, e.clientY,callback);
        }
        function undrag(e) {
            this.onmousemove = null;
            this.onmouseup = null;
        }
    }
    function fixArrowPosition(mouseX, mouseY, callback) {
        if(PLAYER.isPlaying){
            PLAYER.OCX.doPause();
            PLAYER.isPlaying=false;
            $("#js_play").removeClass("stop")
            $("#js_play").attr("title", "播放");
        }
        var config = self.config;
        var targetObj = self.targetObj;
        var w=$("." + targetObj).width();
        //求出鼠标距离容器left值
        var cursorX = mouseX - $("." + targetObj).offset().left;
        var ml=Math.abs(parseFloat(config.$container.css("margin-left")));

        currPos = cursorX + ml;
        currPos = parseFloat(currPos*config.framePerPixel)/config.framePerPixel; //获得整数位帧数的位置

        if(currPos<=0){
            currPos=0;
        }
        if(currPos>=config.$container.width()){
            currPos=config.$container.width();
        }

        if(currPos-ml>w){
            newContainerMarginLeft = currPos - w;
            scrollBtnMovableDistance = parseFloat(config.$sliderTrack.width() -config.$sliderBar.width());//滚动条可滚动距离
            containerMovableDistance = parseFloat(config.$container.width() - w); //刻度可滚动距离

            newTotalBtnScollLeft=newContainerMarginLeft*scrollBtnMovableDistance/containerMovableDistance;

            config.$sliderBar.css('left',newTotalBtnScollLeft);
            config.$container.css("margin-left", -newContainerMarginLeft);
            config.$ruler.css("left", newContainerMarginLeft);
            drawCanvas(newContainerMarginLeft);
            //重新滚动条
            config.$sliderBar.css('left',newTotalBtnScollLeft);
            //重新计算刻度容器
            config.$container.css("margin-left", -newContainerMarginLeft);
            config.$ruler.css("left", newContainerMarginLeft);

            //更新canvas画布
            drawCanvas(newContainerMarginLeft);
        }
        if(currPos<ml){
            newContainerMarginLeft = currPos;
            newTotalBtnScollLeft=newContainerMarginLeft*config.$sliderTrack.width()/config.$container.width();

            config.$sliderBar.css('left',newTotalBtnScollLeft);
            config.$container.css("margin-left", -newContainerMarginLeft);
            config.$ruler.css("left", newContainerMarginLeft);
            drawCanvas(newContainerMarginLeft);
            //重新滚动条
            config.$sliderBar.css('left',newTotalBtnScollLeft);
            //重新计算刻度容器
            config.$container.css("margin-left", -newContainerMarginLeft);
            config.$ruler.css("left", newContainerMarginLeft);

            //更新canvas画布
            drawCanvas(newContainerMarginLeft);
        }

        config.$cursor.css("left", currPos);

        var preSeekTime = self.currTime;
        self.currTime =  Math.round(currPos*config.framePerPixel);
        if (callback !== null && preSeekTime !==self.currTime) {
            callback(self.currTime);
        }
    }
    function seekToCursorFrame(time) {
        if(PLAYER.isPlaying){
            PLAYER.OCX.doPause();
            PLAYER.isPlaying=false;
            $("#js_play").removeClass("stop")
            $("#js_play").attr("title", "播放");
        }
        if(time>=self.config.maxTime){
            time=self.config.maxTime;
        }
        self.currTime=time;
        self.fixArrowCurrentTime(time);

        if(!PLAYER.dbClick){
            PLAYER.TR.currTime=time;
            PLAYER.TR.fixArrowCurrentTime(time);
        }
        PLAYER.OCX.seek(time);

    }
    function getVideoCurrFrame(time){
        var config=self.config;
        console.log('time',time);
        config.seekComandTimesMonitor.push(time);
    }
    /*私有键盘事件*/
    function privateKeyDownEvent(e){
        var config=self.config;
        var targetObj=self.targetObj;
        var old_scrollWidth=config.$sliderBar.width();          //按下时记住滚动条的宽和left
        var old_scrollLeft=config.$sliderBar.position().left;
        var old_marginLeft=Math.abs(parseInt(config.$container.css('marginLeft')));
        var old_fpp=config.framePerPixel;
        var key=e.code;

        var arr=[];             //存储选中对象left值
        var minLeft=0;          //获取选中对象最小的left值
        var offset=0;           //获取选中对象移动的距离
        var newLeft=0;          //选中对象新的left
        var sequenceTrimIn=0;   //选中对象sequenceTrimIn
        var sequenceTrimOut=0;  //选中对象sequenceTrimOut
        var time=0;             //每个切片的创建时间
        var subClipAttr=null;   //更新切片json
        var prevClipSequenceTrimOut=0;

        if(key===189){//--
            PLAYER.keyNum===189;
            if(old_scrollWidth===$("." + self.targetObj).width()){
                return;
            }
            changeFramePerPixel(10,old_fpp,old_scrollWidth,old_scrollLeft,old_marginLeft);
        }
        else if(key===187){//++
            PLAYER.keyNum===187;
            if(old_scrollWidth===(2*scrollRightWidth+8)){
                return;
            }
            changeFramePerPixel(-10,old_fpp,old_scrollWidth,old_scrollLeft,old_marginLeft);
        }
    }
     /*滚轮事件*/
    function privateMousewheelEvent(ev){
        var targetObj=self.targetObj;
        var config=self.config;
        var scrollTotalScollLeft = parseInt(config.$sliderBar.position().left);
        var wheelStep = 2;

        scrollBtnMovableDistance = parseInt(config.$sliderTrack.width() -config.$sliderBar.width());
        containerMovableDistance = parseInt(config.$container.width() - $("." + self.targetObj).width());

        if(Math.floor(config.$sliderBar.width())===Math.floor(config.$sliderTrack.width())){
            return false;
        }
        if(ev.wheelDelta ===-120){//往下滚动
            newTotalBtnScollLeft = scrollTotalScollLeft + wheelStep;
            if (newTotalBtnScollLeft>=scrollBtnMovableDistance) {
                newTotalBtnScollLeft = scrollBtnMovableDistance;
                newContainerMarginLeft = containerMovableDistance;
                console.log('乡下滚动',newContainerMarginLeft);
            } else {
                newContainerMarginLeft=newTotalBtnScollLeft*containerMovableDistance/scrollBtnMovableDistance;
            }
            config.$sliderBar.css("left", newTotalBtnScollLeft);
            config.$container.css("margin-left", -newContainerMarginLeft);
            config.$ruler.css("left", newContainerMarginLeft);
            drawCanvas(newContainerMarginLeft);
            return false;
        }else if(ev.wheelDelta ===120){ //往上滚动
            newTotalBtnScollLeft = scrollTotalScollLeft - wheelStep;
            if (newTotalBtnScollLeft <=0) {
                newTotalBtnScollLeft = 0;
                newContainerMarginLeft = 0;
            } else {
                newContainerMarginLeft=newTotalBtnScollLeft*containerMovableDistance/scrollBtnMovableDistance;
            }
            config.$sliderBar.css("left", newTotalBtnScollLeft);
            config.$container.css("margin-left", -newContainerMarginLeft);
            config.$ruler.css("left", newContainerMarginLeft);
            drawCanvas(newContainerMarginLeft);
            return false;
        }
        return false;
    }
    /*关于出入点函数开始*/
    function handleTrimEvent() {
        var config = self.config;
        config.$trimIn.addEventListener = function(type, callback) {
            if (type == "mousemove") {
                config.$trimIn.mousedown(function(e) {
                    e.stopPropagation();
                    trimInOutStartPos = e.clientX;
                    trimInOrginPos = trimInCurrPos;
                    document.onmousemove = e_move;
                    document.onmouseup = undrag;
                });
                function e_move(e) {
                    fixTrimInPosition(e.clientX, e.clientY, callback);
                }
                function undrag() {
                    this.onmousemove = null;
                }
            }
        };
        config.$trimOut.addEventListener = function(type, callback) {
            if (type == "mousemove") {
                config.$trimOut.mousedown(function(e) {
                    e.stopPropagation();
                    trimInOutStartPos = e.clientX;
                    trimOutOrginPos = trimOutCurrPos;
                    document.onmousemove = e_move;
                    document.onmouseup = undrag;
                });
                function e_move(e) {
                    fixTrimOutPosition(e.clientX, e.clientY, callback);
                }
                function undrag() {
                    this.onmousemove = null;
                }
            }
        };
    }
    function fixTrimInPosition(mouseX, mouseY, callback) {
        var targetObj = self.targetObj;
        var config = self.config;
        console.log('trimInOrginPos',trimInOrginPos);
        if (mouseX < $("." + targetObj).offset().left) {
            mouseX = $("." + targetObj).offset().left;
        }
        var offset = mouseX - trimInOutStartPos;

        if(trimInOrginPos + offset > trimOutCurrPos - 3){
            return;
        }
        if(trimInOrginPos + offset < 0) {
            trimInCurrPos = 0;
        }else {
            trimInCurrPos = trimInOrginPos + offset;
        }
        trimInCurrPos = parseInt(trimInCurrPos*config.framePerPixel)/config.framePerPixel;
        self.trimInCurrTime = Math.round(currPos*config.framePerPixel);

        var newWidth = trimOutCurrPos - trimInCurrPos;
        config.$trimInOut.css("left", trimInCurrPos);
        config.$trimInOut.css("width", newWidth);
        if (callback != null) {
            var currentTime = self.trimInCurrTime;
            callback(currentTime);
        }
    }
    function fixTrimOutPosition(mouseX, mouseY, callback) {
        var targetObj = self.targetObj;
        var config = self.config;
        if (mouseX < $("." + targetObj).offset().left) {
            mouseX = $("." + targetObj).offset().left;
        }
        var offset = mouseX - trimInOutStartPos;
        if (trimOutOrginPos + offset < trimInCurrPos + 3) {
            return;
        }
        if (trimOutOrginPos + offset > config.maxTime * config.perMsecWidth) {
            trimOutCurrPos = config.maxTime * config.perMsecWidth;
        }else {
            trimOutCurrPos = trimOutOrginPos + offset;
        }
        trimOutCurrPos =parseInt(trimOutCurrPos*config.framePerPixel)/config.framePerPixel;
        self.trimOutCurrTime = Math.round(trimOutCurrPos*config.framePerPixel);

        var newWidth = trimOutCurrPos - trimInCurrPos;
        config.$trimInOut.css("width", newWidth);


        if (callback != null) {
            var currentTime = self.trimOutCurrTime;
            callback(currentTime);
        }
    }
    function getVideoTrimInCurrMsec(currMsec) {
        self.trimInCurrTime=currMsec;
        PLAYER.TR.trimInCurrTime=currMsec;
        PLAYER.TR.fixTrimInByCurrentTime(currMsec);
    }
    function getVideoTrimOutCurrMsec(currMsec) {
        self.trimOutCurrTime=currMsec;
        PLAYER.TR.trimOutCurrTime=currMsec;
        PLAYER.TR.fixTrimOutByCurrentTime(currMsec);
    }
    //滚动条函数
    function handleScrollBtnEvent() {
        var targetObj = self.targetObj;
        var config = self.config;
        var oldTotalBtnScollLeft;       //旧的整体滑块的left值
        var oldtotalScrollWidth;
        var totalBtnScollMove;          //整体滑动范围
        var totalScrollStartX;          //整体鼠标开始点击值
        var old_marginLeft;      //刻度尺旧的left值

        var targertEvent;
        var b;
        var old_fpp;            //按下时帧率
        var offset;
        config.$sliderBarLeft.mousedown(function(e) {
            var e = e || window.event;
            config.$sliderBarMiddle.addClass("now");
            totalScrollStartX= e.clientX;
            oldtotalScrollWidth=config.$sliderBar.width();
            oldTotalBtnScollLeft = parseInt(config.$sliderBar.position().left);
            old_marginLeft=Math.abs(parseInt(config.$container.css('marginLeft')));
            old_fpp=config.framePerPixel;
            $(document)[0].onmousemove = function(e) {
                var e = e || window.event;
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                var scale;
                e.preventDefault();
                $('body').css({cursor:"url(images/cur/hand_move.cur),default"});
                //滚动距离
                diff_move=totalScrollStartX-e.clientX;

                changeFramePerPixel(diff_move,old_fpp,oldtotalScrollWidth,oldTotalBtnScollLeft,old_marginLeft);
            };

            $(document)[0].onmouseup = function(e) {
                $('body').css({cursor:"default"});
                $(document)[0].onmousemove = null;
            };
        });
        config.$sliderBarRight.mousedown(function(e) {
            var e = e || window.event;
            config.$sliderBarMiddle.addClass("now");
            totalScrollStartX= e.clientX;
            oldtotalScrollWidth=config.$sliderBar.width();
            oldTotalBtnScollLeft = parseInt(config.$sliderBar.position().left);
            old_marginLeft=Math.abs(parseInt(config.$container.css('marginLeft')));
            old_fpp=config.framePerPixel;
            $(document)[0].onmousemove = function(e) {
                var e = e || window.event;
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                var scale;
                e.preventDefault();

                $('body').css({cursor:"url(images/cur/hand_move.cur),default"});
                //滚动距离
                diff_move=e.clientX-totalScrollStartX;
                changeFramePerPixel(diff_move,old_fpp,oldtotalScrollWidth,oldTotalBtnScollLeft,old_marginLeft);
            };
            $(document)[0].onmouseup = function(e) {
                $('body').css({cursor:"default"});
                $(document)[0].onmousemove = null;
            };
        });

        config.$sliderBarMiddle.mousedown(function(e) {
            var e = e || window.event;
            config.$sliderBarMiddle.addClass("now");
            totalScrollStartX= e.clientX;
            oldtotalScrollWidth=config.$sliderBar.width();
            oldTotalBtnScollLeft = parseInt(config.$sliderBar.position().left);
            $(document)[0].onmousemove = function(e) {
                $('body').css({cursor:"move"});
                    //滚动条移动距离
                    totalBtnScollMove= e.clientX - totalScrollStartX;
                    newTotalBtnScollLeft = oldTotalBtnScollLeft+ totalBtnScollMove;
                    newtotalScrollWidth= oldtotalScrollWidth;
                    //限定滚动条滚动距离
                    if (newTotalBtnScollLeft < 0) {
                        newTotalBtnScollLeft = 0;
                    }
                    if (newTotalBtnScollLeft > scrollBtnMovableDistance) {
                        newTotalBtnScollLeft = scrollBtnMovableDistance;
                    }

                    config.$sliderBar.css('left',newTotalBtnScollLeft);
                    config.$sliderBarMiddle.addClass("now");

                    if (newtotalScrollWidth != config.$sliderTrack.width()) {

                        scrollBtnMovableDistance = parseInt(config.$sliderTrack.width() -newtotalScrollWidth);
                        containerMovableDistance = parseInt(config.$container.width() - $("." + self.targetObj).width());
                        //没有到中部前,$container.width()不变

                        newContainerMarginLeft = Math.floor(parseInt(containerMovableDistance * newTotalBtnScollLeft / scrollBtnMovableDistance));
                    } else {
                        newContainerMarginLeft = 0;
                    }
                    //刻度条容器和刻度的left值
                    config.$container.css("margin-left", parseInt(-newContainerMarginLeft));
                    config.$ruler.css("left", newContainerMarginLeft);

                    //更新canvas画布
                    drawCanvas(newContainerMarginLeft);
                    return false;
            };
            $(document)[0].onmouseup = function(e) {
                config.$sliderBarMiddle.removeClass("now");
                $('body').css({cursor:"default"});
                $(document)[0].onmousemove = null;
            };
        });
    }
    //改变精度
    function changeFramePerPixel(diff_move,old_fpp,oldtotalScrollWidth,oldTotalBtnScollLeft,old_marginLeft){
        var config=self.config;
        var targetObj = self.targetObj;
        var middlePos=($("." + self.targetObj).width()/2);
        var scale;
        var offset;
        if(diff_move>0){
            if(config.max_fpp===old_fpp){
                offset=0;
            }else{
                scale=(config.$sliderTrack.width()-oldtotalScrollWidth)/((config.max_fpp/old_fpp)-1);
                offset=diff_move/scale;
            }

            newTotalBtnScollLeft=oldTotalBtnScollLeft-diff_move;
            newtotalScrollWidth=oldtotalScrollWidth+2*diff_move;
            config.framePerPixel=old_fpp*(offset+1);

            if(newTotalBtnScollLeft<=0){
                newTotalBtnScollLeft=0;
            }
            if(oldTotalBtnScollLeft+oldtotalScrollWidth+diff_move>=$("." + self.targetObj).width()){
                newTotalBtnScollLeft=oldTotalBtnScollLeft-diff_move;
                newtotalScrollWidth=config.$sliderTrack.width()-newTotalBtnScollLeft;
            }
            if(newtotalScrollWidth>=config.$sliderTrack.width()){
                newtotalScrollWidth=config.$sliderTrack.width();
                config.framePerPixel=config.max_fpp;
            }

            letFramePerPixelValid(config.framePerPixel);
        }
        else if(diff_move<0){
            if(config.min_fpp===old_fpp){
                offset=0;
            }else{
                scale=(oldtotalScrollWidth-(2*scrollRightWidth+8))/((old_fpp/config.min_fpp)-1);
                offset=diff_move/scale;
            }

            newTotalBtnScollLeft=oldTotalBtnScollLeft-diff_move;
            newtotalScrollWidth=oldtotalScrollWidth+2*diff_move;
            config.framePerPixel=old_fpp/(-offset+1);

            if(newtotalScrollWidth<=(2*scrollRightWidth+8)){
                newtotalScrollWidth=(2*scrollRightWidth+8);
                offset=0;
                newTotalBtnScollLeft=oldTotalBtnScollLeft-((2*scrollRightWidth+8)-oldtotalScrollWidth/2);
                config.framePerPixel=config.min_fpp;
            }

            letFramePerPixelValid(config.framePerPixel);

        }else{
           config.framePerPixel=old_fpp;
           letFramePerPixelValid(config.framePerPixel);
        }

        var middlePos=Math.floor($("." + self.targetObj).width()/2);
        //改变帧率
        var s=getUnitInfo(config.framePerPixel);
        zoomRulerConfig(s.smallScaleFrame,s.smallScaleNumsPerLargeScale,config.framePerPixel);

        //改变容器宽
        newContainerWidth=Math.floor(config.maxTime/config.framePerPixel);

        if(newContainerWidth<=$("." + self.targetObj).width()){
            newContainerWidth=$("." + self.targetObj).width();
        }

        //改变容器left
        if(self.currTime!=0){
            currPos=Math.floor(parseInt(self.currTime/config.framePerPixel));
            newContainerMarginLeft=currPos-middlePos;
            newTotalBtnScollLeft=newContainerMarginLeft*scrollBtnMovableDistance/containerMovableDistance;
            if(newTotalBtnScollLeft>=scrollBtnMovableDistance){
                newTotalBtnScollLeft=scrollBtnMovableDistance;
                newContainerMarginLeft=containerMovableDistance;
            }
            if(isNaN(newTotalBtnScollLeft)){
                newContainerMarginLeft=0;
                newTotalBtnScollLeft=0;
            }
        }else{
            newContainerMarginLeft = Math.floor(containerMovableDistance * newTotalBtnScollLeft / scrollBtnMovableDistance);
        }

        if(isNaN(newContainerMarginLeft)||newContainerMarginLeft<=0){
            newContainerMarginLeft=0;
            newTotalBtnScollLeft=0;
        }

        //重新滚动条
        config.$sliderBar.css('width',newtotalScrollWidth);
        config.$sliderBar.css('left',newTotalBtnScollLeft);
        config.$sliderBarMiddle.css('width',newtotalScrollWidth-2*scrollRightWidth);
        config.$sliderBarRight.css('left',newtotalScrollWidth-scrollRightWidth);

        //重新计算刻度容器
        config.$container.css("margin-left", -newContainerMarginLeft);
        config.$container.css("width", newContainerWidth);
        config.$ruler.css("left", newContainerMarginLeft);

        //更新canvas画布
        drawCanvas(newContainerMarginLeft);
        //更新计算游标位置和出入点
        self.fixArrowCurrentTime(self.currTime);
        self.fixTrimInByCurrentTime(self.trimInCurrTime);
        self.fixTrimOutByCurrentTime(self.trimOutCurrTime);

    }
    //让帧率再合适的范围
    function letFramePerPixelValid(fpp){
        var config=self.config;
        var targetObj = self.targetObj;

        var _max1=25*60.0*60*10.0/80;
        var _max2=config.maxTime/$("." + self.targetObj).width();
        var _max=Math.min(_max1,_max2);
        if(fpp<config.min_fpp){
            fpp=config.min_fpp;
        }
        else if(fpp>_max){
            fpp=_max;
        }
    }
    /*关于重新渲染配置开始*/
    function zoomRulerConfig(_smallScaleFrame,_smallScaleNumsPerLargeScale,_framePerPixel){
        var config = self.config;
        config.smallScaleFrame = _smallScaleFrame;
        config.smallScaleNumsPerLargeScale = _smallScaleNumsPerLargeScale;
        config.framePerPixel = _framePerPixel;
        self.updateRuler(config);
    }
    return constructor;
}();
/*------绑定事件开始------*/
PLAYER.EventUtil = {
    addHandler: function(element, type, handler) {
        // 标准方法
        if (element.addEventListener) {
            // false表示冒泡
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, handler);
        } else {
            // Dom0级事件
            element['on' + type] = handler;
        }
    },
    removeHandler: function(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler);
        } else if (element.detachEvent) {
            element.detachEvent('on' + type, handler);
        } else {
            // Dom0级移除事件
            element['on' + type] == null;
        }
    },
    // 获取事件IE和w3c的不同
    getEvent: function(event) {
        return event ? event : window.event;
    },
    // 事件的目标,就是指点在哪里
    getTarget: function(event) {
        return event.target || event.srcElement;
    },
    preventDefault: function(event) {
        if (event.preventDefault) {
            // 阻止默认行为
            event.preventDefault();
        } else {
            // IE阻止默认行为
            event.returnValue = false;
        }
    },
    stopPropagation: function(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            // IE取消冒泡
            event.cancelBubble = true;
        }
    },
    // 已经兼容了IE8和以下浏览器
    getPageX: function(event) {
        var pagex = 0;

        if (event.pageX === undefined) {
            pagex = event.clientX +
                (document.documentElement.scrollLeft || document.body.scrollLeft);

        } else {
            pagex = event.pageX;
        }
        return pagex;

    },
    getPageY: function(event) {
        var pagey = 0;
        if (event.pageY === undefined) {
            pagey = event.clientY +
                (document.documentElement.scrollTop || document.body.scrollTop);
        } else {
            pagey = event.pageY;
        }
        return pagey;
    },
    getRelatedTarget: function(event) {
        if (event.relatedTarget) {
            return event.relatedTarget;
        } else if (event.toElement) {
            return event.toElement;
        } else if (event.fromElement) {
            return event.fromElement;
        } else {
            return null;
        }
    },
    getButton: function(event) {
        // IE和其他浏览器都有button属性
        if (document.implementation.hasFeature('MouseEvent', '2.0')) {
            // 0,1,2分别是左中右鼠标键
            return event.button;
        } else {
            switch (event.button) {
                /*合并操作*/
                // IE中的
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 2:
                case 6:
                    return 2;
                case 4:
                    return 1;

            }
        }
    },
    getWheelDelta: function(event) {
        // 向上滚蛋为+120，向下滚动为-120
        if (event.wheelDelta) {
            // IE和其他浏览器支持mousewheel事件
            return (client.engine.opera && client.engine.opera < 9.5) ? -event.wheelDelta : event.wheelDelta;
        } else {
            // 火狐支持一个DOMMouseScroll事件
            return -event.detail * 40;
        }
    },
    getKeyCode:function(event){
        return  event.keyCode || event.which || event.charCode;
    },
    getCharCode: function(event) {
        if (typeof event.charCode == 'number') {
            return event.charCode;
        } else {
            return event.keyCode;
        }
    },
    getClipboardText:function(event){
        var clipboardData=(event.clipboardData||window.clipboardData);
        return clipboardData.getData('text');
    },
    setClipboardText:function(event,value){
        if(event.clipboardData){
            return event.clipboardData.setData('text/plain',value);
        }else if(window.clipboardData){
            return window.clipboardData.setData('text',value);
        }
    }
};
/*------键盘事件开始------*/
PLAYER.documentEvent=function(){
    var keyTarget=new PLAYER.EventTarget();
    var keyElem=null;

    function handleEvent(event){
        event=PLAYER.EventUtil.getEvent(event);
        var target=PLAYER.EventUtil.getTarget(event);
        switch(event.type){
            case 'keydown':
                keyElem=target;
                if(target.nodeName!=='INPUT' && target.nodeName!=='input' && target.nodeName!=='TEXTAREA' && target.nodeName!=='textarea'){
                    keyTarget.fire({
                        type:'keydown',
                        target:keyElem,
                        code:event.keyCode,
                        shift:event.shiftKey,
                        ctrl:event.ctrlKey
                    });
                }

            break;
        }
    }
    keyTarget.enable=function(keyNum){
        PLAYER.EventUtil.addHandler(document,'keydown',handleEvent);
    };
    keyTarget.disable=function(){
        PLAYER.EventUtil.removeHandler(document,'keydown',handleEvent);
    };
    return keyTarget;
}();
/*------毫秒转化时间------*/
PLAYER.$millisecondsToTimeFrame = function(milliseconds) {
    var hour = parseInt(milliseconds / (60 * 60 * 1e3));
    var minutes = parseInt((milliseconds - hour * 60 * 60 * 1e3) / (60 * 1e3));
    var second = parseInt((milliseconds - hour * 60 * 60 * 1e3 - minutes * 60 * 1e3) / 1e3);
    var minsSecond = Math.round((milliseconds - hour * 60 * 60 * 1e3 - minutes * 60 * 1e3 - second * 1e3) / (1e3 / 25));
    if (minsSecond == 25) {
        second += 1;
        minsSecond = 0;
    }
    if (hour < 10) hour = "0" + hour;
    if (minutes < 10) minutes = "0" + minutes;
    if (second < 10) second = "0" + second;
    if (minsSecond < 10) minsSecond = "0" + minsSecond;
    var result = hour + ":" + minutes + ":" + second + ":" + minsSecond;
    return result;
};
/*------判断播放器播放------*/
PLAYER.checkPlaying=function(){
    if(PLAYER.isPlaying){
        PLAYER.OCX.doPause();
        PLAYER.isPlaying=false;
        $("#js_play").removeClass("stop")
        $("#js_play").attr("title", "播放");
    }
};
PLAYER.showSubititleEdit=function(){
    $('#js_subtitile_edit_wrap').show();
    $('#js_subtitle_header_btn').on('click',function(){
        PLAYER.hideSubititleEdit();
    });
    $('#js_pageCover_subtitle').show();
}
PLAYER.hideSubititleEdit=function(){
    $('#js_subtitile_edit_wrap').hide();
    $('#js_pageCover_subtitle').hide();
    $('#js_dragger_subtitle_wrap').remove();

    $('.conetent_tabs1 .subtitle_h_form').empty();
    $('.conetent_tabs2 .subtitle_h_form').empty();
}
PLAYER.hideEffectEdit=function(){
    $('#js_carve_edit').hide();
    $('#js_carve').removeClass('col-md-4').addClass('col-md-6');
    $('#js_effect_h_form').empty();
    $('#move_box').remove();
    $('.edit_box').removeClass('onselected');
}
PLAYER.genNonDuplicateID=function(randomLength){
    return Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36);
}
//帧转时间串
PLAYER.getDurationToString=function(duration){
    var hour = parseInt(duration / (3600 * 25));
    var hourstr = hour+"";
    if (hour < 10)
        hourstr = "0" + hour;

    duration = duration - hour * 3600 * 25;
    var minite = parseInt(duration / (60 * 25));
    var minitestr = minite+"";
    if (minite < 10)
        minitestr = "0" + minite;

    duration = duration - minite * 60 * 25;
    var second = parseInt(duration / 25);
    var secondstr = second+"";
    if (second < 10)
        secondstr = "0" + second;

    duration = duration - second * 25;
    var frame =  duration;
    var framestr = frame+"";
    if (frame < 10)
        framestr = "0" + frame;
    return hourstr + ":" + minitestr + ":" + secondstr + ":" + framestr;
};
//时间戳换算成日期
PLAYER.getLocalTime=function(nows) {
    if(!nows){
        return '';
    }
    function add0(m){return m<10?'0'+m:m };
    var time = new Date(nows);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
};
//帧转纳米
PLAYER.ffToNm=function(ff){
    return ff*40;
}
PLAYER.nmToFf=function(ff){
    return (ff/40);
}
//单例设计模式
PLAYER.singelton=function(fn){
    var result;
    return function(){
        return result || (result=fn.apply(this,arguments));
    }
};

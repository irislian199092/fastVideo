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
                console.log('shuzu',PLAYER.TR.config.seekComandTimesMonitor);
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
        }, 50); 
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
        }, 50);
    }    
    constructor.prototype={
        play:function(){//点击播放暂停
            if(PLAYER.isPlaying){
                PLAYER.OCX.doPause();
                $("#js_play").removeClass("stop")
                $("#js_play").attr("title", "播放");
                PLAYER.isPlaying=false; 
            }else{
                PLAYER.OCX.doPlay(40*parseInt(PLAYER.PTR.currTime), 100000000000);
                $("#js_play").addClass("stop")
                $("#js_play").attr("title", "停止");
                PLAYER.isPlaying=true;
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
        toolbar_nextSelect:function(){//工具条向后选择(shift+g)
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
                $('#js_toolbar_icon_ungroup').addClass('active');
                $('#js_toolbar_icon_ungroup').siblings().removeClass('active');

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
                $('#js_toolbar_icon_group').addClass('active');
                $('#js_toolbar_icon_group').siblings().removeClass('active');
                
                $('#js_time_ruler_bar_box .onselected').each(function(i,n){
                    var time=$(n).attr('data-time');
                    var attr={
                        interleaved:true
                    }
                    PLAYER.operateJson.updateClipAttr(attr,time);

                    $(n).attr('data-interleaved',true);
                });
            }
            console.log('编组',PLAYER.jsonObj.rootBin.sequence[0].tracks);
        }  
    } 
    //设置播放暂停
    function setPlayer(){ 
        var timer=setInterval(function(){
            var lastFrame=PLAYER.operateJson.getLastFrame();//拖拽素材时候的最后一帧
            //var db_lastFrame=PLAYER.PTR.config.maxTime;     //双击素材时候的最后一帧
            if(PLAYER.loadState&&PLAYER.isPlaying){
                var s=PLAYER.OCX.getPosition();
                if(!PLAYER.dbClick){
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
                }else{
                    if(s>db_lastFrame){
                        s=0;
                    }
                    if(s===db_lastFrame){
                        PLAYER.OCX.doPause();
                        PLAYER.isPlaying=false; 
                        $("#js_play").removeClass("stop")
                        $("#js_play").attr("title", "播放"); 
                        clearInterval(timer);  
                    }
                }
                PLAYER.PTR.fixArrowCurrentTime(s);
                PLAYER.PTR.currTime=s;
                $('#js_time_ruler_title_nowTime').html(PLAYER.getDurationToString(PLAYER.TR.currTime));
            }
        },10);

        /*setTimeout(function(){
            var s=PLAYER.OCX.getPosition();
           
            if(PLAYER.dbClick){
                PLAYER.PTR.fixArrowCurrentTime(s);
                PLAYER.PTR.currTime=s;
            }else{
                PLAYER.PTR.fixArrowCurrentTime(s);
                PLAYER.PTR.currTime=s;
                PLAYER.TR.fixArrowCurrentTime(s);
                PLAYER.TR.currTime=s; 
                $('#js_time_ruler_title_nowTime').html(PLAYER.getDurationToString(PLAYER.TR.currTime));
            }
            
            if(PLAYER.loadState&&PLAYER.isPlaying&&s!==lastFrame){
                setTimeout(arguments.callee,40);
            }else{
                PLAYER.OCX.doPause();
                $("#js_play").removeClass("stop")
                $("#js_play").attr("title", "播放");
                PLAYER.isPlaying=false; 
            }
        },40);*/    
    }
    //设置vu表
    function setVuInfo(){
        setTimeout(function(){
            var str = PLAYER.OCX.getVUMeterInfo();
            if(str){
                drawVoiceTable(str.split(","),true);
            }
            if(PLAYER.loadState&&PLAYER.isPlaying){
                if(str!=""){
                   setTimeout(arguments.callee,100); 
                }else{
                    drawVoiceTable("",false)
               }
            } 
        },100); 
        function drawVoiceTable(arr,isDraw){  
            var c1 = document.getElementById("js_voCanvas"); 
            var _h=$("#js_time_ruler_voiceBox").height()-21;  
            if(c1.getContext('2d')){  
                var ctx = c1.getContext("2d");  
                ctx.clearRect(0,0,100,500)
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
                PLAYER.TR.initTime();
                PLAYER.PTR.initTime();
                PLAYER.OCX.seek(0);
                PLAYER.player.play();
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
            try {
                var jsonObj = {
                    command: "pause",
                    params: {
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
                console.log();
            } catch (e) {
                console.log('停止失败！');
                return;
            } 
        },
        getPosition:function() {//return 0;
            try {
                return PLAYER.nmToFf(PLAYER.currentTime);
            } catch (e) {
                console.log('获取当前时码时出错！');
            }
        },
        seek:function(point){
            try {
                console.log('point',point)
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
                return form1.TestActiveX.GetVUMeterInfo();
            } catch (e) {
                console.log('error');
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
        console.log('sendJson',PLAYER.jsonObj.rootBin.sequence[0]);
        PLAYER.OCX.updateProjectJson(PLAYER.jsonObj);
        PLAYER.OCX.seek(parseInt(PLAYER.TR.currTime)); 
    },
    translateFfpToMS:function(json){
        var json=JSON.parse(json);
        var pWidth;
        //转换帧到毫秒
        for (var i = 0,track; track=json.rootBin.sequence[0].tracks[i++];) {
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
                }
            });  
        }
        for (var i = 0,mas; mas=json.reference.material[i++];) {
            mas.duration=40*mas.duration;
        }
        //添加播放器宽高
        if(json.height==='576'&&json.width==='720'){
            pWidth=parseFloat(1.25*$('#ocx').height());
        }else{
            pWidth=parseFloat((16*$('#ocx').height()/9));  
        }
        json.pHeight=$('#ocx').height();
        json.pWidth=pWidth;
        
        return json;
    },
    addVideoClipAttr:function(subClipAttr,_index){
        for (var i = 0,track; track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i++];) {
            if(track.type==='v'&&track.index===_index){
               track.subclip.push(subClipAttr);
            }
        }
    },
    addAudioClipAttr:function(subClipAttr,_index){
        for (var i = 0,track; track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i++];) {
            if(track.type==='a'&&track.index===_index){
               track.subclip.push(subClipAttr);
            }
        }
    },
    addSubtitleClipAttr:function(subClipAttr,_index){
        for (var i = 0,track; track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i++];) {
            if(track.type==='t'&&track.index===_index){
                track.subclip.push(subClipAttr);
            }
        }
    },
    getSubtitleClip:function(time,_index){
        var arr=null;
        for (var i = 0,track; track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i++];) {
            if(track.type==='t'&&track.index===_index){
                $.each(track.subclip,function(i,n){
                    if(n && n.createTime===time){
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
        for (var i = 0,track; track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i++];) {
            if(track.type==='t'&&track.index===_index){
                $.each(track.subclip,function(i,n){
                    if(n && n.createTime===time){
                        
                        n.abs.left_value=moveX;
                        n.abs.top_value=moveY;

                        $.extend(n.pixel,jsonObj.attr);
                        $.extend(n.pixel,jsonObj.attr);
                    }
                }); 
            }
        }

        console.log('更新字幕',PLAYER.jsonObj.rootBin.sequence[0].tracks);
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
        for (var i = 0,track; track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i++];) {
            track.subclip.sort(comparison('sequenceTrimIn'));
        } 
    },
    addProjectMaterial:function(materialAttr){
        if(PLAYER.jsonObj.reference.material.length===0){
            PLAYER.jsonObj.reference.material.push(materialAttr);
        }else{
            $.each(PLAYER.jsonObj.reference.material,function(i,n){
                if(materialAttr.assetId===n.assetId){
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
        for (var i = 0,track; track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i++];) {
            $.each(track.subclip,function(index,elem){
                if(elem){
                    if(elem.createTime===time){
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
        for (var i = 0,track; track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i++];) {
            $.each(track.subclip,function(i,n){
                if(n){
                    if(n.createTime===time){
                        obj=JSON.stringify(track.subclip[i]);
                        track.subclip.splice(i,1);
                    }
                }
            });   
        }
        for (var i = 0,track; track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i++];) {
            if(track.type===type&&track.index===index){
                track.subclip.push(JSON.parse(obj));
            } 
        }  
    },
    deleteClipAttr:function(time){
        for (var i = 0,track; track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i++];) {
            
            $.each(track.subclip,function(index,elem){
                if(elem){
                    if(elem.createTime===time){
                        track.subclip.splice(index,1);
                    }
                }
                
            });  
        } 
    },
    checkCoverEvent:function(dragging,intid){
        var config=PLAYER.TR.config;
        var add_subclip;        //新增的切片对象
        var add_subclip_attr;   //新增的切片对象属性
        var s0_in= parseInt(dragging.attr('data-sequencetrimin'));
        var s0_out= parseInt(dragging.attr('data-sequencetrimout'));
        var t0_in= parseInt(dragging.attr('data-trimin'));
        var t0_out= parseInt(dragging.attr('data-trimout'));

        $.each(dragging.siblings(),function(i,n){
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

                    subClipAttr={
                        sequenceTrimIn:s0_out,
                        sequenceTrimOut:sn_out,
                        trimIn: tn_out-sn_out+s0_out,
                        trimOut:tn_out,
                    }
                    PLAYER.operateJson.updateClipAttr(subClipAttr,time);
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
                    var _createTime=v_type+'_'+PLAYER.genNonDuplicateID(12);

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
                    if(add_subclip.find('.effect_box_r')){
                        v_target.find('.effect_box_r').remove();
                    }
                    add_subclip.removeClass('onselected');
                    add_subclip.attr('data-trimin',vcut_trimIn);
                    add_subclip.attr('data-trimout',vcut_trimOut);
                    add_subclip.attr('data-sequencetrimin',vcut_sequenceTrimIn);
                    add_subclip.attr('data-sequencetrimout',vcut_sequenceTrimOut);
                    add_subclip.attr('data-time',_createTime);
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
                                }else{
                                    e_attr.splice(i,1);
                                }
                            });
                        }
                        add_subclip_attr={
                            "assetID": v_dataId,
                            "trimIn": vcut_trimIn,
                            "trimOut":vcut_trimOut,
                            "sequenceTrimIn": vcut_sequenceTrimIn,
                            "sequenceTrimOut":vcut_sequenceTrimOut,
                            "effect":e_attr,
                            "type":v_type,
                            "createTime":_createTime,
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
                            "assetID": v_dataId,
                            "trimIn": vcut_trimIn,
                            "trimOut":vcut_trimOut,
                            "sequenceTrimIn": vcut_sequenceTrimIn,
                            "sequenceTrimOut":vcut_sequenceTrimOut,
                            "volume":100,
                            "type":v_type,
                            "createTime":_createTime,
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
                            "createTime":_createTime,
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
    getAllsequenceTrimIn:function(dragging,time){
        //获取要吸附的素材
        var _s;
        var s_point=parseInt(dragging.attr('data-sequencetrimin'));
        
        if(time){
            $.each(dragging.siblings(),function(i,n){
                if($(n).attr('data-time')===time){
                    dragging.siblings().splice(i,1);
                }
            });
        }
        

        dragging.siblings().each(function(){
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
    getAllsequenceTrimOut:function(dragging){
        //获取要吸附的素材
        var _s;
        var s_point=parseInt(dragging.attr('data-sequencetrimout'));
        dragging.siblings()

        dragging.siblings().each(function(){
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
    getAllsiblingsWidth(dragging){
        var _s=[];
        $.each(dragging.siblings(),function(i,n){
            _s.push(parseInt($(n).css('left'))+parseInt($(n).css('width')));
        });
        return _s;
    },
    getAllsiblingsLeft(dragging){
        var _s=[];
        $.each(dragging.siblings(),function(i,n){
            _s.push(parseInt($(n).css('left')));
        });
        return _s;
    },
    showAdhere:function(dragging,dir){
        dragging.find('.point').remove();
        var _line=$('<div class="point"></div>');
        if(dir==='forward'){
            _line.css('left',-5);
        }
        if(dir==='backward'){
           _line.css('left',(dragging.width()-5));
        }
        _line.appendTo(dragging);
    },
    hideAdhere:function(dragging){
        if(dragging.find('.point')){
            dragging.find('.point').remove();
            $('.time_ruler_line').hide();
        }  
    },
    chooseInterleavedElem:function(dragging){
        var element=null;
        var arr=[];
        var time=dragging.attr('data-time');
        var intid=dragging.attr('data-intid');
        $.each($('.edit_box'),function(i,n){
            if($(this).attr('data-interleaved')==='true' && $(this).attr('data-intid')===intid){
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
    mouseUpState:function(dragging,groupId){//点击或者mouseup事件状态
        if(PLAYER.keyNum!==17){
            $('#js_time_ruler_bar_box .draggable').removeClass('onselected');
            $('#js_time_ruler_bar_box .draggable').removeClass('zoomRight');
            $('#js_time_ruler_bar_box .draggable').removeClass('zoomLeft');
        }
        dragging.attr('data-group',groupId);
        dragging.removeClass('changeHelp');
        dragging.addClass('onselected');
        dragging.css('opacity','1');
        dragging.css('boxShadow','none');
        dragging.css('z-index',10);
        dragging.css('cursor','default');
        PLAYER.operateJson.hideAdhere(dragging);
        if(dragging.attr('data-interleaved')==="true"){
            $.each(PLAYER.operateJson.chooseInterleavedElem(dragging),function(i,n){
                n.removeClass('changeHelp');
                n.attr('data-group',groupId);
                n.addClass('onselected');
                n.css('opacity','1');
                n.css('z-index',10);
                n.css('boxShadow','none');
                n.css('cursor','default');
                PLAYER.operateJson.hideAdhere(n);
            });
        }
    },
    checkNoClip:function(){
        for (var i = 0,track; track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i++];) {
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
        if(obj!==null){
            return obj;
        }
    },
    checkNextSubClip:function(s_out){
        var obj=null;
        $('.edit_box_v').each(function(i,n){
            if(parseInt($(n).attr('data-sequencetrimin'))===s_out){
                obj=$(n);
            }
        });
        if(obj!==null){
            return obj;
        }
    },
    addEffectClip:function(time,obj){
        for (var i = 0,track; track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i++];) {

            if(track.type==='v'){
                $.each(track.subclip,function(index,elem){
                    if(elem){
                        if(elem.createTime===time){
                            track.subclip[index].effect.push(obj);
                        }
                    }
                }); 
            }
        } 
    },
    getEffectClip:function(time){
        var arr=null;
        for (var  i = 0,track; track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i++];) {
            $.each(track.subclip,function(index,elem){
                if(elem && elem.createTime===time && elem.effect){
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
    updateEffectClip:function(time,attr){
        for (var  i = 0,track; track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i++];) {
            $.each(track.subclip,function(index,elem){
                if(elem && elem.createTime===time && elem.effect){
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
    removeMosaicEffectClip:function(time){
        for (var  i = 0,track; track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i++];) {
            $.each(track.subclip,function(index,elem){
                if(elem && elem.createTime===time && elem.effect){
                    $.each(elem.effect,function(i,n){
                        if(n.type==='mosaic'){
                            elem.effect.splice(i,1);
                        }
                    });
                    
                }
            });   
        }
        console.log("删除马赛克等的切片",PLAYER.jsonObj.rootBin.sequence[0].tracks)
    },
    removeOtherEffectClip:function(time){
        for (var  i = 0,track; track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i++];) {
            $.each(track.subclip,function(index,elem){
                if(elem && elem.createTime===time && elem.effect){
                    elem.effect.forEach(function(n,i){
                        if(n.type==='fadeinout'||n.type==='flashwhite'||n.type==='flashwhite'){
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
    getMaterialDuration:function(id,callback){
        $.ajax({
            url:serverUrl+'program/info',
            data:{
                assetId:id
            },
            async:false,
            success:function(msg){
                if(msg.code===0&&msg.data!==null){
                    callback(msg.data.data);
                }else{
                    console.log('error');
                }
            }
        }); 
    },
    getSubtitleDuration:function(id,callback){
        //获取字幕
        var msg=PLAYER.subJsonTem[id];
        callback(msg);
    },
    getFirstFrame:function(){
        var arr=[];
        for (var i = 0,track; track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i++];) {
            $.each(track.subclip,function(index,elem){
                if(elem){
                    arr.push(track.subclip[index].sequenceTrimIn);
                }
            });   
        }
        if(arr.length!==0){
            var s=Math.min.apply(null,arr);
            return s; 
        }
    },
    getLastFrame:function(){
        var arr=[];
        for (var i = 0,track; track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i++];) {
            if(track.subclip.length!==0){
                $.each(track.subclip,function(i,n){
                    arr.push(n.sequenceTrimOut);
                });
            }
        }
        if(arr.length!==0){
            return Math.max.apply(null,arr);
        }
    },
    updateMaxDuration:function(maxDuration){
        PLAYER.jsonObj.rootBin.sequence[0].maxDuration=maxDuration;
    },
    updateRulerMaxTime:function(){
        //更新轨道最大时常
        var n=Math.max(PLAYER.TR.config.maxTime,PLAYER.operateJson.getLastFrame()+15000);
        PLAYER.TR.updateEvent(n);

        PLAYER.TR.fixClipWidth();
        //更新json最大时常
        PLAYER.operateJson.updateMaxDuration(n);
        //更新轨道最大时常
        PLAYER.PTR.config.maxTime=(PLAYER.operateJson.getLastFrame()||0);
        $('#js_player_totalTime').html(PLAYER.getDurationToString(PLAYER.operateJson.getLastFrame()||0));
        PLAYER.PTR.updateEvent(PLAYER.PTR.config);
    },
    getAudioIndex:function(time){
        var _index=0;
        $.each(PLAYER.jsonObj.rootBin.sequence[0].track[1].subclip,function(index,elem){
            if(elem.createTime===time){
                _index=index;
            }
        });
        return  _index;
    },
    getSubtitleTemp:function(id){
        var player_w=$('#ocx').width();
        var player_h=$('#ocx').height();
        var project_w=PLAYER.jsonObj.width;
        var project_h=PLAYER.jsonObj.height;
        
        PLAYER.subJsonTem={
            "subtitle_01":{
                "id":"subtitle_01",
                "name":'subtitle_01', 
                "duration":2000,               
                "trimIn":0,                         
                "trimOut":2000,
                "abs":{
                    left_value:parseInt(1400/project_w*player_w),
                    top_value:parseInt(40/project_h*player_h)
                },                                       
                "pixel":[
                    {
                        "x1": parseInt(1400/project_w*player_w),                      
                        "y1": parseInt(40/project_h*player_h),                       
                        "width": parseInt(300/project_w*player_w),                       
                        "height": parseInt(285/project_h*player_h),                       
                        "attr":{
                            "type":'images',
                            "url":'http://112.126.71.150:82/FastCarve/s1_01.png'
                        },
                        "attrID":'attrID_'+PLAYER.genNonDuplicateID(12)
                    },
                    {
                        "x1": parseInt(1400/project_w*player_w),                      
                        "y1": parseInt(360/project_h*player_h),                                       
                        "attr":{
                            "type":"fade",
                            "text":'NAME',
                            "fontFamily": 'PingFang Heavy',       
                            "fontSize":parseInt(54/project_h*player_h),                
                            "fillStyle":'#ffffff',    
                            "textAlign":'left',
                            "fadeInTime":1000,
                            "fadeOutTime":1000
                        },
                        "attrID":'attrID_'+PLAYER.genNonDuplicateID(12)
                    },
                    {
                        "x1": parseInt(1400/project_w*player_w),                      
                        "y1": parseInt(410/project_h*player_h),                                       
                        "attr":{
                            "type":"fade",
                            "text":'hellp',
                            "fontFamily":'PingFang Regular',       
                            "fontSize":parseInt(40/project_h*player_h),          
                            "fillStyle":'#ffffff',    
                            "textAlign":'left',
                            "fadeInTime":1000,
                            "fadeOutTime":1000
                        },
                        "attrID":'attrID_'+PLAYER.genNonDuplicateID(12)
                    }
                ]    
            },
            /*"subtitle_02":{
                "id":"subtitle_02",
                "name":'subtitle_02', 
                "duration":2000,               
                "trimIn":0,                         
                "trimOut":2000, 
                "top":0,                                         
                "pixel":[
                    {
                        "x1": parseFloat(550/project_w*player_w),                      
                        "y1": parseFloat(415/project_h*player_h),                                       
                        "attr":{
                            "type":"fade",
                            "text":'NAME',
                            "fontFamily": 'PingFang Medium',       
                            "fontSize":parseFloat(74/project_h*player_h),                
                            "fillStyle":'#ffffff',    
                            "textAlign":'left',
                            "fadeInTime":1000,
                            "fadeOutTime":1000
                        } 
                    },
                    {
                        "x1": parseFloat(550/project_w*player_w),                      
                        "y1": parseFloat(515/project_h*player_h),                                       
                        "attr":{
                            "type":"fade",
                            "text":'hellp',
                            "fontFamily":'造字工房力黑(非商用)常规体',       
                            "fontSize":parseFloat(112/project_h*player_h),                
                            "fillStyle":'#ffffff',    
                            "textAlign":'left',
                            "fadeInTime":1000,
                            "fadeOutTime":1000
                        } 
                    }
                ]    
            },
            "subtitle_03":{
                "id":"subtitle_03",
                "name":'subtitle_03', 
                "duration":2000,               
                "trimIn":0,                         
                "trimOut":2000,
                "top":0,                                            
                "pixel":[
                    {
                        "x1": parseFloat(75/project_w*player_w),                      
                        "y1": parseFloat(818/project_h*player_h),                       
                        "width": parseFloat(710/project_w*player_w),                       
                        "height": parseFloat(150/project_h*player_h),                       
                        "attr":{
                            "type":'images',
                            "url":'http://112.126.71.150:82/FastCarve/s3_01.png'
                        }
                    },
                    {
                        "x1": parseFloat(94/project_w*player_w),                      
                        "y1": parseFloat(745/project_h*player_h),                                       
                        "attr":{
                            "type":"fade",
                            "text":'NAME',
                            "fontFamily": 'PingFang Heavy',       
                            "fontSize":parseFloat(102/project_h*player_h),               
                            "fillStyle":'#ffffff',    
                            "textAlign":'left',
                            "fadeInTime":1000,
                            "fadeOutTime":1000
                        } 
                    },
                    {
                        "x1": parseFloat(94/project_w*player_w),                      
                        "y1": parseFloat(875/project_h*player_h),                                       
                        "attr":{
                            "type":"fade",
                            "text":'hellp',
                            "fontFamily":'PingFang Regular',       
                            "fontSize":parseFloat(102/project_h*player_h),          
                            "fillStyle":'#ffffff',    
                            "textAlign":'left',
                            "fadeInTime":1000,
                            "fadeOutTime":1000
                        } 
                    }
                ]    
            },*/

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

        this.DragDrop.addHandler('clipMouseover',handleClipMouseoverEvent);

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
            console.log('3')
            self.currTime=time;
            $('#js_time_ruler_title_nowTime').html(PLAYER.getDurationToString(self.currTime));
            config.$cursor.css("left",currPos);
        },
        fixTrimInByCurrentTime: function(time) {
            var config = this.config;
            this.trimInCurrTime = time;
            trimInCurrPos = this.trimInCurrTime /config.framePerPixel;
            trimOutCurrPos = this.trimOutCurrTime/config.framePerPixel;
            
            if(PLAYER.keyNum===73&&this.trimInCurrTime===0){
                trimOutCurrPos = config.maxTime/config.framePerPixel;
                this.trimOutCurrTime=config.maxTime;
                trimOutCurrPos = parseInt(trimOutCurrPos*config.framePerPixel)/config.framePerPixel; 
            }
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
            $.each($('.onselected'),function(i,n){
                v0_sequenceTrimIn=parseInt($(n).attr('data-sequencetrimin'));
                v0_sequenceTrimOut=parseInt($(n).attr('data-sequencetrimout'));

                if(v0_sequenceTrimIn<currFrame&&v0_sequenceTrimOut>currFrame){
                    //执行函数
                    cutSubclip($(n),intId);
                    function cutSubclip(v_target,intId){
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
                        var v_index=parseInt(v_target.parent('.time_ruler_bar').attr('data-index'));
                        var v_class=v_target.attr('class');
                        var v_type=v_target.attr('data-type');
                        var v_offsetLeft=parseInt(v_target.offset().left);
                        //切后素材属性
                        var add_subclip;
                        var add_subclip_attr;
                        var _createTime=v_type+'_'+PLAYER.genNonDuplicateID(12);

                        //加状态
                        PLAYER.checkPlaying();
                        v_target.css('cursor','url(images/cur/cut.cur),default');
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
                        
                        add_subclip.removeClass('onselected');
                        add_subclip.attr('data-trimin',vcut_trimIn);
                        add_subclip.attr('data-trimout',vcut_trimOut);
                        add_subclip.attr('data-sequencetrimin',vcut_sequenceTrimIn);
                        add_subclip.attr('data-sequencetrimout',vcut_sequenceTrimOut);
                        add_subclip.attr('data-time',_createTime);
                        add_subclip.attr('data-intid',intId);

                        add_subclip.css('width',(vcut_sequenceTrimOut-vcut_sequenceTrimIn)/config.framePerPixel);
                        add_subclip.css('left',vcut_sequenceTrimIn/config.framePerPixel);
                        
                        v_target.parent('.time_ruler_bar').append(add_subclip);
                        
                        if(v_target.parent('.time_ruler_bar').hasClass('bar_v')){
                            var e_attr=PLAYER.operateJson.getCutNewEffectClip(v_dataTime,vcut_trimIn,vcut_trimOut);
                            add_subclip_attr={
                                "assetID": v_dataId,
                                "trimIn": vcut_trimIn,
                                "trimOut":vcut_trimOut,
                                "sequenceTrimIn": vcut_sequenceTrimIn,
                                "sequenceTrimOut":vcut_sequenceTrimOut,
                                "effect":e_attr,
                                "createTime":_createTime,
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
                                "assetID": v_dataId,
                                "trimIn": vcut_trimIn,
                                "trimOut":vcut_trimOut,
                                "sequenceTrimIn": vcut_sequenceTrimIn,
                                "sequenceTrimOut":vcut_sequenceTrimOut,
                                "volume":100,
                                "createTime":_createTime,
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
                                "createTime":_createTime,
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
                var newLeft=$(n).attr('data-sequencetrimin')/config.framePerPixel;
                $(n).width(newWidth);
                $(n).css('left',newLeft);
                self.fixEffectWidth($(n));
            });
            $.each($('.edit_box_a'),function(i,n){
                var newWidth=($(n).attr('data-trimout')-$(n).attr('data-trimin'))/config.framePerPixel;
                var newLeft=$(n).attr('data-sequencetrimin')/config.framePerPixel;
                $(n).width(newWidth);
                $(n).css('left',newLeft);
            });
            $.each($('.edit_box_t'),function(i,n){
                var newWidth=($(n).attr('data-sequencetrimout')-$(n).attr('data-sequencetrimin'))/config.framePerPixel;
                var newLeft=$(n).attr('data-sequencetrimin')/config.framePerPixel;
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
            var helpElem=null; 
            var helpElem_init=null; 
            //游标
            var cursoring=null;
            var offsetX=0;

            var arr_left=[]; //存储编组切片的left值
            var arr_sOut=[];//存储编组切片的right值
            var min_left=0;//存储编组切片的最小left值
            var max_sOut=0;//存储编组切片的最大left+width值

            var groupId='group_id_'+genNonDuplicateID(12);

            function genNonDuplicateID(randomLength){
                return Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36);
            }
            function handleEvent(event){
                event=PLAYER.EventUtil.getEvent(event);
                var target=PLAYER.EventUtil.getTarget(event);
                switch(event.type){
                    case 'mousedown':
                        if(target.className.indexOf('draggable')>-1){
                            PLAYER.EventUtil.preventDefault(event);
                            PLAYER.clickOrMove=false;
                            initClientX=event.clientX;

                            v0_dragging=$(target);
                            var initid='interleaved_id_'+PLAYER.genNonDuplicateID(12);
                            
                            var v0_attr=getDragInfo(v0_dragging,event);
                            v0_dragging.attr('data-initattr',JSON.stringify(v0_attr));

                            var v0_dir=getClipDir(v0_attr);
                            v0_dragging.attr('data-clipdir',v0_dir);

                            helpElem=v0_dragging.clone().addClass('changeHelp').removeClass('onselected').attr('data-intid',initid);

                            arr_left.push(v0_attr.clipInitLeft);
                            arr_sOut.push(v0_attr.clipInitSequenceTrimOut);


                            dragdrop.fire({
                                type:'clipDragstart',
                                target:v0_dragging,
                                x:event.clientX,
                                y:event.clientY
                            });
                            
                            if(v0_dragging.attr('data-interleaved')==="true"){
                                for (let  i = 0,dragging; dragging=PLAYER.operateJson.chooseInterleavedElem(v0_dragging)[i++];) {

                                    dragging.attr('data-initattr',JSON.stringify(getDragInfo(dragging,event)));
                                    dragging.attr('data-clipdir',v0_dir);
                                    helpElem_init=dragging.clone().addClass('changeHelp').removeClass('onselected').attr('data-intid',initid);

                                    arr_left.push(getDragInfo(dragging,event).clipInitLeft);
                                    arr_sOut.push(getDragInfo(dragging,event).clipInitSequenceTrimOut);

                                    dragdrop.fire({
                                        type:'clipDragstart',
                                        target:dragging,
                                        x:event.clientX,
                                        y:event.clientY
                                    });
                                }
                            }
                            min_left=Math.min.apply(null,arr_left);
                            max_sOut=Math.max.apply(null,arr_sOut);
                        }
                        break;
                    case 'mousemove':
                        if(v0_dragging!==null){
                            var s=Math.abs(event.clientX-initClientX);
                            if(s<=1){
                                PLAYER.clickOrMove=false; //click
                            }else{
                                PLAYER.clickOrMove=true; //move
                                dragdrop.fire({
                                    type:'clipDrag',
                                    target:v0_dragging,
                                    x:event.clientX,
                                    y:event.clientY,
                                    min_left:min_left,
                                    max_sOut:max_sOut,
                                    helpElem:helpElem,
                                    helpElem_init:helpElem_init
                                });
                                /*if(v0_dragging.attr('data-interleaved')==="true"){
                                    for (var  i = 0,dragging; dragging=PLAYER.operateJson.chooseInterleavedElem(v0_dragging)[i++];) {
                                        dragdrop.fire({
                                            type:'clipDrag',
                                            target:dragging,
                                            x:event.clientX,
                                            y:event.clientY,
                                            min_left:min_left,
                                            max_sOut:max_sOut,
                                            helpElem:helpElem_init
                                        });
                                    }
                                }*/
                            }
                        }
                        break;
                    case 'mouseup':
                            var s=Math.abs(event.clientX-initClientX);
                            if(s<=3){
                                PLAYER.clickOrMove=false; //click
                            }else{
                                PLAYER.clickOrMove=true; //move
                            }
                            var initid='check_interleaved_id_'+PLAYER.genNonDuplicateID(12);
                            //拖拽结束
                            if(PLAYER.clickOrMove&&v0_dragging&&v0_dragging.hasClass('draggable')){

                                dragdrop.fire({
                                    type:'clipDragend',
                                    target:v0_dragging,
                                    x:event.clientX,
                                    y:event.clientY,
                                    helpElem:helpElem,
                                    initid:initid
                                });

                                
                                if(v0_dragging.attr('data-interleaved')==="true"){
                                    for (let  i = 0,dragging; dragging=PLAYER.operateJson.chooseInterleavedElem(v0_dragging)[i++];) {
                                        dragdrop.fire({
                                            type:'clipDragend',
                                            target:dragging,
                                            x:event.clientX,
                                            y:event.clientY,
                                            helpElem:helpElem_init,
                                            initid:initid
                                        });
                                    }
                                }
                                //更新JSON
                                PLAYER.operateJson.sendJson();
                            }
                            //click结束
                            if(!PLAYER.clickOrMove&&v0_dragging&&v0_dragging.hasClass('draggable')){
                                var intId='interleaved_id_'+PLAYER.genNonDuplicateID(12);
                                
                                dragdrop.fire({
                                    type:'clipClick',
                                    target:v0_dragging,
                                    x:event.clientX,
                                    y:event.clientY,
                                    intId:intId,
                                    groupId:groupId
                                });
                                if(v0_dragging.attr('data-interleaved')==="true"){
                                    for (let  i = 0,dragging; dragging=PLAYER.operateJson.chooseInterleavedElem(v0_dragging)[i++];) {
                                        dragdrop.fire({
                                            type:'clipClick',
                                            target:dragging,
                                            x:event.clientX,
                                            y:event.clientY,
                                            intId:intId,
                                            groupId:groupId
                                        });
                                    }
                                }
                                if(PLAYER.keyNum===85){
                                    PLAYER.operateJson.sendJson();
                                }
                                
                            }
                            
                            v0_dragging=null; 
                            mouseing=null;
                            helpElem=null;
                            helpElem_init=null;
                            arr_left=[];
                            arr_sOut=[];
                        break;
                    case 'click':
                        if(target.className.indexOf('time_ruler_bar')>-1){
                            var clicking=$(target);
                            dragdrop.fire({
                                type:'sequenceClick',
                                target:clicking,
                                x:event.clientX,
                                y:event.clientY
                            })
                        }
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
                    case 'mouseover':
                        if(target.className.indexOf('draggable')>-1){
                            mouseing=$(target);
                            dragdrop.fire({
                                type:'clipMouseover',
                                target:mouseing,
                                x:event.clientX,
                                y:event.clientY
                            })
                        }
                        break;
                    case 'mouseout':
                        if(mouseing!==null){
                            mouseing.css({cursor:"default"});                
                            dragdrop.fire({
                                type:'mouseout',
                                target:mouseing,
                                x:event.clientX,
                                y:event.clientY
                            });
                            mouseing=null;
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
                PLAYER.EventUtil.addHandler(document,'mouseover',handleEvent);
                PLAYER.EventUtil.addHandler(document,'mouseout',handleEvent);
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
                    +'<span class="toolbar_insert_model add_audio_track" title="添加音频轨道" id="js_add_audio_track">'
                        +'<a class="fa fa-plus"></a>'
                    +'</span>'
                    /*+'<span class="toolbar_insert_model add_audio_track" title="添加音频轨道" id="js_add_audio_track">'
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

        var preSeekTime = self.currTime;
        self.currTime =  Math.round(currPos*config.framePerPixel);        
        if (callback !== null && preSeekTime !==self.currTime) {
            callback(self.currTime);
        }
    } 
    function seekToCursorFrame(time) { 
        PLAYER.checkPlaying();
        self.currTime=time;
        self.fixArrowCurrentTime(time);
        PLAYER.OCX.seek(time);   //必须seek在播放器轨道前，因为播放器最大时常不加15000帧
        
        if(time>=PLAYER.PTR.config.maxTime){
            time=PLAYER.PTR.config.maxTime;
        }
        PLAYER.PTR.currTime=time;
        PLAYER.PTR.fixArrowCurrentTime(time);
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

        return attr;
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
        //mouseup或者click事件抬起时切片状态为选中，其他切片为未选中
        if(dragging.hasClass&&dragging.hasClass('draggable')){
            PLAYER.operateJson.mouseUpState(dragging);
        }
    }
    //拖拽中clip
    function handleClipDragEvent(ev){
        var config=self.config;
        var dragging=ev.helpElem;
        var target=ev.target;
        var parentWidth=config.$header.width();
        var cal_index;
        
        var helpElem_init=ev.helpElem_init; //联动助手
        var attr=JSON.parse(target.attr('data-initattr'));
        
        clipInitWidth=attr.clipInitWidth;
        clipInitLeft=attr.clipInitLeft;
        clipInitClientX=attr.clipInitClientX;
        clipInitOffsetLeft=attr.clipInitOffsetLeft;

        clipInitTop=attr.clipInitTop;
        clipInitClientY=attr.clipInitClientY;
        clipInitOffsetTop=attr.clipInitOffsetTop;
        clipInitIndex=attr.clipInitIndex;
        clipInitType=attr.clipInitType;

        clipInitTrimIn=attr.clipInitTrimIn;
        clipInitTrimOut=attr.clipInitTrimOut;
        clipInitSequenceTrimIn=attr.clipInitSequenceTrimIn;
        clipInitSequenceTrimOut=attr.clipInitSequenceTrimOut;
        clipMaxFrame=attr.clipMaxFrame; 

        //移动状态
        var clipDir=target.attr('data-clipdir');
        PLAYER.operateJson.mouseMoveState(dragging,clipDir);
        if(helpElem_init){
            var init_clipDir=helpElem_init.attr('data-clipdir');
            PLAYER.operateJson.mouseMoveState(helpElem_init,init_clipDir);
        }
            
        if(clipDir==='middle'){
            var  nowLeft=clipInitLeft+(ev.x-clipInitClientX);
            if(ev.min_left+(ev.x-clipInitClientX)<=0){
                ev.x=clipInitClientX-ev.min_left;
                nowLeft=clipInitLeft-ev.min_left;
            }
            if(nowLeft<=0){
                nowLeft=0;
                ev.x=clipInitClientX-clipInitLeft;
            }
            nowLeft=parseInt(nowLeft*config.framePerPixel)/config.framePerPixel;
            sequenceTrimIn=Math.round(nowLeft*config.framePerPixel);
            sequenceTrimOut=sequenceTrimIn+(dragging.attr('data-trimout')-dragging.attr('data-trimin'));
            cal_index=getTrackIndex(clipInitType);


            addHelpObj(dragging,clipInitType,cal_index);
            chcekAdhere(dragging);
            updataMiddleAttr(dragging,sequenceTrimIn,sequenceTrimOut,nowLeft);

            if(helpElem_init){
                var initAttr=JSON.parse(helpElem_init.attr('data-initattr'));
                addHelpObj(helpElem_init,initAttr.clipInitType,cal_index);
                chcekAdhere(helpElem_init);
                updataMiddleAttr(helpElem_init,sequenceTrimIn,sequenceTrimOut,nowLeft);
            }

        }
        else if(clipDir==='left'){
            var nowWidth=clipInitWidth-(ev.x-clipInitClientX);
            var nowLeft=clipInitLeft+(ev.x-clipInitClientX);
            var _offset=(ev.x-clipInitClientX)*config.framePerPixel/config.framePerPixel;
            var _moveIn=Math.round(_offset*config.framePerPixel);//求得移动的帧数

            trimIn=clipInitTrimIn+_moveIn;
            sequenceTrimIn=clipInitSequenceTrimOut-clipInitTrimOut+trimIn;
            
            if(target.attr('data-type')!=='subtitle'&&target.attr('data-type')!=='video'){
                if(trimIn<=0){
                    trimIn=0;
                    sequenceTrimIn=clipInitSequenceTrimOut-clipInitTrimOut;
                    _moveIn= trimIn-clipInitTrimIn;
                    _offset= _moveIn/config.framePerPixel;
                    nowLeft=clipInitLeft+_offset;
                    nowWidth=clipInitWidth-_offset;
                }
            }
            if(trimIn>=clipInitTrimOut-1){
                trimIn=clipInitTrimOut-1;

                sequenceTrimIn=clipInitSequenceTrimOut-1;
                _moveIn= trimIn-clipInitTrimIn;
                _offset= _moveIn/config.framePerPixel;
                nowLeft=clipInitLeft+_offset;
                nowWidth=clipInitWidth-_offset;
            }
            if(nowLeft<=0){
                nowLeft=0;
                sequenceTrimIn=0;
                trimIn=clipInitTrimOut-clipInitSequenceTrimOut;
                nowWidth=clipInitWidth+clipInitLeft;  
            }
            
            addHelpObj(dragging,clipInitType,clipInitIndex);
            updataLeftAttr(dragging,sequenceTrimIn,trimIn,nowLeft,nowWidth);
            if(helpElem_init){
                var initAttr=JSON.parse(helpElem_init.attr('data-initattr'));
                addHelpObj(helpElem_init,initAttr.clipInitType,initAttr.clipInitIndex);
                updataLeftAttr(helpElem_init,sequenceTrimIn,trimIn,nowLeft,nowWidth);
            }
        }
        else if(clipDir==='right'){
            var nowWidth=clipInitWidth+(ev.x-clipInitClientX);
            var _offset=(ev.x-clipInitClientX)*config.framePerPixel/config.framePerPixel;
            var _moveOut=Math.round(_offset*config.framePerPixel);//求得移动的帧数

            trimOut=clipInitTrimOut+_moveOut;
            sequenceTrimOut=clipInitSequenceTrimIn+trimOut-clipInitTrimIn;

            if(target.attr('data-type')!=='subtitle'&&target.attr('data-type')!=='video'){
                if(trimOut>=clipMaxFrame){
                    trimOut=clipMaxFrame;

                    sequenceTrimOut=clipInitSequenceTrimIn+trimOut-clipInitTrimIn;
                    _moveOut=trimOut-clipInitTrimOut;
                    _offset=_moveOut/config.framePerPixel;
                    nowWidth=clipInitWidth+_offset;
                }
            }
            if(trimOut<=clipInitTrimIn+1){
                trimOut=clipInitTrimIn+1;
                sequenceTrimOut=clipInitSequenceTrimIn+trimOut-clipInitTrimIn;
                _moveOut=trimOut-clipInitTrimOut;
                _offset=_moveOut/config.framePerPixel;
                nowWidth=clipInitWidth+_offset;
            }
            if(nowWidth+clipInitLeft>=config.$rulerWrap.width()){
                nowWidth=config.$rulerWrap.width()-clipInitLeft;
                _offset=nowWidth-clipInitWidth;
                _moveOut=Math.round(_offset*config.framePerPixel);
                trimOut=clipInitTrimOut+_moveOut;
                sequenceTrimOut=clipInitSequenceTrimIn+trimOut-clipInitTrimIn;
            }
            
            addHelpObj(dragging,clipInitType,clipInitIndex);
            updataRightAttr(dragging,trimOut,sequenceTrimOut,nowWidth);
            if(helpElem_init){
                var initAttr=JSON.parse(helpElem_init.attr('data-initattr'));
                addHelpObj(helpElem_init,initAttr.clipInitType,initAttr.clipInitIndex);
                updataRightAttr(helpElem_init,trimOut,sequenceTrimOut,nowWidth); 
            }  
        } 

        function getTrackIndex(clipInitType){
            var cal_index;
            if(clipInitType==='t' || clipInitType==='a'){
                if(clipInitIndex>=2&&ev.y-clipInitClientY<-10){
                    cal_index=clipInitIndex-Math.ceil((clipInitOffsetTop-ev.y)/70);
                }
                else if(clipInitIndex>=1&&ev.y-clipInitClientY>10){
                    cal_index=clipInitIndex+Math.ceil((ev.y-clipInitClientY)/70);
                }else if(Math.abs(ev.y-clipInitClientY)<10){
                    cal_index=clipInitIndex;
                }
            }
            else if(clipInitType==='v'){
                if(clipInitIndex>=1&&ev.y-clipInitClientY<-10){
                    cal_index=clipInitIndex+Math.ceil((clipInitOffsetTop-ev.y)/70);
                }
                else if(clipInitIndex>=2&&ev.y-clipInitClientY>10){
                    cal_index=clipInitIndex-Math.ceil((ev.y-clipInitClientY)/70);
                }else if(Math.abs(ev.y-clipInitClientY)<5){
                    cal_index=clipInitIndex;
                }
            }
            return cal_index;
        }
        function addHelpObj(obj,clipInitType,cal_index){
            $.each($('.time_ruler_bar[data-type="'+clipInitType+'"]'),function(i,n){
                if(parseInt($(n).attr('data-index'))===cal_index){
                    $(this).find('.changeHelp').remove();
                    $(this).append(obj);
                }
            });
        }
        //判断吸附
        function chcekAdhere(dragging){
            if(dragging.siblings().length!==0){
                if(ev.x-clipInitClientX>0){//->右
                    var adhere_point=PLAYER.operateJson.getAllsequenceTrimOut(dragging);   //获取所有切片的吸附点
                    var offset=Math.abs(sequenceTrimOut-adhere_point)/config.framePerPixel;
                   
                    if(offset<=5){
                        //更具吸附点设置切片位置属性
                        sequenceTrimOut=adhere_point;
                        sequenceTrimIn=adhere_point-(dragging.attr('data-trimout')-dragging.attr('data-trimin'));
                        nowLeft=Math.round(sequenceTrimIn/config.framePerPixel);
                        //显示吸附线
                        show(dragging,'backward'); 
                    }else{
                        //隐藏吸附线
                        hide(dragging);
                    }
                }
                else if(ev.x-clipInitClientX<0){
                    var adhere_point=PLAYER.operateJson.getAllsequenceTrimIn(dragging);//获取所有切片的吸附点 
                    var offset=Math.abs(sequenceTrimIn-adhere_point)/config.framePerPixel;
                    if(offset<=5){
                        nowLeft=adhere_point/config.framePerPixel;
                        sequenceTrimIn=Math.round(nowLeft*config.framePerPixel);
                        sequenceTrimOut=sequenceTrimIn+(dragging.attr('data-trimout')-dragging.attr('data-trimin'));
                        show(dragging,'forward'); 
                    }else{
                        hide(dragging);
                    }
                }
                function show(dragging,dir){
                    PLAYER.operateJson.showAdhere(dragging,nowLeft,dir);
                }
                function hide(dragging){
                    PLAYER.operateJson.hideAdhere(dragging);
                }
            }
        }
        function updataMiddleAttr(dragging,sequenceTrimIn,sequenceTrimOut,nowLeft){
            dragging.attr('data-sequencetrimin',sequenceTrimIn);
            dragging.attr('data-sequencetrimout',sequenceTrimOut);
            dragging.css('left',nowLeft);
        }
        function updataLeftAttr(dragging,sequenceTrimIn,trimIn,nowLeft,nowWidth){
            dragging.attr('data-trimin',trimIn);
            dragging.attr('data-sequencetrimin',sequenceTrimIn);
            dragging.css('width',nowWidth);
            dragging.css('left',nowLeft);
        }
        function updataRightAttr(dragging,trimOut,sequenceTrimOut,nowWidth){
            dragging.attr('data-trimout',trimOut);
            dragging.attr('data-sequencetrimout',sequenceTrimOut);
            dragging.css('width',nowWidth); 
        }
    }
    //拖拽结束clip
    function handleClipDragEndEvent(ev){
        var config=self.config;
        var dragging=ev.helpElem;
        
        //mouseup或者click事件抬起时切片状态为选中，其他切片为未选中
        if(dragging.hasClass&&dragging.hasClass('draggable')){
            PLAYER.operateJson.mouseUpState(dragging);
        }
        
        //隐藏吸附线
        PLAYER.operateJson.hideAdhere(dragging);
        
        //判断重叠
        if(dragging.siblings().length>=2){
            PLAYER.operateJson.checkCoverEvent(dragging,ev.initid);
        }
        var subClipAttr={
            sequenceTrimIn:parseInt(dragging.attr('data-sequencetrimin')),
            sequenceTrimOut:parseInt(dragging.attr('data-sequencetrimout')),
            trimIn: parseInt(dragging.attr('data-trimin')),
            trimOut:parseInt(dragging.attr('data-trimout')),
            interleaved_id:dragging.attr('data-intid')
        };
        
        var _index=parseInt(dragging.parent().attr('data-index'));
        var _type=dragging.parent().attr('data-type');
        var time=JSON.parse(ev.target.attr('data-initattr')).clipInitTime;

        PLAYER.operateJson.updateClipAttr(subClipAttr,time); 
        PLAYER.operateJson.changeIndexClipAttr(_type,_index,time); 
        ev.target.remove();
    }
    function handleClipClickEvent(ev){
        var config=self.config;
        var v_target=ev.target;

        if(v_target.hasClass&&v_target.hasClass('draggable')){
            PLAYER.operateJson.mouseUpState(v_target,ev.groupId);
        }

        //click事件
        if(PLAYER.keyNum===85){//按下u后
            PLAYER.checkPlaying();
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
            var _createTime=v_type+'_'+PLAYER.genNonDuplicateID(12);
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
            add_subclip.attr('data-time',_createTime);
            add_subclip.attr('data-intid',ev.intId);

            var _left=ev.x-v_target.parent().offset().left;
            var _width=v_target.outerWidth()-(ev.x-v_offsetLeft);
            add_subclip.css('left',_left);
            add_subclip.css('width',_width);
            v_target.parent('.time_ruler_bar').append(add_subclip);
            

            if(v_target.parent('.time_ruler_bar').hasClass('bar_v')){
                var e_attr=PLAYER.operateJson.getCutNewEffectClip(v_dataTime,vcut_trimIn,vcut_trimOut);
                add_subclip_attr={
                    "assetID": v_dataId,
                    "trimIn": vcut_trimIn,
                    "trimOut":vcut_trimOut,
                    "sequenceTrimIn": vcut_sequenceTrimIn,
                    "sequenceTrimOut":vcut_sequenceTrimOut,
                    "effect":e_attr,
                    "createTime":_createTime,
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
                    "assetID": v_dataId,
                    "trimIn": vcut_trimIn,
                    "trimOut":vcut_trimOut,
                    "sequenceTrimIn": vcut_sequenceTrimIn,
                    "sequenceTrimOut":vcut_sequenceTrimOut,
                    "volume":100,
                    "createTime":_createTime,
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
                    "createTime":_createTime,
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
    }
    /*关于clip移入函数开始*/
    function handleClipMouseoverEvent(ev){
        var mouseing=ev.target;
       
        var _l=parseInt(mouseing.position().left);
        var _w=parseInt(mouseing.outerWidth());
        var _s=mouseing.parent('.time_ruler_bar').offset().left;
        var _x=ev.x;
        var off=_x-_s-_l;
        
        if(PLAYER.keyNum===85){
            mouseing.css({cursor:"url(images/cur/cut.cur),default"});
        }
        else if(PLAYER.keyNum===65){
            mouseing.css({cursor:"url(images/cur/select_pre.cur),default"});
        }
        else if(PLAYER.keyNum===6500){
            mouseing.css({cursor:"url(images/cur/select_back.cur),default"});
        }
        else if(PLAYER.keyNum===187){
            mouseing.css({cursor:"url(images/cur/zoom_plus.cur),default"});
        }
        else if(PLAYER.keyNum===189){
            mouseing.css({cursor:"url(images/cur/zoom_minus.cur),default"});
        }
        else{
            if(_x<=_s+_l+8){         
                mouseing.css({cursor:"url(images/cur/cursor1.cur),default"});    
            }
            else if(_x>_w+_l+_s-8){
                mouseing.css({cursor:"url(images/cur/cursor2.cur),default"}); 
            }else{
                mouseing.css({cursor:"default"});  
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
                for (let  i = 0,dragging; dragging=PLAYER.operateJson.chooseInterleavedElem(right_dom)[i++];) {
                    arr_init_sequenceTrimIn.push(parseInt(dragging.attr('data-sequencetrimin')));
                    if(parseInt(dragging.siblings().attr('data-sequencetrimout'))<=parseInt(dragging.attr('data-sequencetrimin'))){
                        arr_init_sequenceTrimOut.push(parseInt(dragging.siblings().attr('data-sequencetrimout')));  
                    }
                    
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
        PLAYER.hideSubititleEdit();
        var config=self.config;
        var targetObj = self.targetObj;
        var target=ev.target;
        var time=target.attr('data-time');
        var sIn=parseInt(target.attr('data-sequencetrimin'));
        var index=parseInt(target.parent().attr('data-index'));
        var type=target.parent().attr('data-type');
        var subtitleAttr=JSON.parse(PLAYER.operateJson.getSubtitleClip(time,index));
        
        PLAYER.showSubititleEdit();
        _addSubtitleDom(subtitleAttr);
        _initSubtitleStyle(subtitleAttr,subtitleAttr.id,type);
        _initSubtitleOperate(subtitleAttr,time,index,type,'subtitle');

        
        if(target.hasClass&&target.hasClass('draggable')){
            PLAYER.operateJson.mouseUpState(target);
        }
    }
    /*字幕右侧编辑框*/
    function _addSubtitleDom(subtitleAttr){
        $('#js_subtitle_h_form').empty();
        var id=subtitleAttr.id;
        var elm1;
        //2个图文
        elm1=$(
            '<div class="form-group">'
                +'<label class="col-md-4 control-label" for="fontsize">左边距</label>'
                +'<div class="col-md-8">'
                    +'<input type="range" class="form-control" id="js_subtitle_left" step="0.5">'
                +'</div>'
            +'</div>'
            +'<div class="form-group">'
                +'<label class="col-md-4 control-label" for="name" ></label>'
                +'<div class="col-md-8">'
                    +'<input type="text" class="form-control" id="js_subtitle_left_value" disabled="disabled">'
                +'</div>'
            +'</div>'
            +'<div class="form-group">'
                +'<label class="col-md-4 control-label" for="fontsize">上边距</label>'
                +'<div class="col-md-8">'
                    +'<input type="range" class="form-control" id="js_subtitle_top" step="0.5">'
                +'</div>'
            +'</div>'
            +'<div class="form-group">'
                +'<label class="col-md-4 control-label" for="name" ></label>'
                +'<div class="col-md-8">'
                    +'<input type="text" class="form-control" id="js_subtitle_top_value" disabled="disabled">'
                +'</div>'
            +'</div>');
        
        $('#js_subtitle_h_form').append(elm1);
        var arrText=subtitleAttr.pixel.filter(function(t){
            return t.attr.type!=='images';
        });
        var arrImages= subtitleAttr.pixel.filter(function(t){
            return t.attr.type==='images';
        });

        $.each(arrText,function(i,n){
            var font=$('<div class="form-group">'
                    +'<label class="col-md-4 control-label" for="name" >字体'+(i+1)+'</label>'
                    +'<div class="col-md-8">'
                        +'<input type="text" class="form-control subtitle_text" id="js_subtitle_text'+(i+1)+'" placeholder="字体'+(i+1)+'" data-id="'+n.attrID+'">'
                    +'</div>'
                +'</div>');
            var color=$('<div class="form-group">'
                    +'<label class="col-md-4 control-label" for="fontcolor">字体'+(i+1)+'颜色</label>'
                    +'<div class="col-md-8">'
                        +'<input type="text" class="form-control subtitle_color" id="js_subtitle_color'+(i+1)+'" data-control="hue" value="#ffffff" data-id="'+n.attrID+'">'
                    +'</div>'
                +'</div>');
            var size=$('<div class="form-group">'
                    +'<label class="col-md-4 control-label" for="fontsize">字体'+(i+1)+'字号</label>'
                    +'<div class="col-md-8">'
                        +'<input type="number" class="form-control subtitle_fontsize" id="js_subtitle_fontsize'+(i+1)+'" data-id="'+n.attrID+'">'
                    +'</div>'
                +'</div>');

            $('#js_subtitle_h_form').append(font);
            $('#js_subtitle_h_form').append(color);
            $('#js_subtitle_h_form').append(size);
        });

        var btn=$('<div class="form-group">'
                    +'<label class="col-md-4 control-label" for="name" ></label>'
                    +'<div class="col-md-8">'
                        +'<button type="button" class="btn btn-sm pull-right" id="js_subtitle_btn">关闭</button>'
                    +'</div>'
                +'</div>');
        
        $('#js_subtitle_h_form').append(btn);
        //3个图文
    }
    function _initSubtitleStyle(obj,id,type){
        
        var arr=obj.pixel.filter(function(t){
            return t.attr.type!=='images';
        }); //过滤掉图元的数组
        if($('#js_subtitle_h_form').height()>$('.subtitle_h_form_wrap').height()){
            $('.subtitle_edit_track').show();
            var s1=new Scrollbar({
                dirSelector:'y',
                contSelector:$('.subtitle_h_form_wrap'),
                barSelector:$('.subtitle_edit_track'),
                sliderSelector:$('.subtitle_edit_scroll')
            }); 
        }
        if(id==="subtitle_01" || id==="subtitle_02" || id==="subtitle_03" || id==="subtitle_05"|| id==="subtitle_06" || id==="subtitle_07"){
            $('#js_subtitle_left').attr('max',$('#ocx').width());
            $('#js_subtitle_top').attr('max',$('#ocx').height());
            $('#js_subtitle_left').attr('min',0);
            $('#js_subtitle_top').attr('min',0);


            $('#js_subtitle_left,#js_subtitle_left_value').val(obj.abs.left_value);
            $('#js_subtitle_top,#js_subtitle_top_value').val(obj.abs.top_value);

            $('#js_subtitle_text1').val(arr[0].attr.text);
            $('#js_subtitle_text2').val(arr[1].attr.text);
            $('#js_subtitle_fontsize1').val(arr[0].attr.fontSize);
            $('#js_subtitle_fontsize2').val(arr[1].attr.fontSize);
            $('#js_subtitle_color1').val(arr[0].attr.fillStyle);
            $('#js_subtitle_color2').val(arr[1].attr.fillStyle); 


            $('#js_subtitle_color1').minicolors({
                control: $(this).attr('data-control') || 'hue',
                defaultValue: $(this).attr('data-defaultValue') || '',
                inline: $(this).attr('data-inline') === 'true',
                letterCase: $(this).attr('data-letterCase') || 'lowercase',
                opacity: $(this).attr('data-opacity'),
                position: $(this).attr('data-position') || 'bottom left',
                change: function(hex, opacity) {
                    if (!hex)
                        return;
                    if (opacity)
                        hex += ', ' + opacity;
                    try {
                        $('#js_subtitle_color1').val(hex)
                    } catch (e) {
                        console.log(e);
                    }
                },
                theme: 'bootstrap'
            });
            $('#js_subtitle_color2').minicolors({
                control: $(this).attr('data-control') || 'hue',
                defaultValue: $(this).attr('data-defaultValue') || '',
                inline: $(this).attr('data-inline') === 'true',
                letterCase: $(this).attr('data-letterCase') || 'lowercase',
                opacity: $(this).attr('data-opacity'),
                position: $(this).attr('data-position') || 'bottom left',
                change: function(hex, opacity) {
                    if (!hex)
                        return;
                    if (opacity)
                        hex += ', ' + opacity;
                    try {
                        $('#js_subtitle_color2').val(hex)
                    } catch (e) {
                        console.log(e);
                    }
                },
                theme: 'bootstrap'
            });
        }
    }
    function _initSubtitleOperate(obj,time,index,type,effectType){
        
        var s_arr=JSON.stringify(obj.pixel);
        var initArr=JSON.parse(JSON.stringify(obj.pixel));
        var initArr_x=[];
        var initArr_y=[];
        for (var i = 0; i < initArr.length; i++) {
            initArr_x[i]=initArr[i].x1-JSON.parse(JSON.stringify(obj.abs.left_value))
        }
        for (var i = 0; i < initArr.length; i++) {
            initArr_y[i]=initArr[i].y1-JSON.parse(JSON.stringify(obj.abs.top_value))
        }

        var jsonObj={
            trackType:type,
            trackIndex:index,
            subClipId:time,
            name:effectType,
            attr:JSON.parse(s_arr)
        };
        
        var newArray=[];
        $('#js_subtitle_left')[0].oninput=function(e){

            $('#js_subtitle_left_value').val($(e.target).val());

            for (var i = 0; i < jsonObj.attr.length; i++) {
                jsonObj.attr[i].x1=initArr_x[i]+parseInt($(e.target).val());
            }
            
            updateJson(jsonObj);
        };
        
        $('#js_subtitle_top')[0].oninput=function(e){
            $('#js_subtitle_top_value').val($(e.target).val());
            for (var i = 0; i < jsonObj.attr.length; i++) {
                jsonObj.attr[i].y1=initArr_y[i]+parseInt($(e.target).val());
            }
            updateJson(jsonObj);
        };
        

        function changeLeft(value){
            for (var i = 0; i < jsonObj.attr.length; i++) {
                jsonObj.attr[i].x1+=parseInt($(e.target).val())-initL;
            }
        }
        
        $('#js_subtitle_h_form .subtitle_text').on('change',function(e){
            var id=$(e.target).attr('data-id');
            var newObj={
                text:$(e.target).val()
            }
            changeJson(jsonObj,id,newObj);
            updateJson(jsonObj);
        });
        $('#js_subtitle_h_form .subtitle_color').on('change',function(e){
            var id=$(e.target).attr('data-id');
            var newObj={
                fillStyle:$(e.target).val()
            }
            changeJson(jsonObj,id,newObj);
            updateJson(jsonObj);
        });
        $('#js_subtitle_h_form .subtitle_fontsize').on('change',function(e){
            var id=$(e.target).attr('data-id');
            var newObj={
                fontSize:$(e.target).val()
            }
            changeJson(jsonObj,id,newObj);
            updateJson(jsonObj);
        });

        
        $('#js_subtitle_btn').on('click',function(e){
            PLAYER.hideSubititleEdit();
        });

        function changeJson(jsonObj,id,newObj){
            $.each(jsonObj.attr,function(i,n){
                if(n.attrID===id){
                    $.extend(n.attr,newObj);
                }
            });
        }

        function updateJson(jsonObj){
            console.log('0000-',jsonObj.attr)
            //PLAYER.OCX.adjustEffect(jsonObj);
            //PLAYER.OCX.seek(parseInt(PLAYER.TR.currTime)); 

            var x1=parseInt($('#js_subtitle_left_value').val());
            var y1=parseInt($('#js_subtitle_top_value').val());

            PLAYER.operateJson.updateSubtitleClip(jsonObj,x1,y1);
        }      
    }
    /*右击切片弹出声音模态框*/
    function handleClipContextmenuEvent(ev){
        //console.log('右击菜单',ev);
    }
    /*点击确定提交声音*/
    function __operateClipContextmenuEvent(clicking){
        $('#js_volume_form_name').val('200');
        $('#js_volume_form_range').mouseup(function(event) {
            $('#js_volume_form_name').val($('#js_volume_form_range').val());
        });
        $('#js_volume_save').on('click',function(){
            var _val=parseInt($('#js_volume_form_name').val());
            var _index=PLAYER.operateJson.getAudioIndex(parseInt(clicking.attr('data-time')));
            var volumeAttr={
                "type": 1,
                "trackIndex": 1,
                "subClipIndex": _index,
                "volume": _val
            }
            var _re=PLAYER.OCX.coverStationLogo(volumeAttr);
            if(_re===0){
                console.log('声音成功');
                $('#js_createVolumeModal').hide();
                $('#js_pageCover').hide();
            }
        });
        $('#js_volume_cancel').on('click',function(){
            $('#js_createVolumeModal').hide();
            $('#js_pageCover').hide();
        });
        $('#js_createVolumeModal .icojam_delete').on('click',function(){
            $('#js_createVolumeModal').hide();
            $('#js_pageCover').hide();
        });
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
            PLAYER.keyNum===189;
            if(old_scrollWidth===config.$headerRight.width()){
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
        else if(key===46||key===8){//delete/backspace
            key=0;
            e.returnValue=false;  
            PLAYER.checkPlaying();

            if(!e.target.hasClass('form-control')){
                if($('#js_time_ruler_bar_box .onselected').length>0){
                    $.each($('.onselected'),function(i,n){
                        $(n).remove();
                        var time=$(n).attr('data-time');
                        PLAYER.operateJson.deleteClipAttr(time);
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
                                for (let  i = 0,dragging; dragging=PLAYER.operateJson.chooseInterleavedElem($(n))[i++];) {
                                    move(dragging);
                                }
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
                        $(n).remove();
                        PLAYER.operateJson.removeOtherEffectClip(time);
                        
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

            $.each($('.onselected'),function(i,n){
                PLAYER.clipboard.push($(this));
                PLAYER.clipboard.parent.push($(this).parent('.time_ruler_bar'))
                $(n).remove();
                var time=$(n).attr('data-time');
                PLAYER.operateJson.deleteClipAttr(time);
            });

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
            var intId='interleaved_id_'+PLAYER.genNonDuplicateID(12);
            var checkId='check_interleaved_id_'+PLAYER.genNonDuplicateID(12);
            $('.onselected').each(function(i,n){
                addClipboardClip($(n),$(n).parent('.time_ruler_bar'),intId,checkId);
            });  

            PLAYER.operateJson.sendJson();
        }
        else if(e.ctrl&&key===86&&PLAYER.copyOrcut==='cut'){//ctrl+v
            PLAYER.checkPlaying();
            var config = self.config;
            var targetObj = self.targetObj;
            var currFrame= self.currTime; //时码线帧数
            var intId='interleaved_id_'+PLAYER.genNonDuplicateID(12);
            var checkId='check_interleaved_id_'+PLAYER.genNonDuplicateID(12);
            if(PLAYER.clipboard){
                for (var i = 0; i < PLAYER.clipboard.length; i++) {
                    addClipboardClip(PLAYER.clipboard[i],PLAYER.clipboard.parent[i],intId,checkId);
                }
                
                PLAYER.operateJson.sendJson();
            }
        } 
        else if(e.ctrl&&key===90){//ctrl+z撤销     
            if((PLAYER.goBackJson.length-2)<0){
                $('.time_ruler_bar').empty();
                //indexCancel=0;
                PLAYER.goBackJson=[];
                
                PLAYER.TR.config.maxTime=15000;
                PLAYER.TR.updateEvent(15000);
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

                console.log('0000',PLAYER.jsonObj);
                //更新时间
                $('#js_player_totalTime').html(PLAYER.getDurationToString(PLAYER.operateJson.getLastFrame()));

                //渲染视频
                $('.time_ruler_bar').empty();
                
                for (var i = 0,track; track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i++];) {
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
                            var _id=n.assetID;//素材ID
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
                            subclipBox.attr('data-id',n.assetID || n.id);
                            subclipBox.attr('data-type',n.type);
                            subclipBox.attr('data-interleaved',n.interleaved);
                            subclipBox.attr('data-time',n.createTime);
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

                        //更新时间轨道配置
                        PLAYER.TR.config.maxTime=PLAYER.operateJson.getLastFrame()+15000;
                        PLAYER.TR.updateEvent(PLAYER.TR.config.maxTime,true);
                        $('#js_player_totalTime').html(PLAYER.getDurationToString(PLAYER.operateJson.getLastFrame()));
                        PLAYER.TR.fixClipWidth();
                        //更新播放器时间配置
                        PLAYER.PTR.config.maxTime=PLAYER.operateJson.getLastFrame();
                        PLAYER.PTR.updateEvent(PLAYER.PTR.config);
                    }
                } 


                PLAYER.goBackJson.pop();
                //提交json
                PLAYER.OCX.updateProjectJson(PLAYER.jsonObj);
                PLAYER.OCX.seek(parseInt(PLAYER.TR.currTime));
            }
        }

        function addClipboardClip(v_target,v_parent,intId,checkId){
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

            v_dataId=v_target.attr('data-id');
            v_type=v_target.attr('data-type');
            v_interleaved=v_target.attr('data-interleaved');
            v_index=parseInt(v_parent.attr('data-index'));
            var _createTime=v_type+'_'+PLAYER.genNonDuplicateID(12);

            v0_trimIn=parseInt(v_target.attr('data-trimin'));
            v0_trimOut=parseInt(v_target.attr('data-trimout'));
            v0_sequenceTrimIn=parseInt(v_target.attr('data-sequencetrimin'));
            v0_sequenceTrimOut=parseInt(v_target.attr('data-sequencetrimout'));

            //复制后数据
            vcut_trimIn=v0_trimIn;
            vcut_trimOut=v0_trimOut;
            vcut_sequenceTrimIn=currFrame;
            vcut_sequenceTrimOut=currFrame+v0_trimOut-v0_trimIn;

            cloneBox=v_target.clone();
            cloneBox.css('left',vcut_sequenceTrimIn/config.framePerPixel);
            cloneBox.attr('data-sequencetrimin',vcut_sequenceTrimIn);
            cloneBox.attr('data-sequencetrimout',vcut_sequenceTrimOut);
            cloneBox.attr('data-time',_createTime);
            cloneBox.attr('data-intid',intId);
            
            v_parent.append(cloneBox);

            PLAYER.operateJson.checkCoverEvent(cloneBox,checkId);
            
            if(v_parent.hasClass('bar_v')){
                var time=v_target.attr('data-time');
                var e_attr=JSON.parse(PLAYER.operateJson.getEffectClip(time));
                if(e_attr.length!==0){
                    $.each(e_attr,function(i,n){
                        if($(this).pos==='all'){
                            $(this).trimIn=vcut_trimIn;
                            $(this).trimOut=vcut_trimOut;
                        }
                    });
                }
                add_subclip_attr={
                    "assetID": v_dataId,
                    "trimIn": vcut_trimIn,
                    "trimOut":vcut_trimOut,
                    "sequenceTrimIn": vcut_sequenceTrimIn,
                    "sequenceTrimOut":vcut_sequenceTrimOut,
                    "effect":e_attr,
                    "createTime":_createTime,
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
                    "assetID": v_dataId,
                    "trimIn": vcut_trimIn,
                    "trimOut":vcut_trimOut,
                    "sequenceTrimIn": vcut_sequenceTrimIn,
                    "sequenceTrimOut":vcut_sequenceTrimOut,
                    "volume":100,
                    "createTime":_createTime,
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
                    "createTime":_createTime,
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
            
            if(PLAYER.keyNum===73&&this.trimInCurrTime===0){
                trimOutCurrPos = config.maxTime/config.framePerPixel;
                this.trimOutCurrTime=config.maxTime;
                trimOutCurrPos = parseInt(trimOutCurrPos*config.framePerPixel)/config.framePerPixel; 
            }
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
    /**
     * 兼容IE和其他浏览器的事件添加方法，
     * @param {[object]} element [元素对象]
     * @param {[string]} type    [事件类型 click等]
     * @param {[function]} handler [操作函数]
     */
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
                keyElem=$(target);
                if(target.nodeName==='INPUT' || target.nodeName==='input' || target.nodeName==='TEXTAREA' || target.nodeName==='textarea'){
                    return false;
                }else{
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
    $('#js_carve').removeClass('col-md-6').addClass('col-md-4');
    $('#js_carve_edit').show();
    $('#js_carve_edit .list li').eq(0).trigger('click');  
}
PLAYER.hideSubititleEdit=function(){
    $('#js_carve').removeClass('col-md-4').addClass('col-md-6');
    $('#js_carve_edit').hide(); 
    $('#js_subtitle_h_form').empty();
}
PLAYER.hideEffectEdit=function(){
    $('#js_carve_edit').hide();
    $('#js_carve').removeClass('col-md-4').addClass('col-md-6');
    $('#js_effect_h_form').empty();
    $('#move_box').remove();
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
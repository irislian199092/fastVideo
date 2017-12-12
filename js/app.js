$(function(){
	/*-----------对象继承-----------*/
	PLAYER.player= new PLAYER.playerFunction();
	PLAYER.documentEvent.enable();

	/*-----------初始化工程对话框插件-----------*/
	$('#js_initProjectModal').show();
	$('#js_pageCover').show();

	/*-----------登出-----------*/
	$('#js_loginout').on('click',function(){
		PLAYER.checkPlaying();
		location.href=loginUrl;
	});
	/*-----------日期选择器-----------*/
	$('.date_picker').date_input();
	/*-----------初始化声音画布宽高-----------*/
	var c1 = document.getElementById("js_voCanvas"); 
    c1.width ='70';
    c1.height =$("#js_time_ruler_voiceBox").height()-21; 

	/*----------------------切换侧边栏的left值----------------------*/
	$('#js_logo_toggle').on('click',function(){
		$('.slider_context').animate({left: '-1080px'}, "slow"); 
	});
	$('#js_notifications .header_box li').on('click',function(){
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
		var _id=$(this).index();
		$('#js_tab_content').children().eq(_id).show();
		$('#js_tab_content').children().eq(_id).siblings().hide();
	});

	$('#js_init_project_list').delegate('li:not(".header")','click',function(){
		$(this).addClass('active');
		$(this).siblings('li').removeClass('active');
  	});
  	$('#js_edit_project_list').delegate('li:not(".header")','click',function(){
		$(this).addClass('active');
		$(this).siblings('li').removeClass('active');
  	});
  	
  	/*----------------------切换右侧编辑框----------------------*/
  	$('#js_carve_edit .list li').on('click',function(){
  		$(this).addClass('active');
  		$(this).siblings('li').removeClass('active');

  		var index=$(this).index();
  		$('.carve_edit_body').children().eq(index).show();
  		$('.carve_edit_body').children().eq(index).siblings().hide();
  	});
	/*----------------------联动状态----------------------------*/
	$('#js_toolbar_icon_ungroup').mousemove(function(){
		$(this).addClass('active');
	}).mouseout(function(){
		$(this).removeClass('active');
	});
	$('#js_toolbar_icon_group').mousemove(function(){
		$(this).addClass('active');
	}).mouseout(function(){
		$(this).removeClass('active');
	});

	/*----------------------添加轨道(以后待用)---------------------------------*/
	/*$('#js_add_video_track').on('click',function(){
		var track_video=$('<div class="time_ruler_bar bar_v" data-type="v"></div>');
		var title_video=$('<div class="time_ruler_title_list">v3</div>');
		title_video.insertBefore($('.time_ruler_title_list[data-type="v2"]'));
		track_video.insertBefore($('.bar_v[data-index="2"]'));

		var _h=$('#js_time_ruler_title_box').children('.time_ruler_title_list').size()*35;
		if(_h>=$('#js_time_ruler_track_box').height()){
			$('.time_ruler_track').show();
			var s1=new Scrollbar({
				dirSelector:'y',
				contSelector:$('#js_time_ruler_track_box'),
				barSelector:$('.time_ruler_track'),
				sliderSelector:$('.time_ruler_scroll')
			}); 
		}
	});
	*/
	var initIndex=2;
	$('#js_add_audio_track').on('click',function(){
		initIndex++;
		if(initIndex===9){
			alert('您最多能添加8轨道');
			return false;
		}
		var track_audio=$('<div class="time_ruler_bar bar_a" data-type="a" data-index="'+initIndex+'"></div>');
		var title_audio=$('<div class="time_ruler_title_list" data-type="a'+initIndex+'">A'+initIndex+'</div>');
		$('#js_time_ruler_bar_box').append(track_audio);
		$('#js_time_ruler_title_box').append(title_audio);

		var _h=$('#js_time_ruler_title_box').children('.time_ruler_title_list').size()*35;
		if(_h>=$('#js_time_ruler_track_box').height()){
			$('.time_ruler_track').show();
			var s1=new Scrollbar({
				dirSelector:'y',
				contSelector:$('#js_time_ruler_track_box'),
				barSelector:$('.time_ruler_track'),
				sliderSelector:$('.time_ruler_scroll')
			}); 
		}
  		var attr={
			type:"a",
			index:initIndex,
			subclip:[]
		};
		PLAYER.jsonObj.rootBin.sequence[0].tracks.push(attr);
	});

	/*----------------------每大块选中蓝框状态----------------------*/
	var maskElem=null;
	var maskText=null;

	var materialActive=false;


	$('#js_thumbnail_box').delegate($('#js_thumbnail_box').children(),'dblclick',function(e){
		if($(e.target).parent().hasClass('thumbnail')){
			
			var s=$(e.target).parent().parent('.col-md-3');
			if(s.hasClass('active')){
				s.removeClass('active');
				$.each(PLAYER.chooseArray,function(i,n){
					if(n===s.attr('data-id')){
						PLAYER.chooseArray.splice(i,1);
					}
				});
			}else{
				s.addClass('active');
				PLAYER.chooseArray.push(s.attr('data-id'));
			}
			console.log('PLAYER.chooseArray',PLAYER.chooseArray);	
		}
	})
	
	$('.carve').delegate($('.carve').children(),'click',function(e){
		$('.carve').addClass('choose');
		$('.time_ruler_wrap').removeClass('choose');
		$('.player_box').removeClass('choose');
		$('.time_ruler_toolbar').removeClass('choose');
		$('.time_ruler_voiceBox').removeClass('choose');

		PLAYER.PTR.DragDrop.disable();
		PLAYER.TR.DragDrop.disable();
		
		//点击字幕列表
		if($(e.target).parent('li').hasClass('subtitle')){
			$(e.target).addClass('active');
			$(e.target).parent().siblings().children('.subtitle_list').removeClass('active');
		}

		//侧边栏
		if(e.target.id==='js_logo'){
			$('.slider_context').animate({left: '0'}, "slow"); 
		}
		//素材列表形式
		if(e.target.id==='js_style_list'){
			$('.meterial_list_box').show();
			$('.meterial_list_track').show();
			$('.meterial_thumbnail_box').hide();
			$('.meterial_thumbnail_track').hide();
			$('#js_style_list').parent('li').addClass('active');
			$('#js_style_list').parent('li').siblings().removeClass('active');
		}
		//素材缩略图形式
		if(e.target.id==='js_style_thumbnail'){
			$('.meterial_list_box').hide();
			$('.meterial_list_track').hide();
			$('.meterial_thumbnail_box').show();
			$('.meterial_thumbnail_track').show();
			$('#js_style_thumbnail').parent('li').addClass('active');
			$('#js_style_thumbnail').parent('li').siblings().removeClass('active');
		}
		//素材库
		if(e.target.id==='tab_material'){
			$('#tab_material').parent('li').addClass('active');
			$('#tab_material').parent('li').siblings().removeClass('active');
			$('#tab_1').show();
			$('#tab_1').siblings('.js_tab').hide();
		}
		//字幕库
		if(e.target.id==='tab_subtitle'){
			$('#tab_subtitle').parent('li').addClass('active');
			$('#tab_subtitle').parent('li').siblings().removeClass('active');
			$('#tab_2').show();
			$('#tab_2').siblings('.js_tab').hide();
			$('.subtitle_list_box').show();
			$('.subtitle_list_track').show();
		}
		//特技库
		if(e.target.id==='tab_effect'){
			$('#tab_effect').parent('li').addClass('active');
			$('#tab_effect').parent('li').siblings().removeClass('active');
			$('#tab_3').show();
			$('#tab_3').siblings('.js_tab').hide();
		}
		//图片库
		if(e.target.id==='tab_images'){
			$('#tab_images').parent('li').addClass('active');
			$('#tab_images').parent('li').siblings().removeClass('active');
			$('#tab_4').show();
			$('#tab_4').siblings('.js_tab').hide();
		}
		//音频库
		if(e.target.id==='tab_audio'){
			$('#tab_audio').parent('li').addClass('active');
			$('#tab_audio').parent('li').siblings().removeClass('active');
			$('#tab_5').show();
			$('#tab_5').siblings('.js_tab').hide();
		}
	});	
	
	/*----------------------点击播放器工具条---------------------------------------------*/
	$('.player_toolbar_list').css('marginLeft',($('.player_toolbar').width()-324)/2);//播放器工具条居中排列	
	$('.player_box').delegate($('.player_box').children(),'click',function(e){
		$('.player_box').addClass('choose');
		$('.time_ruler_wrap').removeClass('choose');
		$('.carve').removeClass('choose');
		$('.time_ruler_toolbar').removeClass('choose');
		$('.time_ruler_voiceBox').removeClass('choose');
		PLAYER.PTR.DragDrop.enable();
		PLAYER.TR.DragDrop.disable();
		
		//点击播放暂停
		if(e.target.id==='js_play'){
			var lastFrame=PLAYER.operateJson.getLastFrame();


            if(PLAYER.TR.currTime>=lastFrame){//如果seek位置大于素材长度，则跳到0处开始播放
                return false;
                /*PLAYER.TR.initTime();
                PLAYER.PTR.initTime();
                PLAYER.OCX.seek(0);
                PLAYER.player.play();*/
            }else{
            	PLAYER.player.play();
            }
		}
		//点击设置循环播放(测试有bug)
		if(e.target.id==='js_setInterval'){
			if($(e.target).parent('li').hasClass('active')){
				$(e.target).parent('li').removeClass('active');
			}else{
				$(e.target).parent('li').addClass('active');
			}
			PLAYER.player.setIntervalPlay();
		}	
		//点击设置入点
		if(e.target.id==='js_setTrimIn'){
			PLAYER.player.setTrimIn();
		}
		//点击设置出点
		if(e.target.id==='js_setTrimOut'){
			PLAYER.player.setTrimOut();
		}
		//点击移动到入点
		if(e.target.id==='js_moveTrimIn'){
			PLAYER.player.moveTrimIn();
		}
		//点击移动到出点
		if(e.target.id==='js_moveTrimOut'){
			PLAYER.player.moveTrimOut();	
		}
		//点击前一帧
		if(e.target.id==='js_prevFrame'){
			PLAYER.player.prevFrame();	
		}
		//点击后一帧
		if(e.target.id==='js_nextFrame'){
			PLAYER.player.nextFrame();	
		}
		//点击到序列头
		if(e.target.id==='js_toFirstFrame'){
			PLAYER.player.toFirstFrame();
		}
		//点击到序列尾
		if(e.target.id==='js_toLastFrame'){
			PLAYER.player.toLastFrame();
		}
		
	});
	/*----------------------特技字幕编辑框---------------------------------------------*/
	$('#js_carve_edit').delegate($('#js_carve_edit').children(),'click',function(e){
		PLAYER.PTR.DragDrop.disable();
		PLAYER.TR.DragDrop.disable();
	});
	/*----------------------时间轨道---------------------------------------------*/
	$('.time_ruler_wrap').delegate($('.time_ruler_wrap').children(),'click',function(e){	
		//点击外面取消选中
		if(e.target.className.indexOf('time_ruler_bar')>-1||e.target.className.indexOf('time_ruler_edit_box')>-1){
			$('.time_ruler_bar').children().removeClass('onselected');
		}
		//向前选中
		var clientE=e.clientX-$('.time_ruler_edit_box').offset().left-parseInt($('#js_time_ruler_bar_box').css('marginLeft'));
		var marginLeft=parseInt($('#js_time_ruler_bar_box').css('marginLeft'));

		if(PLAYER.keyNum===7100){
			$.each($('.time_ruler_bar').children(),function(i,n){
				var _l=parseInt($(n).css('left'));
				var _w=$(n).width();
				var _s=_l+_w;
				if(_l>=clientE){
					$(n).addClass('onselected');
				}
				if(_l<clientE&&_s>=clientE){
					$(n).addClass('onselected');
				}
			});
		}
		//向后选中
		if(PLAYER.keyNum===71){
			$.each($('.time_ruler_bar').children(),function(i,n){
				var _l=parseInt($(n).css('left'));
				var _w=$(n).width();
				var _s=_l+_w;
				if(_s<clientE){
					$(n).addClass('onselected');
				}
				if(_l<clientE&&_s>=clientE){
					$(n).addClass('onselected');
				}
			});
		}
		PLAYER.TR.DragDrop.enable();
		PLAYER.PTR.DragDrop.disable();
		PLAYER.documentEvent.enable();
		$('.time_ruler_wrap').addClass('choose');
		$('.player_box').removeClass('choose');
		$('.carve').removeClass('choose');
		$('.time_ruler_toolbar').removeClass('choose');
		$('.time_ruler_voiceBox').removeClass('choose');
	});
	
	/*----------------------时间轴工具条---------------------------------------------*/
    $('.time_ruler_toolbar').delegate($('.time_ruler_toolbar span'),'click',function(e){
        $('.carve').removeClass('choose');
        $('.time_ruler_wrap').removeClass('choose');
        $('.player_box').removeClass('choose');
        $('.time_ruler_toolbar').addClass('choose');
        $('.time_ruler_voiceBox').removeClass('choose');
        //PLAYER.PTR.DragDrop.disable();
        switch(e.target.id){
            case "js_toolbar_select":
                PLAYER.player.toolbar_choose();
                break;
            case "js_toolbar_select_pre":
                PLAYER.player.toolbar_preSelect();
                break;
            case "js_toolbar_select_back":
                PLAYER.player.toolbar_nextSelect();
                break;
            case "js_toolbar_cut":
                PLAYER.player.toolbar_cut();
                break;
            case "js_toolbar_uCut":
                PLAYER.player.toolbar_uCut();
                break;
            case "js_toolbar_zoom_plus":
                PLAYER.player.toolbar_zoom_plus();
                break;
            case "js_toolbar_zoom_minus":
                PLAYER.player.toolbar_zoom_minus();
                break;
            default:
                return false;
        }
    });
	/*----------------------点击工具条编组解组---------------------------------------------*/
	$('#js_toolbar_icon_ungroup').on('click',function(){
		PLAYER.player.toolbar_ungroup();
	});
	$('#js_toolbar_icon_group').on('click',function(){
		PLAYER.player.toolbar_group();
	});
	/*----------------------点击改变音量---------------------------------------------*/
	var isVolShow=true;
	$('#js_toolbar_icon_volume').click(function(){
		var length=$('.onselected.edit_box_a').length;

		if(!isVolShow){
			$('#js_toolbar_icon_volume_track').hide();
			isVolShow=true;
		}
		else if( length>0 && isVolShow){
			$('#js_toolbar_icon_volume_track').show();
			isVolShow=false;
		}
	});

	$('#js_toolbar_icon_volume_track')[0].onchange=function(e){
		$.each($('.onselected.edit_box_a'),function(i,n){
			var id=$(n).attr('data-time');
			var value=parseInt($(e.target).val());
			$(e.target).attr('title',value);
			PLAYER.operateJson.updateAudioClipVolume(id,value);
			PLAYER.OCX.updateProjectJson(PLAYER.jsonObj);
        	PLAYER.OCX.seek(parseInt(PLAYER.TR.currTime));

        	console.log('更新音量',PLAYER.jsonObj.rootBin.sequence[0])
		});
	}


	/*----------------------右击菜单马赛克---------------------------------------------*/

	var contextOperate=(function(){
		var time;
		var index;
		var type;
		var createContextElem=function(){
	        var contextElem=$('<ul id="js_contextElem" class="contextElem">'
	                +'<li id="js_edit_effect">编辑马赛克</li>'
	                +'<li id="js_remove_effect">移除马赛克</li>'
	            +'<ul>');
	        $('body').append(contextElem);
	        return contextElem;
	    };
	    var contextElemModal=PLAYER.singelton(createContextElem);
	    $('#js_time_ruler_bar_box').delegate('.edit_box.onselected','contextmenu',function(e){
	        e.preventDefault();
	        time=$(e.target).attr('data-time');
	        index=parseInt($(e.target).parent().attr('data-index'));
	        type=$(e.target).parent().attr('data-type');
	        $('#js_effect_btn').attr('data-time',time);
	        var contextElem=contextElemModal();
	        contextElem.css('left',e.clientX);
	        contextElem.css('top',e.clientY);
			
	        if($(e.target).children('.effect_box_all').length>0){
	        	contextElem.attr('data-edit',true);
	        	contextElem.children('#js_edit_effect,#js_remove_effect').css('background','#212121');
	        	contextElem.children('#js_edit_effect,#js_remove_effect').css('color','#fff');
	        }else{

	        	contextElem.attr('data-edit',false);
	        	contextElem.children('#js_edit_effect,#js_remove_effect').css('background','#eee');
	        	contextElem.children('#js_edit_effect,#js_remove_effect').css('color','#999');
	        }
	        contextElem.show();
	    });

	    PLAYER.EventUtil.addHandler($(document)[0],'click',function(e){//点击文档其他部分，右击菜单消失
	        if(e.target.id==='js_edit_effect'){
	            if($(e.target).parent('ul').attr('data-edit')==='false'){
	            	var contextElem=contextElemModal();
	        		contextElem.hide();
	            	return false;
	            }else{
	            	var effectAttr=JSON.parse(PLAYER.operateJson.getEffectClip(time));
	            	var attr=null;
					for (var i = 0; i < effectAttr.length; i++) {
						if(effectAttr[i].type==='mosaic' || effectAttr[i].type==='2D'){
							attr=effectAttr[i].attr;

						}
					}

					initEditDom();
					
					effectEditShow(JSON.stringify(attr),time,index,type,'mosaic');
	            } 
	        }else if(e.target.id==='js_remove_effect'){
				if($(e.target).parent('ul').attr('data-edit')==='false'){
					var contextElem=contextElemModal();
	        		contextElem.hide();
	            	return false;
	            }else{
	            	PLAYER.operateJson.removeEffectClip(time,'mosaic','all');
	            	$('.edit_box_v.onselected').children('.effect_box_all').remove();
            		PLAYER.operateJson.sendJson();
	            } 
	        }

	        var contextElem=contextElemModal();
	        contextElem.hide();
	    });
	})();
	
	/*----------------------右击菜单---------------------------------------------*/
	
	$('#js_zoom').on('click',function(){
		var s=$('.onselected').size();

		if(s===0){
			return false;
		}else{
			var time=$('.edit_box_v.onselected').attr('data-time');
	        var index=parseInt($('.edit_box_v.onselected').parent().attr('data-index'));
	        var type=$('.edit_box_v.onselected').parent().attr('data-type');
	        var duration=parseInt($('.edit_box_v.onselected').attr('data-duration'));
	        var trimIn=parseInt($('.edit_box_v.onselected').attr('data-trimin'));
	        var trimOut=parseInt($('.edit_box_v.onselected').attr('data-trimout'));

	        var effectArray=JSON.parse(PLAYER.operateJson.getEffectClip(time));
        	var effectAttr=null;
			
			if(effectArray.length===0){
				effectAttr={
					duration:duration,
					trimIn:trimIn,
					trimOut:trimOut,
					type:'2D',
					pos:'all',
					attr:{
						x1:0,
						y1:0,
						width:0.2*$('#ocx').width(),
						height:0.2*$('#ocx').height(),
						sizex:100,
						sizey:100
					}
				};
				PLAYER.operateJson.addEffectClip(time,effectAttr);
			}else{
				for (var i = 0; i < effectAttr.length; i++) {
					if(effectAttr[i].type==='2D'){
						effectAttr=effectAttr[i].attr;
					}else{
						effectAttr={
							duration:duration,
							trimIn:trimIn,
							trimOut:trimOut,
							type:'2D',
							pos:'all',
							attr:{
								x1:0,
								y1:0,
								width:0.2*$('#ocx').width(),
								height:0.2*$('#ocx').height(),
								sizex:100,
								sizey:100
							}
						};
						PLAYER.operateJson.addEffectClip(time,effectAttr);
					}
				}
			}
			
	        initEditDom();
			effectEditShow(JSON.stringify(effectAttr.attr),time,index,type,'2D');
		}
	});


	function initEditDom(){
		$('#js_effect_h_form').empty();
		var elem=$(
			'<div class="form-group">'
   					+'<label class="col-md-4 control-label" for="name" >左边距</label>'
   					+'<div class="col-md-8">'
   						+'<input type="range" class="form-control" id="js_effect_left" min="0" step="0.5" >'
   					+'</div>'
			    +'</div>'
			    +'<div class="form-group">'
   					+'<label class="col-md-4 control-label" for="name" ></label>'
   					+'<div class="col-md-8">'
   						+'<input type="text" class="form-control" id="js_effect_left_value"  disabled="disabled">'
   					+'</div>'
			    +'</div>'
			    +'<div class="form-group">'
   					+'<label class="col-md-4 control-label" for="name" >上边距</label>'
   					+'<div class="col-md-8">'
   						+'<input type="range" class="form-control" id="js_effect_top" min="0" step="0.5">'
   					+'</div>'
			    +'</div>'
			    +'<div class="form-group">'
   					+'<label class="col-md-4 control-label" for="name" ></label>'
   					+'<div class="col-md-8">'
   						+'<input type="text" class="form-control" id="js_effect_top_value" disabled="disabled">'
   					+'</div>'
			    +'</div>'
			    +'<div class="form-group">'
   					+'<label class="col-md-4 control-label" for="name" >宽度</label>'
   					+'<div class="col-md-8">'
   						+'<input type="range" class="form-control" id="js_effect_width" min="0" step="0.5">'
   					+'</div>'
			    +'</div>'
			    +'<div class="form-group">'
   					+'<label class="col-md-4 control-label" for="name" ></label>'
   					+'<div class="col-md-8">'
   						+'<input type="text" class="form-control" id="js_effect_width_value" disabled="disabled">'
   					+'</div>'
			    +'</div>'
			    +'<div class="form-group">'
   					+'<label class="col-md-4 control-label" for="name" >高度</label>'
   					+'<div class="col-md-8">'
   						+'<input type="range" class="form-control" id="js_effect_height" min="0" step="0.5" >'
   					+'</div>'
			    +'</div>'
			    +'<div class="form-group">'
   					+'<label class="col-md-4 control-label" for="name" ></label>'
   					+'<div class="col-md-8">'
   						+'<input type="text" class="form-control" id="js_effect_height_value" disabled="disabled">'
   					+'</div>'
			    +'</div>'
			    /*+'<div class="form-group">'
   					+'<label class="col-md-4 control-label" for="name" >水平缩放</label>'
   					+'<div class="col-md-8">'
   						+'<input type="range" class="form-control" id="js_effect_sizex" min="0"  step="1">'
   					+'</div>'
			    +'</div>'
			    +'<div class="form-group">'
   					+'<label class="col-md-4 control-label" for="name" ></label>'
   					+'<div class="col-md-8">'
   						+'<input type="text" class="form-control" id="js_effect_sizex_value" >'
   					+'</div>'
			    +'</div>'
			    +'<div class="form-group">'
   					+'<label class="col-md-4 control-label" for="name" >垂直缩放</label>'
   					+'<div class="col-md-8">'
   						+'<input type="range" class="form-control" id="js_effect_sizey" min="0" step="1">'
   					+'</div>'
			    +'</div>'
			    +'<div class="form-group">'
   					+'<label class="col-md-4 control-label" for="name" ></label>'
   					+'<div class="col-md-8">'
   						+'<input type="text" class="form-control" id="js_effect_sizey_value" >'
   					+'</div>'
			    +'</div>'*/
			    +'<div class="form-group">'
   					+'<label class="col-md-4 control-label" for="name" ></label>'
   					+'<div class="col-md-8">'
   						+'<button type="button" class="btn btn-sm pull-right" id="js_effect_btn">关闭</button>'
   					+'</div>'
			    +'</div>');
		$('#js_effect_h_form').append(elem);

		if($('#ocx').find('#move_box').length>0){
			$('#move_box').remove();
		}else{
			var effectBox=$('<div id="move_box"></div>');
			$('#ocx').append(effectBox);
		}
		
	}
	function effectEditShow(effectAttr,id,index,type,effectType){
		
		$('#js_carve').removeClass('col-md-6').addClass('col-md-4');
        $('#js_carve_edit').show();
        $('#js_carve_edit .list li').eq(1).trigger('click');
        
		initEffectStyle(effectAttr);
		initEffectOperate(effectAttr);

        //初始化effect的值
        function initEffectStyle(effectAttr){
        	
        	//显示滚动条
        	if($('#js_effect_h_form').height()>$('.effect_h_form_wrap').height()){
        		$('.effect_edit_track').show();
	        	var s1=new Scrollbar({
					dirSelector:'y',
					contSelector:$('.effect_h_form_wrap'),
					barSelector:$('.effect_edit_track'),
					sliderSelector:$('.effect_edit_scroll')
				}); 
        	}

        	var attr=JSON.parse(effectAttr);
        	$('#move_box').css('left',attr.x1);
        	$('#move_box').css('top',attr.y1);
        	$('#move_box').css('width',attr.width);
        	$('#move_box').css('height',attr.height);
			
			$('#js_effect_left').attr('max',$('#ocx').width());
        	$('#js_effect_width').attr('max',$('#ocx').width());
        	$('#js_effect_top').attr('max',$('#ocx').height());
        	$('#js_effect_height').attr('max',$('#ocx').height());
        	
        	$('#js_effect_left,#js_effect_left_value').val(attr.x1);
        	$('#js_effect_top,#js_effect_top_value').val(attr.y1);
        	$('#js_effect_width,#js_effect_width_value').val(attr.width);
        	$('#js_effect_height,#js_effect_height_value').val(attr.height);
			/*
			$('#js_effect_sizex,#js_effect_sizex').attr('max',1000);
			$('#js_effect_sizex,#js_effect_sizex_value').val(attr.sizex);
			$('#js_effect_sizey,#js_effect_sizey_value').val(attr.sizey);
			*/
        	
        }
		
		function initEffectOperate(effectAttr){
			var obj={
				trackType:type,
				trackIndex:index,
				subClipId:id,
				name:effectType,
				attr:JSON.parse(effectAttr)
			};
			console.log('attr',obj.attr)
			obj.attr.x1=parseFloat($('#js_effect_left').val());
			obj.attr.y1=parseFloat($('#js_effect_top').val());
			
			obj.attr.x2=obj.attr.x1+parseFloat($('#js_effect_width').val());
			obj.attr.y2=obj.attr.y1+parseFloat($('#js_effect_height').val());
			//obj.attr.sizex=parseFloat($('#js_effect_sizex').val());
			//obj.attr.sizey=parseFloat($('#js_effect_sizey').val());
			
			
			$('#js_effect_left')[0].oninput=function(e){
				var value=parseFloat($(e.target).val());
				$('#js_effect_left_value').val(value);
				obj.attr.x1=value;
				$('#move_box').css('left',value);
				updateJson(obj);
			};
			

			$('#js_effect_top')[0].oninput=function(e){
				var value=parseFloat($(e.target).val())
				$('#js_effect_top_value').val(value);
				obj.attr.y1=value;
				
				$('#move_box').css('top',value);
				updateJson(obj);
			};
			
			$('#js_effect_width')[0].oninput=function(e){
				var value=parseFloat($(e.target).val())
				$('#js_effect_width_value').val(value);
				obj.attr.width=value;

				$('#move_box').css('width',value);
				updateJson(obj);

			};

			$('#js_effect_height')[0].oninput=function(e){
				var value=parseFloat($(e.target).val());
				$('#js_effect_height_value').val(value);
				obj.attr.height=value;
				$('#move_box').css('height',value);
				updateJson(obj);
			};
			
			/*$('#js_effect_sizex')[0].oninput=function(e){
				var value=parseFloat($(e.target).val());
				$('#js_effect_sizex_value').val(value);
				obj.attr.sizex=parseFloat(value);
				var sizeValue=parseFloat($('#js_effect_width_value').val())*(value/100);
				updateJson(obj);
			};
			$('#js_effect_sizey')[0].oninput=function(e){
				var value=parseFloat($(e.target).val());
				$('#js_effect_sizey_value').val($(e.target).val());
				obj.attr.sizey=parseFloat($(e.target).val());
				updateJson(obj);
			};*/

			function updateJson(obj){
				PLAYER.OCX.adjustEffect(obj);
				PLAYER.OCX.seek(parseInt(PLAYER.TR.currTime)); 
				PLAYER.operateJson.updateEffectClip(id,obj.attr);
			}

	        $('#js_effect_btn').on('click',function(){
	            PLAYER.hideEffectEdit();
	        });
		}
		
	}
});



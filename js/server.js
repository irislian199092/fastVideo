/*--------------------------------------------query--------------------------------------------*/
(function(root, factory) {
	//amd
	if (typeof define === 'function' && define.amd) {
		define(['$'], factory);
	} else if (typeof exports === 'object') { //umd
		module.exports = factory();
	} else {
		root.Query = factory(window.Zepto || window.jQuery || $);
	}
})(this, function($) {
	var Query = {
		getQuery: function(name, type, win) {
			var reg = new RegExp("(^|&|#)" + name + "=([^&]*)(&|$|#)", "i");
			win = win || window;
			var Url = win.location.href;
			var u, g, StrBack = '';
			if (type == "#") {
				u = Url.split("#");
			} else {
				u = Url.split("?");
			}
			if (u.length == 1) {
				g = '';
			} else {
				g = u[1];
			}
			if (g != '') {
				gg = g.split(/&|#/);
				var MaxI = gg.length;
				str = arguments[0] + "=";
				for (i = 0; i < MaxI; i++) {
					if (gg[i].indexOf(str) == 0) {
						StrBack = gg[i].replace(str, "");
						break;
					}
				}
			}
			return decodeURI(StrBack);
		},
		getForm: function(form) {
			var result = {},
				tempObj = {};
			$(form).find('*[name]').each(function(i, v) {
				var nameSpace,
					name = $(v).attr('name'),
					val = $.trim($(v).val()),
					tempArr = [];
				if (name == '' || $(v).hasClass('getvalued')) {
					return;
				}

				if ($(v).data('type') == "money") {
					val = val.replace(/\,/gi, '');
				}

				//处理radio add by yhx  2014-06-18
				if ($(v).attr("type") == "radio") {
					var tempradioVal = null;
					$("input[name='" + name + "']:radio").each(function() {
						if ($(this).is(":checked"))
							tempradioVal = $.trim($(this).val());
					});
					if (tempradioVal) {
						val = tempradioVal;
					} else {
						val = "";
					}
				}


				if ($(v).attr("type") == "checkbox") {
					var tempradioVal = [];
					$("input[name='" + name + "']:checkbox").each(function() {
						if ($(this).is(":checked"))
							tempradioVal.push($.trim($(this).val()));
					});
					if (tempradioVal.length) {
						val = tempradioVal.join(',');
					} else {
						val = "";
					}
				}

				if ($(v).attr('listvalue')) {
					if (!result[$(v).attr('listvalue')]) {
						result[$(v).attr('listvalue')] = [];
						$("input[listvalue='" + $(v).attr('listvalue') + "']").each(function() {
							if ($(this).val() != "") {
								var name = $(this).attr('name');
								var obj = {};
								if ($(this).data('type') == "json") {
									obj[name] = JSON.parse($(this).val());
								} else {
									obj[name] = $.trim($(this).val());
								}
								if ($(this).attr("paramquest")) {
									var o = JSON.parse($(this).attr("paramquest"));
									obj = $.extend(obj, o);
								}
								result[$(v).attr('listvalue')].push(obj);
								$(this).addClass('getvalued');
							}
						});
					}
				}

				if ($(v).attr('arrayvalue')) {
					if (!result[$(v).attr('arrayvalue')]) {
						result[$(v).attr('arrayvalue')] = [];
						$("input[arrayvalue='" + $(v).attr('arrayvalue') + "']").each(function() {
							if ($(this).val() != "") {
								var obj = {};
								if ($(this).data('type') == "json") {
									obj = JSON.parse($(this).val());
								} else {
									obj = $.trim($(this).val());
								}
								if ($(this).attr("paramquest")) {
									var o = JSON.parse($(this).attr("paramquest"));
									obj = $.extend(obj, o);
								}
								result[$(v).attr('arrayvalue')].push(obj);
							}
						});
					}
				}
				if (name == '' || $(v).hasClass('getvalued')) {
					return;
				}
				//构建参数
				if (name.match(/\./)) {
					tempArr = name.split('.');
					nameSpace = tempArr[0];
					if (tempArr.length == 3) {
						tempObj[tempArr[1]] = tempObj[tempArr[1]] || {};
						tempObj[tempArr[1]][tempArr[2]] = val;
					} else {
						if ($(v).data('type') == "json") {
							tempObj[tempArr[1]] = JSON.parse(val);
							if ($(v).attr("paramquest")) {
								var o = JSON.parse($(v).attr("paramquest"));
								tempObj[tempArr[1]] = $.extend(tempObj[tempArr[1]], o);
							}
						} else {
							tempObj[tempArr[1]] = val;
						}
					}
					if (!result[nameSpace]) {
						result[nameSpace] = tempObj;
					} else {
						result[nameSpace] = $.extend({}, result[nameSpace], tempObj);
					}
				} else {
					result[name] = val;
				}

			});
			var obj = {};
			for (var o in result) {
				var v = result[o];
				if (typeof v == "object") {
					obj[o] = JSON.stringify(v);
				} else {
					obj[o] = result[o]
				}
			}
			$('.getvalued').removeClass('getvalued');
			return obj;
		},
		setHash: function(obj) {
			var str = '';
			obj = $.extend(this.getHash(), obj)
			var arr = [];
			for (var v in obj) {
				if(obj[v]!=''){
					arr.push(v + '=' + encodeURIComponent(obj[v]));
				}
			}
			str+=arr.join('&');
			location.hash = str;
			return this;
		},
		getHash: function(name) {
			if (typeof name === "string") {
				return this.getQuery(name, "#");
			} else {
				var obj = {};
				var hash = location.hash;
				if(hash.length>0){
					hash = hash.substr(1);
					var hashArr = hash.split('&');
					for (var i = 0, l = hashArr.length; i < l; i++) {
						var a = hashArr[i].split('=');
						if (a.length > 0) {
							obj[a[0]] = decodeURI(a[1]) || '';
						}
					}
				}
				return obj;
			}
		}
	};
	return Query;
});
/*--------------------------------------------paging--------------------------------------------*/
(function(root, factory) {
	//amd
	if (typeof define === 'function' && define.amd) {
		define(['$', 'query'], factory);
	} else if (typeof exports === 'object') { //umd
		module.exports = factory();
	} else {
		root.Paging = factory(window.Zepto || window.jQuery || $, Query);
	}
})(this, function($, Query) {
	$.fn.Paging = function(settings) {
		var arr = [];
		$(this).each(function() {
			var options = $.extend({
				target: $(this)
			}, settings);
			var lz = new Paging();
			lz.init(options);
			arr.push(lz);
		});
		return arr;
	};

	function Paging() {
		var rnd = Math.random().toString().replace('.', '');
		this.id = 'Paging_' + rnd;
	}
	Paging.prototype = {
		init: function(settings) {
			this.settings = $.extend({
				callback: null,
				pagesize: 10,
				current: 1,
				prevTpl: "上一页",
				nextTpl: "下一页",
				firstTpl: "首页",
				lastTpl: "末页",
				ellipseTpl: "...",
				toolbar: false,
				hash:true,
				pageSizeList: [5, 10, 15, 20]
			}, settings);
			this.target = $(this.settings.target);
			this.container = $('<div id="' + this.id + '" class="ui-paging-container"/>');
			this.target.append(this.container);
			this.render(this.settings);
			this.format();
			this.bindEvent();
		},
		render: function(ops) {
			this.count = ops.count || this.settings.count;
			this.pagesize = ops.pagesize || this.settings.pagesize;
			this.current = ops.current || this.settings.current;
			this.pagecount = Math.ceil(this.count / this.pagesize);
			this.format();
		},
		bindEvent: function() {
			var _this = this;
			this.container.on('click', 'li.js-page-action,li.ui-pager', function(e) {
				if ($(this).hasClass('ui-pager-disabled') || $(this).hasClass('focus')) {
					return false;
				}
				if ($(this).hasClass('js-page-action')) {
					if ($(this).hasClass('js-page-first')) {
						_this.current = 1;
					}
					if ($(this).hasClass('js-page-prev')) {
						_this.current = Math.max(1, _this.current - 1);
					}
					if ($(this).hasClass('js-page-next')) {
						_this.current = Math.min(_this.pagecount, _this.current + 1);
					}
					if ($(this).hasClass('js-page-last')) {
						_this.current = _this.pagecount;
					}
				} else if ($(this).data('page')) {
					_this.current = parseInt($(this).data('page'));
				}
				_this.go();
			});
			/*
			$(window).on('hashchange',function(){
				var page=  parseInt(Query.getHash('page'));
				if(_this.current !=page){
					_this.go(page||1);
				}
			})
			 */
		},
		go: function(p) {
			var _this = this;
			this.current = p || this.current;
			this.current = Math.max(1, _this.current);
			this.current = Math.min(this.current, _this.pagecount);
			this.format();
			if(this.settings.hash){
				Query.setHash({
					page:this.current
				});
			}
			this.settings.callback && this.settings.callback(this.current, this.pagesize, this.pagecount);
		},
		changePagesize: function(ps) {
			this.render({
				pagesize: ps
			});
		},
		format: function() {
			var html = '<ul>'
			html += '<li class="js-page-first js-page-action ui-pager" >' + this.settings.firstTpl + '</li>';
			html += '<li class="js-page-prev js-page-action ui-pager">' + this.settings.prevTpl + '</li>';
			if (this.pagecount > 6) {
				html += '<li data-page="1" class="ui-pager">1</li>';
				if (this.current <= 2) {
					html += '<li data-page="2" class="ui-pager">2</li>';
					html += '<li data-page="3" class="ui-pager">3</li>';
					html += '<li class="ui-paging-ellipse">' + this.settings.ellipseTpl + '</li>';
				} else
				if (this.current > 2 && this.current <= this.pagecount - 2) {
					html += '<li>' + this.settings.ellipseTpl + '</li>';
					html += '<li data-page="' + (this.current - 1) + '" class="ui-pager">' + (this.current - 1) + '</li>';
					html += '<li data-page="' + this.current + '" class="ui-pager">' + this.current + '</li>';
					html += '<li data-page="' + (this.current + 1) + '" class="ui-pager">' + (this.current + 1) + '</li>';
					html += '<li class="ui-paging-ellipse" class="ui-pager">' + this.settings.ellipseTpl + '</li>';
				} else {
					html += '<li class="ui-paging-ellipse" >' + this.settings.ellipseTpl + '</li>';
					for (var i = this.pagecount - 2; i < this.pagecount; i++) {
						html += '<li data-page="' + i + '" class="ui-pager">' + i + '</li>'
					}
				}
				html += '<li data-page="' + this.pagecount + '" class="ui-pager">' + this.pagecount + '</li>';
			} else {
				for (var i = 1; i <= this.pagecount; i++) {
					html += '<li data-page="' + i + '" class="ui-pager">' + i + '</li>'
				}
			}
			html += '<li class="js-page-next js-page-action ui-pager">' + this.settings.nextTpl + '</li>';
			html += '<li class="js-page-last js-page-action ui-pager">' + this.settings.lastTpl + '</li>';
			html += '</ul>';
			this.container.html(html);
			if (this.current == 1) {
				$('.js-page-prev', this.container).addClass('ui-pager-disabled');
				$('.js-page-first', this.container).addClass('ui-pager-disabled');
			}
			if (this.current == this.pagecount) {
				$('.js-page-next', this.container).addClass('ui-pager-disabled');
				$('.js-page-last', this.container).addClass('ui-pager-disabled');
			}
			this.container.find('li[data-page="' + this.current + '"]').addClass('focus').siblings().removeClass('focus');
			if (this.settings.toolbar) {
				this.bindToolbar();
			}
		},
		bindToolbar: function() {
			var _this = this;
			var html = $('<li class="ui-paging-toolbar"><select class="ui-select-pagesize"></select><input type="text" class="ui-paging-count"/><a href="javascript:void(0)">跳转</a></li>');
			var sel = $('.ui-select-pagesize', html);
			var str = '';
			for (var i = 0, l = this.settings.pageSizeList.length; i < l; i++) {
				str += '<option value="' + this.settings.pageSizeList[i] + '">' + this.settings.pageSizeList[i] + '条/页</option>';
			}
			sel.html(str);
			sel.val(this.pagesize);
			$('input', html).val(this.current);
			$('input', html).click(function() {
				$(this).select();
			}).keydown(function(e) {
				if (e.keyCode == 13) {
					var current = parseInt($(this).val()) || 1;
					_this.go(current);
				}
			});
			$('a', html).click(function() {
				var current = parseInt($(this).prev().val()) || 1;
				_this.go(current);
			});
			sel.change(function() {
				_this.changePagesize($(this).val());
			});
			this.container.children('ul').append(html);
		}
	}
	return Paging;
});

/*--------------------------------------------滚动条--------------------------------------------*/
(function(win,doc,$){
	function Scrollbar(options){
		this._init(options);
	};
	$.extend(Scrollbar.prototype,{
		//初始化函数
		_init:function(options){
			var self=this;
			self.options={
				dirSelector    :'x', //滚动条方向
				contSelector   :'',  //内容选择器
				barSelector    :'',  //滑动槽选择器
				sliderSelector :'',  //滑动块选择器
				wheelStep      :'10' //滚轮步长
			}
			$.extend(true,self.options,options||{});
			self._initDom();
			return self;
		},
		//DOM元素选择操作
		_initDom:function(){
			this.$dir=this.options.dirSelector;
			this.$cont=this.options.contSelector;
			this.$bar=this.options.barSelector;
			this.$slider=this.options.sliderSelector;
			this.$wheelStep=this.options.wheelStep;
			this.$doc=$(doc);
			if(this.$dir==='x'){
			    this._initSliderDragEvent()
			    	._bindContScrollX();
			}
			if(this.$dir==='y'){
				this._initSliderDragEvent()
			    	._bindContScrollY()
			    	._bindMouseWheel();
			}
		},
		//滑块开始拖动函数
		_initSliderDragEvent:function(){
			var self=this;
			var doc=this.$doc;
			if(self.$dir==='x'&&self.$slider){
				var	sliderStartPosX; //鼠标开始拖拽位置
				var	sliderMovePosX;  //鼠标移动时位置
				var contStartPosX;   //内容开始时的滚动距离
				var scaleX;           //内容可滚动的最大高度跟滑块可滑动的距离的比值
				var contMovePosX;    //内容移动时到可视区的距离
				function mousemoveHandler(e){
					e.preventDefault();
					sliderMovePosX=e.pageX;
					contMovePosX=scaleX*(sliderMovePosX-sliderStartPosX)+contStartPosX;
					self._scrollToX(contMovePosX);
				}
			};
			if(self.$dir==='y'&&self.$slider){
				var	sliderStartPosY; //鼠标开始拖拽位置
				var	sliderMovePosY;  //鼠标移动时位置
				var contStartPosY;   //内容开始时的滚动距离
				var scaleY;          //内容可滚动的最大高度跟滑块可滑动的距离的比值
				var contMovePosY;    //内容移动时到可视区的距离
				function mousemoveHandler(e){
					e.preventDefault();
					sliderMovePosY=e.pageY;
					contMovePosY=scaleY*(sliderMovePosY-sliderStartPosY)+contStartPosY;
					self._scrollToY(contMovePosY);
				};
			}
			self.$slider.on('mousedown',function(e){
				e.preventDefault();
				/*X方向*/
				sliderStartPosX=e.pageX;     //鼠标开始拖拽位置
				contStartPosX=self.$cont[0].scrollLeft; //内容开始滚动距离
				scaleX=self._getContMaxScrollX()/self._getSliderMaxScrollX();//比例
				/*Y方向*/
				sliderStartPosY=e.pageY;
				contStartPosY=self.$cont[0].scrollTop;
				scaleY=self._getContMaxScrollY()/self._getSliderMaxScrollY();
				/*移动时函数*/
				doc.on('mousemove.slider',mousemoveHandler).on('mouseup.slider',function(e){
					doc.off('.slider');
				});
			});
			return self;
		},
		//y轴绑定滚轮事件
		_bindMouseWheel:function(){
			var self=this;
			//火狐和其他浏览器的滚轮事件区别
			self.$cont.on('mousewheel DOMMouseScroll',function(e){
				e.preventDefault();
				var oEv=e.originalEvent;//指向原生对象事件
				var range=oEv.wheelDelta?-oEv.wheelDelta/120:(oEv.detail||0)/3;
				var value=self.$cont[0].scrollTop+range*self.$wheelStep;
				self._scrollToY(value);
			})
			return self;
		},
		//x轴监视内容的滚动，滑块开始滚动
		_bindContScrollX:function(){
			var self=this;
			self.$cont.on('scroll',function(){
				self.$slider.css({
					left:self._getSliderScrollX()
				})
			})
			return self;
		},
		//y轴监视内容的滚动，滑块开始滚动
		_bindContScrollY:function(){
			var self=this;
			self.$cont.on('scroll',function(){
				self.$slider.css({
					top:self._getSliderScrollY()
				})
			})
			return self;
		},

		//x轴内容可滚动的最大高度
		_getContMaxScrollX:function(){
			var self=this;
			var _c=self.$cont[0].scrollWidth-self.$cont.width();
			return _c;
		},
		//y轴内容可滚动的最大高度
		_getContMaxScrollY:function(){
			var self=this;
			var _c=self.$cont[0].scrollHeight-self.$cont.height();
			return _c;
		},

		//x轴滑块可滑动的距离
		_getSliderMaxScrollX:function(){
			var self=this;
			return self.$bar.width()-self.$slider.width();

		},
		//y轴滑块可滑动的距离
		_getSliderMaxScrollY:function(){
			var self=this;
			return self.$bar.height()-self.$slider.height();
		},
		//x轴获取滑块当前滚动位置
		_getSliderScrollX:function(){
			var self=this;
			var n=Math.min(self._getSliderMaxScrollX(),self.$cont[0].scrollLeft*self._getSliderMaxScrollX()/self._getContMaxScrollX());
			return n;
		},
		//y轴获取滑块当前滚动位置
		_getSliderScrollY:function(){
			var self=this;
			var n=Math.min(self._getSliderMaxScrollY(),self.$cont[0].scrollTop*self._getSliderMaxScrollY()/self._getContMaxScrollY());
			return n;
		},
		//x轴内容滚动距离
		_scrollToX:function(pos){
			var self=this;
			self.$cont.scrollLeft(pos);
		},
		//y轴内容滚动距离
		_scrollToY:function(pos){
			var self=this;
			self.$cont.scrollTop(pos);
		}
	})
	win.Scrollbar=Scrollbar;
})(window,document,jQuery);


/*--------------------------------------------人脸识别弹窗--------------------------------------*/
(function(win,player,$,doc){
	function CreateFacialModal(options){
		this._init(options);
	}
	$.extend(CreateFacialModal.prototype,{
		_init:function(options){
			var self=this;
			self.options={
				cssName:'facial',		
				headerTitle:'视频分析',
				data:[]
			};
			$.extend(true,self.options,options||{});
			self._initDom(self.options.data);

			return self;
		},
		_initDom:function(){
			var self=this;

			var dom=$('<div id="js_create'+self.options.cssName+'Modal" class="create_'+self.options.cssName+'_modal">'
				+'<div class="fast_content">'
					+'<div class="fast_header" id="js_fast_header">'
						+'<span class="icojam_delete"></span>'
						+'<h4>视频分析</h4>'
					+'</div>'
					+'<div class="fast_body row">'
						+'<div class="col-md-12">'
							+'<div class="facial_box" id="js_facial_box">'
							+'</div>'
							+'<div class="facial_list_track">'
								+'<div class="facial_list_scroll"></div>'
							+'</div>'
						+'</div>'
						+'<div class="col-md-12 '+self.options.cssName+'_pagination">'
							+'<ul class="pager" id="js_'+self.options.cssName+'_pager">'
							+'</ul>'
						+'</div>'
					+'</div>'
					+'<div class="fast_footer">'
						+'<button type="button" class="fast_btn" id="js_'+self.options.cssName+'_cancel">关闭</button>'
					+'</div>'
				+'</div>'
				+'<iframe  src="" frameBorder="0" style="position: absolute;top: 0px; left: 0px; width: 100%; height: 100%; z-index: -1; filter: alpha(opacity = 0);">'
				+'</iframe>'
			+'</div>');

			dom.insertAfter($('.container-fluid'));	
			self._initStyle();
			return self;	
		},
		_initStyle:function(){
			var self=this;
			self._initDrag();
			self._operateInit();
			return self;
		},
		_initDrag:function(){
			var self=this;
			$('#js_fast_header').mousedown(function(e) {
				var startX=e.clientX;
				var startY=e.clientY;
				var moveX;
				var moveY;
				var offsetX=$('#js_create'+self.options.cssName+'Modal').position().left;
				var offsetY=$('#js_create'+self.options.cssName+'Modal').position().top;
				$(body).css('cursor','move');
				function mousemoveHandler(e){
					e.preventDefault();
					moveX=e.clientX;
					moveY=e.clientY;

					var _left=moveX-startX+offsetX;
					var _top=moveY-startY+offsetY;
					if(_left<=0){
						_left=0;
					}
					if(_left>=($('#body').width()-$('#js_create'+self.options.cssName+'Modal').width())){
						_left=$('#body').width()-$('#js_create'+self.options.cssName+'Modal').width();
					}
					if(_top<=0){
						_top=0;
					}
					if(_top>=($('#body').height()-$('#js_create'+self.options.cssName+'Modal').height())){
						_top=$('#body').height()-$('#js_create'+self.options.cssName+'Modal').height();
					}
					$('#js_create'+self.options.cssName+'Modal').css('left',_left);
					$('#js_create'+self.options.cssName+'Modal').css('top',_top);
				}

				/*移动时函数*/
				$(doc).on('mousemove',mousemoveHandler).on('mouseup',function(e){
					$(doc).off('mousemove');
					$(body).css('cursor','default');
				});
			});
		},
		
		_operateInit:function(){
			var self=this;
			//点击取消和X
			$('#js_'+self.options.cssName+'_cancel, .icojam_delete').on('click',function(){
				$('#js_create'+self.options.cssName+'Modal').remove();
				$('#js_pageCover').hide();
				//素材列表
				PLAYER.model=null;
			});
			return self;
		}	

	});	
	player.CreateFacialModal=CreateFacialModal;
})(window,PLAYER,jQuery,document);

/*--------------------------------------------server--------------------------------------------*/
$(document).ready(function() {

document.onselectstart=function(e){
	console.log('e',e.srcElement)
	if(e.srcElement.tagName==='input'||e.srcElement.tagName==='INPUT'||e.srcElement.tagName==="textarea" || e.srcElement.tagName==="TEXTAREA"||e.srcElement.tagName==='span'||e.srcElement.tagName==='SPAN'){
		return true;
	}else{
		return false;
	}	
};

/*----------------------初始化模态框开始----------------------*/
//初始化工程模态框
var createInitModal=PLAYER.singelton(function(){
	var s1=$('<div id="js_initProjectModal" class="init_pro_modal">'
			+'<div class="fast_content">'
				+'<div class="fast_header">'
					+'<h4>打开工程</h4>'
				+'</div>'
				+'<div class="fast_body row">'
					+'<div class="col-md-12 left">'
						+'<ul class="project_list" id="js_init_project_list" onselectstart="return false">'
						+'</ul>'
						+'<div class="project_list_track">'
							+'<div class="project_list_scroll"></div>'
						+'</div>'
					+'</div>'
					+'<div class="col-md-12 project_pagination">'
						+'<ul class="pager" id="js_pro_pager">'
						+'</ul>'
					+'</div>'
				+'</div>'
				+'<div class="fast_footer">'
					+'<button type="button" class="fast_btn" id="js_modal_initOpenNew">打开</button>'
					+'<button type="button" class="fast_btn" id="js_modal_initNew">新建</button>'
				+'</div>'
			+'</div>'
			+'<iframe  src="" frameBorder="0" style="position: absolute;top: 0px; left: 0px; width: 100%; height: 100%; z-index: -1; filter: alpha(opacity = 0);">'
			+'</iframe>'
		+'</div>');
	s1.insertAfter($('.container-fluid'));
	return s1;
});
//初始化新建工程模态框
var createInitNewModal=PLAYER.singelton(function(){
	var s1=$('<div id="js_createProjectModal" class="create_pro_modal">'
			+'<div class="fast_content">'
				+'<div class="fast_header">'
					+'<span class="icojam_delete"></span>'
					+'<h4>创建工程</h4>'
				+'</div>'
				+'<div class="fast_body row">'
					+'<div class="col-md-12 right">'
						+'<form id="js_create_form">'
							+'<div class="form-group">'
							    +'<input type="text" class="form-control" name="name" placeholder="未命名" id="js_create_form_name">'
							+'</div>'
							+'<div class="form-group" id="js_create_pro_type">'
							+'</div>'
						+'</form>'
					+'</div>'
				+'</div>'
				+'<div class="fast_footer">'
					+'<button type="button" class="fast_btn" id="js_modal_createNew">新建</button>'
				+'</div>'
			+'</div>'
			+'<iframe  src="" frameBorder="0" style="position: absolute;top: 0px; left: 0px; width: 100%; height: 100%; z-index: -1; filter: alpha(opacity = 0);">'
			+'</iframe>'
		+'</div>');
	s1.insertAfter($('.container-fluid'));
	return s1;
});
//保存后编辑工程模态框
var createSaveOpenModal=PLAYER.singelton(function(){
	var s1=$('<div id="js_editProjectModal" class="edit_pro_modal">'
			+'<div class="fast_content">'
				+'<div class="fast_header">'
					+'<span class="icojam_delete"></span>'
					+'<h4>编辑工程</h4>'
				+'</div>'
				+'<div class="fast_body row">'
					+'<div class="col-md-12 left">'
						+'<ul class="project_list" id="js_edit_project_list">'
						+'</ul>'
						+'<div class="project_edit_list_track">'
							+'<div class="project_edit_list_scroll"></div>'
						+'</div>'
					+'</div>'
					+'<div class="col-md-12 project_edit_pagination">'
						+'<ul class="pager" id="js_pro_edit_pager">'
						+'</ul>'
					+'</div>'
				+'</div>'
			+'</div>'
			+'<iframe  src="" frameBorder="0" style="position: absolute;top: 0px; left: 0px; width: 100%; height: 100%; z-index: -1; filter: alpha(opacity = 0);">'
			+'</iframe>'
		+'</div>');
	s1.insertAfter($('.container-fluid'));
	return s1;
});
//创建单例保存模态框
var createSaveModal=PLAYER.singelton(function(){
	var s1=$('<div id="js_saveProjectModal" class="save_pro_modal">'
				+'<div class="fast_content">'
					+'<div class="fast_header">'
						+'<span class="icojam_delete"></span>'
						+'<h4>保存工程</h4>'
					+'</div>'
					+'<div class="fast_footer">'
						+'<button type="button" class="fast_btn" id="js_modal_savePro">确定</button>'
						+'<button type="button" class="fast_btn" id="js_modal_cancelPro">取消</button>'
					+'</div>'
				+'</div>'
				+'<iframe  src="" frameBorder="0" style="position: absolute;top: 0px; left: 0px; width: 100%; height: 100%; z-index: -1; filter: alpha(opacity = 0);">'
				+'</iframe>'
			+'</div>');
	s1.insertAfter($('.container-fluid'));
	return s1;
});
//合成打包工程
var createExportModal=PLAYER.singelton(function(){
	var s1=$('<div id="js_exportProjectModal" class="export_pro_modal">'
			+'<div class="fast_content">'
				+'<div class="fast_header">'
					+'<span class="icojam_delete"></span>'
					+'<h4>合成打包</h4>'
				+'</div>'
				+'<div class="fast_body row">'
					+'<div class="col-md-12">'
						+'<form id="js_create_form" class="form-horizontal">'
							+'<div class="form-group">'
								+'<label for="schema" class="col-md-3 control-label">文件模板</label>'
								+'<div class="col-md-9">'
							    	+'<select class="form-control" name="schema" id="js_export_form_schema"></select>'
							    +'</div>'
							+'</div>'
							+'<div class="form-group">'
								+'<label for="name" class="col-md-3 control-label">文件名称</label>'
								+'<div class="col-md-9">'
							    	+'<input type="text" class="form-control" name="name" placeholder="打包" id="js_export_form_name">'
							    +'</div>'
							+'</div>'
							+'<div class="form-group">'
								+'<div class="col-md-offset-3 col-md-9">'
							      +'<div class="checkbox">'
							        +'<label>'
							          +'<input type="checkbox" id="js_export_form_check">整个序列'
							        +'</label>'
							      +'</div>'
							    +'</div>'
							+'</div>'
						+'</form>'
					+'</div>'
				+'</div>'
				+'<div class="fast_footer">'
					+'<div class="col-md-offset-3 col-md-9">'
						+'<button type="button" class="fast_btn" id="js_modal_export">打包</button>'
						+'<button type="button" class="fast_btn" id="js_export_modal_cancelPro">取消</button>'
					+'</div>'
				+'</div>'
			+'</div>'
			+'<iframe  src="" frameBorder="0" style="position: absolute;top: 0px; left: 0px; width: 100%; height: 100%; z-index: -1; filter: alpha(opacity = 0);">'
			+'</iframe>'
		+'</div>');
	s1.insertAfter($('.container-fluid'));
	return s1;
});
//创建网络素材工程
var createAddProgramModal=PLAYER.singelton(function(){
	var s1=$('<div id="js_addProgramModal" class="add_pro_modal">'
			+'<div class="fast_content">'
				+'<div class="fast_header">'
					+'<span class="icojam_delete"></span>'
					+'<h4>添加网络素材</h4>'
				+'</div>'
				+'<div class="fast_body row">'
					+'<div class="col-md-12">'
						+'<form id="js_create_form" class="form-horizontal">'
							
							+'<div class="form-group">'
								+'<label for="name" class="col-md-3 control-label">文件名称</label>'
								+'<div class="col-md-9">'
							    	+'<input type="text" class="form-control" name="name" placeholder="文件名称" id="js_add_form_name">'
							    +'</div>'
							+'</div>'
							+'<div class="form-group">'
								+'<label for="name" class="col-md-3 control-label">URL</label>'
								+'<div class="col-md-9">'
							    	+'<input type="text" class="form-control" name="name" placeholder="http://" id="js_add_form_url">'
							    +'</div>'
							+'</div>'
						+'</form>'
					+'</div>'
				+'</div>'
				+'<div class="fast_footer">'
					+'<div class="col-md-offset-3 col-md-9">'
						+'<button type="button" class="fast_btn" id="js_modal_add">添加</button>'
						+'<button type="button" class="fast_btn" id="js_add_modal_cancelPro">取消</button>'
					+'</div>'
				+'</div>'
			+'</div>'
			+'<iframe  src="" frameBorder="0" style="position: absolute;top: 0px; left: 0px; width: 100%; height: 100%; z-index: -1; filter: alpha(opacity = 0);">'
			+'</iframe>'
		+'</div>');
	s1.insertAfter($('.container-fluid'));
	return s1;
});
//创建音量工程
var createVolumeModal=PLAYER.singelton(function(){
	var s1=$('<div id="js_createVolumeModal" class="create_volume_modal">'
			+'<div class="fast_content">'
				+'<div class="fast_header">'
					+'<span class="icojam_delete"></span>'
					+'<h4>调节音量</h4>'
				+'</div>'
				+'<div class="fast_body row">'
					+'<div class="col-md-12 right">'
						+'<div class="volume_num" id="js_volume_num">'
							+'<span>0</span>'
							+'<span>100</span>'
							+'<span>400</span>'
						+'</div>'
						+'<form id="js_volume_form">'
							+'<div class="form-group">'
							    +'<input type="range" class="form-control" name="range" min="0" max="400" step="10" value="" id="js_volume_form_range">'
							+'</div>'
							+'<div class="form-group">'
							    +'<input type="text" class="form-control" name="name" placeholder="未命名" id="js_volume_form_name">'
							+'</div>'
						+'</form>'
					+'</div>'
				+'</div>'
				+'<div class="fast_footer">'
					+'<button type="button" class="fast_btn" id="js_volume_save">确定</button>'
					+'<button type="button" class="fast_btn" id="js_volume_cancel">取消</button>'
				+'</div>'
			+'</div>'
			+'<iframe  src="" frameBorder="0" style="position: absolute;top: 0px; left: 0px; width: 100%; height: 100%; z-index: -1; filter: alpha(opacity = 0);">'
			+'</iframe>'
		+'</div>');
	s1.insertAfter($('.container-fluid'));
	return s1;
});
//删除特效模态框
PLAYER.createEffectModal=PLAYER.singelton(function(){
	
});

createInitModal();
createInitNewModal();
createSaveOpenModal();
createVolumeModal();
/*----------------------ajax设置开始----------------------*/
$.ajaxSetup({
  type: "POST",
  dataType : "json",
  error:function(XMLHttpRequest, textStatus, errorThrown){
  	alert('失败XMLHttpRequest',XMLHttpRequest);
  	alert('失败XMLHttpRequest',textStatus);
  	alert('失败XMLHttpRequest',errorThrown);
  }
});
/*----------------------发布数据----------------------*/
//初始化发布工程列表
$.ajax({
	url:serverUrl+'proj/list',
	data:{
		currentPage:1,
		pageSize:20
	},
	success:function(msg){
		if(msg.code===0&&msg.data!==null){
			PLAYER.observer.trigger('proList',msg.data);
		}else{
			console.log('error');
		}
	}
});
//初始化发布工程高标清模板
$.ajax({
	url:serverUrl+'proj/template',
	success:function(msg){
		if(msg.code===0&&msg.data!==null){
			PLAYER.observer.trigger('proTemplate',msg.data);
		}else{
			console.log('error');
		}
	}
});

//初始化获取全部节目列表	
$.ajax({
	url:serverUrl+'program/list',
	data:{
		"currentPage":1,
		"pageSize":36,
		"name":($('#js_programForm_name .form-control').val()||''),
		"provider":($('#js_programForm_cpspcode .form-control').val()||''),
		"programType":($('#js_programForm_type .form-control').val()||''),
		"from":($('#js_programForm_stime .form-control').val()||''),
		"to":($('#js_programForm_etime .form-control').val()||'')
	},
	success:function(msg){
		if(msg.code===0&&msg.data!==null){
			PLAYER.observer.trigger('getProgramList',msg.data);
		}else{
			console.log('error');
		}
	}
});
//点击素材搜索按钮筛选节目
$('#js_programForm_btn').on('click',function(){
	var nameValue=$('#js_programForm_name .form-control').val()||'';			//节目名称
	var providerValue=$('#js_programForm_cpspcode .form-control').val()||'';	//节目提供商
	var typeValue=$('#js_programForm_type .form-control').val()||'';			//节目类型
	var sTimeValue=$('#js_programForm_stime .form-control').val()||'';			//创建开始时间
	var eTimeValue=$('#js_programForm_etime .form-control').val()||'';			//创建结束时间
	$.ajax({
		url:serverUrl+'program/list',
		data:{
			"currentPage":1,
			"pageSize":36,
			"name":nameValue,
			"provider":providerValue,
			"programType":typeValue,
			"from":sTimeValue,
			"to":eTimeValue
		},
		success:function(msg){
			if(msg.code===0&&msg.data!==null){
				PLAYER.observer.trigger('getProgramList',msg.data);
				PLAYER.observer.trigger('projectData',JSON.stringify(PLAYER.jsonObj),true);
			}else{
				console.log('error');
			}
		}
	});
});
//初始化点击打开按钮发布工程数据
$('#js_modal_initOpenNew').on('click',function(){
	if(!$('#js_init_project_list li.active').length){
	alert('您必须选中一个');
	}else{
		//获取json
		$.ajax({
	  		url:serverUrl+'proj/info',
	  		data:{
	  			projectid:$('#js_init_project_list li.active').attr('data-id')
	  		},
	  		success:function(msg){
	  			if(msg.code===0&&msg.data!==null){
	  				$('#js_initProjectModal').hide();
					$('#js_pageCover').hide();
					$('.player_title').html($('#js_init_project_list li.active .project_list_name').html());
					
					var obj=JSON.parse(msg.data.projectcontent);
					if(obj.rootBin.sequence[0].tracks.length===0){
						$.each($('#js_time_ruler_bar_box .time_ruler_bar'),function(i,n){
		  					var attr={
		  						type:$(n).attr('data-type'),
			  					index:parseInt($(n).attr('data-index')),
			  					subclip:[]
		  					};
		  					obj.rootBin.sequence[0].tracks.push(attr);
		  				});
					}

					var proType;
					if(obj.height==='576'){
						proType='SD';
					}else if(obj.height==='1080'){
						proType='HD';
					}
					PLAYER.OCX.sendProType(proType);
					PLAYER.observer.trigger('projectData',JSON.stringify(obj)); //发布工程数据
					
	  			}else{
	  				console.log('error');
	  			}
	  		}
	  	});
	}
});	
//初始化点击新建按钮,发布工程数据
$('#js_modal_initNew').on('click',function(){
	$('#js_initProjectModal').hide();
	$('#js_createProjectModal').show();
	//点击新建按钮
	$('#js_modal_createNew').on('click',function(){
		if($('#js_create_form_name').val()===''){
			$('#js_create_form_name').val('未命名');
		}
		var nameValue=$('#js_create_form_name').val();
		$.ajax({
	  		url:serverUrl+'proj/create',
	  		data:{
	  			name:nameValue,
	  			templateid:$('#js_create_pro_type .form-control').val()
	  		},
	  		success:function(msg){
	  			if(msg.code===0&&msg.data!==null){
	  				//新建工程初始化轨道和json
	  				$('#js_createProjectModal').hide();
	  				$('#js_pageCover').hide();
	  				$('.player_title').html($('#js_create_form_name').val());

	  				var obj=JSON.parse(msg.data);
	  				$.each($('#js_time_ruler_bar_box .time_ruler_bar'),function(i,n){
	  					var attr={
	  						type:$(n).attr('data-type'),
		  					index:parseInt($(n).attr('data-index')),
		  					subclip:[]
	  					};
	  					obj.rootBin.sequence[0].tracks.push(attr);
	  				});
	  				var proType=parseInt($('#js_create_pro_type .form-control').val());
					if(proType===1){
						proType='SD';
					}else if(proType===2){
						proType='HD';
					}
					PLAYER.OCX.sendProType(proType);
	  				PLAYER.observer.trigger('projectData',JSON.stringify(obj)); //发布工程数据
	  			}else{
	  				console.log('error');
	  			}
	  		}
	  	});
	});
	//点击X按钮,返回打开工程按钮
	$('#js_createProjectModal .icojam_delete').on('click',function(){
		$('#js_initProjectModal').show();
		$('#js_pageCover').show();
		$('#js_createProjectModal').hide();
	});
});
//初始化发布打包列表数据
$.ajax({
	url:serverUrl+'task/list',
	data:{
		"status":parseInt($('#js_status_select').val()),
		"currentPage":1,
		"pageSize":20
	},
	success:function(msg){
		if(msg.code===0&&msg.data!==null){
			PLAYER.observer.trigger('packbagList',msg.data);
		}else{
			console.log('error');
		}
	}
});
//点击打包刷新按钮
$('#js_status_btn').on('click',function(){
	$.ajax({
		url:serverUrl+'task/list',
		data:{
			"status":parseInt($('#js_status_select').val()),
			"currentPage":1,
			"pageSize":20
		},
		success:function(msg){
			if(msg.code===0&&msg.data!==null){
				PLAYER.observer.trigger('packbagList',msg.data);
			}else{
				console.log('error');
			}
		}
	});
});
//点击添加网络素材
$('#js_addProgram_btn').on('click',function(){
	createAddProgramModal();
	$('#js_addProgramModal').show();
	$('#js_pageCover').show();
	$('#js_add_modal_cancelPro, .icojam_delete').on('click',function(){
		$('#js_addProgramModal').hide();
		$('#js_pageCover').hide();
	});
});
//初始化发布字幕列表数据
$.ajax({
	url:serverUrl+'subtitle/list',
	success:function(msg){
		if(msg.code===0&&msg.data!==null){
			PLAYER.observer.trigger('getSubtitleList',msg.data);
		}else{
			alert('获取字幕失败');
		}
	}
});
//初始化发布特技列表数据
$.ajax({
	url:serverUrl+'effect/list',
	success:function(msg){
		if(msg.code===0&&msg.data!==null){
			PLAYER.observer.trigger('getEffectList',msg.data);
		}else{
			alert('获取特技失败');
		}
	}
});
//点击视频分析按钮
$('#js_finding').on('click',function(){
	if(PLAYER.isPlaying){
        PLAYER.OCX.doPause();
        PLAYER.isPlaying=false; 
        $("#js_play").removeClass("stop")
        $("#js_play").attr("title", "播放");       
    }
	if(PLAYER.model===null&&PLAYER.dbClick&&$('#js_finding').attr('data-id')!==undefined){
		PLAYER.model=new PLAYER.CreateFacialModal();
		//人脸识别
		$.ajax({
	  		'url':faceUrl+'/service/getFaceResult',
	  		'type': "GET",
	  		'data':{
	  			"assetid":$('#js_finding').attr('data-id')
	  		},
	  		'success':function(msg){
	  			if(msg.code===0&&msg.data!==null){
	  				PLAYER.observer.trigger('facialList',msg.data.data);
	  			}else{
	  				alert('获取人脸失败');
	  			}
	  		}
	  	});
	}else if($('#js_finding').attr('data-id')===undefined){
		alert('您必选先双击素材！')
	}else if(PLAYER.model!==null){
		alert('您不能重复点击！')
	}
});
/*----------------------初始化获取工程列表模块--------------------------*/
var getInitProListModule=(function(){
	PLAYER.observer.listen('proList',function(data){
		list(data);
		//创建工程列表
		function list(data){
			$('#js_init_project_list').empty();
			var h='<li class="header">'+
						'<span>工程名称</span>'+
						'<span>上次编辑时间</span>'+
						'<span>版本</span>'+
						'<span></span>'+
					'</li>';
			$('#js_init_project_list').append(h);
			$.each(data.list,function(i,n){
				var s=$('<li data-id="'+n.projectid+'"></li>');
				var option=$('<span class="project_list_name">'+n.projectname+'</span><span>'+PLAYER.getLocalTime(n.createtime)+'</span><span>v-'+n.version+'</span></span>');
				s.append(option);
				$('#js_init_project_list').append(s);
			});
		}
		//添加滚动条
		if(data.totalLines>5){
			$('.project_list_track').show();
			var s1=new Scrollbar({
				dirSelector:'y',
				contSelector:$('#js_init_project_list'),
				barSelector:$('.project_list_track'),
				sliderSelector:$('.project_list_scroll')
			});
		}
		//添加分页
		$('#js_pro_pager').empty();
		$('#js_pro_pager').Paging({
			pagesize:20,
			count:data.totalLines,
			prevTpl:'&laquo;',
			nextTpl:'&raquo;',
			callback:function(page,size,count){
				console.log('当前第 ' +page +'页,每页 '+size+'条,总页数：'+count+'页');
				$.ajax({
			  		url:serverUrl+'proj/list',
			  		data:{
			  			currentPage:page,
			  			pageSize:20
			  		},
			  		success:function(msg){
			  			if(msg.code===0&&msg.data!==null){
			  				list(msg.data);
			  			}else{
			  				console.log('error');
			  			}
			  		}
			  	});
			}
		});
	});
})();
/*----------------------初始化获取工程高标清模块------------------------*/
var getCreateProTemplateModule=(function(){
	PLAYER.observer.listen('proTemplate',function(data){
		var s=$('<select class="form-control" name="templateid">');
		$.each(data,function(i,n){
			var option=$('<option value="'+n.templateid+'">'+n.name+'</option>')
			s.append(option);
		});
		$('#js_create_pro_type').append(s);	
	});
})();
/*----------------------初始化获取高标清播放器宽高模块------------------*/
var drawPlayerModule=(function(){
	PLAYER.observer.listen('projectData',function(data){
		var data=JSON.parse(data);
		var playerWidth;
		if(data.height==='576'&&data.width==='720'){
			playerWidth=parseFloat(1.25*$('#ocx').height());
		}else{
			playerWidth=parseFloat((16*$('#ocx').height()/9));	
		}
		$('#ocx').width(playerWidth);
		var _ml=($('.player').width()-playerWidth)/2;
		if(_ml<0){
			_ml=0;
		}
		$('#ocx').css('margin-left', _ml);

		$('#js_mask').width(playerWidth);
		$('#js_mask').css('left', _ml);
	});
})();
/*----------------------初始化获取全部供应商模块------------------------*/
var getAllCpspcodeModule=(function(){
	PLAYER.observer.listen('getAllCpspcode',function(data){
		var s=$('<select class="form-control" name="cpspcode" >');
		var all=$('<option value="">全部</option>');
		s.append(all);
		$.each(data,function(i,n){
			var option=$('<option value="'+n.cpspcode+'">'+n.name+'</option>');
			s.append(option);
		});
		$('.program_cpspcode').append(s);
	});
})();
/*----------------------初始化获取全部节目类型模块----------------------*/
var getProgramTypeModule=(function(){
	PLAYER.observer.listen('getProgramType',function(data){
		var s=$('<select class="form-control" name="type">');
		var all=$('<option value="">全部</option>');
		s.append(all);
		$.each(data,function(i,n){
			var option=$('<option value="'+n.name+'">'+n.name+'</option>')
			s.append(option);
		});
		$('.program_type').append(s);
	});
})();
/*----------------------初始化获取全部节目列表模块----------------------*/
var getProgramListModule=(function(){
	PLAYER.observer.listen('getProgramList',function(data){
		drawList(data);
		function drawList(data){
			$('.meterial_thumbnail_box').empty();
			$.each(data.list,function(i,n){
				var h=$('<div class="col-md-3 col-sm-3 col-lg-3" draggable="true" data-id="'+n.assetid+'" data-test="m'+i+'"><a class="thumbnail"><img src="'+n.thumbnail+'" alt=""  draggable="false"><span class="thumbnail_name" style="bottom:22px;">'+n.name+'</span><span>'+PLAYER.getDurationToString(n.duration)+'</span></a></div>');
				$('#js_thumbnail_box').append(h);
			});

			
		}

		if(data.totalLines>8){
			$('.meterial_thumbnail_box').show();
			$('.meterial_thumbnail_track').show();
			var s1=new Scrollbar({
				dirSelector:'y',
				contSelector:$('.meterial_thumbnail_box'),
				barSelector:$('.meterial_thumbnail_track'),
				sliderSelector:$('.meterial_thumbnail_scroll')
			});
		}
		
		$('#js_pager').empty();
		$('#js_pager').Paging({
			pagesize:36,
			count:data.totalLines,
			prevTpl:'&laquo;',
			nextTpl:'&raquo;',
			callback:function(page,size,count){
				$.ajax({
			  		url:serverUrl+'program/list',
			  		data:{
			  			"currentPage":page,
			  			"pageSize":36
			  		},
			  		success:function(msg){
			  			if(msg.code===0&&msg.data!==null){
			  				drawList(msg.data);
			  				PLAYER.observer.trigger('projectData',PLAYER.json);
			  			}else{
			  				console.log('error');
			  			}
			  		}
			  	});
			}
		});
		
		
		//获取列表内容
		/*$('.meterial_list_box ul').empty();
		var h='<li class="header">'+
					'<span>项目名称</span>'+
					'<span>供应商</span>'+
					'<span>媒体开始</span>'+
					'<span>媒体结束</span>'+
					'<span>媒体结束</span>'+
					'<span>媒体持续时间</span>'+
					'<span>视频出点</span>'+
				'</li>';
		$('.meterial_list_box ul').append(h);
		$.each(data.list,function(i,n){
			var _li=$('<li draggable="true" data-id="'+n.assetid+'">');
			var d=$('<span class="meterial_list_name" title="'+n.name+'" draggable="false">'+n.name+'</span>'
					+'<span draggable="false">'+n.provider+'</span>'
					+'<span draggable="false">00:00:00:00</span>'
					+'<span draggable="false">'+PLAYER.getDurationToString(n.duration)+'</span>'
					+'<span draggable="false">'+PLAYER.getDurationToString(n.duration)+'</span>'
					+'<span draggable="false">00:00:00:00</span>'
					+'<span draggable="false">'+PLAYER.getDurationToString(n.duration)+'</span>');
			_li.append(d);
			$('.meterial_list_box ul').append(_li);
		});*/
	});
})();
/*----------------------工程保存编辑模块--------------------------------*/
var getEditProListModule=(function(){
	PLAYER.observer.listen('proList',function(data){
		list(data);
		//创建列表
		function list(data){
			$('#js_edit_project_list').empty();
			var h='<li class="header">'+
						'<span>工程名称</span>'+
						'<span>上次编辑时间</span>'+
						'<span>状态</span>'+
						'<span></span>'+
					'</li>';
			$('#js_edit_project_list').append(h);
			$.each(data.list,function(i,n){
				var s=$('<li data-id="'+n.projectid+'"></li>');
				var option=$('<span class="project_list_name">'+n.projectname+'</span><span>'+PLAYER.getLocalTime(n.createtime)+'</span><span>↓'+n.version+'</span><span class="glyphicon glyphicon-remove project_delete" data-id="'+n.id+'"></span>');
				s.append(option);
				$('#js_edit_project_list').append(s);
			});
		}
		//添加滚动条
		if(data.totalLines>5){
			$('.project_edit_list_track').show();
			var s1=new Scrollbar({
				dirSelector:'y',
				contSelector:$('#js_edit_project_list'),
				barSelector:$('.project_edit_list_track'),
				sliderSelector:$('.project_edit_list_scroll')
			});	
		}
		//添加分页
		$('#js_pro_edit_pager').empty();
		$('#js_pro_edit_pager').Paging({
			pagesize:20,
			count:data.totalLines,
			prevTpl:'&laquo;',
			nextTpl:'&raquo;',
			callback:function(page,size,count){
				console.log('当前第 ' +page +'页,每页 '+size+'条,总页数：'+count+'页');
				$.ajax({
			  		url:serverUrl+'proj/list',
			  		data:{
			  			currentPage:page,
			  			pageSize:20
			  		},
			  		success:function(msg){
			  			if(msg.code===0&&msg.data!==null){
			  				list(msg.data);
			  			}else{
			  				console.log('error');
			  			}
			  		}
			  	});
			}
		});
	});
})();
/*----------------------初始化打包列表模块------------------------------*/
var getPackbagListModule=(function(){
	PLAYER.observer.listen('packbagList',function(data){
		getWorkList(data);
		function checkState(flag){
			var flag;
			if(flag===0){
				flag='待处理';
			}else if(flag===1){
				flag='处理中';
			}
			else if(flag===2){
				flag='完成';
			}
			else if(flag===3){
				flag='出错';
			}
			return flag;
		}
		function getWorkList(data){
			$('#js_export_list').empty();
			var oH=$('<li class="header">'
		        			+'<span>名称</span>'
		        			+'<span>创建时间</span>'
		        			+'<span>进度</span>'
		        			+'<span>状态</span>'
		        			+'<span>备注</span>'
		        		+'</li>');
			$('#js_export_list').append(oH);
			$.each(data,function(i,n){
				
				var oLi=$('<li>');
				var oA=$('<a href="javascript:;"  class="name"><span>'+n.title+'</span></a>'
						+'<a href="javascript:;"  class="createTime"><span>'+PLAYER.getLocalTime(n.createtime)+'</span></a>'
						+'<a href="javascript:;"  class="progressBox"><span><div class="progress progress-mini" title="当前进度'+n.progress+'%">'
			                +'<div style="width:'+n.progress+'%;" class="progress-bar"></div>'
			            +'</div></span></a>'
			        +'<a href="javascript:;"  class="state"><span>'+checkState(n.flag)+'</span></a>'
			        +'<a href="javascript:;" ><span>'+n.last_err+'</span></a>'
					);
				oLi.append(oA);
				$('#js_export_list').append(oLi);
			});
		}
		//创建分页
		$('#js_pager_export').empty();
		$('#js_pager_export').Paging({
			pagesize:20,
			count:data.length,
			prevTpl:'&laquo;',
			nextTpl:'&raquo;',
			callback:function(page,size,count){
				$.ajax({
			  		url:serverUrl+'program/list',
			  		data:{
			  			"currentPage":page,
			  			"pageSize":20,
			  			"status":parseInt($('#js_status_select').val())
			  		},
			  		success:function(msg){
			  			if(msg.code===0&&msg.data!==null){
			  				getWorkList(msg.data);
			  			}else{
			  				console.log('error');
			  			}
			  		}
			  	});
			}
		});
	});
})();

/*----------------------视频分析人脸识别模块-----------------------------*/
var facialListModule=(function(){
	PLAYER.observer.listen('facialList',function(data){
		if(data.length!==0){
			//创建人脸识别弹窗
			list(data);
			function list(data){
				$('#js_createfacialModal #js_facial_box').empty();
				$.each(data,function(i,n){
					var s=$('<div class="facial_list">'
						+'<img src='+n.httpPath+' data-frame="'+n.startTime+'"/>'
						+'<span class="facial_description">'+n.name+'</span>'
						+'<span class="pull-right">'+PLAYER.getDurationToString(n.startTime)+'</span>'

					+'</div>');
					$('#js_createfacialModal #js_facial_box').append(s);
				});
			}
			
			//显示滚动条
			$('.facial_list_track').show();
			var s1=new Scrollbar({
				dirSelector:'y',
				contSelector:$('#js_facial_box'),
				barSelector:$('.facial_list_track'),
				sliderSelector:$('.facial_list_scroll')
			});

			//操作人脸识别弹窗
			$('.facial_list').on('click',function(e){
				if(PLAYER.isPlaying){
			        PLAYER.OCX.doPause();
			        PLAYER.isPlaying=false; 
			        $("#js_play").removeClass("stop")
			        $("#js_play").attr("title", "播放");       
			    }
				if($(e.target).attr('data-frame')!==undefined){
					$(e.target).addClass('active');
					$(e.target).parent().siblings().children('img').removeClass('active');
					var _f=parseInt($(e.target).attr('data-frame'));
					PLAYER.OCX.seek(_f);
					PLAYER.PTR.fixArrowCurrentTime(_f);
				}
			});
		}else{
			alert('视频分析失败！')
		}
		
	});
})();

/*----------------------点击工具条按钮----------------------------------*/
//显示保存工程模态框
var showSaveModal=function(type){
	PLAYER.checkPlaying();
	var s1=createSaveModal();

	$('#js_modal_savePro').attr('data-type',type);
	s1.show();
	$('#js_pageCover').show();

	//点击取消按钮
	$('#js_saveProjectModal #js_modal_cancelPro').off().click(function(){
		s1.hide();
		$('#js_pageCover').hide();
	});
	//点击X按钮
	$('#js_saveProjectModal .icojam_delete').off().click(function(){
		s1.hide();
		$('#js_pageCover').hide();
	});
	//点击确定按钮
	$('#js_modal_savePro').off().click(function(){
		var projStr = PLAYER.operateJson.translateFfpToMS(JSON.stringify(PLAYER.jsonObj));

		$.ajax({
	  		url:serverUrl+'proj/update',
	  		data:{
	  			projectid:PLAYER.jsonObj.id,
	  			html:'',
	  			content:JSON.stringify(projStr)
	  		},
	  		success:function(msg){
	  			if(msg.code===0&&msg.data!==null){
	  				$('#js_saveProjectModal').hide();
					$('#js_pageCover').hide();
					PLAYER.observer.trigger('saveProModal',true,$('#js_modal_savePro').attr('data-type'));
	  			}else{
	  				console.log('error');
	  			}
	  		}
	  	});
	});
};
//点击工具条保存工程按钮
$('#js_saveProject').click(function(){
	showSaveModal('savepro');
	PLAYER.observer.listen('saveProModal',function(data,type){
		if(data && (type==="savepro")){
			$('#js_saveProjectModal').hide();
			$('#js_pageCover').hide();
			$('#js_modal_savePro').attr('data-type','');
		}
	});
});
//点击工具条新建工程按钮
$('#js_newProject').on('click',function(){
	showSaveModal('newpro');
	PLAYER.observer.listen('saveProModal',function(data,type){
		if(data && (type==="newpro")){
			$('#js_saveProjectModal').hide();
			$('#js_pageCover').hide();
			$('#js_modal_savePro').attr('data-type','');
			location.href=enterUrl;
		}
	});
});
//点击工具条编辑工程按钮
$('#js_openProject').on('click',function(){
	showSaveModal('editpro');
	PLAYER.observer.listen('saveProModal',function(data,type){
		if(data && (type==="editpro")){
			createSaveOpenModal();
			$('#js_modal_savePro').attr('data-type','');
			$('#js_saveProjectModal').hide();
			$('#js_pageCover').show();
			$('#js_editProjectModal').show();

			//点击X按钮
			$('#js_editProjectModal .icojam_delete').on('click',function(){
				$('#js_editProjectModal').hide();
				$('#js_pageCover').hide();
			});
			//取消选择
			$('#js_edit_project_list').delegate($('#js_edit_project_list').children(),'selectstart',function(){
				return false;
			});
			//点击删除工程按钮
			$('#js_edit_project_list').delegate('.project_delete','click',function(){
				var r=confirm('确定删除吗?');
				if(r){
					var assetId=$(this).parent('li').attr('data-id');
					var assetName=$(this).parent('li').find('.project_list_name').html();
					
					if(assetId===PLAYER.jsonObj.id){
						alert('您不能删除当前工程！');
					}else{
						
				  		$(this).parent('li').remove();
				  		$.ajax({
					  		url:serverUrl+'proj/delete',
					  		data:{
					  			id:assetId
					  		},
					  		success:function(msg){
					  			if(msg.code===0&&msg.data!==null){
					  				$.ajax({
								  		url:serverUrl+'proj/list',
								  		data:{
								  			currentPage:1,
								  			pageSize:20
								  		},
								  		success:function(msg){
								  			if(msg.code===0&&msg.data!==null){
								  				alert('删除:'+assetName+'成功!');
								  				PLAYER.observer.trigger('proList',msg.data);
								  			}else{
								  				console.log('error');
								  			}
								  		}
								  	});

					  			}else{
					  				console.log('error');
					  			}
					  		}
					  	});
					}
					
				}else{
					return false;
				}	
			});
		}
	});
});
//点击工具条打包输出按钮
$('#js_exportProject').on('click',function(){
	showSaveModal('exportpro');
	PLAYER.observer.listen('saveProModal',function(data,type){
		if(data && (type==="exportpro")){
			if($('.time_ruler_bar').children().length>0){
				$('#js_saveProjectModal').hide();
				$('#js_pageCover').show();

				//创建打包模态框
				createExportModal();
				//获取打包任务模板
				$.ajax({
					url:serverUrl+'task/schema',
					success:function(msg){
						if(msg.code===0&&msg.data!==null){
							$('#js_export_form_schema').empty();
							$.each(msg.data,function(i,n){
								var _o=$('<option value="'+n.name+'">'+n.name+'</option>');
								$('#js_export_form_schema').append(_o);
							});
						}else{
							console.log('error');
						}
					}
				});
				$('#js_exportProjectModal').show();
				//点击X
				$('#js_exportProjectModal .icojam_delete').off().click(function(){
					$('#js_exportProjectModal').hide();
					$('#js_pageCover').hide();
				});
				//点击取消	
				$('#js_export_modal_cancelPro').off().click(function(){
					$('#js_exportProjectModal').hide();
					$('#js_pageCover').hide();
				});
				//点击打包
				$('#js_modal_export').off().click(function(){
					var schemaValue=$('#js_export_form_schema').val();
					var nameValue=$('#js_export_form_name').val()?$('#js_export_form_name').val():'打包文件';
					var checkOff=$('#js_export_form_check').prop('checked');
					var triminValue=getTrimInVal();
					var trimoutValue=getTrimOutVal();

					function getTrimInVal(){
						if(checkOff){
							return parseInt(PLAYER.operateJson.getFirstFrame());
						}else{
							return parseInt(PLAYER.TR.trimInCurrTime);
						}
					}
					function getTrimOutVal(){
						if(checkOff){
							return parseInt(PLAYER.operateJson.getLastFrame());
						}else{
							return parseInt(PLAYER.TR.trimOutCurrTime);
						}
					}
					if(!trimoutValue){
						alert('您必须打入出入点或者选择整个序列');
					}else{
						$.ajax({
				  		url:serverUrl+'task/send',
				  		data:{
				  			projectid:PLAYER.jsonObj.id,
				  			name:nameValue,
				  			trimin:triminValue*40,
				  			trimout:trimoutValue*40,
				  			packschema:schemaValue
				  		},
				  		success:function(msg){
				  			if(msg.code===0&&msg.data!==null){
				  				console.log('打包成功',msg.data);
				  				$('#js_exportProjectModal').hide();
								$('#js_pageCover').hide();
								//打包任务列表
							  	$.ajax({
							  		url:serverUrl+'task/list',
							  		data:{
							  			"status":parseInt($('#js_status_select').val()),
										"currentPage":1,
										"pageSize":20
							  		},
							  		success:function(msg){
							  			if(msg.code===0&&msg.data!==null){
							  				PLAYER.observer.trigger('packbagList',msg.data);
							  			}else{
							  				console.log('error');
							  			}
							  		}
							  	});
				  			}else{
				  				console.log('error');
				  			}
				  		}
				  	});
					}
				});
			}else{
				alert('没有任何素材供打包！');
			}
		}
	});
});

$('#js_status_select').on('change',function(){
	$.ajax({
		url:serverUrl+'task/list',
		data:{
			"status":parseInt($('#js_status_select').val()),
			"currentPage":1,
			"pageSize":20
		},
		success:function(msg){
			if(msg.code===0&&msg.data!==null){
				PLAYER.observer.trigger('packbagList',msg.data);
			}else{
				console.log('error');
			}
		}
	});
})

//快捷键工程函数
PLAYER.EventUtil.addHandler(document,'keydown',function(){
	var e=PLAYER.EventUtil.getEvent(e);
    var code=PLAYER.EventUtil.getKeyCode(e);
    if(e.ctrlKey&&code===83){//ctrl+s
    	PLAYER.EventUtil.preventDefault(e);
    	showSaveModal();
    	PLAYER.observer.listen('saveProModal',function(data){
			if(data){
				$('#js_saveProjectModal').hide();
				$('#js_pageCover').hide();
			}
		});
    }
    else if(e.ctrlKey&&code===78){//ctrl+n
    	PLAYER.EventUtil.preventDefault(e);
    	showSaveModal();
    	PLAYER.observer.listen('saveProModal',function(data){
			if(data){
				$('#js_saveProjectModal').hide();
				$('#js_pageCover').hide();
				location.href=enterUrl;
			}
		});
    }
    else if(e.ctrlKey&&code===79){//ctrl+o
    	PLAYER.EventUtil.preventDefault(e);
    	showSaveModal();
    	PLAYER.observer.listen('saveProModal',function(data){
			if(data){
				createSaveOpenModal();
				$('#js_saveProjectModal').hide();
				$('#js_pageCover').show();
				$('#js_editProjectModal').show();

				//点击X按钮
				$('#js_editProjectModal .icojam_delete').on('click',function(){
					$('#js_editProjectModal').hide();
					$('#js_pageCover').hide();
				});
				//取消选择
				$('#js_edit_project_list').delegate($('#js_edit_project_list').children(),'selectstart',function(){
					return false;
				});
				//点击删除工程按钮
				$('#js_edit_project_list').delegate('.project_delete','click',function(){
					var r=confirm('确定删除吗?');
					if(r){
						var assetId=$(this).parent('li').attr('data-id');
						var assetName=$(this).parent('li').find('.project_list_name').html();
						
						if(assetId===PLAYER.jsonObj.id){
							alert('您不能删除当前工程！');
						}else{
							
					  		$(this).parent('li').remove();
					  		$.ajax({
						  		url:serverUrl+'proj/delete',
						  		data:{
						  			id:assetId
						  		},
						  		success:function(msg){
						  			if(msg.code===0&&msg.data!==null){
						  				$.ajax({
									  		url:serverUrl+'proj/list',
									  		data:{
									  			currentPage:1,
									  			pageSize:20
									  		},
									  		success:function(msg){
									  			if(msg.code===0&&msg.data!==null){
									  				alert('删除:'+assetName+'成功!');
									  				PLAYER.observer.trigger('proList',msg.data);
									  			}else{
									  				console.log('error');
									  			}
									  		}
									  	});

						  			}else{
						  				console.log('error');
						  			}
						  		}
						  	});
						}
						
					}else{
						return false;
					}	
				});
			}
		});
    }
    else if(e.ctrlKey&&code===66){//ctrl+b
    	PLAYER.EventUtil.preventDefault(e);
        showSaveModal();
    	PLAYER.observer.listen('saveProModal',function(data){
			if(data){
				if($('.time_ruler_bar').children().length>0){
					$('#js_saveProjectModal').hide();
					$('#js_pageCover').show();

					//创建打包模态框
					createExportModal();
					//获取打包任务模板
					$.ajax({
						url:serverUrl+'task/schema',
						success:function(msg){
							if(msg.code===0&&msg.data!==null){
								$('#js_export_form_schema').empty();
								$.each(msg.data,function(i,n){
									var _o=$('<option value="'+n.name+'">'+n.name+'</option>');
									$('#js_export_form_schema').append(_o);
								});
							}else{
								console.log('error');
							}
						}
					});
					$('#js_exportProjectModal').show();
					//点击X
					$('#js_exportProjectModal .icojam_delete').on('click',function(){
						$('#js_exportProjectModal').hide();
						$('#js_pageCover').hide();
					});
					//点击取消	
					$('#js_export_modal_cancelPro').on('click',function(){
						$('#js_exportProjectModal').hide();
						$('#js_pageCover').hide();
					});
					//点击打包
					$('#js_modal_export').on('click',function(){
						var schemaValue=$('#js_export_form_schema').val();
						var nameValue=$('#js_export_form_name').val()?$('#js_export_form_name').val():'打包文件';
						var checkOff=$('#js_export_form_check').prop('checked');
						var triminValue=getTrimInVal();
						var trimoutValue=getTrimOutVal();

						function getTrimInVal(){
							if(checkOff){
								return parseInt(PLAYER.operateJson.getFirstFrame());
							}else{
								return parseInt(PLAYER.TR.trimInCurrTime);
							}
						}
						function getTrimOutVal(){
							if(checkOff){
								return parseInt(PLAYER.operateJson.getLastFrame());
							}else{
								return parseInt(PLAYER.TR.trimOutCurrTime);
							}
						}
						if(!trimoutValue){
							alert('您必须打入出入点或者选择整个序列');
						}else{
							$.ajax({
					  		url:serverUrl+'task/send',
					  		data:{
					  			projectid:PLAYER.jsonObj.id,
					  			name:nameValue,
					  			trimin:triminValue,
					  			trimout:trimoutValue,
					  			packschema:schemaValue
					  		},
					  		success:function(msg){
					  			if(msg.code===0&&msg.data!==null){
					  				console.log('打包成功',msg.data);
					  				$('#js_exportProjectModal').hide();
									$('#js_pageCover').hide();
									//打包任务列表
								  	/*$.ajax({
								  		url:serverUrl+'task/list',
								  		data:{
								  			"status":parseInt($('#js_status_select').val()),
											"currentPage":1,
											"pageSize":20
								  		},
								  		success:function(msg){
								  			if(msg.code===0&&msg.data!==null){
								  				PLAYER.observer.trigger('packbagList',msg.data);
								  			}else{
								  				console.log('error');
								  			}
								  		}
								  	});*/
					  			}else{
					  				console.log('error');
					  			}
					  		}
					  	});
						}
					});
				}else{
					alert('没有任何素材供打包！');
				}
			}
		});
    }
}); 

/*----------------------拖拽特技素材模块------------------------------------*/
var dragEffectModule=(function(){
	PLAYER.observer.listen('projectData',function(data){
		document.onselectstart=function(e){
			if(e.srcElement.tagName==='input'||e.srcElement.tagName==='INPUT'||e.srcElement.tagName==="textarea" || e.srcElement.tagName==="TEXTAREA"){
				return true;
			}else{
				return false;
			}	
		};
		var curr_subclip,		//特技移入当前的切片
			onOff,				//判断是否拖拽
			type;				//特技类型

		if(PLAYER.jsonObj===null){
			PLAYER.jsonObj=JSON.parse(data);
		}
		
		//拖拽素材
		$('#js_effect_wrap').delegate('.effect_fadeInOut,.effect_flashBlack,.effect_flashWhite,.effect_mosaic', 'mousedown', function(e) {
			
			e.preventDefault();
			PLAYER.checkPlaying();
			$(e.target).parent('li').siblings().children('.effect_list').removeClass('active');
			$(e.target).addClass('active');
			onOff=false;
			type=$(e.target).attr('data-effect');
			
			curr_subclip=null;

			$(document)[0].onmousemove = function(e) {
                var e = e || window.event;
            	onOff=true; 
            	console.log('e',type);
            	if(type==='mosaic'){
            		PLAYER.observer.trigger('move_effect_mosaic',e); 
            	}else{
            		PLAYER.observer.trigger('move_effect',e); 
            	}	
            };
            $(document)[0].onmouseup = function(e) {
            	if(onOff){
            		PLAYER.observer.trigger('up_effect',e,type);

            		onOff=false; 
            	}
                $(document)[0].onmousemove = null;
                curr_subclip=null;
            };
		});

		//移动时拖拽图像动作
		var listenDragmove=(function(){
			var l,
				w,
				h,
				t,
				sIn,
				sOut,
				prev_sOut,
				next_sIn;

			PLAYER.observer.listen('move_effect_mosaic',function(e){
				var x=e.clientX;
				var y=e.clientY;
				calTimerRulerRreaMosaic(x,y);			//区域轨道
			});
			PLAYER.observer.listen('move_effect',function(e){
				var x=e.clientX;
				var y=e.clientY;
				calTimerRulerRrea(x,y);			//区域轨道
			});
			//计算是否在时间轨道区域
			function calTimerRulerRrea(x,y){
				if($('#js_time_ruler_bar_box').find('.edit_box_v').length<=0){
					return false;
				} 
				$('#js_time_ruler_bar_box').find('.edit_box_v').each(function(i,n){
					var _self=$(this);
					l=_self.offset().left;
					w=_self.width();
					h=_self.height();
					t=_self.offset().top+3;
					sIn=parseInt(_self.attr('data-sequencetrimin'));
					sOut=parseInt(_self.attr('data-sequencetrimout'));
					

					//判断没有与他相邻的切片
					if(x>=l && x<=(l+15) && y>=t &&y<=(y+h)) {
						_self.addClass('effectActive');
						_self.prevSubclip=PLAYER.operateJson.checkPrevSubClip(sIn);

						if(!_self.prevSubclip){
							_self.effectPos='header';
						}else{
							_self.prevSubclip.addClass('effectActive');
							_self.effectPos='prev_middle';
						}
						curr_subclip=_self;
					}
					else if(x>=(l+w-20) && x<=(l+w) && y>=t &&y<=(y+h)){
						_self.addClass('effectActive');
						_self.nextSubclip=PLAYER.operateJson.checkNextSubClip(sOut);

						if(!_self.nextSubclip){
							_self.effectPos='footer';
						}else{
							_self.nextSubclip.addClass('effectActive2');
							_self.effectPos='next_middle';
						}
						curr_subclip=_self;
					}
					else{
						_self.removeClass('effectActive');
						if(_self.prevSubclip){
							_self.prevSubclip.removeClass('effectActive');
						}
						if(_self.nextSubclip){
							_self.nextSubclip.removeClass('effectActive2');
						}
					}
				});
			}	

			function calTimerRulerRreaMosaic(x,y){
				if($('#js_time_ruler_bar_box').find('.edit_box_v').length<=0){
					return false;
				} 
				$('#js_time_ruler_bar_box').find('.edit_box_v').each(function(i,n){
					var _self=$(this);
					l=_self.offset().left;
					w=_self.width();
					h=_self.height();
					t=_self.offset().top+3;
					
					//判断没有与他相邻的切片
					if(x>=l && x<=(l+w) && y>=t &&y<=(y+h)) {
						if(_self.find('.effect_box_all').length>0){
							return false;
						}else{
							_self.addClass('effectActive');
							_self.effectPos='all';
							curr_subclip=_self;
						}
					}
					else{
						_self.removeClass('effectActive');
					}
				});
			}

		})();

		//抬起拖拽图像动作
		var listenDragup=(function(){
			PLAYER.observer.listen('up_effect',function(e,type){
				if(curr_subclip===null){
					return;
				}
				curr_subclip.removeClass('effectActive');
				if(curr_subclip.prevSubclip){
					curr_subclip.prevSubclip.removeClass('effectActive');
				}else if(curr_subclip.nextSubclip){
					curr_subclip.nextSubclip.removeClass('effectActive2');
				}
				//添加特技json
				addEffectJson(curr_subclip,type);
				console.log('增加特技',PLAYER.jsonObj.rootBin.sequence[0].tracks)
				PLAYER.operateJson.sendJson();

			});

			//在切片上添加特技效果
			function addEffectJson(curr_subclip,type){
				var _left=parseInt(curr_subclip.css('left'));
				var _width=parseInt(curr_subclip.width());
				var _boxWidth=parseFloat(25/PLAYER.TR.config.framePerPixel);

				var _trimin=parseInt(curr_subclip.attr('data-trimin'));
				var _trimout=parseInt(curr_subclip.attr('data-trimout'));
				
				function getEffectAttr(type,trimIn,trimOut,duration,pos){
					var effectAttr={
						type:type,
						trimIn:trimIn,
						trimOut:trimOut,
						duration:duration,
						attr:{},
						pos:pos
					}
					if(type==='mosaic'){
						var obj={
							attr:{
								x1:0,
								y1:0,
								width:0.2*$('#ocx').width(),
								height:0.2*$('#ocx').height(),
								sizex:100,
								sizey:100
							}
						}
						$.extend(effectAttr,obj);
					}

					return effectAttr;
				}

				if(type!=='mosaic' && curr_subclip.effectPos==='header'){
					if(curr_subclip.find('.effect_box_l').length>0){
						return false;
					}
					var effect_box=$('<div class="effect_box effect_box_l"></div>');
					var effect_trimin=_trimin;
					var effect_trimout=(_trimin+25);

					effect_box.attr('data-trimin',effect_trimin);
					effect_box.attr('data-type',type);
					effect_box.attr('data-trimout',effect_trimout);
					effect_box.attr('data-duration',25);
					effect_box.attr('data-pos','header');
					effect_box.css('width',_boxWidth);

					curr_subclip.append(effect_box);

					var time=curr_subclip.attr('data-time');
					var effectAttr=getEffectAttr(type,effect_trimin,effect_trimout,25,'header');
					PLAYER.operateJson.addEffectClip(time,effectAttr);
				}else if(type!=='mosaic' && curr_subclip.effectPos==='footer'){
					if(curr_subclip.find('.effect_box_r').length>0){
						return false;
					}
					var effect_box=$('<div class="effect_box effect_box_r"></div>');

					var effect_trimin=(_trimout-25);
					var effect_trimout=_trimout;

					effect_box.attr('data-trimin',effect_trimin);
					effect_box.attr('data-trimout',effect_trimout);
					effect_box.attr('data-duration',25);
					effect_box.attr('data-pos','footer');
					effect_box.css('width',_boxWidth);
					effect_box.attr('data-type',type);
					curr_subclip.append(effect_box);

					var time=curr_subclip.attr('data-time');
					var effectAttr=getEffectAttr(type,effect_trimin,effect_trimout,25,'footer');
					PLAYER.operateJson.addEffectClip(time,effectAttr);
				}else if(type!=='mosaic' && curr_subclip.effectPos==='prev_middle'){
					if(curr_subclip.find('.effect_box_l').length>0){
						return false;
					}
					if(curr_subclip.prevSubclip.find('.effect_box_r').length>0){
						return false;
					}
					var prev_trimout=parseInt(curr_subclip.prevSubclip.attr('data-trimout'));
					var effectBox1=$('<div class="effect_box effect_box_l"></div>');
					var effectBox2=$('<div class="effect_box effect_box_r"></div>');

					var effect1_trimin=_trimin;
					var effect1_trimout=_trimin+25;

					var effect2_trimin=prev_trimout-25;
					var effect2_trimout=prev_trimout;
					var duration=50;

					effectBox1.attr('data-trimin',effect1_trimin);
					effectBox1.attr('data-trimout',effect1_trimout);
					effectBox1.attr('data-duration',duration);
					effectBox1.css('width',_boxWidth);
					effectBox1.attr('data-pos','header-middle');
					effectBox1.attr('data-type',type);

					effectBox2.attr('data-trimin',effect2_trimin);
					effectBox2.attr('data-trimout',effect2_trimout);
					effectBox2.attr('data-duration',duration);
					effectBox2.css('width',_boxWidth);
					effectBox2.attr('data-pos','footer-middle');
					effectBox2.attr('data-type',type);

					curr_subclip.append(effectBox1);
					curr_subclip.prevSubclip.append(effectBox2);

					var time1=curr_subclip.attr('data-time');
					var effectAttr1=getEffectAttr(type,effect1_trimin,effect1_trimout,duration,'header-middle');
					PLAYER.operateJson.addEffectClip(time1,effectAttr1);

					var time2=curr_subclip.prevSubclip.attr('data-time');
					var effectAttr2=getEffectAttr(type,effect2_trimin,effect2_trimout,duration,'footer-middle');

					PLAYER.operateJson.addEffectClip(time2,effectAttr2);
				}else if(type!=='mosaic' && curr_subclip.effectPos==='next_middle'){
					if(curr_subclip.find('.effect_box_r').length>0){
						return false;
					}
					if(curr_subclip.nextSubclip.find('.effect_box_l').length>0){
						return false;
					}
					var next_trimin=parseInt(curr_subclip.nextSubclip.attr('data-trimin'));

					var effectBox1=$('<div class="effect_box effect_box_r"></div>');
					var effectBox2=$('<div class="effect_box effect_box_l"></div>');

					console.log('effectBox1',effectBox1)
					var effect1_trimin=(_trimout-25);
					var effect1_trimout=_trimout;

					var effect2_trimin=next_trimin;
					var effect2_trimout=next_trimin+25;
					var duration=50;

					effectBox1.attr('data-trimin',effect1_trimin);
					effectBox1.attr('data-trimout',effect1_trimout);
					effectBox1.attr('data-duration',duration);
					effectBox1.css('width',_boxWidth);
					effectBox1.attr('data-pos','footer-middle');
					effectBox1.attr('data-type',type);

					effectBox2.attr('data-trimin',effect2_trimin);
					effectBox2.attr('data-trimout',effect2_trimout);
					effectBox2.attr('data-duration',duration);
					effectBox2.css('width',_boxWidth);
					effectBox2.attr('data-pos','header-middle');
					effectBox2.attr('data-type',type);


					curr_subclip.append(effectBox1);
					curr_subclip.nextSubclip.append(effectBox2);

					var time1=curr_subclip.attr('data-time');
					var effectAttr1=getEffectAttr(type,effect1_trimin,effect1_trimout,duration,'footer-middle');
					PLAYER.operateJson.addEffectClip(time1,effectAttr1);

					var time2=curr_subclip.nextSubclip.attr('data-time');
					var effectAttr2=getEffectAttr(type,effect2_trimin,effect2_trimout,duration,'header-middle');
					PLAYER.operateJson.addEffectClip(time2,effectAttr2);
				}else if(type==='mosaic' && curr_subclip.effectPos==='all'){
					var effect_box=$('<div class="effect_box effect_box_all"></div>');
					var effect_trimin=_trimin;
					var effect_trimout=_trimout;

					effect_box.attr('data-trimin',effect_trimin);
					effect_box.attr('data-trimout',effect_trimout);
					effect_box.attr('data-duration',(_trimout-_trimin));
					effect_box.css('width',_width);
					effect_box.attr('data-pos','all');
					effect_box.attr('data-type',type);

					curr_subclip.append(effect_box);

					var time=curr_subclip.attr('data-time');
					var effectAttr=getEffectAttr(type,effect_trimin,effect_trimout,(_trimout-_trimin),'all');
					PLAYER.operateJson.addEffectClip(time,effectAttr);
				}
				return curr_subclip;
			}

		})();
		
	});
})();
/*----------------------重新渲染轨道素材模块--------------------------------*/
var drawClipModule=(function(){
	PLAYER.observer.listen('projectData',function(data,freshList){
		
		if(!freshList){
			if(JSON.parse(data).reference.material.length===0){
				return false;
			}else{
				var data=PLAYER.operateJson.translateMsToFfp(data);
				PLAYER.jsonObj=data;
				console.log('PLAYER.jsonObj',PLAYER.jsonObj)
				for (var i = 0,track; track=data.rootBin.sequence[0].tracks[i++];) {
					var type=track.type;
					var index=track.index;
						
					//如果工程已经有clip，则更新下工程
					PLAYER.operateJson.sortClipAttr();
					//获取当前轨道
					var current_track=PLAYER.operateJson.getTrack(type,index);

					if(track.subclip.length!==0){
						$.each(track.subclip,function(i,n){
							var duration;
							var name;
							var _id=n.assetID||n.id;
					        PLAYER.operateJson.getMaterialDuration(_id,function(msg){
					        	duration=msg.duration;
					        	name=msg.name;
					        });

					        var initWidth=(n.trimOut-n.trimIn)/PLAYER.TR.config.framePerPixel;//获取轨道切片宽度
				        	var _left=n.sequenceTrimIn/PLAYER.TR.config.framePerPixel;

				        	var subclipBox=$('<div class="edit_box draggable" data-trimin="'+n.trimIn+'" data-trimout="'+n.trimOut+'" data-sequencetrimin="'+n.sequenceTrimIn+'" data-sequencetrimout="'+n.sequenceTrimOut+'">'+name+'</div>');
				        	subclipBox.attr('data-duration',duration ||2000);
				        	subclipBox.attr('data-name',name);
				        	subclipBox.attr('data-id',n.assetID || n.id);
				        	subclipBox.attr('data-type',n.type);
				        	subclipBox.attr('data-interleaved',n.interleaved);
				        	subclipBox.attr('data-time',n.createTime);
							subclipBox.css('width',initWidth);
							subclipBox.css('left',_left);
							subclipBox.attr('data-intid',n.interleaved_id);


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
					}
		        } 
				PLAYER.operateJson.sendJson();
			}
		}
	});
})();
/*----------------------选中素材模块上轨------------------------------------*/
var chooseClipModule=(function(){
	PLAYER.observer.listen('projectData',function(data){
		
		var materialAttr=null; //保存单个视频素材属性
		if(PLAYER.jsonObj===null){
			PLAYER.jsonObj=JSON.parse(data);
		}

		$('#js_add_groupProgram').on('click',function(){
			PLAYER.checkPlaying();

			var arr_attr=[];
			for (var i = 0; i < PLAYER.chooseArray.length; i++) {
				$.ajax({
					url:serverUrl+'program/info',
					async:false,
					data:{
						assetId:PLAYER.chooseArray[i]
					},
					success:function(msg){
						if(msg.code===0&&msg.data!==null){
							msg.data.data.assetId=PLAYER.chooseArray[i];
							arr_attr.push(msg.data.data);
							if(arr_attr.length===PLAYER.chooseArray.length){
								addClip(arr_attr);
								updateJson();
							}
						}else{
							console.log('error');
						}
					}
				});
			}
			function calcWidth(duration){
				var self=this;
	            var res;
	            for (var i = 0,track; track=PLAYER.jsonObj.rootBin.sequence[0].tracks[i++];) {
	                if(track.subclip.length===0){
	                    PLAYER.TR.config.maxTime=duration+15000;
	                    PLAYER.TR.updateEvent(duration+15000,true);//更新时间轴
	                    res=duration/PLAYER.TR.config.framePerPixel;//获取轨道切片宽度
	                }else{
	                    res=duration/PLAYER.TR.config.framePerPixel;//获取轨道切片宽度
	                }
	            }
	            return res;
			}
			function addClip(program_info){
				var _left,
					_index=1,
					_width,
					int_id,
					_duration,
					initTrimin,
					initTrimout,
					initSequencetrimin,
					initSequencetrimout=PLAYER.TR.currTime,
					_name,
					_createTime_v,
					_createTime_a;
					console.log('program_info',program_info)
				for (var i = 0; i < program_info.length; i++) {
					_createTime_v='video_'+i+PLAYER.genNonDuplicateID(12);
					_createTime_a='audio_'+i+PLAYER.genNonDuplicateID(12);
					int_id='interleaved_id_'+i+PLAYER.genNonDuplicateID(12);

					initTrimin=0;
					initTrimout=program_info[i].duration;
					initSequencetrimout+=program_info[i].duration;
					initSequencetrimin=initSequencetrimout-program_info[i].duration;
					_duration=program_info[i].duration;
					_name=program_info[i].name;
					_left=initSequencetrimin/PLAYER.TR.config.framePerPixel;
					_id=program_info[i].assetId;
					_width=program_info[i].duration/PLAYER.TR.config.framePerPixel;

					//更新切片参数
					var videoEdit=$('<div class="edit_box edit_box_v draggable" data-trimin="'+initTrimin+'" data-trimout="'+initTrimout+'" data-sequencetrimin="'+initSequencetrimin+'" data-sequencetrimout="'+initSequencetrimout+'">'+_name+'</div>');
					var audioEdit=$('<div class="edit_box edit_box_a draggable" data-trimin="'+initTrimin+'" data-trimout="'+initTrimout+'" data-sequencetrimin="'+initSequencetrimin+'" data-sequencetrimout="'+initSequencetrimout+'">'+_name+'</div>');
					
					videoEdit.attr('data-time',_createTime_v);
					videoEdit.attr('data-interleaved','true');
					videoEdit.attr('data-type','video_and_audio');
					videoEdit.attr('data-intid',int_id);
					videoEdit.attr('data-duration',_duration);
					videoEdit.attr('data-id',_id);
					videoEdit.attr('data-name',_name);
					videoEdit.css('left',_left);
					videoEdit.css('width',_width);

					audioEdit.attr('data-time',_createTime_a);
					audioEdit.attr('data-interleaved','true');
					audioEdit.attr('data-type','video_and_audio');
					audioEdit.attr('data-intid',int_id);
					audioEdit.attr('data-duration',_duration);
					audioEdit.attr('data-id',_id);
					audioEdit.attr('data-name',_name);
					audioEdit.css('left',_left);
					audioEdit.css('width',_width);

					$('.bar_v[data-index="1"]').append(videoEdit);
					$('.bar_a[data-index="1"]').append(audioEdit);	

					var clipObj={
			            "assetID": _id,
			            "name": _name,
			            "trimIn": initTrimin,
			            "trimOut":initTrimout,
			            "sequenceTrimIn": initSequencetrimin,
			            "sequenceTrimOut":initSequencetrimout,
			            "createTime":_createTime_v,
			            "interleaved":true,
						"interleaved_id":int_id,
			            "effect":[]
					}
					var clipObj2={
			            "assetID":_id,
			            "name": _name,
			            "trimIn": initTrimin,
			            "trimOut":initTrimout,
			            "createTime":_createTime_a,
			            "sequenceTrimIn": initSequencetrimin,
			            "sequenceTrimOut":initSequencetrimout,
			            "interleaved":true,
			            "interleaved_id":int_id,
			            "volume":100
					}
					//判断覆盖
					if($('.bar_v').children().length>=1){
						PLAYER.operateJson.checkCoverEvent(videoEdit);
					}
					if($('.bar_a').children().length>=1){
						PLAYER.operateJson.checkCoverEvent(audioEdit);
					}

					PLAYER.operateJson.addVideoClipAttr(clipObj,_index);
					PLAYER.operateJson.addAudioClipAttr(clipObj2,_index);
					PLAYER.operateJson.addProjectMaterial(program_info[i]);	
				}
			};
			function updateJson(){
				//更新播放器时常
	            $('#js_player_totalTime').html(PLAYER.getDurationToString(PLAYER.operateJson.getLastFrame()));
	            //更新轨道时间线
	            var n=Math.max(PLAYER.TR.config.maxTime,PLAYER.operateJson.getLastFrame()+15000);
	            PLAYER.TR.updateEvent(n);
	            PLAYER.TR.fixClipWidth();

	            //更新播放器时间线
	            PLAYER.PTR.config.maxTime=PLAYER.operateJson.getLastFrame();
	            PLAYER.PTR.updateEvent(PLAYER.PTR.config);

	            PLAYER.operateJson.sendJson();
				
				//置空
				PLAYER.chooseArray=[];	
				$('#js_thumbnail_box .col-md-3').removeClass('active');
			}
		});

	});
})();

(function(win,doc,$){
    function DragObj(options){
        this._init(options);
    };
    $.extend(DragObj.prototype,{
        //初始化函数
        _init:function(options){
            var self=this;
            self.options={
                type:'', 
                cont:''
            }
            $.extend(true,self.options,options||{});

            self._initDom();
            return self;
        },
        //DOM元素选择操作
        _initDom:function(){
            var self=this;
            this.$type=this.options.type;
            this.$cont=this.options.cont;
            this.$doc=$(doc);
            this._initSliderDragEvent();
            if(this.$type===''){
                throw new Error('您必须输入拖拽的素材类型')
            }
            if(this.$cont===''){
                throw new Error('您必须输入拖拽的素材')
            }
            if(this.$type==='video_and_audio'){
                this._down_video_and_audio()
                    ._move_video_and_audio()
                    ._up_video_and_audio();
            }else if(this.$type==='video'){
                this._down_video()
                    ._move_video()
                    ._up_video();
            }
            else if(this.$type==='audio'){
                this._down_audio()
                    ._move_audio()
                    ._up_audio();
            }
            else if(this.$type==='subtitle'){
                this._down_subtitle()
                    ._move_subtitle()
                    ._up_subtitle();
            }
        },
        //滑块开始拖动函数
        _initSliderDragEvent:function(){
            var self=this;
            var doc=this.$doc;
            var onOff=false;
            if(self.$cont){
            	self.$cont.delegate(self.$cont.children(),'mousedown',function(e){
					
				 	e.preventDefault();
                    PLAYER.checkPlaying();
                    
                    PLAYER.hideSubititleEdit();
                    PLAYER.hideEffectEdit();

                    if($('#js_time_ruler_bar_box').find('.edit_box').length===0){
                    	PLAYER.initDrag=true;
                    }else{
                    	PLAYER.initDrag=false;
                    }
                    
					onOff=false;
                    if(self.$type==='video_and_audio'){
                    	var target=$(e.target).parents('.col-md-3');
                        var _id=target.attr('data-id');
                        $.ajax({
                            url:serverUrl+'program/info',
                            data:{
                                assetId:_id
                            },
                            success:function(msg){
                                if(msg.code===0&&msg.data!==null){
                                    materialAttr=msg.data.data;
                                    materialAttr.assetId=_id;
                                    PLAYER.observer.trigger('_down_'+self.$type,e,materialAttr);
                                }else{
                                    console.log('error');
                                }
                            }
                        });
                    }else if(self.$type==='video'){
                        var target=$(e.target);
                        
                        target.addClass('active');
                        target.siblings().removeClass('active');
                        materialAttr={
                            assetId:"e"+Math.random(),
                            duration:50,
                            filePath:target.attr('data-http'),
                            name:target.siblings('span').html()
                        }
                        PLAYER.observer.trigger('_down_'+self.$type,e,materialAttr);
                    }else if(self.$type==='audio'){
                    	var target=$(e.target);
                    	target.addClass('active');
                        target.siblings().removeClass('active');
                        materialAttr={
                            assetId:"e"+Math.random(),
                            duration:1000,
                            filePath:target.attr('data-http'),
                            name:target.siblings('span').html()
                        }
                        PLAYER.observer.trigger('_down_'+self.$type,e,materialAttr);
                    }else if(self.$type==='subtitle'){
                    	var target=$(e.target);
                    	target.addClass('active');
                        target.siblings().removeClass('active');
                        var _id=target.attr('data-temid');
                        var attr=JSON.parse(PLAYER.operateJson.getSubtitleTemp(_id));
                        if(attr){
                            PLAYER.observer.trigger('_down_'+self.$type,e,attr);
                        }
                    }

                    doc.on('mousemove.slider',mousemoveHandler).on('mouseup.slider',function(e){
                        doc.off('.slider');
                        PLAYER.observer.trigger('_up_'+self.$type,e,onOff);//拖拽抬起的事件,防止与click冲突
                        onOff=false;  
                    });

                    function mousemoveHandler(e){
						onOff=true; 
                        PLAYER.observer.trigger('_move_'+self.$type,e,onOff); 
                    }
            	})
            }
            
            return self;
        },
        _down_video_and_audio:function(){
            var self=this;
            PLAYER.observer.listen('_down_video_and_audio',function(e,materialInfo){
                self.materialAttr=materialInfo;
                //创建单例拖拽图像
                var createSingleDragElem=function(){
                    self._addVideoClip(e,materialInfo);
                    self._addAudioClip(e,materialInfo);
                };

                PLAYER.singelton(createSingleDragElem)();
            }); 
            return self;
        },
        _move_video_and_audio:function(){
            var self=this;
            PLAYER.observer.listen('_move_video_and_audio',function(e,onOff){
                var x=e.clientX;
                var y=e.clientY;
                
                self.moveObj=self._calTimerRulerRrea(x,y,'video_and_audio');            //区域轨道
            });
            return self;
        },
        _up_video_and_audio:function(){
            var self=this;
            PLAYER.observer.listen('_up_video_and_audio',function(e,onOff){
				if(!onOff){
					$('#js_time_ruler_bar_box .draghelper').remove();
					return false;
				}else{
					var intId='interleaved_id_'+PLAYER.genNonDuplicateID(12);
	                var checkId='check_interleaved_id_'+PLAYER.genNonDuplicateID(12);
	                if(self.$type==='video_and_audio'){
	                    var a1=self._updateVideoClip(e,'video_and_audio',intId,checkId);
	                    var a2=self._updateAudioClip(e,'video_and_audio',intId,checkId);
	                    if(a1&&a2){
	                        PLAYER.operateJson.addVideoClipAttr(a1.clipAttr,a1._index);
	                        PLAYER.operateJson.addAudioClipAttr(a2.clipAttr,a2._index);
	                        self._updateJsonAttr();
	                    }
	                }
				}
                
            });
            return self;
        },
        _down_video:function(){
            var self=this;
            PLAYER.observer.listen('_down_video',function(e,materialInfo){
                self.materialAttr=materialInfo;
                var createSingleDragElem=function(){
                    self._addVideoClip(e,materialInfo);
                };
                var dragElem=PLAYER.singelton(createSingleDragElem)();
            }); 
            return self;
        },
        _move_video:function(){
            var self=this;
            PLAYER.observer.listen('_move_video',function(e){
                var x=e.clientX;
                var y=e.clientY;
                self.moveObj=self._calTimerRulerRrea(x,y,'video');          //区域轨道
            });
            return self;
        },
        _up_video:function(){
            var self=this;
            PLAYER.observer.listen('_up_video',function(e,onOff){
            	if(!onOff){
					$('#js_time_ruler_bar_box .draghelper').remove();
					return false;
				}else{
	                if(self.$type==='video'){
	                    var checkId='check_interleaved_id_'+PLAYER.genNonDuplicateID(12);
	                    var a1=self._updateVideoClip(e,'video','',checkId);
	                    if(a1){
	                        PLAYER.operateJson.addVideoClipAttr(a1.clipAttr,a1._index);
	                        self._updateJsonAttr();
	                    }
	                }
	            }
            });
            return self;
        },
        _down_audio:function(){
            var self=this;
            PLAYER.observer.listen('_down_audio',function(e,materialInfo){
                self.materialAttr=materialInfo;
                var createSingleDragElem=function(){
                    self._addAudioClip(e,materialInfo);
                };
                var dragElem=PLAYER.singelton(createSingleDragElem)();
            }); 
            return self;
        },
        _move_audio:function(){
            var self=this;
            PLAYER.observer.listen('_move_audio',function(e){
                var x=e.clientX;
                var y=e.clientY;
                self.moveObj=self._calTimerRulerRrea(x,y,'audio');          //区域轨道
            });
            return self;
        },
        _up_audio:function(){
            var self=this;
            PLAYER.observer.listen('_up_audio',function(e,onOff){
            	if(!onOff){
					$('#js_time_ruler_bar_box .draghelper').remove();
					return false;
				}else{
					if(self.$type==='audio'){
	                    var checkId='check_interleaved_id_'+PLAYER.genNonDuplicateID(12);
	                    var a2=self._updateAudioClip(e,'audio','',checkId);
	                    if(a2){
	                        PLAYER.operateJson.addAudioClipAttr(a2.clipAttr,a2._index);
	                        self._updateJsonAttr();
	                    }
	                }
				}
                
            });
            return self;
        },
        _down_subtitle:function(){
            var self=this;
            PLAYER.observer.listen('_down_subtitle',function(e,materialInfo){
                
                self.materialAttr=materialInfo;
                var createSingleDragElem=function(){
                    self._addSubtitleClip(e,materialInfo);
                };
                var dragElem=PLAYER.singelton(createSingleDragElem)();
            }); 
            return self;
        },
        _move_subtitle:function(){
            var self=this;
            PLAYER.observer.listen('_move_subtitle',function(e){
                var x=e.clientX;
                var y=e.clientY;
                
                self.moveObj=self._calTimerRulerRrea(x,y,'subtitle');           //区域轨道
            });
            return self;
        },
        _up_subtitle:function(){
            var self=this;
            PLAYER.observer.listen('_up_subtitle',function(e,onOff){
            	if(!onOff){
					$('#js_time_ruler_bar_box .draghelper').remove();
					return false;
				}else{
	                if(self.$type==='subtitle'){
	                    var checkId='check_interleaved_id_'+PLAYER.genNonDuplicateID(12);
	                    var a3=self._updateSubtitleClip(e,'subtitle',checkId);
	                    if(a3){
	                        PLAYER.operateJson.addSubtitleClipAttr(a3.clipAttr,a3._index);
	                        self._updateJsonAttr();
	                    }
	                }
	            }
            });
            return self;
        },
        _addVideoClip:function(e,materialInfo){
            var self=this;
            var dragElem_v;
            var initTrimin=0;
            var initTrimout=materialInfo.duration;
            var initSequencetrimin=parseInt(e.clientX*PLAYER.TR.config.framePerPixel);
            var initSequencetrimout=materialInfo.duration+initSequencetrimin;
            var _w=self._calculateWidth(materialInfo.duration);
            $.each($('#js_time_ruler_bar_box .bar_v'),function(i,n){
                dragElem_v=$('<div class="edit_box edit_box_v draggable draghelper">'+materialInfo.name+'</div>');
                dragElem_v.attr('data-duration',materialInfo.duration);
                dragElem_v.attr('data-name',materialInfo.name);
                dragElem_v.attr('data-id',materialInfo.assetId);
                dragElem_v.css('left',e.clientX);
                dragElem_v.css('width',_w);

                dragElem_v.attr('data-trimin',initTrimin);
                dragElem_v.attr('data-trimout',initTrimout);
                dragElem_v.attr('data-sequencetrimin',initSequencetrimin);
                dragElem_v.attr('data-sequencetrimout',initSequencetrimout);

                $(n).append(dragElem_v);

                _duration=parseInt($(n).children('.draghelper').attr('data-duration'));
                _left=parseInt($(n).children('.draghelper').css('left'));
                
            });
            return self;
        },
        _addAudioClip:function(e,materialInfo){
            var self=this;
            var dragElem_a;

            var initTrimin=0;
            var initTrimout=materialInfo.duration;
            var initSequencetrimin=parseInt(e.clientX*PLAYER.TR.config.framePerPixel);
            var initSequencetrimout=materialInfo.duration+initSequencetrimin;

            var _w=self._calculateWidth(materialInfo.duration);
            $.each($('#js_time_ruler_bar_box .bar_a'),function(i,n){
                dragElem_a=$('<div class="edit_box edit_box_a draggable draghelper">'+materialInfo.name+'</div>');
                dragElem_a.attr('data-duration',materialInfo.duration);
                dragElem_a.attr('data-name',materialInfo.name);
                dragElem_a.attr('data-id',materialInfo.assetId);
                dragElem_a.css('left',e.clientX);
                dragElem_a.css('width',_w);

                dragElem_a.attr('data-trimin',initTrimin);
                dragElem_a.attr('data-trimout',initTrimout);
                dragElem_a.attr('data-sequencetrimin',initSequencetrimin);
                dragElem_a.attr('data-sequencetrimout',initSequencetrimout);

                $(n).append(dragElem_a);
            });
            return self;
        },
        _addSubtitleClip:function(e,materialInfo){
            var self=this;
            var dragElem;

            var initTrimin=0;
            var initTrimout=materialInfo.duration;
            var initSequencetrimin=parseInt(e.clientX*PLAYER.TR.config.framePerPixel);
            var initSequencetrimout=materialInfo.duration+initSequencetrimin;

            var _w=self._calculateWidth(materialInfo.duration);

            $.each($('#js_time_ruler_bar_box .bar_t'),function(i,n){
                dragElem=$('<div class="edit_box edit_box_t draggable draghelper">'+materialInfo.name+'</div>');
                dragElem.attr('data-duration',materialInfo.duration);
                dragElem.attr('data-name',materialInfo.name);
                dragElem.attr('data-id',materialInfo.id);
                dragElem.css('left',e.clientX);
                dragElem.css('width',_w);

                dragElem.attr('data-trimin',initTrimin);
                dragElem.attr('data-trimout',initTrimout);
                dragElem.attr('data-sequencetrimin',initSequencetrimin);
                dragElem.attr('data-sequencetrimout',initSequencetrimout);
                $(n).append(dragElem);
            });
            return self;
        },
        _calculateWidth:function(duration){
            var self=this;
            var res;
            if(PLAYER.initDrag){
            	PLAYER.TR.config.maxTime=duration+15000;
                PLAYER.TR.updateEvent(duration+15000,true);//更新时间轴
                res=duration/PLAYER.TR.config.framePerPixel;//获取轨道切片宽度
                PLAYER.initDrag=true;
            }else{
            	res=duration/PLAYER.TR.config.framePerPixel;//获取轨道切片宽度
            }
            
            return res;
        },
        _calTimerRulerRrea:function(x,y,type){
            var self=this;
            var _index;
            var config=PLAYER.TR.config;
            var _marginLeft=Math.abs(parseInt($('#js_time_ruler_bar_box').css('marginLeft')));
            if(type==='video_and_audio'){
                var nowLeft;
                var sequenceTrimIn;
                var sequenceTrimOut;
                var dragging;

                $('.bar_v').each(function(i,n){
                    var _top=parseInt($(this).offset().top);
                    var _left=parseInt($(this).offset().left);
                    
                    that=$(this);
                    _index=that.attr('data-index');

                    if(y>=_top && y<=_top+35 && (x>=_left||Math.abs(x-_left)<=15) ){
                        
                        that.addClass('overActive');
                        that.siblings('.bar_v').removeClass('overActive');
                        $('.bar_a[data-index="'+_index+'"]').addClass('overActive');
                        $('.bar_a[data-index="'+_index+'"]').siblings('.bar_a').removeClass('overActive');
                        that.children('.draghelper').show();
						dragging=that.children('.draghelper');

                        nowLeft=x-_left;

                        if(nowLeft-_marginLeft<=0){
                            nowLeft=_marginLeft;
                        }
                        nowLeft=parseInt(nowLeft*config.framePerPixel)/config.framePerPixel;
            			sequenceTrimIn=Math.round(nowLeft*config.framePerPixel);
            			sequenceTrimOut=sequenceTrimIn+(dragging.attr('data-trimout')-dragging.attr('data-trimin'));
                        
                        if(dragging.siblings().length!==0){
                            var adhere_point=PLAYER.operateJson.getAllsequenceTrimIn(dragging);//获取所有切片的吸附点
							
							console.log('adhere_point',adhere_point)
		                    var offset=Math.abs(sequenceTrimIn-adhere_point)/config.framePerPixel;
		                    if(offset<=5){
		                        nowLeft=adhere_point/config.framePerPixel;
		                        sequenceTrimIn=adhere_point;

								var _d=dragging.attr('data-trimout')-dragging.attr('data-trimin');
		                        sequenceTrimOut=sequenceTrimIn+_d;
		                        show(dragging,'forward'); 
		                    }else{
		                        hide(dragging);
		                    }

		                    /*
		                    	var adhere_point2=PLAYER.operateJson.getAllsequenceTrimOut(dragging);
		                    	var offset2=Math.abs(sequenceTrimOut-adhere_point2)/config.framePerPixel;
		                    	if(offset2<=5){
			                        sequenceTrimOut=adhere_point2;
			                        sequenceTrimIn=adhere_point2-(dragging.attr('data-trimout')-dragging.attr('data-trimin'));
			                        nowLeft=Math.round(sequenceTrimIn/config.framePerPixel);
			                        show(dragging,'backward'); 
			                    }else{
			                        hide(dragging);
		                    	}
		                    */
                        }
                        
                        that.children('.draghelper').css('left',nowLeft);
                        that.children('.draghelper').attr('data-sequencetrimin',sequenceTrimIn);
            			that.children('.draghelper').attr('data-sequencetrimout',sequenceTrimOut);
                        $('.bar_a[data-index="'+_index+'"]').children('.draghelper').show();
                        $('.bar_a[data-index="'+_index+'"]').children('.draghelper').css('left',nowLeft);
                        $('.bar_a[data-index="'+_index+'"]').children('.draghelper').attr('data-sequencetrimin',sequenceTrimIn);
                        $('.bar_a[data-index="'+_index+'"]').children('.draghelper').attr('data-sequencetrimout',sequenceTrimOut);
                        
                    }else{
                        that.children('.draghelper').hide();
                        $('.bar_a[data-index="'+_index+'"]').children('.draghelper').hide();
                        that.removeClass('overActive');
                        $('.bar_a[data-index="'+_index+'"]').removeClass('overActive');
                    }

                    
                });
            }else if(type==='video'){
            	var nowLeft;
                var sequenceTrimIn;
                var sequenceTrimOut;
                var dragging;
                $('.bar_v').each(function(i,n){
                    var _top=parseInt($(this).offset().top);
                    var _left=parseInt($(this).offset().left);
                    that=$(this);
                    _index=that.attr('data-index');
                    if(y>=_top&&y<=_top+35 && (x>=_left||Math.abs(x-_left)<=15)){
                        that.addClass('overActive');
                        that.siblings('.bar_v').removeClass('overActive');
						dragging=that.children('.draghelper');

                        nowLeft=x-_left;
                        if(nowLeft-_marginLeft<=0){
                            nowLeft=_marginLeft;
                        }
                        
                        nowLeft=parseInt(nowLeft*config.framePerPixel)/config.framePerPixel;
            			sequenceTrimIn=Math.round(nowLeft*config.framePerPixel);
            			sequenceTrimOut=sequenceTrimIn+(dragging.attr('data-trimout')-dragging.attr('data-trimin'));
                        
                        if(dragging.siblings().length!==0){
                            var adhere_point=PLAYER.operateJson.getAllsequenceTrimIn(dragging);//获取所有切片的吸附点 
		                    var offset=Math.abs(sequenceTrimIn-adhere_point)/config.framePerPixel;
		                    if(offset<=5){
		                        nowLeft=adhere_point/config.framePerPixel;
		                        sequenceTrimIn=Math.round(nowLeft*config.framePerPixel);
		                        var _d=dragging.attr('data-trimout')-dragging.attr('data-trimin');
		                        sequenceTrimOut=sequenceTrimIn+_d;
		                        show(dragging,'forward'); 
		                    }else{
		                        hide(dragging);
		                    }
                        }
                        that.children('.draghelper').show();
                        that.children('.draghelper').css('left',nowLeft);
                        that.children('.draghelper').attr('data-sequencetrimin',sequenceTrimIn);
            			that.children('.draghelper').attr('data-sequencetrimout',sequenceTrimOut);

                    }else{
                        that.children('.draghelper').hide();
                        that.removeClass('overActive');
                    }
                });
            }else if(type==='audio'){
            	var nowLeft;
                var sequenceTrimIn;
                var sequenceTrimOut;
                var dragging;
                $('.bar_a').each(function(i,n){
                    var _top=parseInt($(this).offset().top);
                    var _left=parseInt($(this).offset().left);
                    that=$(this);
                    _index=that.attr('data-index');
                    if(y>=_top&&y<=_top+35 && (x>=_left||Math.abs(x-_left)<=15)){
                        that.addClass('overActive');
                        that.siblings('.bar_a').removeClass('overActive');
                        that.children('.draghelper').show();
						dragging=that.children('.draghelper');

                        nowLeft=x-_left;
                        if(nowLeft-_marginLeft<=0){
                            nowLeft=_marginLeft;
                        }

                        nowLeft=parseInt(nowLeft*config.framePerPixel)/config.framePerPixel;
            			sequenceTrimIn=Math.round(nowLeft*config.framePerPixel);
            			sequenceTrimOut=sequenceTrimIn+(dragging.attr('data-trimout')-dragging.attr('data-trimin'));
                        
                        if(dragging.siblings().length!==0){
                            var adhere_point=PLAYER.operateJson.getAllsequenceTrimIn(dragging);//获取所有切片的吸附点 
		                    var offset=Math.abs(sequenceTrimIn-adhere_point)/config.framePerPixel;
		                    if(offset<=5){
		                        nowLeft=adhere_point/config.framePerPixel;
		                        sequenceTrimIn=Math.round(nowLeft*config.framePerPixel);
		                        var _d=dragging.attr('data-trimout')-dragging.attr('data-trimin');
		                        sequenceTrimOut=sequenceTrimIn+_d;
		                        show(dragging,'forward'); 
		                    }else{
		                        hide(dragging);
		                    }
                        }

                        that.children('.draghelper').css('left',nowLeft);
                        that.children('.draghelper').attr('data-sequencetrimin',sequenceTrimIn);
            			that.children('.draghelper').attr('data-sequencetrimout',sequenceTrimOut);
                    }else{
                        that.children('.draghelper').hide();
                        that.removeClass('overActive');
                    }
                });
            }else if(type==='subtitle'){
            	var nowLeft;
                var sequenceTrimIn;
                var sequenceTrimOut;
                var dragging;
                $('.bar_t').each(function(i,n){
                    var _top=parseInt($(this).offset().top);
                    var _left=parseInt($(this).offset().left);
                    that=$(this);
                    _index=that.attr('data-index');

                    if(y>=_top&&y<=_top+35&& (x>=_left||Math.abs(x-_left)<=15)){
                        that.addClass('overActive');
                        that.siblings('.bar_a').removeClass('overActive');
                        that.children('.draghelper').show();
                        that.children('.draghelper').css('background','pink');
						dragging=that.children('.draghelper');
                        nowLeft=x-_left;
                        if(nowLeft-_marginLeft<=0){
                            nowLeft=_marginLeft;
                        }
						nowLeft=parseInt(nowLeft*config.framePerPixel)/config.framePerPixel;
            			sequenceTrimIn=Math.round(nowLeft*config.framePerPixel);
            			sequenceTrimOut=sequenceTrimIn+(dragging.attr('data-trimout')-dragging.attr('data-trimin'));
                        
                        if(dragging.siblings().length!==0){
                            var adhere_point=PLAYER.operateJson.getAllsequenceTrimIn(dragging);//获取所有切片的吸附点 
		                    var offset=Math.abs(sequenceTrimIn-adhere_point)/config.framePerPixel;
		                    if(offset<=5){
		                        nowLeft=adhere_point/config.framePerPixel;
		                        sequenceTrimIn=Math.round(nowLeft*config.framePerPixel);
		                        var _d=dragging.attr('data-trimout')-dragging.attr('data-trimin');
		                        sequenceTrimOut=sequenceTrimIn+_d;
		                        show(dragging,'forward'); 
		                    }else{
		                        hide(dragging);
		                    }
                        }
                        
                        that.children('.draghelper').css('left',nowLeft);
                        that.children('.draghelper').attr('data-sequencetrimin',sequenceTrimIn);
            			that.children('.draghelper').attr('data-sequencetrimout',sequenceTrimOut);
                        
                    }else{
                        that.children('.draghelper').hide();
                        that.removeClass('overActive');
                    }
                });
            }

            function show(dragging,dir){
                PLAYER.operateJson.showAdhere(dragging,dir);
            }
            function hide(dragging){
                PLAYER.operateJson.hideAdhere(dragging);
            }
            return _index;
        },
        _updateVideoClip:function(e,type,intid,checkId){
            var self=this;
            var clipAttr;
            var _index;
            $.each($('.bar_v'),function(i,n){
                if($(n).hasClass('overActive')){
                    _index=parseInt($(n).attr('data-index'));
                    var createTime=type+'_'+PLAYER.genNonDuplicateID(12);
                    var _left,
                        _id,
                        _name,
                        _duration,
                        initTrimin,
                        initTrimout,
                        initSequencetrimin,
                        initSequencetrimout;
                    _id=$(n).children('.draghelper').attr('data-id');
                    _name=$(n).children('.draghelper').attr('data-name');
                    _duration=parseInt($(n).children('.draghelper').attr('data-duration'));
                    
                    
                    initTrimin=parseInt($(n).children('.draghelper').attr('data-trimin'));
                    initTrimout=parseInt($(n).children('.draghelper').attr('data-trimout'));
                    initSequencetrimin=parseInt($(n).children('.draghelper').attr('data-sequencetrimin'));
                    initSequencetrimout=parseInt($(n).children('.draghelper').attr('data-sequencetrimout'));

                    
                    $(n).children('.draghelper').css('background','#33bbff');
                    $(n).children('.draghelper').attr('data-type',type);
                    $(n).children('.draghelper').attr('data-time',createTime);
                    
                    clipAttr={
                        "assetID": _id,
                        "trimIn": initTrimin,
                        "trimOut":initTrimout,
                        "sequenceTrimIn": initSequencetrimin,
                        "sequenceTrimOut":initSequencetrimout,
                        "effect":[],
                        "type":type,
                        "createTime":createTime
                    }
                    if(type==='video_and_audio'){
                        $(n).children('.draghelper').attr('data-interleaved',true);
                        clipAttr.interleaved=true;

                        $(n).children('.draghelper').attr('data-intid',intid);
                        clipAttr.interleaved_id=intid;

                    }else if(type==='video'){
                        var _id='no_interleaved_id_'+PLAYER.genNonDuplicateID(12);

                        $(n).children('.draghelper').attr('data-interleaved',false);
                        clipAttr.interleaved=false;

                        $(n).children('.draghelper').attr('data-intid',_id);
                        clipAttr.interleaved_id=_id;
                    }
                    
                    //判断覆盖
                    if($(n).children().length>=2){
                        PLAYER.operateJson.checkCoverEvent($(n).children('.draghelper'),checkId);
                    }

                    $(n).removeClass('overActive');
                    $(n).children('.draghelper').removeClass('draghelper');
                    
                }else{
                    $(n).children('.draghelper').remove();
                    return;
                }
                PLAYER.operateJson.hideAdhere($(n));
            });
            if(clipAttr){
                return  {
                    clipAttr:clipAttr,
                    _index:_index
                }
            }
        },
        _updateAudioClip:function(e,type,intid,checkId){
            var self=this;
            var clipAttr;
            var _index;
            $.each($('.bar_a'),function(i,n){
                if($(n).hasClass('overActive')){
                    _index=parseInt($(n).attr('data-index'));
                    var createTime=type+'_'+PLAYER.genNonDuplicateID(12);
                    var _left,
                        _id,
                        _name,
                        _duration,
                        initTrimin,
                        initTrimout,
                        initSequencetrimin,
                        initSequencetrimout;
                    _id=$(n).children('.draghelper').attr('data-id');
                    _name=$(n).children('.draghelper').attr('data-name');
                    _duration=parseInt($(n).children('.draghelper').attr('data-duration'));


                    initTrimin=parseInt($(n).children('.draghelper').attr('data-trimin'));
                    initTrimout=parseInt($(n).children('.draghelper').attr('data-trimout'));
                    initSequencetrimin=parseInt($(n).children('.draghelper').attr('data-sequencetrimin'));
                    initSequencetrimout=parseInt($(n).children('.draghelper').attr('data-sequencetrimout'));

                    $(n).children('.draghelper').css('background','#33bbff');
                    $(n).children('.draghelper').attr('data-type',type);
                    $(n).children('.draghelper').attr('data-time',createTime);
                    
                    clipAttr={
                        "assetID":_id,
                        "trimIn": initTrimin,
                        "trimOut":initTrimout,
                        "sequenceTrimIn": initSequencetrimin,
                        "sequenceTrimOut":initSequencetrimout,
                        "volume":100,
                        "type":type,
                        "createTime":createTime
                    }
                    if(type==='video_and_audio'){
                        $(n).children('.draghelper').attr('data-interleaved',true);
                        clipAttr.interleaved=true;

                        $(n).children('.draghelper').attr('data-intid',intid);
                        clipAttr.interleaved_id=intid;

                    }else if(type==='audio'){
                        var _id='no_interleaved_id_'+PLAYER.genNonDuplicateID(12);

                        $(n).children('.draghelper').attr('data-interleaved',false);
                        clipAttr.interleaved=false;

                        $(n).children('.draghelper').attr('data-intid',_id);
                        clipAttr.interleaved_id=_id;
                    }
                    
                    //判断覆盖
                    if($(n).children().length>=2){
                        PLAYER.operateJson.checkCoverEvent($(n).children('.draghelper'),checkId);
                    }

                    $(n).removeClass('overActive');
                    $(n).children('.draghelper').removeClass('draghelper');

                }else{
                    $(n).children('.draghelper').remove();
                    return;
                }
                PLAYER.operateJson.hideAdhere($(n));
            });
            

            if(clipAttr){
                return  {
                    clipAttr:clipAttr,
                    _index:_index
                }
            }
        },
        _updateSubtitleClip:function(e,type,checkId){
            var self=this;
            var clipAttr;
            var _index;
            $.each($('.bar_t'),function(i,n){
                if($(n).hasClass('overActive')){
                    _index=parseInt($(n).attr('data-index'));
                    var _left,
                        _id,
                        _name,
                        _duration,
                        _createTime,
                        initTrimin,
                        initTrimout,
                        initSequencetrimin,
                        initSequencetrimout;
                    _id=$(n).children('.draghelper').attr('data-id');
                    _name=$(n).children('.draghelper').attr('data-name');
                    _duration=parseInt($(n).children('.draghelper').attr('data-duration'));
                    _createTime=type+'_'+PLAYER.genNonDuplicateID(12);


                    initTrimin=parseInt($(n).children('.draghelper').attr('data-trimin'));
                    initTrimout=parseInt($(n).children('.draghelper').attr('data-trimout'));
                    initSequencetrimin=parseInt($(n).children('.draghelper').attr('data-sequencetrimin'));
                    initSequencetrimout=parseInt($(n).children('.draghelper').attr('data-sequencetrimout'));

                    $(n).children('.draghelper').attr('data-time',_createTime);
                    $(n).children('.draghelper').css('background','#ea3af5');
                    $(n).children('.draghelper').attr('data-type',type);
                    $(n).children('.draghelper').attr('data-interleaved',false);

                    var int_id='no_interleaved_id_'+PLAYER.genNonDuplicateID(12);
                    $(n).children('.draghelper').attr('data-intid',int_id);

                    clipAttr= JSON.parse(PLAYER.operateJson.getSubtitleTemp(_id));
                    var subAttr={
                        "trimIn": 0,
                        "trimOut":2000,
                        "sequenceTrimIn":initSequencetrimin,        //字体默认入点 0
                        "sequenceTrimOut":initSequencetrimout,      //字体默认出点 2000
                        "createTime":_createTime,
                        "type":type,
                        "interleaved":false,
                        "interleaved_id":int_id
                    }
                    $.extend(clipAttr,subAttr);
                    
                    //判断覆盖
                    if($(n).children().length>=2){
                        PLAYER.operateJson.checkCoverEvent($(n).children('.draghelper'),checkId);
                    }
					
                }else{
                    $(n).children('.draghelper').remove();
                    return;
                }
                PLAYER.operateJson.hideAdhere($(n));
            });
            if(clipAttr){
                return  {
                    clipAttr:clipAttr,
                    _index:_index
                }
            }
        },
        _updateJsonAttr:function(){
            var self=this;
            $('.time_ruler_bar').removeClass('overActive');
            $('.time_ruler_bar').children().removeClass('onselected');
            $('.time_ruler_bar').children('.draghelper').removeClass('draghelper');

            //更新播放器时常
            $('#js_player_totalTime').html(PLAYER.getDurationToString(PLAYER.operateJson.getLastFrame()));

            //更新轨道时间线
            var n=Math.max(PLAYER.TR.config.maxTime,PLAYER.operateJson.getLastFrame()+15000||0);
            PLAYER.TR.updateEvent(n);
            PLAYER.TR.fixClipWidth();

            //更新播放器时间线
            PLAYER.PTR.config.maxTime=PLAYER.operateJson.getLastFrame();
            PLAYER.PTR.updateEvent(PLAYER.PTR.config);

            //更新material,json
            PLAYER.operateJson.addProjectMaterial(self.materialAttr);
            PLAYER.operateJson.sendJson();
        }
    });
        
    win.DragObj=DragObj;
})(window,document,jQuery);

var FlyFactory=(function(){
	var createFlyObj={};
	return {
		create:function(type,cont){
			if(createFlyObj[type]){
				return createFlyObj[type];
			}
			return createFlyObj[type]=new DragObj({
				type:type,
				cont:cont
			});
		}
	}
})();

PLAYER.observer.listen('projectData',function(data){
	if(PLAYER.jsonObj===null){
		PLAYER.jsonObj=JSON.parse(data);
	}
	//拖拽视频
	FlyFactory.create("video_and_audio",$('#js_thumbnail_box'));
	//拖拽字幕
	FlyFactory.create("subtitle",$('#js_subtitle_wrap'));
	//拖拽图片
	FlyFactory.create("video",$('#js_images_wrap'));
	//拖拽音频
	FlyFactory.create("audio",$('#js_audio_wrap'));
	
});

});




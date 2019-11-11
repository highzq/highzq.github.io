/*									【进度条的布局格式不能改变！都是用Dom控制好了的】					*/
																	

/*			【模板】
	<div id="box1">		<--【整个的大盒子】
		<a href="javascript:void(0)" id="play1">播放</a>
		<a href="javascript:void(0)" style="display:none" id="stop1">暂停</a>
		<a href="javascript:void(0)" id="vol1">静音</a>
		<span id="tot1">00:00</span>	<--【显示总时长】
		<span id="cur1">00:00</span>	<--【已播放时间】
		<span id="bur1">00:00</span>	<--剩余播放时间】
		<div id="prograss" class="cprograss">	<--【进度条最外层盒子】
			<div class="cpercent"></div> <--【宽度显示百分比】
			<div id="bar" class="cbar">	<--【进度拖动的目标】
				<span class="cpnum">0%</span>	<--【百分比显示】
			</div>
			<div class="cover"></div>	<--【遮罩层】
		</div>

		<div id="vprograss" class="cprograss">	<--【音量最外层盒子】
			<div id="vpercent" class="cpercent"></div>	<--【宽度显示百分比】
			<div id="vbar" class="cbar">	<--【音量拖动的目标】
				<span id="pnum" class="cpnum">0%</span>	<--【百分比显示】
			</div>
			<div id="vcover" class="cover"></div>	<--【遮罩层】
		</div>
	</div>



	【JS模板】		每创建一个新的播放器 new的名字和每个元素命名都要不同

window.onload = function(){	

	var music1 = new TzMusic("box1","mp3/1.mp3","追梦赤子心","gagao");
	music1.init({bar:$("bar"),volume:$("vbar")},function(mark){
		if(mark=="time"){//时长的调用
			$("tot1").innerHTML = this.ftime;//总时长
		}else if(mark=="play"){
			//播放中的		
			$("cur1").innerHTML= this.fptime;//已播放时间
			$("bur1").innerHTML= this.btime;//剩余播放时间
			
		}
	});

	$("play1").onclick = function(){
		music1.play();
		this.style.display = "none";
		$("stop1").style.display = "inline-block";
	};
	$("stop1").onclick = function(){
		music1.stop();
		this.style.display = "none";
		$("play1").style.display = "inline-block";
	};
	$("vol1").onclick = function(){
		var obj = this;
		music1.stopVolome(function(mark){
			obj.innerHTML = mark ? "非静音":"静音";
		});
	};
}







*/



var TzMusic = (function(){   
	function _tzMusic(id,src,title,author){
		//如果new了那么代表this是_tzMusic里面的，不是就在new一个
		if(this instanceof _tzMusic){//对象的检查
			this.id = id;
			this.src = src;
			this.title = title;
			this.author = author;
			this.audioDom = null;
		}else{
			return new _tzMusic(id,src,title,author);
		}
	};
	//公有方法和属性
	_tzMusic.prototype = {
		constructor:_tzMusic,
		audioDom:null,
		//初始的基本方法，把需要调用的全部放在一起
		init:function(opts,callback){
			this.audioDom = document.createElement("audio");//创建一个音乐播放器
			//this.audioDom.controls = "controls";	//默认显示播放器
			this.audioDom.src = this.src;	//把类里面的路径传进来
			this.audioDom.volume = 0.5;
			dom(this.id).appendChild(this.audioDom);//把播放器放入父容器内
			this.event(callback,opts);//需要时间就用回调函数传入进来
			for(key in opts){//循环给元素绑定事件
				this.drag(opts[key],key,function(mark,dom,sbit){//拖动快进的回调函数
					if(mark){
						//如果音乐正在播放，就调用暂停方法
						if(dom.key =="bar"){
							if(this.played)this.pause();
							this.currentTime = this.duration*sbit;
						}else{
							this.volume = sbit;//判断为false代表拖动的就是音乐
						}
						var per =_tzMusic.formatPercent(sbit)+"%";//百分比换算
						dom.previousElementSibling.style.width =per; //按百分比赋给宽度
					//	dom.children[0].innerHTML=per;//显示当前进度
					}else{
						if(dom.key=="bar"){
							this.play();//鼠标松开就进这里，然后播放音乐
						}
					}
				},function(sbit,dom){//点击快进的回调函数
					var per =_tzMusic.formatPercent(sbit)+"%";
					if(dom.key=="bar"){
						this.currentTime = this.duration*sbit;
						this.play();
						dom.previousElementSibling.style.width =per; 
					}else{
						this.volume = sbit;
						dom.previousElementSibling.style.width =per; 
					}
				});
			}
		},
		//播放
		play:function(){
			this.audioDom.play();
		},
		//暂停
		stop:function(){
			this.audioDom.pause();
		},//静音
		stopVolome:function(callback){
			//因为这个属性是一个布尔类型，所以每次取反就可以了
			this.audioDom.muted = !this.audioDom.muted;
			if(callback)callback(this.audioDom.muted);
			
		},//时间控制    不理解意思有时间查查：oncanplaythrough  ontimeupdate
		event:function(callback,opts){
			var barDom = opts.bar;
			var json = {};
			this.audioDom.oncanplaythrough = function(){//ontimeupdate：这个事件在音频正常播放，无停顿，缓存的情况下执行 
				json.totaltime = this.duration;
				json.ftime = _tzMusic.format(this.duration);
				if(callback)callback.call(json,"time");
			};
			//播放时间 ontimeupdate
			this.audioDom.ontimeupdate = function(){//ontimeupdate：	通过这个事件，获得当前播放进度
				json.playtime = this.currentTime;	//已播放时间
				json.backtime = this.duration - this.currentTime;//用总时长 - 已播放时间 = 剩余时间
				json.fptime = _tzMusic.format(json.playtime);//转换格式
				json.btime = _tzMusic.format(json.backtime)//转换格式
				// 已播放时间 / 总时长 = 已播放的百分比
				json.percent = ((json.playtime / this.duration)*100).toFixed(0);
				/*【Dom元素进度条控制部分】*/
				barDom.previousElementSibling.style.width =json.percent+"%";//和播放器联动进度条
				var maxL = (barDom.parentElement.offsetWidth-barDom.offsetWidth)*json.percent/100;//百分比进度换算
				barDom.style.left = maxL+"px" //和播放器联动进度联动的拖拽体
				//barDom.children[0].innerHTML= json.percent+"%";//同步显示百分比进度
				if(callback)callback.call(json,"play")
			}; 
		},
		//音乐播放器进度拖拽，和音量拖拽
		drag:function(targetDom,key,callback,callback2){
			//获取音乐播放器对象
			var adom = this.audioDom;
		
			var barDom = targetDom;
			barDom.key = key;//循环的时候给每个对象分别缓存一个自己的值。【关键点】！
			barDom.onmousedown = function(e){
				var ev = e||window.event;
				var pos = getXY(ev);
				var l = pos.x - this.offsetLeft;
				var maxLeft = this.parentElement.offsetWidth - this.offsetWidth;
				document.onmousemove = function(e){
					var ev = e||window.event;
					var pos = getXY(e);
					//用最后移动的坐标减去点击时的坐标
					var nleft =pos.x - l;
					//边界判断
					if(nleft<=0)nleft = 0;
					if(nleft>=maxLeft)nleft = maxLeft;
					barDom.style.left = nleft+"px";
					//用已拖动的距离除以父元素换算后的长度，得出当前的百分比
					var sbit = nleft / maxLeft;
					if(callback)callback.call(adom,true,barDom,sbit);
				};
				//鼠标松开
				document.onmouseup = function(){
					document.onmousemove = null;
					document.onmouseup = null;
					//拖动松开时执行播放音乐的回调函数
					if(callback)callback.call(adom,false,barDom);
				};
			};
			//点击透明层cover快进
			barDom.nextElementSibling.onmousedown = function(e){
				var ev = e||window.event;
				var pos = getXY(ev);
				var x = pos.x;
				//拿到父元素距离浏览器的位置
				var left = this.parentElement.offsetLeft;
				//获取当前鼠标在滚动条的位置
				var px = x -left;
				//	拿到整个盒子的宽度
				var pwidth = this.parentElement.offsetWidth;
				//用当前鼠标的位置除以盒子宽度计算出当前百分比
				var sbit = px / pwidth;
				var percent = Math.ceil(sbit*100)+"%";
				var cwidth = pwidth - this.previousElementSibling.offsetWidth;
				this.previousElementSibling.style.left = (cwidth*sbit)+"px";
				//this.previousElementSibling.children[0].innerHTML = percent;
				if(callback2)callback2.call(adom,sbit,barDom);
			};				
		}
	};
	//静态方法和属性，和最基本的封装函数作用一样
	//格式化时间
	_tzMusic.format = function(time){
		var m = Math.floor(time / 60);
		var s = Math.floor(time % 60);
		return (m<10 ? "0"+m:m)+":"+(s<10?"0"+s:s);
	};
	//百分比换算
	_tzMusic.formatPercent = function(sbit){
		return Math.ceil(sbit * 100);
	};
	return _tzMusic;//把对象返回出去给外界调用
})();
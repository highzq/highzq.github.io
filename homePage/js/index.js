	/*【搜索框代码】*/
	dom("search").onclick = function(){
		dom("l_box_search").style.display ="block";
		dom("l_box_search").style.top = "70px";
		dom("l_box_search").style.zIndex = "10";
		dom("l_box_search").style.transition = "top .8s ease,width 1s ease 1s";
		dom("l_box_search").style.width = "210px";
		dom("b_text_search").style.width="140px";
		dom("b_text_search").style.transition="width 1s ease 1s";
	};
	dom("b_text_search").onblur= function(){
		dom("l_box_search").style.width = "100px";
		dom("l_box_search").style.top = "0px";
		dom("l_box_search").style.zIndex = "-1";
		dom("b_text_search").style.width = "30px";
	};



	/*【banner代码】*/
	var imgDoms = dom("c_banner_img").children;
	var len  = imgDoms.length;
	var btnDoms = dom("c_list_bnt").children;
	var index = 0;
	var timer = null;
	for(var i=0,lens = btnDoms.length;i<lens;i++){
		btnDoms[i].index = i;
		btnDoms[i].onclick = function(){
			for(var i=0;i<len;i++){
			imgDoms[i].style.zIndex = 0;
			GGanimate(imgDoms[i],{opacity:0},null,80);
			btnDoms[i].children[0].className= "";
			}
		imgDoms[this.index].style.zIndex = 1;
		GGanimate(imgDoms[this.index],{opacity:100},null,80);
		btnDoms[this.index].children[0].className= "active";
		index = this.index;
		};
	};
	dom("btn_right").onclick = function(){
		index>=len-1 ? index=0:index++;
		for(var i=0;i<len;i++){
			imgDoms[i].style.zIndex = 0;
			GGanimate(imgDoms[i],{opacity:0},null,80);
			btnDoms[i].children[0].className= "";
		}
		imgDoms[index].style.zIndex = 1;
		GGanimate(imgDoms[index],{opacity:100},null,80);
		btnDoms[index].children[0].className= "active";
	};
	dom("btn_left").onclick = function(){
		index<=0 ? index=len-1:index--;
		for(var i=0;i<len;i++){
			imgDoms[i].style.zIndex = 0;
			GGanimate(imgDoms[i],{opacity:0},null,80);
			btnDoms[i].children[0].className= "";
		}
		imgDoms[index].style.zIndex = 1;
		GGanimate(imgDoms[index],{opacity:100},null,80);
		btnDoms[index].children[0].className= "active";
	};


	function start(){
		clearInterval(timer);
		timer = setInterval(function(){
			index>=len-1 ? index=0:index++;
			for(var i=0;i<len;i++){
				imgDoms[i].style.zIndex = 0;
				GGanimate(imgDoms[i],{opacity:0},null,80);
				btnDoms[i].children[0].className= "";
			};
			imgDoms[index].style.zIndex = 1;
			GGanimate(imgDoms[index],{opacity:100},null,80);
			btnDoms[index].children[0].className= "active";
		},2000);
	};
	dom("b_cneter").onmouseover = function(){
		clearInterval(timer);
	};
	dom("b_cneter").onmouseout = function(){
		start();
	};
	start();
	
	/*【置顶代码】*/
	
	$("#s_arrows").on("click",function(){
		$("html,body").animate({scrollTop:0},600);
	});


	/*【小提示文本切换】*/

	var iconDoms = dom("liBox").children;
	var iconlen=iconDoms.length
	for(var i=0;i<iconlen;i++){
		//iconDoms[i].children[0].index =i ;
		iconDoms[i].children[0].onclick = function(){
			dom("li_text").innerHTML = this.getAttribute("ntext");
			for(var j=0;j<iconlen;j++){
				iconDoms[j].children[0].style.background ="#e1d3bb";
			}
			this.style.background = "orange";
		};
	};






		/*【联系方式】*/
	function tel(){
		alert("电话：15270925112  企鹅:1309609944");
	};
	/*【关于本人】*/
	function i(){
		alert("姓：高，名：志强");
	};
	
	/*【创建万年历】*/
	var cl = new Calender({id:"calendar_box",weekTag:["周日","周一","周二","周三","周四","周五","周六"],yrange:[2014,2016]},null,function(){
		this.style.left = "-361px";
	});
	cl.init();
	dom("s_calendar").onclick = function(){
		dom("calendar_box").className = "animated bounceInLeft";
		dom("calendar_box").style.left = "0";
		setTimeout(function(){
			dom("calendar_box").className = "";
		},900);
	};
	window.onscroll = function(){
		var wtop = document.body.scrollTop;

	//	alert(wtop);
		if(wtop>90){
			GGanimate(dom("calendar_box"),{top:0});
		}else{
			$("#calendar_box").animate({top:90},500);
		}
	};
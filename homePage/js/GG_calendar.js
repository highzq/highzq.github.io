var Calender = (function(){
		var GaoCalender = function(opts,callback,closeCallback){
			this.id = opts.id;
			this.defaults = {
				//width:600,
			//	height:600,
				background:"#fff",
				color:"#999"
			};
			this.options = mix(this.defaults,opts);//混入
			//如果有年份传进来就用年份
			this.yrange = this.options.yrange||GaoCalender.YEARS;
			//如果有月份传进来就用年份
			this.mrange = this.options.mrange||GaoCalender.MONTHS;
			//如果有星期书传进来就用年份
			this.weekTag = this.options.weekTag || GaoCalender.WEEKS;
			this.callback = callback;
			this.closeCallback = closeCallback;

		};

		//静态常量
		GaoCalender.WEEKS= ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
		GaoCalender.MONTHS = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
		GaoCalender.YEARS = [2000,2018];
		
		GaoCalender.prototype = {
			consturctor:GaoCalender,
			init:function(){
				var args = arguments;
				var year = "",month="";
				if(args.length==2){
					year = args[0];
					month = args[1];
				}else{
					var date = new Date();
					year = date.getFullYear();
					month = date.getMonth()+1;
				}
				//初始化模板
				var domObj = this.template(year,month);
				
			},
			//结构模板
			template:function(year,month){
				var $calc = this;
				var boxDom = dom($calc.id);
				var html = "<div class='cal1'>"+
					"<div class='clndr'>"+
					"	<div class='clndr-controls'>"+
					"		<div class='c_close' id='c_colse"+$calc.id+"'>-</div>"+
					"		<div class='clndr-control-button'>"+
					"			<p class='clndr-button g_prev'></p>"+
					"		</div>"+
					"		<div class='month'>"+$calc.mrange[month-1]+"/ "+year+"</div>"+
					"		<div class='clndr-control-button rightalign'>"+
					"			<p class='clndr-button g_next'></p>"+
					"		</div>"+
					"		<div id='g_cacle"+$calc.id+"'></div>"+
					"	</div>"+
					"</div>"+
				"</div>";
				
				boxDom.innerHTML = html;
				//给盒子添加样式，如颜色，宽高，等等
				$calc.css(boxDom,$calc.options);
				//绑定事件，上一月，下一月
				$calc.prevEvent(boxDom,year,month);
				$calc.nextEvent(boxDom,year,month);
				$calc.colsefn((dom("c_colse"+$calc.id)),$calc.closeCallback);
				//创建一个表格
				var tableDom = $calc.element("table");
				//创建表头
				var theadDom = $calc.element("thead");
				//创建一个tr
				var trDom = $calc.element("tr");
				for(var i=0,len=$calc.weekTag.length;i<len;i++){
					var tdDom = $calc.element("td");
					$calc.addClass(tdDom,"header-day");
					tdDom.innerHTML = $calc.weekTag[i];
					$calc.append(trDom,tdDom);
				};
				//将行添加到表头中
				$calc.append(theadDom,trDom);
				//创建表体
				var tbodyDom = $calc.element("tbody");
				
				//获取当月天数
				var days = $calc.getMonthDay(year,month-1);//当月天数
				//拿到上一个月的总天数，补齐前面的空格
				var pdays = $calc.getMonthDay(year,month-1);
				//创建每个月的第一天的日前对象
				var date = new Date(year,month-1,1);
				var currentDate = new Date();
				var cdate = currentDate.getDate();
				//获取每个月的第一天是星期几
				var week = date.getDay();
				var j = 0;//记录天数
				var tdHtml = "";
				var cmark = false;
				var nindex = 1;
				var pwdays = pdays -week +1;
				while(true){
					tdHtml+="<tr>";
					//拿到一个月有多少天
					//拿到这个月第一天是星期几
					for(var i=0;i<7;i++){
						var mark = "day";
						if(j==0 && i==week){//就去是寻找每个月第一天是星期几
							j++;
							if(j==cdate)mark = "day  today";
							tdHtml +="<td ymd='"+year+"/"+month+"/"+j+"' class='g_calcd "+mark+"'>1</td>";
							cmark = true;
						}else if(j>0 && j<days){
							j++;
							if(j==cdate)mark = "day today";
							tdHtml +="<td ymd='"+year+"/"+month+"/"+j+"' class='g_calcd "+mark+"'>"+j+"</td>";
						}else{
							//td填空格
							if(!cmark){
								var oy = year;
								if(month==1){
									oy = year-1;
								}
								tdHtml +="<td ymd='"+oy+"/"+(month-1==0?12:month-1)+"/"+pwdays+"' class='g_calcd day empt'>"+pwdays+"</td>";
								pwdays++;
							}else{
								var oy = year;
								if(month==12)oy = year+1;
								tdHtml +="<td ymd='"+oy+"/"+(month+1)+"/"+nindex+"' class='g_calcd day empt'>"+nindex+"</td>";
								nindex++;
							}
						}
					}
					tdHtml+="</tr>";
					if(j>=days)break;
				};
				//追加拼接的日期文本
				tbodyDom.innerHTML = tdHtml;
				//追加元素
				$calc.append(tableDom,theadDom);
				$calc.append(tableDom,tbodyDom);
				$calc.append(dom("g_cacle"+$calc.id),tableDom);
				//绑定事件
				domClass(tbodyDom,"g_calcd").forEach(function(obj){
					obj.onclick = function(){
						var ymd = this.getAttribute("ymd");
						var date = new Date();
						var hour = date.getHours();
						var min = date.getMinutes();
						var sec = date.getSeconds();
						var dataStr = ymd+" "+hour+":"+min+":"+sec;
						var rdate = new Date(dataStr);
						if($calc.callback)$calc.callback.call(rdate,rdate.format($calc.options.format));
					}
				});
				return boxDom;
			},//下一年
			nextEvent:function(dom,year,month){//下一年
				var $calc = this;
				domClass(dom,"g_next")[0].onclick = function(){
					var m = month+1;
					var y = year;
					if(year==$calc.yrange[1] && m>12){
						alert("你已经到最大年限了...");
						return;
					}
					if(m > 12){
						y = year+1;
						m = 1;
					}
					
					$calc.template(y,m);
				};
			},
			prevEvent:function(dom,year,month){//上一年
				var $calc = this;
				domClass(dom,"g_prev")[0].onclick = function(){
					var m = month-1;
					var y = year;
					if(year==$calc.yrange[0] && m==0){
						alert("你已经到最小年限了...");
						return;
					}
					if(m ==0){
						y = year-1;
						m = 12;
					}
					$calc.template(y,m);
				};
			},
			getMonthDay:function(year,month){//获取当月的天数
				return new Date(year,month,0).getDate();
			},
			addClass:function(dom,className){//添加样式
				dom.className = className;
			},
			append:function(dom,subdom){//追加元素
				dom.appendChild(subdom);
			},
			element:function(ele){//创建元素
				return document.createElement(ele);
			},
			css:function(dom,opts){
				for(var key in opts){
					var v = opts[key];
					dom.style[key] = (typeof v==="number"?v+"px":v);
				}
			},
			colsefn:function(colseDom,colse){
				var $calc = this;
				colseDom.onclick = function(){
					if(colse)colse.call(dom($calc.id));
				};
			}
		
		};

		return GaoCalender;
	})();
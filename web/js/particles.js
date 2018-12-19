"use strict";

var 
	canvas = {},
	image = {},
	requestId = 0,
	startTime = 0;

function Particles(param) {

	var self = this;

	// 缓动函数
	var ease = param.ease || 'easeInOutExpo';

	//如果ease是不存在的缓动函数
	if(typeof window[ease] !== 'function') {
		console.log('the function is not existed, it will use easeInOutExpo instead');
		ease = 'easeInOutExpo';
	}

	// 初始化
	this.init = (function() {
		if(!param.canvasId || !document.getElementById(param.canvasId)){
			console.log('pls use the correct canvas id');
			return;
		}
		if(!param.imgUrl) {
			console.log('pls use the correct img url');
			return;
		}
		// 把canvas赋值给本身
		canvas.self = document.getElementById(param.canvasId);
		// 判断支持画布上下文
		if(canvas.self.getContext) {

			// 保存canvas的信息
			canvas.w = canvas.self.width;
			canvas.h = canvas.self.height;
			canvas.ctx = canvas.self.getContext('2d');

			// 创建image对象
			var img = new Image();

			image.isLoaded = false;

			// 图像加载完后
			img.onload = function() {
				//把图像信息保存在image里面
				image.self = img;
				image.w = img.width;
				image.h = img.height;
				image.x = param.imgX || parseInt(canvas.w/2 - image.w/2);
				image.y = param.imgY || 0;

				// 把图像绘制到画布
				canvas.ctx.drawImage(image.self,image.x,image.y,image.w,image.h);

				// 保存图像信息
				image.imgData = canvas.ctx.getImageData(image.x,image.y,image.w,image.h);

				//清空画布					
				canvas.ctx.clearRect(0,0,canvas.w,canvas.h);

				// 计算出符合要求的像素
				self._calculate({
					color: param.fillStyle || 'rgba(26,145,211,1)',
					pOffset: param.particleOffset || 2,
					startX: param.startX || (image.x + image.w/2),
					startY: param.startY || 0,
					duration: param.duration || 3000,
					interval: param.interval || 3,
					ease: ease,
					ratioX: param.ratioX || 1,
					ratioY: param.ratioY || 1,
					cols: param.cols || 100,
					rows: param.rows || 100
				});

				image.isLoaded = true;
				//开始动画时间
				startTime = new Date().getTime();
			}
			// 解决图片跨域
			img.crossOrigin="anonymous";
			// 设置image的source
			img.src = param.imgUrl;
		}
		
	})();

	this.draw = function() {
		// 绘制到画布上
		if(image.isLoaded) {
			self._draw();
		} else {
			setTimeout(self.draw);
		}
	}

	this.animate = function() {
		// 做动效
		if(image.isLoaded) {
			self._animate(param.delay);
		} else {
			setTimeout(self.animate);
		}
	}
};

Particles.prototype = {
	
	// 保存粒子的数组
	array: [],

	// 计算每个粒子的位置	
	_calculate: function(param) {
		// 图片数组的长度
		var len = image.imgData.length;
		// 像素值数组
		var data = image.imgData.data;
		// 每行每列粒子个数
		var 
			cols = param.cols,
			rows = param.rows;
		// 每一个单元的宽高
		var 
			single_w = parseInt(image.w/cols),
			single_h = parseInt(image.h/rows);
		// 粒子坐标
		var 
			par_x, 
			par_y;
		// 数组中位置
		var pos = 0;

		// 计算每个满足条件的像素，保存到数组中
		for(var i = 0; i < cols; i++) {

			for(var j = 0; j < rows; j++) {

				// 计算(i,j)在数组中的R的坐标值
				pos = (j*single_h*image.w + i*single_w)*4;

				// 判断R值是否符合要求
				if(data[pos] <= 10)	{

					// 符合要求的粒子保存到数组里
					this.array.push({
						// x0,y0起始坐标，x1,y1终点坐标
						x0: param.startX,
						y0: param.startY,
						x1: image.x + i*single_w + (Math.random() - 0.5)*10*param.pOffset,
						y1: image.y + j*single_h + (Math.random() - 0.5)*10*param.pOffset,
						fillStyle: param.color,
						delay: j/20,
						currTime: 0,
						count: 0,
						duration: parseInt(param.duration/16.66) + 1,
						interval: parseInt(Math.random() * 10 * param.interval),
						ease: param.ease,
						ratioX: param.ratioX,
						ratioY: param.ratioY
					});
				}
			}
		}
	},
	// 绘制在canvas上
	_draw: function() {

		// 清空画布					
		canvas.ctx.clearRect(0,0,canvas.w,canvas.h);

		// 所有粒子数组的length
		var len = this.array.length;

		var cur_particle = null;

		for(var i = 0; i < len; i++) {

			cur_particle = this.array[i];

			// 设置填充颜色
			canvas.ctx.fillStyle = cur_particle.fillStyle;

			// 绘粒子到画布上
			canvas.ctx.fillRect(cur_particle.x1,cur_particle.y1,1,1);
		}
	},

	_render: function() {

		// 清空画布					
		canvas.ctx.clearRect(0,0,canvas.w,canvas.h);

		var particles = Particles.prototype.array;

		// 所有粒子数组的length
		var len = particles.length;

		var cur_particle = null;

		var cur_x,cur_y;
		var 
			cur_time = 0, 
			duration = 0, 
			cur_delay = 0,
			ratioX = 1,
			ratioY = 1;

		for(var i = 0; i < len; i++) {

			cur_particle = particles[i];

			// 如果单位时间超过delay,开始
			if(cur_particle.count++ > cur_particle.delay) {
				// 设置画布的填充色
				canvas.ctx.fillStyle = cur_particle.fillStyle;
				//获取当前的time和持续时间和延时
				cur_time = cur_particle.currTime;
				duration = cur_particle.duration;
				cur_delay = cur_particle.interval;
				cur_particle.ratioX !== 1 ? ratioX = cur_particle.ratioX + Math.random()*2 : 1;
				cur_particle.ratioY !== 1 ? ratioY = cur_particle.ratioY + Math.random()*2 : 1;

				// 如果最后一个粒子动画也执行完了则停止动画并return
				if(particles[len - 1].duration + particles[len - 1].interval < particles[len - 1].currTime/2) {
					// 停止动画
					cancelAnimationFrame(requestId);
					// 重新绘制一遍
					Particles.prototype._draw();
					return;
				} else if(cur_time < duration + cur_delay){ 
					//如果当前时间大于延时
					if(cur_time >= cur_delay) {
						// 当前粒子正在动画
						// 计算出此刻x的坐标
						cur_x = window[cur_particle.ease]((cur_time - cur_delay)*ratioX, cur_particle.x0, (cur_particle.x1 - cur_particle.x0)*ratioX, duration);
						// 计算此刻y的坐标
						cur_y = window[cur_particle.ease]((cur_time - cur_delay)*ratioY, cur_particle.y0, (cur_particle.y1 - cur_particle.y0)*ratioY, duration);	
						// 绘制到画布上
						canvas.ctx.fillRect(cur_x,cur_y,1,1);
					}
					
				} else {
					// 终点绘制在画布
					canvas.ctx.fillRect(cur_particle.x1,cur_particle.y1,1,1);
				}
				//当前时间++
				cur_particle.currTime += Math.random() + 0.5;
			}

		}
		requestId = requestAnimationFrame(Particles.prototype._render);	
	},

	_animate: function(delay) {

		if(startTime + delay < new Date().getTime()) {
			// 开始渲染
			requestId = requestAnimationFrame(Particles.prototype._render);
			
		} else {
			setTimeout(function(){
				Particles.prototype._animate(delay);
			});
		}
		
	}
};

//t:current time 动画执行到当前帧所进过的时间
//b:start value 起始的值 
//c:change in value 需要变化的量
//d:duration 持续时间
var linear = function (t, b, c, d) {
		return c*t/d + b;
	},
	easeInOutQuad = function (t, b, c, d) {
		t /= d/2;
		if (t < 1) return c/2*t*t + b;
		t--;
		return -c/2 * (t*(t-2) - 1) + b;
	},
	easeOutQuad = function (t, b, c, d) {
		t /= d;
		return -c * t*(t-2) + b;
	},
	easeOutQuad = function (t, b, c, d) {
		t /= d;
		return -c * t*(t-2) + b;
	},
	easeInCubic = function (t, b, c, d) {
		t /= d;
		return c*t*t*t + b;
	},
	easeOutCubic = function (t, b, c, d) {
		t /= d;
		t--;
		return c*(t*t*t + 1) + b;
	},
	easeInOutCubic = function (t, b, c, d) {
		t /= d/2;
		if (t < 1) return c/2*t*t*t + b;
		t -= 2;
		return c/2*(t*t*t + 2) + b;
	},
	easeInQuart = function (t, b, c, d) {
		t /= d;
		return c*t*t*t*t + b;
	},
	easeOutQuart = function (t, b, c, d) {
		t /= d;
		t--;
		return -c * (t*t*t*t - 1) + b;
	},
	easeInOutQuart = function (t, b, c, d) {
		t /= d/2;
		if (t < 1) return c/2*t*t*t*t + b;
		t -= 2;
		return -c/2 * (t*t*t*t - 2) + b;
	},
	easeInQuint = function (t, b, c, d) {
		t /= d;
		return c*t*t*t*t*t + b;
	},
	easeOutQuint = function (t, b, c, d) {
		t /= d;
		t--;
		return c*(t*t*t*t*t + 1) + b;
	},
	easeInOutQuint = function (t, b, c, d) {
		t /= d/2;
		if (t < 1) return c/2*t*t*t*t*t + b;
		t -= 2;
		return c/2*(t*t*t*t*t + 2) + b;
	},
	easeInSine = function (t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine = function (t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine = function (t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo = function (t, b, c, d) {
		return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
	},
	easeOutExpo = function (t, b, c, d) {
		return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
	},
	easeInOutExpo = function(t, b, c, d) {
	    return c * (-Math.pow(2, -10 * t / d) + 1) + b
	},
	easeInCirc = function (t, b, c, d) {
		t /= d;
		return -c * (Math.sqrt(1 - t*t) - 1) + b;
	},
	easeOutCirc = function (t, b, c, d) {
		t /= d;
		t--;
		return c * Math.sqrt(1 - t*t) + b;
	},
	easeInOutCirc = function (t, b, c, d) {
		t /= d/2;
		if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		t -= 2;
		return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
	},
	easeInOutElastic = function(t,b,c,d,a,p){
        if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
        if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    },
    easeInElastic = function(t,b,c,d,a,p){
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    easeOutElastic = function(t,b,c,d,a,p){
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
    },
    easeInOutBack = function(t,b,c,d,s){
        if (s == undefined) s = 1.70158; 
        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    easeInBack = function(t,b,c,d,s){
        if (s == undefined) s = 1.70158;
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    easeOutBack = function(t,b,c,d,s){
        if (s == undefined) s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    };
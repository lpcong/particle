# particle 

> 动画制作原理可以查看我之前写的一篇文章：[<打造高大上的Canvas粒子动画>](https://juejin.im/entry/57baf747a34131005b130069)

先来看一下粒子动画的实际效果：

![](http://ww2.sinaimg.cn/large/0064cTs2gw1f72nsjjo4qg30qo0cz4ex.gif)
![](http://ww4.sinaimg.cn/large/0064cTs2gw1f72nsjzsvug30qo0czkfl.gif)

## 使用
## web网页版本
**注意：clone到本地直接访问demo是无法打开的（load img会失败），需要本地跑个服务器，把静态资源放到服务目录，通过ip地址方式再访问demo**
```javascript
<canvas id="myCanvas" width="1200" height="700"></canvas>
<script type="text/javascript" src="js/particles.min.js"></script>
<script type="text/javascript">
	/*
	 * parameters
	 * canvasId: 画布id，必填
	 * imgUrl: 纯色图片的路径，可以是jpg或者png，做粒子动画的图案色值应为#000，必填
	 * cols/rows：分别代表图案每一行和每一列显示粒子数，此处需要设定的cols和rows要可被图片width和height整除，必填
	 * startX/startY: 粒子起始位置x,y  
	 * imgX/imgY: 图片左上角坐标，相对canvas左上角的偏移值
	 * delay: 延迟执行动画时间，单位ms
	 * duration: 持续时间，单位ms
	 * fillStyle: 粒子颜色值，可带半透明
	 * particleOffset：粒子偏移值
	 * ease: 缓动函数 提供linear，Quad，Cubic，Quart，Quint，Sine，Expo，Circ，Elastic，Back 提供easeIn,easeOut,easeInOut
	 * interval: 粒子间开始移动间隔
	 * ratioX/ratioY x,y轴位移比率 
	 */
	var particles = new Particles({
		canvasId: 'myCanvas',
		imgUrl: 'img/isux.jpg',
		cols: 100,
		rows: 100,
		startX: 700,
		startY: 600,
		imgX: 500,
		imgY: 130,
		delay: 100,
		duration: 1400,
		interval: 5,
		fillStyle: 'rgba(26,145,211,1)',
		particleOffset: 2,
		ease: 'easeInCirc',
		ratioX: 1,
		ratioY: 1
	});
	particles.animate();
</script>
```



## 微信小程序版本(2018新增)
> 小程序的逻辑层和Canvas交互涉及跨线程通讯，性能并不好，不建议用，写出来实现只是闹着玩。
#### 用法：
##### wxml
``` html
<!-- 记得设置好canvas宽高；canvas-id和id设置成一样的值 -->
<canvas canvas-id="myCanvas" id="myCanvas" class="my-canvas"></canvas>
```

##### js
``` javascript
import wxParticles from './libs/wx-miniapp-particle';

/**
 * @parameters
 * canvasId: 画布id，必填
 * imgUrl: 纯色图片的路径，可以是jpg或者png，做粒子动画的图案色值应为#000，必填,注意外链url记得加入到小程序downloadfile合法域名
 * cols/rows：分别代表图案每一行和每一列显示粒子数，此处需要设定的cols和rows要可被图片width和height整除，必填
 * startX/startY: 粒子起始位置x,y  
 * imgX/imgY: 图片左上角坐标，相对canvas左上角的偏移值，实际计算单位使用rpx
 * delay: 延迟执行动画时间，单位ms
 * duration: 持续时间，单位ms
 * fillStyle: 粒子颜色值，可带半透明
 * particleOffset：粒子偏移值
 * ease: 缓动函数 提供linear，Quad，Cubic，Quart，Quint，Sine，Expo，Circ，Elastic，Back 提供easeIneaseOut,easeInOut，已内置
 * interval: 粒子间开始移动间隔
 * ratioX/ratioY x,y轴位移比率 
**/


try {
    new wxParticles({
        canvasId: 'myCanvas',
        imgUrl: './img/wx-particle-logo.jpg',
        ease: 'easeInOutBack', 
        imgX: 200, 
        imgY: 0,
        fillStyle: '#fff',
        offset: 1,
    }).animate();
} catch (e) {
    // 插件抛出异常处理
    console.warn(e);
}
```

可以通过改变参数值来制作不同的动画效果，具体效果可看参照demo。

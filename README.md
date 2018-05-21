# particle
particle.js是用来制作canvas粒子动画。具体用法如下：

![](http://ww2.sinaimg.cn/large/0064cTs2gw1f72nsjjo4qg30qo0cz4ex.gif)
![](http://ww4.sinaimg.cn/large/0064cTs2gw1f72nsjzsvug30qo0czkfl.gif)

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


可以通过改变参数值来制作不同的动画效果，具体效果可看参照demo。

动画制作原理可以查看我之前写的一篇文章：<http://web.jobbole.com/87602/>

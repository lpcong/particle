/**
 * 微信小程序canvas粒子动画插件
 * @author andypliang
 * @description 用于小程序项目页面粒子动画的展示
 */
class wxParticles {
    /**
     * 构造函数
     */
    constructor(params) {
        Object.assign(this, { ...params });
        this._checkSupport();
        this._init();
    }
    
    /**
     * 入参及兼容性检测
     */
    _checkSupport() {
        if (!wx.createCanvasContext) throw 'not support canvas api'; 
        if (!this.canvasId) throw 'pls use the corrent canvasId';
        if (!this.imgUrl) throw 'pls use the corrent imgUrl';
        if (!this.ease || typeof ease[this.ease] !== 'function') {
            console.log('the ease function is not existed, it will use easeInOutExpo instead');
            this.ease = 'easeInOutExpo';
        }
    }

    /**
     * 初始化粒子动画
     */
    _init() {
        const _this = this;
        this.ctx = wx.createCanvasContext(this.canvasId);
        this.dataArray = [];
        wx.createSelectorQuery()
            .select(`#${this.canvasId}`)
            .boundingClientRect((rect) => {
                rect.width
                rect.height
            })
            .exec(((res) => {
                _this.canvasWidth = res[0].width;
                _this.canvasHeight = res[0].height;
                _this._updateImageInfo().then(() => {
                    _this._drawAndSaveImageData().then(() => {
                        _this._calculate(); 
                    })
                });
            }));
    }

    /**
     * 更新图片信息
     */
    _updateImageInfo() {
        const _this = this;
        return new Promise((resolve, reject) => {
            if (wx.getImageInfo) {
                wx.getImageInfo({
                    src: _this.imgUrl,
                    success: (res) => {
                        let imgX = _this.imgX/2;
                        _this.imgWidth = res.width/2;
                        _this.imgHeight = res.height/2;
                        _this.imgX = !imgX ? (imgX === 0 ? 0 : parseInt(_this.canvasWidth/2 - _this.imgWidth/2)) : imgX;
                        _this.imgY = _this.imgY/2 || 0;
                        resolve();
                    },
                    fail: () => {
                        reject();
                    }
                })
            } else {
                reject();
            }
        });
    }

    /**
     * 绘制&保持图像信息
     */
    _drawAndSaveImageData() {
        const _this = this;
        const { ctx, imgUrl, imgX, imgY, imgWidth, imgHeight, canvasId, canvasWidth, canvasHeight } = this;
        return new Promise((resolve, reject) => {
            try {
                // 写法是1.9.0开始支持，需支持异常处理
                ctx.drawImage(imgUrl, imgX, imgY, imgWidth, imgHeight);
                ctx.draw(false, () => {
                    wx.canvasGetImageData({
                        canvasId,
                        x: imgX,
                        y: imgY,
                        width: imgWidth,
                        height: imgHeight,
                        success: (res) => {
                            _this.imgData = res.data;
                            resolve();
                        }
                    });
                });
            } catch(e) {
                throw 'not support canvas api';
            }
        });
    }

    /**
     * 计算符合要求的像素
     */
    _calculate() {
        // 图像数据和数组长度
        const data = this.imgData;
        const length = data.length;
        // 每行和每列粒子个数
        const cols = this.cols || 100;
        const rows = this.rows || 100;
        // 单个粒子的宽高
        const singleWidth = parseInt(this.imgWidth/cols);
        const singleHeight = parseInt(this.imgHeight/rows);
        const { imgWidth, imgHeight, imgX, imgY } = this;
        // 默认粒子起始位置
        const startX = this.startX || (imgX + imgWidth/2);
        const startY = this.startY || 0;
        const fillStyle = this.fillStyle || 'rgba(26,145,211,1)';
        const duration = parseInt((this.duration || 3000) /16.66) + 1;
        const interval = this.interval || 3;
        const offset = this.particleOffset || 2;
        let parX, parY;  // 当前粒子坐标变量
        let curPos = 0;  // 当前粒子数组位置
        
        // 计算每一个满足条件的像素，保存到数组
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                // 计算(i,j)在数组中的R的坐标值
                curPos = (j * singleHeight * imgWidth + i * singleWidth) * 4;
                if (data[curPos] > 10) {
                    // 符合要求的粒子存储起来
                    this.dataArray.push({
                        fillStyle,
                        x0: startX,
                        y0: startY,
                        x1: imgX + i * singleWidth + (Math.random() - 0.5) * 5 * offset,
                        y1: imgY + j * singleHeight + (Math.random() - 0.5) * 5 * offset,
                        delay: j / 20,
                        duration,
                        interval: parseInt(Math.random() * 10 * interval),
                        count: 0,
                        curTime: 0,
                        ratioX: this.ratioX || 1,
                        ratioY: this.ratioY || 1
                    });
                }
            }
        }
    }

    /**
     * 绘制渲染粒子
     */
    _render() {
        const _this = this;
        const { ctx, dataArray } = this;
        const len = dataArray.length;
        let curParticle;
        let curX, curY;
        let curTime = 0, 
            duration = 0, 
            curDelay = 0,
            ratioX = 1,
            ratioY = 1;
        console.log(1);
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        ctx.draw(true, () => {
            for (let i = 0; i < len; i++) {
                curParticle = dataArray[i];
                // 不超过延迟值，continue
                if (curParticle.count++ <= curParticle.delay) continue;
                // 设置填充色
                ctx.setFillStyle(curParticle.fillStyle);
                //获取当前的time和持续时间和延时
                curTime = curParticle.curTime;
                duration = curParticle.duration;
                curDelay = curParticle.interval;
                curParticle.ratioX !== 1 && (ratioX = curParticle.ratioX + Math.random() * 2);
                curParticle.ratioY !== 1 && (ratioY = curParticle.ratioY + Math.random() * 2);
                // 如果最后一个粒子动画也执行完了则停止动画
                if (dataArray[len - 1].duration + dataArray[len - 1].interval < dataArray[len - 1].curTime / 4) {
                    console.warn('animate end');
                    // 停止动画
                    cancelAnimationFrame(_this.requestId);
                    // 重新绘制一遍
                    return _this.draw();
                } else if (curTime < duration + curDelay) {
                    //如果当前时间小于延时
                    if (curTime >= curDelay) {
                        // 当前粒子正在动画
                        // 计算此刻x的坐标
                        curX = ease[_this.ease]((curTime - curDelay) * ratioX, curParticle.x0, (curParticle.x1 - curParticle.x0) * ratioX, duration);
                        // 计算此刻y的坐标
                        curY = ease[_this.ease]((curTime - curDelay) * ratioY, curParticle.y0, (curParticle.y1 - curParticle.y0) * ratioY, duration);	
                        // 绘制到画布上
                        ctx.fillRect(curX, curY, 1, 1);
                    }
                } else {
                    // 终点绘制在画布
                    ctx.fillRect(curParticle.x1, curParticle.y1, 1, 1);
                }
                ctx.draw(true);
                //当前时间++
                curParticle.curTime += Math.random() + 0.5;
            }
            // _this.requestId = requestAnimationFrame(_this._render.bind(_this));
            _this.requestId = setTimeout(function(){
                _this._render();
            }, 100);
        });
    }

    /**
     * 绘制到canvas
     */
    draw(succ) {
        const len = this.dataArray.length; // 所有粒子数组的length
        const { ctx } = this;
        let curParticle;
		// 清空画布					
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        ctx.draw(false, () => {
            for(var i = 0; i < len; i++) {
                curParticle = this.dataArray[i];
                // 设置填充颜色
                ctx.setFillStyle(curParticle.fillStyle);
                // 绘粒子到画布上
                ctx.fillRect(curParticle.x1, curParticle.y1, 1, 1);
                ctx.draw(true, () => {
                    succ && succ();
                });
            }
        });
    }
    
    /**
     * 做动画
     */
    animate() {
        // this.requestId = requestAnimationFrame(this._render.bind(this));
        this._render();
    }
}

const ease = {
    //t:current time 动画执行到当前帧所进过的时间
    //b:start value 起始的值 
    //c:change in value 需要变化的量
    //d:duration 持续时间
    linear: (t, b, c, d) => {
        return c * t / d + b;
    },
    easeInOutQuad: (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    },
    easeOutQuad: (t, b, c, d) => {
        t /= d;
        return -c * t * (t - 2) + b;
    },
    easeOutQuad: (t, b, c, d) => {
        t /= d;
        return -c * t * (t - 2) + b;
    },
    easeInCubic: (t, b, c, d) => {
        t /= d;
        return c * t * t * t + b;
    },
    easeOutCubic: (t, b, c, d) => {
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
    },
    easeInOutCubic: (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    },
    easeInQuart: (t, b, c, d) => {
        t /= d;
        return c * t * t * t * t + b;
    },
    easeOutQuart: (t, b, c, d) => {
        t /= d;
        t--;
        return -c * (t * t * t * t - 1) + b;
    },
    easeInOutQuart: (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t + b;
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
    },
    easeInQuint: (t, b, c, d) => {
        t /= d;
        return c * t * t * t * t * t + b;
    },
    easeOutQuint: (t, b, c, d) => {
        t /= d;
        t--;
        return c * (t * t * t * t * t + 1) + b;
    },
    easeInOutQuint: (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t * t * t + 2) + b;
    },
    easeInSine: (t, b, c, d) => {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: (t, b, c, d) => {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: (t, b, c, d) => {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeInExpo: (t, b, c, d) => {
        return c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOutExpo: (t, b, c, d) => {
        return c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInOutExpo: (t, b, c, d) => {
        return c * (-Math.pow(2, -10 * t / d) + 1) + b
    },
    easeInCirc: (t, b, c, d) => {
        t /= d;
        return -c * (Math.sqrt(1 - t * t) - 1) + b;
    },
    easeOutCirc: (t, b, c, d) => {
        t /= d;
        t--;
        return c * Math.sqrt(1 - t * t) + b;
    },
    easeInOutCirc: (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        t -= 2;
        return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
    },
    easeInOutElastic: (t, b, c, d, a, p) => {
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (!p) p = d * (.3 * 1.5);
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },
    easeInElastic: (t, b, c, d, a, p) => {
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOutElastic: (t, b, c, d, a, p) => {
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
    },
    easeInOutBack: (t, b, c, d, s) => {
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    easeInBack: (t, b, c, d, s) => {
        if (s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: (t, b, c, d, s) => {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    }
}

export default wxParticles;
/**
 * 微信小程序Page对象代理构造函数
 * @author andypliang
 * @description 用于小程序项目页面中公共属性及公共函数的提取，并拥有公共的生命周期
 */
const systemInfo = wx.getSystemInfoSync && wx.getSystemInfoSync() || {};
const GLOBAL_DATA = {
    // 全局的图片路径 根据项目自己调整
    IMAGE_PATH: `https://cdn.domain.com/`,
    // 系统信息
    systemInfo,
    //是否iPhoneX标志，便于页面做适配
    iPhoneX: systemInfo.model && systemInfo.model.indexOf('iPhone X') >= 0
};
const GLOBAL_LIFE_CIRCLE = {
    onReady() {
        // the `this` obj in func is pointing to the AgentPage
        console.log('this is the page global ready func');
    },
    onLoad(options) {
        console.log('this is the page global load func');
    },
    onShow() {
        console.log('this is the page global show func');
    },
    onHide() {
        console.log('this is the page global hide func');
    },
    onUnload() {
        console.log('this is the page global unload func');
    },
    onPullDownRefresh() {
        console.log('this is the page global pulldownrefresh func');
    },
    onPageScroll() {
        console.log('this is the page global pagescroll func');
    },
    onReachBottom() {
        console.log('this is the page global reachbottom func');
    }
}

 class AgentPage {
    /**
     * 构造函数
     */
    constructor(params) {
        Object.assign(this, { params });
        this._init();

        // 实例化Page
        Page(this.target);
    }

    /**
     * init data
     */
    _init() {
        this.target = {};

        // 初始化数据
        this._initDatas();

        // 初始化方法
        this._initMethods();

        // 初始化生命周期
        this._initLifeCircle();

        // add custom datas
        this._customDatas();
    }

    /**
     * 初始化数据
     */
    _initDatas() {
        this.target.data = this.params.data || {};
    }

    /** 
     * 初始化方法
     */
    _initMethods() {
        const params =  this.params;
        if (!params || typeof params !== 'object') return;
        // add custom life circle
        this._customLifeCircle();
        for (let key in params) {
            // 如果该属性不是对象自身拥有的函数
            if (!params.hasOwnProperty(key) || typeof params[key] !== 'function') continue;
            // 判断函数是否是生命周期
            if (typeof GLOBAL_LIFE_CIRCLE[key] === 'function') {
                // 把属于生命周期的函数暂存
                this.LIFE_CIRCLE_FUNC[key].push(params[key]);
            } else {
                // 其他函数透传
                this.target[key] = params[key];
            }
        }
    }
    
    /**
     * 加入定制生命周期
     */
    _customLifeCircle() {
        this.LIFE_CIRCLE_FUNC = [];
        for(let func in GLOBAL_LIFE_CIRCLE) {
            this.LIFE_CIRCLE_FUNC[func] = [GLOBAL_LIFE_CIRCLE[func]];
        }
    }

    /** 
     * target加入生命周期函数
     */
    _initLifeCircle() {
        const _this = this;
        for (let circle in this.LIFE_CIRCLE_FUNC) {
            this.target[circle] = (...args) => {
                for (let fn of _this.LIFE_CIRCLE_FUNC[circle]) {
                    fn.apply(this, args);
                }
            };
        }
    }

    /**
     * 加入定制的全局数据
     */
    _customDatas() {
        for(let item in GLOBAL_DATA) {
            this.target.data[item] = GLOBAL_DATA[item];
        }
    }
 }

 export default AgentPage;
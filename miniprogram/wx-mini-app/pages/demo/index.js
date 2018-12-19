/**
 * 使用代理Page构造函数 https://github.com/lpcong/wx-miniapp-agentpage
 */ 

import wxParticles from '../../base/libs/wx-miniapp-particle';

new global.AgentPage({
    data: {

    },
    onLoad() {
        try {
            new wxParticles({
                canvasId: 'myCanvas',
                // 注意外链url记得加入到小程序downloadfile合法域名
                imgUrl: './img/wx-particle-logo.jpg',
                // imgUrl: 'https://resource.wesure100.com/front/sit/image/icon-arr-right.png',
                ease: 'easeInOutBack',
                imgX: 200, // 单位rpx
                imgY: 0,
                fillStyle: '#fff',
                offset: 0.2,
            }).animate();
        } catch (e) {
            // 插件抛出异常处理
            console.warn(e);
        }
    }
});
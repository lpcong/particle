import AgentPage from './base/libs/agentPage';

App({
	onLaunch: function (options) {
		// 将代理Page挂载到全局global
		Object.defineProperty(global, 'AgentPage', {
			value: AgentPage,
			writable: false,
			configurable: false
		});
		
	},
	onShow: function (options) {
		// Do something when show.
	},
	onHide: function () {
		// Do something when hide.
	},
	onError: function (msg) {
		console.log(msg)
	},
	globalData: 'I am global data'
});
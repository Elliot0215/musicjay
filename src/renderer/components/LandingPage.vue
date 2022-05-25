<template>
	<div id="wrapper">
		<div class="top">
			<div class="head" style="width: 50%;" @click="showAuthor">
				<h2>周杰伦专属</h2>
			</div>
			<div class="musicDwonList" style="width: 40%;margin-right: 100px;">
				<!-- <a-button type="primary" icon="appstore">二月</a-button> -->
				<span>{{ FormatTime(nowTime) }}</span>
			</div>
			<a-icon type="minus-circle" style="width: 5%;margin-left: 20px;" @click="minWin" />
			<a-icon type="close-circle" style="width: 10%;" @click="closeWin" />
		</div>
		<div class="empty-content"></div>
		<div class="listData">
			<a-table :columns="columns" :data-source="searchList">
				<img slot="pic" slot-scope="pic" :src="pic" style="width: 100px;" />
				<div slot="mp3" slot-scope="mp3,rowData" class="operate">
					<a-button type="primary" icon="play-circle" size="small" @click="showDrawer(mp3,rowData.mname)">播放
					</a-button>
					<!-- <a-button type="primary" icon="cloud-download" size="small" @click="downMusic()">下载</a-button> -->
				</div>
			</a-table>
		</div>
		<div class="audioPlay">
			<a-drawer :title="songTitle" :mask="true" :placement="placement" :closable="false" :get-container="false"
				:height=180 :destroyOnClose="destroyOnClose" :visible="visible" @close="onClose">
				<audio :src="`${musicSrc}`" type="audio/mp3" controls="controls" autoplay="autoplay" loop="loop"
					style="width:98%;margin-top: 20px;">
				</audio>
			</a-drawer>
		</div>
	</div>
</template>

<script>
	// import Audio from '../components/audio.vue'
	import SystemInformation from './LandingPage/SystemInformation'
	import qs from "qs"
	import {
		ipcRenderer
	} from 'electron'

	const columns = [{
			title: '歌曲名称',
			dataIndex: 'mname',
			key: 'mname',
		},
		{
			title: '封面',
			dataIndex: 'pic',
			key: 'pic',
			slots: {
				title: 'pic'
			},
			scopedSlots: {
				customRender: 'pic'
			},
		},
		{
			title: '歌手',
			dataIndex: 'sname',
			key: 'sname',
		},
		{
			title: '时长',
			dataIndex: 'play_time',
			key: 'play_time',
		},
		{
			title: '操作',
			dataIndex: 'mp3',
			key: 'mp3',
			slots: {
				title: 'mp3'
			},
			scopedSlots: {
				customRender: 'mp3'
			},
		}
	]

	export default {
		name: 'landing-page',
		components: {
			SystemInformation,
			Audio
		},
		data() {
			return {
				searchList: [],
				columns,
				songTitle: '',
				visible: false,
				placement: 'bottom',
				musicSrc: '',
				destroyOnClose: true,
				globalName: '',
				timer: undefined,
				nowTime: new Date(),
				latedata: "2020-1-9"
			}
		},
		methods: {
			closeWin: function() {
				ipcRenderer.send('close')
			},
			minWin: function() {
				ipcRenderer.send('min')
			},
			showAuthor: function() {
				const h = this.$createElement;
				this.$info({
					title: '二月の提示',
					content: h('div', {}, [
						h('p', '好好听歌，别乱点！！！'),
					]),
					onOk() {},
				});
			},
			showDrawer: function(mp3, mname) {
				this.musicSrc = mp3
				this.songTitle = mname
				this.destroyOnClose = false
				console.log(this.songTitle)
				console.log(this.musicSrc)
				this.visible = true;
			},
			onClose() {
				this.destroyOnClose = false
				this.visible = false;
			},
			onSearch: async function() {
				let res = []
				for (var i = 1; i <= 7; i++) {
					let form = {
						act: "geshou_music",
						id: "dqk",
						lang: "",
						page: i
					}
					res = await this.$http({
						url: 'https://www.zz123.com/ajax/',
						method: "post",
						data: qs.stringify(form),
						hearder: {
							"content-type": "application/x-www-form-urlencoded; charset=UTF-8"
						}
					})
					for (var j = 0; j < res.data.data.length; j++) {
						this.searchList.push(res.data.data[j])
					}
				}

				for (var i = 0; i < this.searchList.length; i++) {
					if (this.searchList[i].pic) {
						console.log(this.searchList[i].pic.split("?")[0])
						this.searchList[i].pic = this.searchList[i].pic.split("?")[0]
					}
				}

				console.log(this.searchList)
			},
			FormatTime: function() {
				//返回显示的日期时间格式
				var date = new Date();
				var year = this.formatTime(date.getFullYear());
				var month = this.formatTime(date.getMonth() + 1);
				var day = this.formatTime(date.getDate());
				var hour = this.formatTime(date.getHours());
				var minute = this.formatTime(date.getMinutes());
				var second = this.formatTime(date.getSeconds());
				var weekday = date.getDay();
				var weeks = new Array(
					"星期日",
					"星期一",
					"星期二",
					"星期三",
					"星期四",
					"星期五",
					"星期六"
				);
				var week = weeks[weekday];
				return `${year}-${month}-${day} ${hour}:${minute}:${second} ${week}`;
			},
			formatTime: function(n) {
				//判断是否需要加0
				if (n < 10) {
					return "0" + n;
				} else {
					return n;
				}
			}
		},
		beforeDestroy() {
			if (this.timer) {
				clearInterval(this.timer);
			}
		},
		created() {
			console.log(this)
			this.$nextTick(() => {
				this.onSearch()
				this.timer = setInterval(() => {
					this.nowTime = new Date().toLocaleString();
				})
			})
		}
	}
</script>

<style>
	#wrapper {
		padding: 20px 20px;
	}

	.empty-content {
		position: relative;
		display: block;
		height: 40px;
		margin-top: 20px;
	}

	.top {
		position: fixed;
		display: flex;
		z-index: 9999;
		width: 100%;
		margin-bottom: 200px;
		justify-content: space-between;
	}

	div /deep/ table tbody tr {
		pointer-events: none;
	}

	div /deep/ button {
		pointer-events: auto;
	}

	span {
		-webkit-app-region: drag;
	}
</style>

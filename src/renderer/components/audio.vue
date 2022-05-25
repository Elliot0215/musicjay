<template>
  <div class="retrievalBox_child">
    <div class="box-card">
      <!-- 列表项 -->
      <div class="retrilist">
        <div class="retridome">
          <!-- 进度条 -->
          <div class="trtricon">
            <audio id="ado"
                   controls
                   :ref="'audioItem' + id"
                   @canplay="getDuration"
                   @timeupdate="updateTime"
                   @ended="audioEnd"
                   style="display:none;">
              <source :src="filePath"
                      type="audio/ogg" />
              您的浏览器不支持 audio 元素。
            </audio>
            <!-- 播放按钮 -->
            <div class="btn"
                 :class="playing ? 'btn1' : 'btn2'"
                 @click="play"></div>
            <!-- 进度条 -->
            <div class="progress">
              <div class="huakuai"
                   :ref="'huakuaiparent' + id"
                   :style="{left:huakuaiLeft}"></div>
              <div class="fill"
                   :ref="'fill' + id"></div>
              <div class="cruxnode"
                   ref="cruxnodeparent"
                   :style="{width:cruxWidth,left:cruxLeft}"></div>
            </div>
            <!-- 时间 -->
            <div class="jindu_time">
              <span :class="'currentTime' + id">{{musicTime}}</span> /
              <span :class="'duraTime' + id">{{allTime}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
import { transTime } from '../utils/tools.js'
export default {
  props: ['id', 'url', 'start', 'end'],
  data() {
    return {
      filePath: this.url,
      startPoint: this.start,
      endPoint: this.end,
      caseTypeList: [], //案件类型
      caseType: '',
      currentPage: 1,
      playing: true,
      musicTime: '00:00',
      allTime: '00:00',
      cruxWidth: '4px',
      cruxLeft: '0px',
      huakuaiLeft: '0%',
    }
  },
  watch: {},
  created() {},
  methods: {
    // 点击播放和暂停音频
    play() {
      this.playing = !this.playing
      if (this.playing) {
        this.$refs[`audioItem${this.id}`].pause()
      } else {
        this.$refs[`audioItem${this.id}`].play()
      }
    },
    //播放结束 修改播放状态
    audioEnd() {
      this.playing = true
      var huakuai = this.$refs[`huakuaiparent${this.id}`]
      var fill = this.$refs[`fill${this.id}`]
      huakuai.style.left = '0%'
      fill.style.width = '0%'
      var currentTime = document.querySelector('.currentTime' + this.id)
      currentTime.innerHTML = '00:00'
    },
    // 获取文件总时长
    getDuration() {
      this.allTime = transTime(this.$refs[`audioItem${this.id}`].duration)
      this.nodered()
    },
    // 小红点的位置
    nodered() {
      var cruxnode = document.querySelector('.cruxnode')
      //音频总时长
      var allduration = this.$refs[`audioItem${this.id}`].duration
      console.log(this.$refs.cruxnodeparent.offsetParent.offsetWidth)
      //音频进度条总长度
      var allWidth = this.$refs.cruxnodeparent.offsetParent.offsetWidth
      //获取音频标红区域占总长度的像素
      var qjWidth = Math.ceil(
        ((this.endPoint / 1000 - this.startPoint / 1000) / allduration) *
          allWidth
      )
      //标红起始点的像素
      var startWidth = Math.ceil(
        (this.startPoint / 1000 / allduration) * allWidth
      )
      this.cruxWidth = qjWidth + 'px'
      this.cruxLeft = startWidth + 'px'
    },
    // 实时播放时间
    updateTime() {
      let duration1 = this.$refs[`audioItem${this.id}`].duration
      this.musicTime = transTime(this.$refs[`audioItem${this.id}`].currentTime)
      // 实时播放进度条
      var huakuai = this.$refs[`huakuaiparent${this.id}`]
      var fill = this.$refs[`fill${this.id}`]
      var l =
        (this.$refs[`audioItem${this.id}`].currentTime /
          this.$refs[`audioItem${this.id}`].duration) *
        100
      this.huakuaiLeft = l + '%'
      fill.style.width = l + '%'
      if (this.musicTime == 0) {
        this.huakuaiLeft = '0%'
      }
      var currentTime = document.querySelector('.currentTime' + this.id)
      currentTime.innerHTML = this.musicTime
      var duraTime = document.querySelector('.duraTime' + this.id)
      duraTime.innerHTML = this.allTime
 
      var progress = document.querySelector('.progress')
      // 点击进度条
      progress.onmousedown = function (e) {
        var rate =
          ((e.clientX - progress.offsetLeft) / this.clientWidth) * this.allTime
        this.musicTime = rate - progress.clientWidth * 0.005
      }
      //进度条拖动
      let that = this
      huakuai.onmousedown = function (e) {
        var x = e.clientX - this.offsetLeft
        document.onmousemove = function (e) {
          var jlx = ((e.clientX - x) / progress.clientWidth) * 100
          if (jlx <= 100 && jlx >= 0) {
            this.huakuaiLeft = jlx + '%'
            fill.style.width = jlx + '%'
            that.$refs[`audioItem${that.id}`].currentTime =
              (jlx / 100) * duration1
          }
        }
        document.onmouseup = function (e) {
          document.onmousemove = null
          document.onmouseup = null
        }
      }
      huakuai.ontouchstart = function (e) {
        var x = e.targetTouches[0].clientX - this.offsetLeft
        document.ontouchmove = function (e) {
          var jlx =
            ((e.targetTouches[0].clientX - x) / progress.clientWidth) * 100
          if (jlx <= 100 && jlx >= 0) {
            this.huakuaiLeft = jlx + '%'
          }
          this.musicTime = (jlx / 100) * this.allTime
        }
        document.ontouchend = function (e) {
          document.ontouchmove = null
          document.ontouchend = null
        }
      }
    },
  },
}
</script>
 
<style lang="less" scoped>
.retrievalBox_child {
  width: 100%;
  .box-card {
    .clearfix {
      padding: 15px 30px;
      text-align: left;
      .card_top {
        width: 180px;
        /deep/.el-input__inner {
          height: 32px;
          border-radius: 4px;
          color: #939eae;
        }
        .el-icon-arrow-up:before {
          content: '\e78f';
        }
        /deep/.el-input__icon {
          line-height: 32px;
        }
      }
      .left_card {
        margin-left: 10px;
      }
    }
    .retrilist {
      overflow-y: hidden;
      .retridome {
        width: 96%;
        // height: 140px;
        border: 1px solid #e7eaef;
        margin: 0 auto;
        .trtrititle {
          width: 98%;
          height: 30px;
          margin: 0 auto;
          position: relative;
          .title_img {
            display: inline-block;
            position: absolute;
            top: 7px;
            width: 16px;
            height: 16px;
            background: url() no-repeat;
            background-size: 100% 100%;
          }
          .title_txt {
            height: 30px;
            line-height: 30px;
            position: absolute;
            display: inline-block;
            left: 22px;
            font-size: 12px;
          }
        }
        .trtricon {
          width: 95%;
          height: 38px;
          margin: 0 auto;
          position: relative;
          //   background-color: #f1f1f1;
          .btn {
            width: 12px;
            height: 12px;
            position: absolute;
            left: -5px;
            top: 14px;
          }
          .btn1 {
            background: url() no-repeat;
            background-size: 100% 100%;
          }
          .btn2 {
            background: url() no-repeat;
            background-size: 100% 100%;
          }
          .progress {
            width: 70%;
            height: 4px;
            background-color: #e1e1e1;
            position: absolute;
            top: 48%;
            left: 2%;
            .huakuai {
              position: absolute;
              top: -0.2rem;
              width: 20px;
              height: 10px;
              background: url() no-repeat;
              background-size: 100% 100%;
              z-index: 9;
            }
            .fill {
              position: absolute;
              top: 0;
              height: 4px;
              background-color: #3299cc;
            }
            .cruxnode {
              position: absolute;
              top: 0;
              // right: 10%;
              width: 4px;
              height: 4px;
              background-color: red;
              //   z-index: 10;
              //   border-radius: 100%;
            }
          }
          .jindu_time {
            position: absolute;
            top: 20%;
            right: 3%;
            font-size: 12px;
            color: #666666;
          }
        }
        .trtribom {
          width: 98%;
          height: 50px;
          margin: 10px auto;
          .bom {
            float: left;
            width: 100px;
            height: 100%;
            margin-right: 100px;
            span {
              display: inline-block;
              width: 100%;
              font-size: 12px;
              text-align: center;
            }
            .bom_bottom {
              padding-top: 15px;
            }
          }
        }
      }
    }
  }
}
</style>
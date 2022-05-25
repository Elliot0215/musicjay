//import { keyFor } from "core-js/fn/symbol";
import router from './../router'

export function dragControllerDiv() {
    var resize = document.getElementsByClassName('resize');
    var left = document.getElementsByClassName('list_aside');
    var mid = document.getElementsByClassName('list_main');
    var box = document.getElementsByClassName('text');
    for (let i = 0; i < resize.length; i++) {
        // 鼠标按下事件
        resize[i].onmousedown = function (e) {
            var startX = e.clientX;
            resize[i].left = resize[i].offsetLeft;
            // 鼠标拖动事件
            document.onmousemove = function (e) {
            var endX = e.clientX;
            var moveLen = resize[i].left + (endX - startX); // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
            var maxT = box[i].clientWidth - resize[i].offsetWidth;  // 容器宽度 - 左边区域的宽度 = 右边区域的宽度

            if (moveLen < 200) moveLen = 200; // 左边区域的最小宽度为150px

            if (moveLen > maxT - 800) moveLen = maxT  - 800;  //右边区域最小宽度为800px
            resize[i].style.left = moveLen; // 设置左侧区域的宽度
            for (let j = 0; j < left.length; j++) {
                left[j].style.width = moveLen + 'px';
                mid[j].style.width = (box[i].clientWidth - moveLen - 10) + 'px';
            }
            }
            // 鼠标松开事件
            document.onmouseup = function (evt) {
            document.onmousemove = null;
            document.onmouseup = null;
            resize[i].releaseCapture && resize[i].releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
            }
            resize[i].setCapture && resize[i].setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
            return false;
        }
    }
}

// 判断是否为超级管理员
export function isAdmin() {
    return sessionStorage.getItem("name") == 'admin'
}

// 添加，编辑，删除，批量删除，导入，导出等按钮操作权限控制
export function operationAuth(data) {
    let result = {};
    for(let item of data) {
    	if(item == 'sel') {// 查询
            result.btn_sel = 'sel'
        }
        if(item == 'add') {//添加
            result.btn_add = 'add'
        }
        if(item == 'update') {//修改
            result.btn_update = 'update'
        }
        if(item == 'del') {//删除
            result.btn_del = 'del'
        }
        if(item == 'import') {//导入
            result.btn_import = 'import'
        }
        if(item == 'export') {//导出
            result.btn_export = 'export'
        }
        if(item == 'transfer') {//转移
            result.btn_transfer = 'transfer'
        }
    }
    return result;
}

// 格式化时间
export function format (date, format) {
    if (!date) {
      return ''
    }  
    let d = new Date(date)
  
    // 年
    if (/YYYY/.test(format)) {
      format = format.replace(/YYYY/, d.getFullYear())
    }
    // 月份
    let month = d.getMonth() + 1
    if (/MM/.test(format)) {
      let monthStr = month < 10 ? '0' + month : month
      format = format.replace(/MM/, monthStr)
    } else if (/M/.test(format)) {
      format = format.replace(/M/, month)
    }
    // 日期
    let dates = d.getDate()
    if (/DD/.test(format)) {
      let dateStr = dates < 10 ? '0' + dates : dates
      format = format.replace(/DD/, dateStr)
    } else if (/D/.test(format)) {
      format = format.replace(/D/, dates)
    }
    // 小时
    let hours = d.getHours()
    if (/HH/.test(format)) {
      let hoursStr = hours < 10 ? '0' + hours : hours
      format = format.replace(/HH/, hoursStr)
    } else if (/H/.test(format)) {
      format = format.replace(/H/, hours)
    } else if (/hh/.test(format)) {
      let hoursMin = hours > 12 ? hours - 12 : hours
      let hoursStr = hoursMin < 10 ? '0' + hoursMin : hoursMin
      format = format.replace(/hh/, hoursStr)
    } else if (/h/.test(format)) {
      let hoursMin = hours > 12 ? hours - 12 : hours
      format = format.replace(/h/, hoursMin)
    }
    // 分
    let minutes = d.getMinutes()
    if (/mm/.test(format)) {
      let minutesStr = minutes < 10 ? '0' + minutes : minutes
      format = format.replace(/mm/, minutesStr)
    } else if (/m/.test(format)) {
      format = format.replace(/m/, minutes)
    }
    // 秒
    let seconds = d.getSeconds()
    if (/ss/.test(format)) {
      let secondsStr = seconds < 10 ? '0' + seconds : seconds
      format = format.replace(/ss/, secondsStr)
    } else if (/s/.test(format)) {
      format = format.replace(/s/, seconds)
    }
    return format
  }

// 时间格式转化（yyyy-MM-dd HH:mm:ss）
export function dateFun(date) {
	if(!date)return '';
    var dateee = new Date(date).toJSON();
  	return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}

//获得当前时间（2020年08月30日）
export function getNowFormatDate() {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = year + '年' + month + '月' + strDate + '日';
	return currentdate;
}
//打开新页面方法
export function openWin(obj) {
	const { href } = router.resolve(obj);
	let toUrl = href;
	if(toUrl.indexOf("/static") != -1)toUrl = toUrl.split("/static")[1];
	window.open(toUrl, '_blank');
}
// 声纹检索格式化时间方法
export function transTime(time){
  var duration = parseInt(time);
  var minute = parseInt(duration/60);
  var sec = duration % 60 + '';
  var isMo = ':'
  if(minute == 0){
    minute ='00'
  }else if(minute < 10){
    minute = '0' + minute;
  }
  if(sec.length == 1){
    sec = '0' + sec;
  }
  return minute + isMo + sec
}

// 声纹检索录音格式化时间方法
export function transTimehour(time){
  var duration = parseInt(time);
  var minute = parseInt(duration/60);
  var hour = parseInt(minute/60);
  var sec = duration % 60 + '';
  var isMo = ':'
  if(hour == 0){
    hour = '00'
  }else if(hour < 10){
    hour = '0' + hour;
  }
  if(minute == 0){
    minute ='00'
  }else if(minute < 10){
    minute = '0' + minute;
  }
  if(sec.length == 1){
    sec = '0' + sec;
  }
  return hour + isMo + minute + isMo + sec
}
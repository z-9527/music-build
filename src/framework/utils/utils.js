import moment from 'moment';
import numeral from 'numeral';
import {times,divide,round} from 'number-precision'


export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - (day * oneDay);

    return [moment(beginTime), moment(beginTime + ((7 * oneDay) - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`), moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}


function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!');  // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    // 是否包含
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(routePath =>
    routePath.indexOf(path) === 0 && routePath !== path);
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map((item) => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
      exact,
    };
  });
  return renderRoutes;
}


/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

/* 数字格式化 */

export function formatNum (num) {
  return numeral(num).format('0,0[.]00')
}

/* 货币格式化 */
export function formatCurrency (currencySymbol,currency) {
  let currencys = currencySymbol + " " + numeral(currency).format('0,0[.]00')

  return currencys
}
/* 从地址参数中分离出参数名称和值*/
export function getUrlParameterToJson(Parameter) {
  let theRequest = {};
  let strs = Parameter.split(",");
  for(var i = 0; i < strs.length; i ++) {
    theRequest[strs[i].split("|")[0]] = decodeURI(strs[i].split("|")[1]);
  }
  return theRequest;
}

// 获取 文件扩展名
export function getFileExtension(filename) {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

// 根据文件名校验文件类型 目前只支持 File ，
export function getFileType(filename) {
  let fe = filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
  // console.log("getFileType",fe)
  let audio = ['cd', 'ogg', 'mp3', 'asf', 'wma', 'wav', 'mp3pro', 'rm', 'real', 'ape', 'module', 'midi', 'vqf']
  let video = ['avi', 'wma', 'rmvb', 'rm', 'flash', 'mp4', 'mid', '3gp'];
  let image = ['jpg','gif','png']
  for (let i in audio) if (audio[i] === fe) return 'audio'; //音频
  for (let i in video) if (video[i] === fe) return 'video'; //视频
  for (let i in image) if (image[i] === fe) return 'image'; //视频
  return "file";

}

// var strRegex = "(.jpg|.JPG|.gif|.GIF)$"; //用于验证图片扩展名的正则表达式
// var re=new RegExp(strRegex);


//var a = ['cd', 'ogg', 'mp3', 'asf', 'wma', 'wav', 'mp3pro', 'rm', 'real', 'ape', 'module', 'midi', 'vqf'],
//       v = ['avi', 'wma', 'rmvb', 'rm', 'flash', 'mp4', 'mid', '3gp'];
//     for (var i in a)
//       if (a[i] === e) return 'audio'; //音频
//     for (var i in v)
//       if (v[i] === e) return 'video'; //视频
//     return null;

// 金额转换用于前后台金额转换，用于项目金额转换。现在用于
export function floatToLong (number) {
  return times(round(number,2),100)
}

export function longToFloat (number) {
  return divide(number,100)
}


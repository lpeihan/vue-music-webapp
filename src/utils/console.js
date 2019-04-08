export function loadScript(src, cb) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = src;

  let flag = false; // 防止 IE9/10 中执行两次

  script.onload = script.onreadystatechange = function() {
    if (
      flag === false &&
      (!this.readyState || this.readyState === 'complete')
    ) {
      flag = true;
      cb && cb();
    }
  };

  const s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(script, s);
}

let vconsole;
let count = 0;
const url =
  'https://res.wx.qq.com/mmbizwap/zh_CN/htmledition/js/vconsole/3.0.0/vconsole.min.js';

// 通过 url 唤醒
if (/console/g.test(location.href)) {
  loadScript(url, function() {
    if (typeof vconsole === 'undefined') {
      /* eslint-disable */
      vconsole = new VConsole();
    }
  });
}

// 通过点击事件
window.addEventListener('load', function() {
  const entry = document.querySelector('#vconsole-secret');

  // 点击 #vconsole-secret 的元素唤起
  entry &&
    entry.addEventListener('click', function() {
      count++;

      if (count > 5) {
        count = -10000;
        loadScript(url, function() {
          if (typeof vconsole === 'undefined') {
            /* eslint-disable */
            vconsole = new VConsole();
          }
        });
      }
    });
});

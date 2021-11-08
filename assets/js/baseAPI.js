// 注意：每次调用$.get,$.post,$.ajax 的时候， 会先调用这个 ajaxPrefilter  函数
// 在这个函数中可以拿到Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  // 再发起真正的ajax请求之前，统一拼接请求根路径
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
  // 统一为有权限的接口设置 headers 请求头
  if (options.url.indexOf('/my/') != -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || '',
    };
  }
  // 全局统一挂载 comlete 回调
  // 统一为有权限的访问设置验证
  options.complete = function (res) {
    //   console.log('执行了complete');
    //   console.log(res);
    // 在complete回调函数中，可以使用res.responseJSON 拿到服务器相应回来的数据
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // 1.强制清空token
      localStorage.removeItem('token');
      // 2.强制跳转login.html页面
      location.href = 'login.html';
    }
  };
});

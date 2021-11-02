// 注意：每次调用$.get,$.post,$.ajax 的时候， 会先调用这个 ajaxPrefilter  函数
// 在这个函数中可以拿到Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  // 再发起真正的ajax请求之前，统一拼接请求根路径
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
});

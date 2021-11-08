$(function () {
  // 调用 getUserInfo 获取用户基本信息
  getUserInfo();

  $('#btnLoginout').on('click', function () {
    // 提示用户是否确认退出
    var layer = layui.layer;
    layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
      //do something

      // 1.清空token本地存储
      localStorage.removeItem('token');
      //   window.localStorage.clear(); // 清除所有缓存
      // 2.跳转到登陆页面
      location.href = 'login.html';

      //   关闭confirm弹出框
      layer.close(index);
    });
  });
});

// 获取用户基本信息
// 在指定有权限得接口访问的时候，都要指定一个complete回调函数（用来判断）
function getUserInfo() {
  token = localStorage.getItem('token');
  console.log(token);
  $.ajax({
    type: 'GET',
    url: '/my/userinfo',
    // 请求头字段
    // headers: {
    //   Authorization: token || '',
    // },
    success: function (res) {
      console.log(res);
      if (res.status != 0) {
        return layui.layer.msg('获取用户基本信息失败');
      }
      //   调用 renderAvatar 渲染用户头像
      renderAvatar(res.data);
    },
    // ajax请求服务器，不论成功还是失败都会返回
    // complete: function (res) {
    //   //   console.log('执行了complete');
    //   //   console.log(res);
    //   // 在complete回调函数中，可以使用res.responseJSON 拿到服务器相应回来的数据
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！')
    //     // 1.强制清空token
    //     localStorage.removeItem('token');
    //   // 2.强制跳转login.html页面
    //   location.href = 'login.html';
    // },
  });
}

function renderAvatar(user) {
  // 1.获取用户的名称
  var name = user.nickname || user.username;
  //   2.设置欢迎文本
  $('#welcome').html('欢迎&emsp;' + name);
  //   3.按需渲染用户头像
  if (user.user_pic) {
    //   3.1渲染图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show();
    $('.text-avatar').hide();
  } else {
    //   3.1渲染文字头像
    $('.layui-nav-img').hide();
    var textAvatar = name[0].toUpperCase();
    $('.text-avatar').html(textAvatar).show();
  }
}

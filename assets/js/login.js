$(function () {
  // 点击去注册的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();
  });
  // 点击去登录的链接
  $('#link_login').on('click', function () {
    $('.login-box').show();
    $('.reg-box').hide();
  });

  //   从layui中获取form对象
  var form = layui.form;
  var layer = layui.layer;
  //  通过 form.verify() 则会个函数自定义校验规则 \S 非空格
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 校验两次密码是否一致的规则
    repwd: function (value) {
      // 通过形参拿到的是确认密码框的内容
      // 还需要骂道密码框中的内容
      // 进行一次比较
      //   判断失败，则return一个提示消息
      var pwd = $('.reg-box [name=password]').val();
      if (pwd !== value) {
        return '两次密码不一致！';
      }
    },
  });

  //   监听注册表单的提交事件
  $('#form_reg').on('submit', function (e) {
    var data = {
      username: $('#form_reg [name=username]').val(),
      password: $('#form_reg [name=password]').val(),
    };
    e.preventDefault();
    $.ajax({
      url: '/api/reguser',
      type: 'POST',
      data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg('注册成功,请登录');
        $('#link_login').click();
      },
    });
  });
  var useInfo = '';
  //   监听登录表单的提交事件 serialize()获取表单内所有元素
  $('#form_login').on('submit', function (e) {
    e.preventDefault();
    // var data = {
    //   username: $('#form_login [name=username]').val(),
    //   password: $('#form_login [name=password]').val(),
    // };

    $.ajax({
      url: '/api/login',
      type: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        localStorage.setItem('token', res.token);
        useInfo = localStorage.getItem('token');
        console.log(useInfo);
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg('登录成功');
        // 跳转到后台
        location.href = 'index.html';
      },
    });
  });
});

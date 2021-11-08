$(function () {
  var form = layui.form;
  var layer = layui.layer;

  form.verify({
    pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    samePwd: function (value) {
      if (value === $('[name=oldPwd]').val()) {
        //   不能用layer的提示框，本身就有否则会产生冲突
        return '新旧密码不能相同';
      }
    },
    rePwd: function (value) {
      if (value !== $('[name=newPwd]').val()) {
        //   不能用layer的提示框，本身就有否则会产生冲突
        return '两次输入密码不一致';
      }
    },
  });

  //   监听表单提交事件
  $('#layui-form').on('submit', function (e) {
    //  阻止默认事件
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status != 0) {
          return layer.msg('更i新密码失败');
        }
        layer.msg('更新密码成功');
        // 重置表单 form的方法 reset() 原生的
        $('#layui-form')[0].reset();
      },
    });
  });
});

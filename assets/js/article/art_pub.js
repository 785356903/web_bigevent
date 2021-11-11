$(function () {
  var layer = layui.layer;
  var form = layui.form;
  // 获取分类列表
  initCateList();
  //   调用富文本
  initEditor();
  function initCateList() {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        console.log(res);
        if (res.status != 0) {
          return layer.msg('获取分类失败');
        }
        // 调用模板引擎，渲染
        var htmlStr = template('tpl-cateList', res);
        $('[name=cate_id]').html(htmlStr);
        // layui的更新渲染(在执行代码时，执行layui没有数据，就默认空，渲染样式)
        // 通过 layui 重新渲染表单的UI结构
        form.render();
      },
    });
  }

  //   剪辑头像区域
  var $image = $('#image');

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview',
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  //   未选择封面的按钮绑定点击事件函数
  $('#fileBtn').on('click', function (e) {
    $('#coverFile').click();
  });
  //   监听coverFile 的change事件，获取用户选的的列表
  $('#coverFile').on('change', function (e) {
    var files = e.target.files;
    if (files == 0) {
      return;
      //   return layer.msg('请选择文件');
    }
    var newImgURL = URL.createObjectURL(files[0]);

    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  //  1. 定义文章发布状态
  var art_sate = '已发布';
  $('#brnSave2').on('click', function () {
    art_sate = '草稿';
  });

  //   为表单 绑定submit事件
  $('#form-pub').on('submit', function (e) {
    e.preventDefault();
    // 2.基于form表单，快读创建一个FormDate 对象
    var fd = new FormData($(this)[0]);
    // 3.发布状态存入fd
    fd.append('state', art_sate);

    fd.forEach(function (v, k) {
      console.log(v, k);
    });

    // 4.将封面裁剪过后的图片，输出作为一个对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5.将文件对象，存到fd中
        fd.append('cover_img', blob);
        // 6.发起ajax请求
        publishArticle(fd);
      });
  });

  //   定义一个发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      type: 'POST',
      url: '/my/article/add',
      data: fd,

      //   **注意:如果像服务器提交的是 FormDate 格式的数据
      //   必须添加一下两个配置

      contentType: false, //告诉jquery不要设置content-Type请求头
      processData: false, //告诉jquery不要处理发送的数据
      success: function (res) {
        console.log(res);
        if (res.status != 0) {
          return layer.msg('发布文章失败！');
        }
        layer.msg('发布文章成功！');
        // location.href = 'art_list.html';
      },
    });
  }
});

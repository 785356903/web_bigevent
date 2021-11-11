$(function () {
  var layer = layui.layer;
  var form = layui.form;
  // 获取文章分类的列表 cate
  initArtCateList();
  function initArtCateList() {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        console.log(res, 11);
        // console.log(res.data[0].Id);
        var htmlStr = template('tpl-table', res);
        $('#tbody').html(htmlStr);
      },
    });
  }

  //   为添加类别按钮添加点击事件
  var indexAdd = null;
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html(),
    });
  });

  //   监听表单的提交事件
  //   通过代理的形式 为 form-add 表单绑定submit事件
  $('body').on('submit', '#form-add', function (e) {
    // 阻止默认事件
    console.log($(this).serialize());
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status != 0) {
          return layer.msg('新增分类失败！');
        }
        // 重新渲染数据
        initArtCateList();
        // 根据索引关闭弹出层
        layer.close(indexAdd);
        return layer.msg('新增分类成功！');
      },
    });
  });

  //   为编辑按钮添加绑定事件 通过代理的形式
  var indexEdit = null;
  $('#tbody').on('click', '.btn-edit', function () {
    //   弹出一个修改文章分类信息的层
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html(),
    });

    var id = $(this).attr('data-id');
    console.log(id);

    //发起请求对应分类的数据
    $.ajax({
      type: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        console.log(res, 22, Math.abs(id));
        // $('#form-edit').val();
        // $('[name=Id]').val(res.data.Id);
        // $('[name=alias]').val(res.data.alias);
        // $('[name=name]').val(res.data.name);
        // 调用form.val 为表单赋值
        // form.val(lay-filter="form-edit"的值, 数据);
        form.val('form-edit', res.data);
      },
    });
  });

  //   为编辑绑定点击事件;
  $('body').on('submit', '#form-edit', function (e) {
    // 阻止默认事件
    console.log($(this).serialize());
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status != 0) {
          return layer.msg('更新分类失败！');
        }
        // 重新渲染数据
        initArtCateList();
        // 根据索引关闭弹出层
        layer.close(indexEdit);
        return layer.msg('更新分类成功！');
      },
    });
  });

  // 通过代理的形式为删除绑定点击事件
  $('#tbody').on('click', '.btn-del', function (e) {
    e.preventDefault;
    var id = $(this).attr('data-id');
    console.log($(this).attr('data-id'));
    // 提示用户是否删除
    layer.confirm('确认删除', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        type: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status != 0) {
            return layer.msg('删除分类失败');
          }
          layer.msg('删除分类成功');
          layer.close(index);
          // 刷新列表数据
          initArtCateList();
        },
      });
    });
  });
});
// $('.layui-btn')[0].reset()

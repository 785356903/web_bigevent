$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;

  // 定义美化时间的过滤器   template.defaults.imports.dataFormat
  function optimizeDate(date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
  }

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n;
  }

  // 定义一个查询的参数对象，将来请求数据的时候
  // 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '', // 文章的发布状态
  };

  //   获取文章数据列表的方法
  initTable();
  function initTable() {
    $.ajax({
      type: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        console.log(res);
        res.data.forEach(function (ele, i) {
          res.data[i].pub_date = optimizeDate(res.data[i].pub_date);
        });

        if (res.status != 0) {
          return layer.msg('获取文章列表失败');
        }
        // layer.msg('获取文章列表成功');
        // 使用模板引擎渲染数据
        var htmlStr = template('tpl-artList', res);
        $('#tbody').html(htmlStr);

        // 调用渲染分页的方法
        renderPage(res.total);
      },
    });
  }

  initCate();
  //   初始化文章分类的方法
  function initCate() {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status != 0) {
          return layer.msg('初始化文章失败');
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-artCate', res);
        $('#cate_id').html(htmlStr);

        // layui的更新渲染(在执行代码时，执行layui没有数据，就默认空，渲染样式)
        // 通过 layui 重新渲染表单的UI结构
        form.render();
      },
    });
  }

  //   为筛选表单绑定 submit事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    //   获取表单中选中项的值
    var cate_id = $('#cate_id').val();
    var state = $('[name=state]').val();
    //   为查询参数对象q 属性赋值
    q.cate_id = cate_id ? cate_id : '';
    q.state = state ? state : '';
    //   根据最新的筛选条件重新渲染表格的数据
    initTable();
  });

  // 定义渲染分页的方法
  function renderPage(total) {
    // 调用laypage.render({})方法来渲染分页结构
    laypage.render({
      elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize, //每页显示的条数。laypage将会借助 count 和 limit 计算出分页数。
      curr: q.pagenum, //起始页。一般用于刷新类型的跳页以及HASH跳页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 10],
      //   分页发生变化的时候回调
      //   触发jump回调的方法有两种
      // 1.点击页码的时候，会触发jump回调
      // 2.只要调用了 laypage.render()方法就会触发jump回调
      jump: function (obj, first) {
        //obj包含了当前分页的所有参数，比如：
        // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        // console.log(obj.limit); //得到每页显示的条数
        q.pagesize = obj.limit;
        q.pagenum = obj.curr;
        // 根据罪行的 q 对应的数据列表，并渲染表格

        if (!first) {
          // first 是一个布尔值 点击触发为undifande
          //   可轻易通过first的值，来判断是那种方式触发的jump
          initTable();
        }
      },
    });
  }

  //   删除代理行使绑定
  $('#tbody').on('click', '.btn-del', function () {
    //   获取当前文章的id
    var id = $(this).attr('data-id');
    // 获取删除按钮的个数
    var len = $('.btn-del').length;
    // 询问是否删除数据
    layer.confirm('确定删除？', { icon: 3, title: '提示' }, function (index) {
      layer.close(index);
      $.ajax({
        type: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status != 0) {
            return layer.msg('删除文章失败');
          }
          layer.msg('删除文章成功');
          //   当数据删除完成后，需要判断这一页中，是否还有剩余的数据
          // 如果没有剩余的数据则页码-1
          // 从新调用  initTable();方法
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable();
        },
      });
    });
  });
});
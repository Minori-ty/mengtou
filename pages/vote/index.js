Page({
    data: {
        charas:[

        ],
        flag1:false,
        flag2:false,
        flag3:false,
        userinfo:{}
    },
    getMess:function(){
        var that = this
        // var uid = swan.getStorageSync("uid")
        // console.log(uid);

        swan.request({
            url: 'https://xanxus.top/api/vote.php',
            data:{},
            header:{
              'content-type':'application/json'
            },
            success:function(res){
            //   console.log(res.data);
              that.setData({
                charas:res.data
              })
              swan.setStorageSync("charas", res.data);
              swan.request({
                  url:'https://xanxus.top/api/myfavo.php',
                  method:'POST',
                  data:{
                      uid:swan.getStorageSync("uid")
                  },
                  header:{
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success:function(res){
                    console.log(res.data);
                    swan.setStorageSync("myfavo", res.data);
                    var myfavo = swan.getStorageSync("myfavo")
                    var charas = swan.getStorageSync("charas")
                    myfavo.forEach(function(item,index){
                        var myfavoid = item.charasid
                        charas.forEach(function(item,index){
                            // console.log(item.id);
                            if(myfavoid == item.id ){
                                // console.log(item.status);
                                item.status = 1
                            }
                        })
                    })
                    swan.setStorageSync('charas', charas);
                    that.setData({
                        charas:charas
                    })
                    // console.log(that.data);

                  },
                  fail:function(err){
                    console.log(err);
                  }
              })
            },
            fail:function(err){
              console.log(err);
            }
          })
    },
    cancel(){
        this.setData({
            flag1:false,
            flag2:false
        })
    },
    //??????????????????
    handleGetUserInfo(e){
        console.log(e);
        this.setData({
            flag1:false,
            flag2:false
        })
        const {userInfo} = e.detail;
        swan.setStorageSync("userinfo", userInfo);
        swan.startPullDownRefresh({
        });
        const userinfo = swan.getStorageSync("userinfo");
        this.setData({userinfo});

        var username = e.detail.userInfo.nickName
        var headUrl = e.detail.userInfo.avatarUrl
        // console.log('headUrl??????'+headUrl);
        var that = this
        swan.request({
            url: 'https://xanxus.top/api/login.php',
            method:'POST',
            data:{
                username:username,
                headUrl:headUrl
            },
            header: {// ??????????????? header
                'content-type': 'application/x-www-form-urlencoded'
              },
            success:function(res){
                // console.log('????????????');
                console.log(res.data[0].id);
                const uid = res.data[0].id
                swan.setStorageSync("uid", uid);
                  console.log(that);
            }
        });

    },
    love(e){
        var user = swan.getStorageSync("userinfo")
        if(!user){
            this.setData({
                flag1:true,
                flag2:true
            })
        }else{
        var that = this
        var id = e.target.dataset.id
        console.log(id);
        var chara = this.data.charas;
        var uid = swan.getStorageSync("uid")
        chara.forEach(function(item,index){
            if(id == item.id){
                // console.log(item.status);
                var favo = item.favo
                //??????
                if(item.status==0){
                    console.log('id??????'+id);
                    console.log(item.status);
                    item.status=1
                    item.favo=parseInt(item.favo)+1
                    swan.request({
                        url: 'https://xanxus.top/api/change.php',
                        method:'POST',
                        data:{
                           num:1,
                           charaid:id,
                           uid:uid
                        },
                        header: {// ??????????????? header
                            'content-type': 'application/x-www-form-urlencoded'
                          },
                        success:function(res){
                            console.log('????????????');
                            console.log(res.data);
                        }
                    });
                    //????????????
                }else{
                    item.status=0
                    item.favo=parseInt(item.favo)-1
                    console.log(item.favo);
                    swan.request({
                        url: 'https://xanxus.top/api/change.php',
                        method:'POST',
                        data:{
                           num:-1,
                           charaid:id,
                           uid:uid
                        },
                        header: {// ??????????????? header
                            'content-type': 'application/x-www-form-urlencoded'
                          },
                        success:function(res){
                            console.log('????????????');
                            console.log(res.data);
                        }
                    });
                }
            }
        })

        swan.setStorageSync("charas", chara);
        // console.log(this.data.charas);
        this.setData({
            charas:swan.getStorageSync('charas')
        })


        }
    },
    onLoad: function () {
        // ???????????????????????????????????????
        this.getMess();
    },
    onReady: function() {
        // ???????????????????????????????????????????????????
    },
    onShow: function() {
        // ???????????????????????????????????????
        this.getMess();
        const userinfo = swan.getStorageSync("userinfo");
        this.setData({userinfo})
    },
    onHide: function() {
        // ???????????????????????????????????????
    },
    onUnload: function() {
        // ???????????????????????????????????????
    },
    onPullDownRefresh: function () {
        this.getMess()
        setTimeout(() => {
            swan.stopPullDownRefresh();
        }, 500);
    },
    onReachBottom: function() {
        // ???????????????????????????????????????
    },
    onShareAppMessage: function () {
        // ???????????????????????????
    }
});
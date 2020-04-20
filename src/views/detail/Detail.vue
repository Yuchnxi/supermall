<template>
  <div id='detail'>
    <detail-nav-bar class="detail-nav"></detail-nav-bar>
    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info :param-info="paramInfo"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo"></detail-comment-info>
      <goods-list :goods="recommends"></goods-list>
    </scroll>
  </div>
</template>

<script>

import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo' 
import DetailCommentInfo from './childComps/DetailCommentInfo'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'

import { debounce } from "common/utils"

import {getDetail, getRecommend, Goods, Shop, GoodsParam} from 'network/detail'

export default {
  name: 'Detail',
  data(){
    return {
      iid: {},
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      itemImglistener: null
    }
  },
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    Scroll,
    GoodsList
  },
  created(){
    // 1. 保存传入的 iid
    this.iid = this.$route.params.iid

    // 2. 根据 iid 请求详情数据
    getDetail(this.iid).then(res => {
        // 1. 获取顶部的图片轮播数据
        const data = res.result
        this.topImages = data.itemInfo.topImages

        // 2. 获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 3. 创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        // 4. 保存店铺图片
        this.detailInfo = data.detailInfo

        // 5. 获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 6.获取评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
        
    })

    // 获取推荐信息
    getRecommend().then(res => {
      console.log(res)
      this.recommends = res.data.list
    })
  },
  mounted(){
    let newRefresh = debounce(this.$refs.scroll.refresh, 500)

    this.itemImglistener = () => {
      newRefresh()
    }

    this.$bus.$on('itemImgLoad', this.itemImglistener)
  },
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh()
    }
  },
  destroyed () {
    this.$bus.$of('itemImgLoad', this.itemImglistener)
  }
}
</script>
<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav{
    position: relative;
    z-index: 9;
    background: #fff;
  }
  .content {
  overflow: hidden;
  height: calc(100% - 44px);

}


</style>

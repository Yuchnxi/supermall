<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true" @pullingUp="loadMore">
      <home-swiper :banners="banners"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="titles" @tabClick="tabClick"></tab-control>
      <good-list :goods="showGoods"></good-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from 'components/content/backTop/BackTop';

import { getHomeMultidata, getHomeGoods } from "network/home";
import { debounce } from "common/utils"

export default {
  name: "Home",
  components: {
    // 挂载组件
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodList,
    Scroll,
    BackTop
  },
  data() {
    return {
      banners: [],
      recommends: [],
      titles: ["流行", "新款", "精选"],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: "pop",
      isShowBackTop: false
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  created() {
    // 1. 请求多个数据
    this.getHomeMultidata();

    // 2. 请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");

  },
  mounted () {
    // 监听 item 中图片加载完成
    const refresh = debounce(this.$refs.scroll.refresh, 500)

    this.$bus.$on('itemImageLoad', () => {
      refresh()
    })
  },
  methods: {
    /**
     *  事件监听相关的方法
     */

    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
    },
    // 监听点击回归顶部
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500) 
    },
    // 监听滚动位置
    contentScroll(position) {
      this.isShowBackTop = (-position.y) > 1000
    },
    // 监听上拉加载更多
    loadMore() {
      this.getHomeGoods(this.currentType)
    },

    /**
     *  网络请求相关的方法
     */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      // 请求商品数据
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        this.$refs.scroll.finishPullUp()
      });
    }
  }
};
</script>

<style scope>
#home {
  padding-top: 44px;
  height: 100vh;
  position: relative;
}

.home-nav {
  background: var(--color-tint);
  color: #f5f0f0;

  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
}


.content {
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
</style>
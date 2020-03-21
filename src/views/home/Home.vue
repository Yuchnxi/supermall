<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'

  import {getHomeMultidata} from 'network/home'
  import {Swiper, SwiperItem} from 'components/common/swiper'

  export default {
    name: 'Home',
    components: {
      NavBar,
      Swiper,
      SwiperItem
    },
    data () {
      return {
        banners: [],
        recommends: []
      }
    },
    created () {
      // 请求多个数据
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    }
  }
</script>

<style>
 .home-nav {
   background: var(--color-tint);
   color: #f5f0f0;
 }
</style>
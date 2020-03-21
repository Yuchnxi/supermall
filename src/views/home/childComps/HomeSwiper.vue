<template>
  <swiper>
      <swiper-item v-for="(item, index) in banners">
        <a :href="item.link">
          <img :src="item.image" alt="">
        </a>
      </swiper-item>
    </swiper>
</template>

<script>
import {Swiper, SwiperItem} from 'components/common/swiper'

export default {
  name: 'HomeSwiper',
  props: {
    banners: {
      type: Array,
      defailt() {
        return []
      }
    }
  },
  components: {
    Swiper,
    SwiperItem
  }
}
</script>

<style>

</style>
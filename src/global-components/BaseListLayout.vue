<template>
  <div
    id="base-list-layout"
    class="zoomIn"
  >
    <header
      class="home-hero"
      :style="{backgroundImage: 'url(' + $themeConfig.heroImage + ')'}"
    >
      <!-- backgroundImage: 'url(' + $withBase($themeConfig.heroImage) + ')' -->
      <div class="p-3">
        <h1 class="display-3 d-none d-md-block">
          {{ $site.title }}
        </h1>
        <p class="font-weight-light h3 ">
          {{ $site.description }}
        </p>
      </div>
    </header>
    <featured-posts class="my-5 d-sm-none d-lg-block" />
    <el-container class="row px-lg-4">
      <aside class="tags col-md-12 col-lg-3  py-0 py-lg-5">
        <About v-if="$themeConfig.about" />
        <BlogTags :tags="tags" />
      </aside>
      <div
        id="posts"
        class="col-md-12 col-lg-9 py-3 py-lg-5"
      >
        <PostsList :posts="pages" />

        <div class="d-flex">
          <component
            :is="paginationComponent"
            v-if="$pagination.length > 1 && paginationComponent"
          />
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
/* global THEME_BLOG_PAGINATION_COMPONENT */

import Vue from 'vue'
import PostsList from '@theme/components/PostsList.vue'
import About from '@theme/components/About.vue'
import FeaturedPosts from '@theme/components/FeaturedPosts'
import {
  Pagination,
  SimplePagination,
} from '@vuepress/plugin-blog/lib/client/components'

export default {
  components: { PostsList, Pagination, FeaturedPosts, About },
  computed: {
    pages () {
      return this.$pagination.pages
    },
    tags () {
      return this.$tag.list
    },
  },
  created () {
    this.paginationComponent = this.getPaginationComponent()
  },
  methods: {
    getPaginationComponent () {
      const n = THEME_BLOG_PAGINATION_COMPONENT
      if (n === 'Pagination') {
        return Pagination
      }
      if (n === 'SimplePagination') {
        return SimplePagination
      }
      return Vue.component(n) || Pagination
    },
  },
}
</script>

<style lang="stylus">
header.home-hero {
  max-height: 300px;
  padding: 1.5rem 30% 1.5rem 1.5rem;
  background-color: $mainBackColor;
  background-repeat: no-repeat;
  background-position: right;
  background-size: contain;

  @media only screen and (max-width: $MQMobile){
    max-height: 250px;
    h1 {
      font-size: 2rem;
    }
    p {
      font-size: 1.1rem;
    }
  }
}

.tags, #posts {
  @media only screen and (max-width: $MQMobile) {
    padding-left: 5px;
    padding-right: 5px;
  }
}
</style>

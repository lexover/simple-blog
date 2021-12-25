<template>
  <div id="vuperess-theme-blog__post-layout">
    <Toc />
    <transition name="el-fade-in-linear">
      <main class="vuepress-blog-theme-content">
        <el-card class="py-3 px-3 mb-4">
          <img
            v-if="$frontmatter.image"
            :src="$withBase($frontmatter.image)"
            :alt="$frontmatter.title"
            class="p-5 post-header-img"
          >
          <div class="p-3">
            <h1 align="center">
              {{ $frontmatter.title }}
            </h1>
          </div>
          <Content />
        </el-card>

        <el-card
          v-if="$themeConfig.posts && $themeConfig.posts.append && $themeConfig.posts.append.length > 0"
          class="py-3 px-3 mb-4"
        >
          <!-- eslint-disable-next-line -->
          <span v-html="$themeConfig.posts.append" />
        </el-card>

        <ClientOnly v-if="$themeConfig.disqus">
          <el-card class="comments-area my-4">
            <div
              slot="header"
              class="clearfix"
            >
              <h5 class="m-0">
                {{ $t("leave_comment") }}
              </h5>
            </div>
            <Disqus
              :shortname="$themeConfig.disqus"
              class="disqus-comments"
            />
          </el-card>
        </ClientOnly>
      </main>
    </transition>
  </div>
</template>

<script>
import Toc from '@theme/components/Toc.vue'
import PostInfo from '@theme/components/PostInfo.vue'
import FeaturedPosts from '@theme/components/FeaturedPosts.vue'

export default {
  components: {
    Toc,
    PostInfo,
    FeaturedPosts,
  },
  computed: {
    featured_posts () {
      return this.$site.pages.filter(page => page.frontmatter.featured === true)
    },
  },
}
</script>

<style lang="stylus">
#vuperess-theme-blog__post-layout {
  position: relative;
}

.vuepress-blog-theme-content {
  font-size: 16px;
  letter-spacing: 0px;
  color: #2c3e50;
  position: relative;
  padding: 15px;
  max-width: 90% !important;

  .post-header-img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    max-height: 300px;

  }

  @media only screen and (max-width: $MQMobile) {
    padding-left: 5px !important;
    padding-right: 5px !important;

    .el-card__body {
      padding-left: 5px !important;
      padding-right: 5px !important;
    }
  }

  .content__default {
    > p {
      text-align: justify;
    }
  }
}

.post-tags {
  padding: 0;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.disqus-comments {
  margin-top: 0rem;
}
</style>

<style src="prismjs/themes/prism-okaidia.css"></style>

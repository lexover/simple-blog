<template>
  <div
    v-if="posts && posts.length"
    class="container featured-posts"
  >
    <el-carousel
      :interval="4000"
      type="card"
      height="300px"
    >
      <el-carousel-item
        v-for="post in posts"
        :key="post.key"
        class="carousel-card bg-cover border-10"
        :style="{
          'background-image': $withBase(post.frontmatter.image)
            ? `url(${$withBase(post.frontmatter.image)})`
            : 'none'
        }"
      >
        <div
          class="carousel-card-content d-flex justify-content-center align-content-end flex-column h-100 px-4"
        >
          <a
            class="text-center mt-auto pb-2 h4"
            @click="go(post.path)"
          >
            {{ post.title }}
          </a>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: 'FeaturedPosts',
  props: {
    posts: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    go (path) {
      this.$router.push(path)
    },
  },
}
</script>

<style lang='stylus' scoped>
  .carousel-card {
    background-blend-mode: multiply;
    background-size: 200px auto;
    background-color: rgba(238,240,236,0.7);
    background-repeat: no-repeat;
    background-position: center 20%;
    border-radius: 10px;

    @media only screen and (max-width: $MQMobile) {
      background-size: 150px auto;
      width: 200px;
      .h4 {
        font-size: 1.2rem;
      }
    }
  }
</style>

<template>
  <el-container>
    <el-main class="">
      <el-row
        :gutter="10"
        align="center"
        class="py-3"
      >
        <el-col
          v-for="cheatSheet in cheatSheets"
          :key="cheatSheet.name"
          :sm="24"
          :md="12"
        >
          <el-card class="card project-card zoomIn">
            <router-link :to="cheatSheet.regularPath">
              <div class="project-card-header">
                <div class="project-icon">
                  <i class="el-icon-document" />
                </div>
                <h4>{{ cheatSheet.frontmatter.title || cheatSheet.title }}</h4>
              </div>
              <div>
                <p class="project-description">
                  {{ cheatSheet.frontmatter.description }}
                </p>
                <ul class="languages-list">
                  <li
                    v-for="lang in cheatSheet.frontmatter.languages"
                    :key="lang"
                  >
                    {{ lang }}
                  </li>
                </ul>
              </div>
            </router-link>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import {
  GithubIcon,
  LinkIcon,
} from 'vue-feather-icons'

export default {
  components: {
    GithubIcon,
    LinkIcon,
  },
  computed: {
    cheatSheets () {
      return this.$pagination._matchedPages
    },
  },
}
</script>

<style lang="stylus" scoped>
.el-container {
  max-width: 1100px;
  margin-right: auto !important;
  margin-left: auto !important;

  @media screen and (min-width: 860px) {
    min-height: 80vh;
    width: 80%;
  }

  .project-card.card {
    margin: .5rem;
    background: linear-gradient(45deg, darken($accentColor, 30%), darken($accentColor, 70%));
    color: lighten($accentColor, 80%);
    box-shadow: 0 0 2rem rgba(0, 0, 0, 0.3);
    transition: all 0.4s;

    a:hover {
      text-decoration: none;
    }

    &:hover {
      transform: scale(0.99);
      box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
    }

    .project-card--links a {
      color: $accentColor;

      &:hover {
        color: lighten($accentColor, 50%);
      }
    }

    .project-card-header {
      display: flex;
      margin-bottom: 0.5rem;
      align-items: center;

      h4 {
        margin: auto .2em;
      }

      .project-icon {
        font-size: 2em;
        position: relative;
        color: lighten($accentColor, 50%);
        margin-right: 0.2em;
      }
    }

    p.project-description {
      color: lighten($accentColor, 60%);
      margin: auto .2em;
    }

    .languages-list {
      list-style: none;
      display: flex;
      padding: 0;
      margin: 0;
      color: lighten($accentColor, 40%);
      font-family: monospace;

      li {
        padding: 0 5px;
      }
    }
  }
}
</style>

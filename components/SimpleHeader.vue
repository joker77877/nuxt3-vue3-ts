<template>
  <div class="header flex justify-between border-b border-solid border-b-[#EBEBED] bg-white">
    <div class="logo cursor-pointer text-ellipsis font-sans" @click="jump">
      <NuxtImg src="/images/logo.png" alt="Mita3D"></NuxtImg>
    </div>
    <HeaderUserDownMenu></HeaderUserDownMenu>
  </div>
</template>

<script setup lang="ts" name="SimpleHeader">
const jump = () => {
  navigateTo("/")
  clearUploadWorkStore()
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 80px;
  padding: 0 36px;

  @media screen and (width <= $screen-width-lg) {
    padding: 0 30px;
  }

  @media screen and (width <= $screen-width-med) {
    padding: 0 20px;
  }
  .logo {
    display: flex;
    align-items: center;
    img {
      width: auto;
      height: 23px;
    }

    margin-right: 53px;

    @media screen and (width <= $screen-width-lg) {
      margin-right: 20px;
    }

    @media screen and (width <= $screen-width-med) {
      margin-right: 15px;
    }
  }
  .menus {
    ul {
      display: flex;
      flex-direction: row;
      li {
        padding: 0 25px;
        &.active {
          color: var(--el-color-primary);
        }

        @media screen and (width <= $screen-width-lg) {
          padding: 0 20px;
        }

        @media screen and (width <= $screen-width-med) {
          padding: 0 14px;
        }
        .el-link {
          font-size: var(--el-font-size-medium);
        }
        .menu-item {
          cursor: pointer;
        }
      }
    }
  }
  .search {
    flex: 1;
    align-items: center;
    width: 280px;
    padding-left: 130px;

    @media screen and (width <= $screen-width-lg) {
      padding-left: 50px;
    }

    @media screen and (width <= $screen-width-med) {
      padding-left: 40px;
    }
  }
  .operation {
    margin-left: 19px;
    ul {
      display: flex;
      flex-direction: row;
      li {
        display: flex;
        align-items: center;
        padding: 0 11px;
        a {
          font-size: var(--el-font-size-medium);
        }
        .base-icon {
          &:hover {
            stroke: var(--el-color-primary);
          }
        }
      }
      .dropdown-item-text {
        font-size: var(--el-font-size-medium);
      }
    }
  }
  .user-avatar {
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
}
.go-login {
  color: var(--el-color-info);
  span {
    cursor: pointer;
  }
}
.skip {
  color: var(--el-color-info-light-3);
}
</style>

<template>
  <n-space class="back-g">
    <n-card id="regis-card">
      <n-tabs
          class="card-tabs"
          default-value="signin"
          size="large"
          animated
          style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
      >
        <n-tab-pane name="signin" tab="登录">
          <n-form>
            <n-form-item-row label="用户名">
              <n-input />
            </n-form-item-row>
            <n-form-item-row label="密码">
              <n-input />
            </n-form-item-row>
          </n-form>
          <n-button class="logon-button" type="primary" block secondary strong >
            登录
          </n-button>
        </n-tab-pane>
        <n-tab-pane name="signup" tab="注册">
          <n-form>
            <n-form-item-row label="用户名">
              <n-input />
            </n-form-item-row>
            <n-form-item-row label="密码">
              <n-input />
            </n-form-item-row>
            <n-form-item-row label="重复密码">
              <n-input />
            </n-form-item-row>
          </n-form>
          <n-button type="primary" block secondary strong>
            注册
          </n-button>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </n-space>

</template>

<script>
export default {
  name: "regisTer"
}
</script>

<style>
.back-g{
  background-color: #161622;
}
.card-tabs .n-tabs-nav--bar-type {
  padding-left: 4px
}
#regis-card {
    position: absolute;
    width: 480px;
    height: 430px;
    left: calc(50% - 480px/2);
    top: calc(50% - 430px/2);

    background: #FFE6D6;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
}

logon-button{
  width: 300px;
  height: 42px;
  left: 570px;
  top: calc(50% - 42px/2 + 89px);

  background: #FF9671;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 2px;
}
</style>
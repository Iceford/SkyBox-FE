<!--
 * @Description: 实现了用户注册、登录和重置密码的功能
 * @FilePath: \SkyBox-FE\src\views\Login.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 15:27:20
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-15 02:52:12
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->
<template>
  <div class="login-body">
    <div class="bg"></div>
    <div class="login-panel">
      <el-form
          ref="formDataRef"
          :model="formData"
          :rules="rules"
          class="login-register"
      >
        <div class="login-title">SkyBox</div>
        <!--input输入-->
        <el-form-item prop="email">
          <el-input
              v-model="formData.email"
              clearable
              maxLength="150"
              placeholder="请输入邮箱"
              size="large"
          >
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>
        <!--登录密码-->
        <el-form-item v-if="opType == 1" prop="password">
          <el-input
              v-model="formData.password"
              placeholder="请输入密码"
              show-password
              size="large"
              type="password"
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <!--注册-->
        <div v-if="opType == 0 || opType == 2">
          <el-form-item prop="emailCode">
            <div class="send-emali-panel">
              <el-input
                  v-model="formData.emailCode"
                  placeholder="请输入邮箱验证码"
                  size="large"
              >
                <template #prefix>
                  <span class="iconfont icon-checkcode"></span>
                </template>
              </el-input>
              <el-button
                  class="send-mail-btn"
                  size="large"
                  type="primary"
                  @click="getEmailCode"
              >获取验证码
              </el-button
              >
            </div>
            <el-popover :width="500" placement="left" trigger="click">
              <div>
                <p>1、在垃圾箱中查找邮箱验证码</p>
                <p>2、在邮箱中头像->设置->反垃圾->白名单->设置邮件地址白名单</p>
                <p>
                  3、将邮箱【rongquanhuang@qq.com】添加到白名单不知道怎么设置？
                </p>
              </div>
              <template #reference>
                <span :style="{ 'font-size': '14px' }" class="a-link"
                >未收到邮箱验证码？</span
                >
              </template>
            </el-popover>
          </el-form-item>
          <el-form-item v-if="opType == 0" prop="nickName">
            <el-input
                v-model="formData.nickName"
                clearable
                maxLength="20"
                placeholder="请输入昵称"
                size="large"
            >
              <template #prefix>
                <span class="iconfont icon-account"></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="registerPassword">
            <el-input
                v-model="formData.registerPassword"
                placeholder="请输入密码"
                show-password
                size="large"
                type="password"
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="reRegisterPassword">
            <el-input
                v-model="formData.reRegisterPassword"
                placeholder="请再次输入密码"
                show-password
                size="large"
                type="password"
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <el-form-item prop="checkCode">
          <div class="check-code-panel">
            <el-input
                v-model="formData.checkCode"
                placeholder="请输入验证码"
                size="large"
                @keyup.enter="doSubmit"
            >
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <img
                :src="checkCodeUrl"
                class="check-code"
                @click="changeCheckCode(0)"
            />
          </div>
        </el-form-item>
        <el-form-item v-if="opType == 1">
          <div class="rememberme-panel">
            <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
          </div>
          <div class="no-account">
            <a class="a-link" href="javascript:void(0)" @click="showPanel(2)"
            >忘记密码？</a
            >
            <a class="a-link" href="javascript:void(0)" @click="showPanel(0)"
            >没有账号？</a
            >
          </div>
        </el-form-item>
        <el-form-item v-if="opType == 0">
          <a class="a-link" href="javascript:void(0)" @click="showPanel(1)"
          >已有账号?</a
          >
        </el-form-item>
        <el-form-item v-if="opType == 2">
          <a class="a-link" href="javascript:void(0)" @click="showPanel(1)"
          >去登录?</a
          >
        </el-form-item>
        <el-form-item>
          <el-button
              class="op-btn"
              size="large"
              type="primary"
              @click="doSubmit"
          >
            <span v-if="opType == 0">注册</span>
            <span v-if="opType == 1">登录</span>
            <span v-if="opType == 2">重置密码</span>
          </el-button>
        </el-form-item>
        <div v-if="opType == 1" class="login-btn-qq">
          快捷登录 <img src="@/assets/qq.png" @click="qqLogin"/>
        </div>
      </el-form>
    </div>
    <!--发送邮箱验证码-->
    <Dialog
        :buttons="dialogConfig4SendMailCode.buttons"
        :show="dialogConfig4SendMailCode.show"
        :showCancel="false"
        :title="dialogConfig4SendMailCode.title"
        width="500px"
        @close="dialogConfig4SendMailCode.show = false"
    >
      <el-form
          ref="formData4SendMailCodeRef"
          :model="formData4SendMailCode"
          :rules="rules"
          label-width="80px"
      >
        <el-form-item label="邮箱">
          {{ formData.email }}
        </el-form-item>
        <el-form-item label="验证码" prop="checkCode">
          <div class="check-code-panel">
            <el-input
                v-model="formData4SendMailCode.checkCode"
                placeholder="请输入验证码"
                size="large"
            >
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <img
                :src="checkCodeUrl4SendMailCode"
                class="check-code"
                @click="changeCheckCode(1)"
            />
          </div>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import {getCurrentInstance, nextTick, onMounted, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import md5 from "js-md5";

const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const api = {
  checkCode: "/api/checkCode",
  sendMailCode: "/sendEmailCode",
  register: "/register",
  login: "/login",
  resetPwd: "/resetPwd",
  qqlogin: "/qqlogin",
};

// 0:注册 1:登录 2:重置密码
const opType = ref();
const showPanel = (type) => {
  opType.value = type;
  resetForm();
};

onMounted(() => {
  showPanel(1);
});

//验证码
const checkCodeUrl = ref(api.checkCode);
const checkCodeUrl4SendMailCode = ref(api.checkCode);
const changeCheckCode = (type) => {
  if (type == 0) {
    checkCodeUrl.value =
        api.checkCode + "?type=" + type + "&time=" + new Date().getTime();
  } else {
    checkCodeUrl4SendMailCode.value =
        api.checkCode + "?type=" + type + "&time=" + new Date().getTime();
  }
};

//发送邮箱验证码弹窗
const formData4SendMailCode = ref({});
const formData4SendMailCodeRef = ref();
const dialogConfig4SendMailCode = reactive({
  show: false,
  title: "发送邮箱验证码",
  buttons: [
    {
      type: "primary",
      text: "发送验证码",
      click: () => {
        sendEmailCode();
      },
    },
  ],
});
//获取邮箱验证码
const getEmailCode = () => {
  formDataRef.value.validateField("email", (valid) => {
    if (!valid) {
      return;
    }
    dialogConfig4SendMailCode.show = true;

    nextTick(() => {
      changeCheckCode(1);
      formData4SendMailCodeRef.value.resetFields();
      formData4SendMailCode.value = {
        email: formData.value.email,
      };
    });
  });
};
//发送邮件
const sendEmailCode = () => {
  formData4SendMailCodeRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    const params = Object.assign({}, formData4SendMailCode.value);
    params.type = opType.value == 0 ? 0 : 1;
    let result = await proxy.Request({
      url: api.sendMailCode,
      params: params,
      errorCallback: () => {
        changeCheckCode(1);
      },
    });
    if (!result) {
      return;
    }
    proxy.Message.success("验证码发送成功，请登录邮箱查看");
    dialogConfig4SendMailCode.show = false;
  });
};

//登录，注册 弹出配置
const dialogConfig = reactive({
  show: false,
  title: "标题",
});

const checkRePassword = (rule, value, callback) => {
  if (value !== formData.value.registerPassword) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};
const formData = ref({});
const formDataRef = ref();
const rules = {
  email: [
    {required: true, message: "请输入邮箱"},
    {validator: proxy.Verify.email, message: "请输入正确的邮箱"},
  ],
  password: [{required: true, message: "请输入密码"}],
  emailCode: [{required: true, message: "请输入邮箱验证码"}],
  nickName: [{required: true, message: "请输入昵称"}],
  registerPassword: [
    {required: true, message: "请输入密码"},
    {
      validator: proxy.Verify.password,
      message: "密码只能是数字，字母，特殊字符 8-18位",
    },
  ],
  reRegisterPassword: [
    {required: true, message: "请再次输入密码"},
    {
      validator: checkRePassword,
      message: "两次输入的密码不一致",
    },
  ],
  checkCode: [{required: true, message: "请输入图片验证码"}],
};

//重置表单
const resetForm = () => {
  dialogConfig.show = true;
  if (opType.value == 0) {
    dialogConfig.title = "注册";
  } else if (opType.value == 1) {
    dialogConfig.title = "登录";
  } else if (opType.value == 2) {
    dialogConfig.title = "重置密码";
  }
  nextTick(() => {
    changeCheckCode(0);
    formDataRef.value.resetFields();
    formData.value = {};

    //登录
    if (opType.value == 1) {
      const cookieLoginInfo = proxy.VueCookies.get("loginInfo");
      if (cookieLoginInfo) {
        formData.value = cookieLoginInfo;
      }
    }
  });
};

// 登录、注册、重置密码  提交表单
const doSubmit = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    //注册
    if (opType.value == 0 || opType.value == 2) {
      params.password = params.registerPassword;
      delete params.registerPassword;
      delete params.reRegisterPassword;
    }
    //登录
    if (opType.value == 1) {
      let cookieLoginInfo = proxy.VueCookies.get("loginInfo");
      let cookiePassword =
          cookieLoginInfo == null ? null : cookieLoginInfo.password;
      if (params.password !== cookiePassword) {
        params.password = md5(params.password);
      }
    }
    let url = null;
    if (opType.value == 0) {
      url = api.register;
    } else if (opType.value == 1) {
      url = api.login;
    } else if (opType.value == 2) {
      url = api.resetPwd;
    }
    let result = await proxy.Request({
      url: url,
      params: params,
      errorCallback: () => {
        changeCheckCode(0);
      },
    });
    if (!result) {
      return;
    }
    //注册返回
    if (opType.value == 0) {
      proxy.Message.success("注册成功,请登录");
      showPanel(1);
    } else if (opType.value == 1) {
      //登录
      if (params.rememberMe) {
        const loginInfo = {
          email: params.email,
          password: params.password,
          rememberMe: params.rememberMe,
        };
        proxy.VueCookies.set("loginInfo", loginInfo, "7d");
      } else {
        proxy.VueCookies.remove("loginInfo");
      }
      dialogConfig.show = false;
      proxy.Message.success("登录成功");
      //存储cookie
      proxy.VueCookies.set("userInfo", result.data, 0);
      //重定向到原始页面
      const redirectUrl = route.query.redirectUrl || "/";
      router.push(redirectUrl);
    } else if (opType.value == 2) {
      //重置密码
      proxy.Message.success("重置密码成功,请登录");
      showPanel(1);
    }
  });
};

const closeDialog = () => {
  dialogConfig.show = false;
};

//QQ登录
const qqLogin = async () => {
  let result = await proxy.Request({
    url: api.qqlogin,
    params: {
      callbackUrl: route.query.redirectUrl || "",
    },
  });
  if (!result) {
    return;
  }
  proxy.VueCookies.remove("userInfo");
  document.location.href = result.data;
};
</script>

<style lang="scss" scoped>
.login-body {
  height: calc(100vh);
  background-size: cover;
  background: url("../assets/login_bg.jpg");
  display: flex;

  .bg {
    flex: 1;
    background-size: cover;
    background-position: center;
    background-size: 800px;
    background-repeat: no-repeat;
    background-image: url("../assets/login_img.png");
  }

  .login-panel {
    width: 430px;
    margin-right: 15%;
    margin-top: calc((100vh - 500px) / 2);

    .login-register {
      padding: 25px;
      background: #fff;
      border-radius: 5px;

      .login-title {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
      }

      .send-emali-panel {
        display: flex;
        width: 100%;
        justify-content: space-between;

        .send-mail-btn {
          margin-left: 5px;
        }
      }

      .rememberme-panel {
        width: 100%;
      }

      .no-account {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }

      .op-btn {
        width: 100%;
      }
    }
  }

  .check-code-panel {
    width: 100%;
    display: flex;

    .check-code {
      margin-left: 5px;
      cursor: pointer;
    }
  }

  .login-btn-qq {
    margin-top: 20px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      cursor: pointer;
      margin-left: 10px;
      width: 20px;
    }
  }

  .icp {
    text-align: center;
    padding-top: 9%;

    a {
      color: white;
    }
  }
}
</style>


<!--
 * @Description: 一个文件上传的功能组件，包括了文件列表展示、上传进度展示、文件状态展示等功能
 * @FilePath: \src\views\main\Uploader.vue
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 19:35:55
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-12-15 02:37:29
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
-->
<template>
  <div class="uploader-panel">
    <div class="uploader-title">
      <span>上传任务</span>
      <span class="tips">（仅展示本次上传任务）</span>
    </div>
    <div class="file-list">
      <div v-for="(item, index) in fileList" class="file-item">
        <div class="upload-panel">
          <div class="file-name">
            {{ item.fileName }}
          </div>
          <div class="progress">
            <!--上传-->
            <el-progress
                v-if="
                item.status == STATUS.uploading.value ||
                item.status == STATUS.upload_seconds.value ||
                item.status == STATUS.upload_finish.value
              "
                :percentage="item.uploadProgress"
            />
          </div>
          <div class="upload-status">
            <!--图标-->
            <span
                :class="['iconfont', 'icon-' + STATUS[item.status].icon]"
                :style="{ color: STATUS[item.status].color }"
            ></span>
            <!--状态描述-->
            <span
                :style="{ color: STATUS[item.status].color }"
                class="status"
            >{{
                item.status == "fail" ? item.errorMsg : STATUS[item.status].desc
              }}</span
            >
            <!--上传中-->
            <span
                v-if="item.status == STATUS.uploading.value"
                class="upload-info"
            >
              {{ sizeTostr(item.uploadSize) }}/{{ sizeTostr(item.totalSize) }}
            </span>
          </div>
        </div>
        <div class="op">
          <!--MD5-->
          <el-progress
              v-if="item.status == STATUS.init.value"
              :percentage="item.md5Progress"
              :width="50"
              type="circle"
          />
          <div class="op-btn">
            <span v-if="item.status === STATUS.uploading.value">
              <icon
                  v-if="item.pause"
                  :width="28"
                  class="btn-item"
                  iconName="upload"
                  title="上传"
                  @click="startUpload(item.uid)"
              ></icon>
              <icon
                  v-else
                  :width="28"
                  class="btn-item"
                  iconName="pause"
                  title="暂停"
                  @click="pauseUpload(item.uid)"
              ></icon>
            </span>
            <icon
                v-if="
                item.status != STATUS.init.value &&
                item.status != STATUS.upload_finish.value &&
                item.status != STATUS.upload_seconds.value
              "
                :width="28"
                class="del btn-item"
                iconName="del"
                title="删除"
                @click="delUpload(item.uid, index)"
            ></icon>
            <icon
                v-if="
                item.status == STATUS.upload_finish.value ||
                item.status == STATUS.upload_seconds.value
              "
                :width="28"
                class="clean btn-item"
                iconName="clean"
                title="清除"
                @click="delUpload(item.uid, index)"
            ></icon>
          </div>
        </div>
      </div>
      <div v-if="fileList.length == 0">
        <NoData msg="暂无上传任务"></NoData>
      </div>
    </div>
  </div>
</template>

<script setup>
import {getCurrentInstance, ref} from "vue";
import SparkMD5 from "spark-md5";

const {proxy} = getCurrentInstance();

const STATUS = {
  emptyfile: {
    value: "emptyfile",
    desc: "文件为空",
    color: "#F75000",
    icon: "close",
  },
  fail: {
    value: "fail",
    desc: "上传失败",
    color: "#F75000",
    icon: "close",
  },
  init: {
    value: "init",
    desc: "解析中",
    color: "#e6a23c",
    icon: "clock",
  },
  uploading: {
    value: "uploading",
    desc: "上传中",
    color: "#409eff",
    icon: "upload",
  },
  upload_finish: {
    value: "upload_finish",
    desc: "上传完成",
    color: "#67c23a",
    icon: "ok",
  },
  upload_seconds: {
    value: "upload_seconds",
    desc: "秒传",
    color: "#67c23a",
    icon: "ok",
  },
};

const chunkSize = 1024 * 1024 * 5;
const fileList = ref([]);
const delList = ref([]);

const addFile = async (file, filePid) => {
  const fileItem = {
    file: file,
    //文件UID
    uid: file.uid,
    //md5进度
    md5Progress: 0,
    //md5值
    md5: null,
    //文件名
    fileName: file.name,
    //上传状态
    status: STATUS.init.value,
    //已上传大小
    uploadSize: 0,
    //文件总大小
    totalSize: file.size,
    //进度
    uploadProgress: 0,
    //暂停
    pause: false,
    //当前分片
    chunkIndex: 0,
    //父级ID
    filePid: filePid,
    //错误信息
    errorMsg: null,
  };
  //加入文件
  fileList.value.unshift(fileItem);
  if (fileItem.totalSize == 0) {
    fileItem.status = STATUS.emptyfile.value;
    return;
  }
  //文件MD5
  let md5FileUid = await computeMD5(fileItem);
  if (md5FileUid == null) {
    return;
  }
  uploadFile(md5FileUid);
};
defineExpose({addFile});

//开始上传
const startUpload = (uid) => {
  let currentFile = getFileByUid(uid);
  currentFile.pause = false;
  uploadFile(uid, currentFile.chunkIndex);
};
//暂停上传
const pauseUpload = (uid) => {
  let currentFile = getFileByUid(uid);
  currentFile.pause = true;
};
//删除文件
const delUpload = (uid, index) => {
  delList.value.push(uid);
  fileList.value.splice(index, 1);
};

const emit = defineEmits(["uploadCallback"]);
const uploadFile = async (uid, chunkIndex) => {
  chunkIndex = chunkIndex ? chunkIndex : 0;
  //分片上传
  let currentFile = getFileByUid(uid);
  const file = currentFile.file;
  const fileSize = currentFile.totalSize;
  const chunks = Math.ceil(fileSize / chunkSize);
  for (let i = chunkIndex; i < chunks; i++) {
    let delIndex = delList.value.indexOf(uid);
    if (delIndex != -1) {
      delList.value.splice(delIndex, 1);
      // console.log(delList.value);
      break;
    }
    currentFile = getFileByUid(uid);
    if (currentFile.pause) {
      break;
    }
    let start = i * chunkSize;
    let end = start + chunkSize >= fileSize ? fileSize : start + chunkSize;
    let chunkFile = file.slice(start, end);
    let uploadResult = await proxy.Request({
      url: "/file/uploadFile",
      showLoading: false,
      dataType: "file",
      params: {
        file: chunkFile,
        fileName: file.name,
        fileMd5: currentFile.md5,
        chunkIndex: i,
        chunks: chunks,
        fileId: currentFile.fileId,
        filePid: currentFile.filePid,
      },
      showError: false,
      errorCallback: (errorMsg) => {
        currentFile.status = STATUS.fail.value;
        currentFile.errorMsg = errorMsg;
      },
      uploadProgressCallback: (event) => {
        let loaded = event.loaded;
        if (loaded > fileSize) {
          loaded = fileSize;
        }
        currentFile.uploadSize = i * chunkSize + loaded;
        currentFile.uploadProgress = Math.floor(
            (currentFile.uploadSize / fileSize) * 100
        );
      },
    });
    if (uploadResult == null) {
      break;
    }
    currentFile.fileId = uploadResult.data.fileId;
    currentFile.status = STATUS[uploadResult.data.status].value;
    currentFile.chunkIndex = i;
    if (
        uploadResult.data.status == STATUS.upload_seconds.value ||
        uploadResult.data.status == STATUS.upload_finish.value
    ) {
      currentFile.uploadProgress = 100;
      emit("uploadCallback");
      break;
    }
  }
};

const computeMD5 = (fileItem) => {
  let file = fileItem.file;
  let blobSlice =
      File.prototype.slice ||
      File.prototype.mozSlice ||
      File.prototype.webkitSlice;
  let chunks = Math.ceil(file.size / chunkSize);
  let currentChunk = 0;
  let spark = new SparkMD5.ArrayBuffer();
  let fileReader = new FileReader();
  let time = new Date().getTime();


  let loadNext = () => {
    let start = currentChunk * chunkSize;
    let end = start + chunkSize >= file.size ? file.size : start + chunkSize;
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  };

  loadNext();
  return new Promise((resolve, reject) => {
    let resultFile = getFileByUid(file.uid);
    fileReader.onload = (e) => {
      spark.append(e.target.result); // Append array buffer
      currentChunk++;
      if (currentChunk < chunks) {
        console.log(
            `第${file.name},${currentChunk}分片解析完成, 开始第${
                currentChunk + 1
            } / ${chunks}分片解析`
        );
        let percent = Math.floor((currentChunk / chunks) * 100);
        resultFile.md5Progress = percent;
        loadNext();
      } else {
        let md5 = spark.end();
        console.log(
            `MD5计算完成：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${
                file.size
            } 用时：${new Date().getTime() - time} ms`
        );
        spark.destroy(); //释放缓存
        resultFile.md5Progress = 100;
        resultFile.status = STATUS.uploading.value;
        resultFile.md5 = md5;
        resolve(fileItem.uid);
      }
    };
    fileReader.onerror = () => {
      resultFile.md5Progress = -1;
      resultFile.status = STATUS.fail.value;
      resolve(fileItem.uid);
    };
  }).catch((error) => {
    return null;
  });
};

//获取文件
const getFileByUid = (uid) => {
  let file = fileList.value.find((item) => {
    return item.file.uid === uid;
  });
  return file;
};

//字节转为M
const sizeTostr = (size) => {
  var data = "";
  if (size < 0.1 * 1024) {
    //如果小于0.1KB转化成B
    data = size.toFixed(2) + "B";
  } else if (size < 0.1 * 1024 * 1024) {
    //如果小于0.1MB转化成KB
    data = (size / 1024).toFixed(2) + "KB";
  } else if (size < 1024 * 1024 * 1024) {
    //如果小于1GB转化成MB
    data = (size / (1024 * 1024)).toFixed(2) + "MB";
  } else {
    //其他转化成GB
    data = (size / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  }
  var sizestr = data + "";
  var len = sizestr.indexOf(".");
  var dec = sizestr.substr(len + 1, 2);
  if (dec == "00") {
    //当小数点后为00时 去掉小数部分
    return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
  }
  return sizestr;
};
</script>

<style lang="scss" scoped>
.uploader-panel {
  .uploader-title {
    border-bottom: 1px solid #ddd;
    line-height: 40px;
    padding: 0px 10px;
    font-size: 15px;

    .tips {
      font-size: 13px;
      color: rgb(169, 169, 169);
    }
  }

  .file-list {
    overflow: auto;
    padding: 10px 0px;
    min-height: calc(100vh / 2);
    max-height: calc(100vh - 120px);

    .file-item {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 3px 10px;
      background-color: #fff;
      border-bottom: 1px solid #ddd;
    }

    .file-item:nth-child(even) {
      background-color: #fcf8f4;
    }

    .upload-panel {
      flex: 1;

      .file-name {
        color: rgb(64, 62, 62);
      }

      .upload-status {
        display: flex;
        align-items: center;
        margin-top: 5px;

        .iconfont {
          margin-right: 3px;
        }

        .status {
          color: red;
          font-size: 13px;
        }

        .upload-info {
          margin-left: 5px;
          font-size: 12px;
          color: rgb(112, 111, 111);
        }
      }

      .progress {
        height: 10px;
      }
    }

    .op {
      width: 100px;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .op-btn {
        .btn-item {
          cursor: pointer;
        }

        .del,
        .clean {
          margin-left: 5px;
        }
      }
    }
  }
}
</style>


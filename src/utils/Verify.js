/*
 * @Description: 
 * @FilePath: \SkyBox-FE\src\utils\Verify.js
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 17:04:30
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-11-14 17:09:05
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
 */

// 一些正则表达式，用于验证不同类型的数据
const regs = {
    // 用于验证电子邮件地址的正则表达式
    email: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
    // 用于验证数字的正则表达式
    number: /^([0]|[1-9][0-9]*)$/,
    // 用于验证密码的正则表达式。该正则表达式要求密码至少包含一个数字和一个字母，可以包含特殊字符，并且长度至少为8位。
    password: /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*_]{8,}$/,
    // 用于验证分享码的正则表达式。该正则表达式要求分享码只能包含字母和数字。
    shareCode: /^[A-Za-z0-9]+$/
}

// 验证给定的值是否符合指定的正则表达式
const verify = (rule, value, reg, callback) => {
    if (value) {
        if (reg.test(value)) {
            callback()
        } else {
            callback(new Error(rule.message))
        }
    } else {
        callback()
    }
}

// 导出了一个包含多个验证方法的对象
export default {
    email: (rule, value, callback) => {
        return verify(rule, value, regs.email, callback)
    },
    number: (rule, value, callback) => {
        return verify(rule, value, regs.number, callback)
    },
    password: (rule, value, callback) => {
        return verify(rule, value, regs.password, callback)
    },
    shareCode: (rule, value, callback) => {
        return verify(rule, value, regs.shareCode, callback)
    },
}


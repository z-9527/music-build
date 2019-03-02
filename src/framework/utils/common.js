export function sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
}

export function round(num, len = 0) {
    return Math.round(num * Math.pow(10, len)) / Math.pow(10, len)
}

export const regex = {
    phone:/^((\+)?86|((\+)?86)?)0?1[345678]\d{9}$/,
    idCard:/^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/,
    password:/^[a-zA-Z0-9]{6,20}$/,
    generalChar: /^[\w\u4e00-\u9fa5_,.;/?]+$/gi,
    input:/^[\u4E00-\u9FA5A-Za-z0-9]{0,30}$/,
    phoneCaptcha:/^[0-9]{6}$/,
    input01:/^[\u4E00-\u9FA5A-Za-z0-9]{1,30}$/,
    fixedPhone:/^0\d{2,3}-?\d{7,8}$/
}

export const regexPrompt = {
    phonePrompt:"您输入的11位手机号码格式不正确",
    idCardPrompt:"请输入正确的身份证号",
    passwordPrompt:"请输入最少6位最多20位的密码(不包含特殊字符)",
    generalCharPrompt:"请输入6位数的验证码",
    inputPrompt:"请填写不超过30字的正确信息(不包含特殊字符)",
    phoneCaptchaPrompt:"请输入正确的6位手机验证码",
    fixedPhonePrompt:"请输入正确的固定电话号码"
}
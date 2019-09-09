export const ACCOUNT_RE = /^[a-z][a-z\d]{5,19}$/i

export const PASSWORD_RE = /^(?=[a-z]*\d)(?=\d*[a-z])[a-z\d]{6,20}$/i

export const TASK_NAME_RE = /^[\w\u4e00-\u9fa5]{1,20}$/

export const TASK_CONTENT_RE = /^(.|\n){1,200}$/
const crypto = require('crypto')

const createVerifyCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const codeLength = 6
  let code = ''

  for (let i = 0; i < codeLength; i++) {
    const index = crypto.randomInt(0, characters.length)
    code += characters[index]
  }

  return code
}

module.exports = createVerifyCode

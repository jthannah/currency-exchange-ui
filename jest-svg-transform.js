// Taken from https://github.com/visualfanatic/vue-svg-loader/issues/38

// eslint-disable-next-line @typescript-eslint/no-var-requires
const vueJest = require('@vue/compiler-sfc/dist')

module.exports = {
  process(content) {
    const { render } = vueJest({
      content,
      attrs: {
        functional: false,
      },
    })

    return `module.exports = { render: ${render} }`
  },
}

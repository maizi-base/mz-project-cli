const assert = require('assert').strict

describe('test require mz-project-cli-config', () => {
  const config = require('mz-project-cli-config')
  it('config is not null', () => {
    assert.notEqual(config, null)
  })
  it('config has egg-simple boilerplate', () => {
    const blpName = config.boilerplate['egg-simple'].blpName
    assert.equal(blpName, 'egg-boilerplate-simple')
  })
})
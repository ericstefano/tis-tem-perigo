import { describe, expect, it } from 'vitest'
import { createPage, setup } from '@nuxt/test-utils/e2e'

await setup({
  browser: true,
  dev: true,
  server: true,
  browserOptions: {
    type: 'chromium',
  },
})

describe('e2e example suite', async () => {
  it('e2e example test', async () => {
    const page = await createPage('/', {})
    const text = await page.getByRole('button', { name: 'Ver alertas' }).textContent()
    expect(text).toContain('Comece agora')
    await page.close()
  })
})

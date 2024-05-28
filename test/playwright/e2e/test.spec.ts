import { expect, test } from '@nuxt/test-utils/playwright'

test.use({
  geolocation: { longitude: 41.890221, latitude: 12.492348 },
  permissions: ['geolocation'],
})

test('should render', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const text = page.getByRole('heading', { level: 1, name: /insira sua chave de api/i })
  await expect(text).toBeVisible()
  await page.close()
})

test('should open config', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const text = page.getByRole('heading', { level: 1, name: /insira sua chave de api/i })
  await expect(text).toBeVisible()
  await page.getByRole('button', { name: /settings/i }).click()
  const settings = page.getByRole('heading', { level: 1, name: /configurações/i })
  await expect(settings).toBeVisible()
  await page.close()
})

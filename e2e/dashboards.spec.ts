import { test, expect } from '@playwright/test'

test.describe('Dashboard Pages', () => {
  test('Homepage should be accessible', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Neural Palette/)
  })

  test('Identity Dashboard should load', async ({ page }) => {
    await page.goto('/dashboard/identity')
    await expect(page.getByText('Neural Identity')).toBeVisible()
  })

  test('Palette Dashboard should load', async ({ page }) => {
    await page.goto('/dashboard/palette')
    await expect(page.getByText('Neural Palette')).toBeVisible()
  })

  test('Muse Dashboard should load', async ({ page }) => {
    await page.goto('/dashboard/muse')
    await expect(page.getByText('Neural Muse')).toBeVisible()
  })

  test('Echo Dashboard should load and display stats', async ({ page }) => {
    await page.goto('/dashboard/echo')
    await expect(page.getByText('Neural Echo')).toBeVisible()
    await expect(page.getByText('総メッセージ数')).toBeVisible()
    await expect(page.getByText('AI応答済み')).toBeVisible()
  })

  test('Publisher Dashboard should load and display stats', async ({ page }) => {
    await page.goto('/dashboard/publisher')
    await expect(page.getByText('Neural Publisher')).toBeVisible()
    await expect(page.getByText('総配信数')).toBeVisible()
  })

  test('Connector Dashboard should load', async ({ page }) => {
    await page.goto('/dashboard/connector')
    await expect(page.getByText('Neural Connector')).toBeVisible()
  })

  test('Sentinel Dashboard should load', async ({ page }) => {
    await page.goto('/dashboard/sentinel')
    await expect(page.getByText('Neural Sentinel')).toBeVisible()
  })

  test('Sidebar navigation should work', async ({ page }) => {
    await page.goto('/')

    // Click Neural Muse link
    await page.click('text=Neural Muse')
    await expect(page).toHaveURL(/\/dashboard\/muse/)

    // Click Neural Echo link
    await page.click('text=Neural Echo')
    await expect(page).toHaveURL(/\/dashboard\/echo/)
  })
})

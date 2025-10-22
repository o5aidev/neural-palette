import { test, expect } from '@playwright/test'

test.describe('Dashboard Pages', () => {
  test('Homepage should be accessible', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Neural Palette/)
  })

  test('Identity Dashboard should load', async ({ page }) => {
    await page.goto('/dashboard/identity')
    await expect(page.getByRole('heading', { name: 'Neural Identity' })).toBeVisible()
  })

  test('Palette Dashboard should load', async ({ page }) => {
    await page.goto('/dashboard/palette', { waitUntil: 'networkidle' })
    await expect(page.getByRole('heading', { name: 'Neural Palette' })).toBeVisible()
  })

  test('Muse Dashboard should load', async ({ page }) => {
    await page.goto('/dashboard/muse')
    await expect(page.getByRole('heading', { name: 'Neural Muse' })).toBeVisible()
  })

  test('Echo Dashboard should load and display stats', async ({ page }) => {
    await page.goto('/dashboard/echo')
    await expect(page.getByRole('heading', { name: 'Neural Echo' })).toBeVisible()
    await expect(page.getByText('総メッセージ数')).toBeVisible()
    await expect(page.getByText('AI応答済み')).toBeVisible()
  })

  test('Publisher Dashboard should load and display stats', async ({ page }) => {
    await page.goto('/dashboard/publisher')
    await expect(page.getByRole('heading', { name: 'Neural Publisher' })).toBeVisible()
    await expect(page.getByText('総配信数')).toBeVisible()
  })

  test('Connector Dashboard should load', async ({ page }) => {
    await page.goto('/dashboard/connector')
    await expect(page.getByRole('heading', { name: 'Neural Connector' })).toBeVisible()
  })

  test('Sentinel Dashboard should load', async ({ page }) => {
    await page.goto('/dashboard/sentinel')
    await expect(page.getByRole('heading', { name: 'Neural Sentinel' })).toBeVisible()
  })

  test('Sidebar navigation should work', async ({ page }) => {
    await page.goto('/dashboard/identity')

    // Click Neural Muse link in sidebar
    await page.getByRole('link', { name: /Neural Muse/ }).click()
    await expect(page).toHaveURL(/\/dashboard\/muse/)

    // Click Neural Echo link in sidebar
    await page.getByRole('link', { name: /Neural Echo/ }).click()
    await expect(page).toHaveURL(/\/dashboard\/echo/)
  })
})

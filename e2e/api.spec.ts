import { test, expect } from '@playwright/test'

test.describe('API Endpoints', () => {
  test('GET /api/identity - should return artist identity', async ({ request }) => {
    const response = await request.get('/api/identity')
    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    expect(data.success).toBe(true)
  })

  test('GET /api/echo/stats - should return echo statistics', async ({ request }) => {
    const response = await request.get('/api/echo/stats')
    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data).toHaveProperty('totalMessages')
    expect(data.data).toHaveProperty('withResponse')
    expect(data.data).toHaveProperty('averageConfidence')
  })

  test('GET /api/publisher/stats - should return publisher statistics', async ({ request }) => {
    const response = await request.get('/api/publisher/stats')
    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data).toHaveProperty('totalDistributions')
    expect(data.data).toHaveProperty('publishedCount')
  })

  test('GET /api/connector/stats - should return connector statistics', async ({ request }) => {
    const response = await request.get('/api/connector/stats')
    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data).toHaveProperty('totalConnections')
    expect(data.data).toHaveProperty('totalPosts')
  })

  test('GET /api/sentinel/stats - should return sentinel statistics', async ({ request }) => {
    const response = await request.get('/api/sentinel/stats')
    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data).toHaveProperty('totalRights')
    expect(data.data).toHaveProperty('totalInfringements')
  })

  test('POST /api/echo/messages - should create fan message', async ({ request }) => {
    const response = await request.post('/api/echo/messages', {
      data: {
        content: 'Test fan message',
        platform: 'web'
      }
    })

    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data).toHaveProperty('id')
    expect(data.data).toHaveProperty('sentiment')
    expect(data.data).toHaveProperty('confidence')
  })
})

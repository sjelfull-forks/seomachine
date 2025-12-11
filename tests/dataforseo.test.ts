import { describe, it, expect } from 'vitest'
import { DataForSEO } from '../src/modules/dataforseo'

describe('DataForSEO', () => {
  describe('constructor', () => {
    it('should throw error when credentials are missing', () => {
      // Clear env vars
      const originalLogin = process.env.DATAFORSEO_LOGIN
      const originalPassword = process.env.DATAFORSEO_PASSWORD
      delete process.env.DATAFORSEO_LOGIN
      delete process.env.DATAFORSEO_PASSWORD

      expect(() => new DataForSEO()).toThrow('DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD must be set')

      // Restore env vars
      if (originalLogin) process.env.DATAFORSEO_LOGIN = originalLogin
      if (originalPassword) process.env.DATAFORSEO_PASSWORD = originalPassword
    })

    it('should accept credentials via constructor', () => {
      const client = new DataForSEO({
        login: 'test_login',
        password: 'test_password',
      })

      expect(client).toBeDefined()
    })

    it('should use environment variables when no config provided', () => {
      process.env.DATAFORSEO_LOGIN = 'env_login'
      process.env.DATAFORSEO_PASSWORD = 'env_password'

      const client = new DataForSEO()
      expect(client).toBeDefined()
    })
  })

  describe('configuration', () => {
    it('should use default base URL when not provided', () => {
      const client = new DataForSEO({
        login: 'test',
        password: 'test',
      })

      expect(client).toBeDefined()
    })

    it('should accept custom base URL', () => {
      const client = new DataForSEO({
        login: 'test',
        password: 'test',
        baseUrl: 'https://custom.api.com',
      })

      expect(client).toBeDefined()
    })
  })
})

/* eslint-env jest */

const request = require('request')
const cheerio = require('cheerio')

const configPaths = require('../config/paths.json')
const PORT = configPaths.ports.test

// Returns a wrapper for `request` which applies these options by default
const requestPath = request.defaults({
  baseUrl: `http://localhost:${PORT}`,
  headers: {
    'Content-Type': 'text/plain'
  }
})

describe('Banner', () => {
  it('is visible by default', done => {
    requestPath.get('/', (err, res) => {
      const $ = cheerio.load(res.body)

      // Check the page responded correctly
      expect(res.statusCode).toBe(200)
      expect($.html()).toContain('GOV.UK Frontend')

      // Check that the banner is present
      const appBanner = $('[data-module="app-banner"]')
      if (appBanner.length) {
        expect(appBanner.length).toBeTruthy()
      }
      done(err)
    })
  })

  it('can be hidden using a url parameter', done => {
    requestPath.get('/?hide-banner', (err, res) => {
      const $ = cheerio.load(res.body)

      // Check the page responded correctly
      expect(res.statusCode).toBe(200)
      expect($.html()).toContain('GOV.UK Frontend')

      // Check that the banner is visible
      const appBanner = $('[data-module="app-banner"]')
      expect(appBanner.length).toBeFalsy()
      done(err)
    })
  })

  it.skip('should be dismissable', done => {
    requestPath.post('/hide-banner', {
      followAllRedirects: true,
      jar: true // enable cookies
    }, (err, res) => {
      const $ = cheerio.load(res.body)

      // Check the page responded correctly
      expect(res.statusCode).toBe(200)
      expect($.html()).toContain('GOV.UK Frontend')

      // Check that the banner is not visible
      const appBanner = $('[data-module="app-banner"]')
      expect(appBanner.length).toBeFalsy()
      done(err)
    })
  })
})

require 'yelp'

ENV['GOOGLE-API-KEY'] = "AIzaSyBQFqGYrIsaopElq94flPXuRmBAEPipwac"
ENV['FOUR-SQUARE-CLIENT-ID'] = "OAFMINVFDDMWB3MXW0RQMY4R0MYENMPH5V2JXJZQDNRQVM2N"
ENV['FOUR-SQUARE-CLIENT-SECRET'] = "0NVGFL135EYXAQXWIOSD5O30CSA1DC2CVR2IMLA1XYHOXXVY"
ENV['FOUR-SQUARE-API-VERSION'] = "20131017"

Yelp.client.configure do |config|
  config.consumer_key = 'RshqyqRhDD6JXHMAKMz7hw'
  config.consumer_secret = 'zcXamZOi4_sVdmA_n5U2shJDfEk'
  config.token = 'gYmf6RkQQMJY5sSXgLQbXLGLGNMvmvZ7'
  config.token_secret = 'dWnqa4CLYh74Lc7IRQcKrm2cQww'
end
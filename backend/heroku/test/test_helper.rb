ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
  def generate_random_string(len)
    token = SecureRandom.base64(len).tr('+/=', 'Qrt')
  end

  def sanitize_hash(h)
    JSON.parse(h.to_json)
  end
end
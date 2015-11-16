ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
# require "mocha"

class ActiveSupport::TestCase
  require "mocha/mini_test"

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all
  self.use_transactional_fixtures = true

  # Add more helper methods to be used by all tests here...
  def generate_random_string(len)
    token = SecureRandom.base64(len).tr('+/=', 'Qrt')
  end

  def sanitize_hash(h)
    JSON.parse(h.to_json)
  end

  def validate_error_response(err, code)
    validate_response(err, code)
  end

  def validate_success_response(msg)
    validate_response(msg, 200)
  end

  def validate_response(msg, code)
    exp_response_body = sanitize_hash(msg)
    act_response_body = JSON.parse(response.body)
    assert response.status == code
    assert act_response_body == exp_response_body
  end
end
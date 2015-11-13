require 'test_helper'

class SessionsIntegrationTest < ActionController::TestCase

  def setup
    SessionsController.any_instance.stubs(:send_notification).returns(nil)
    @device_token = '12345678'
    request.headers['Device-Token'] = @device_token

    @controller = SessionsController.new
    @user_1 = users(:user_1)
    @correct_password = 'test'
    @request_body = {
                      login: {
                        email: @user_1.email,
                        password: @correct_password
                      }
                    }
  end

  test 'should not log in if no device token in request header' do
    request.headers['Device-Token'] = nil
    post_request(:create, @request_body)
    validate_error_response({errors: 'No Device Token'}, 400)
  end

  test 'should not log in if email is not found' do
    @request_body[:login][:email] = 'BadEmail@test.com'
    post_request(:create, @request_body)
    validate_error_response({errors: 'User With Email Not Found'}, 404)
  end

  test 'should not log in if password is incorrect' do
    @request_body[:login][:password] = 'BadPassword'
    post_request(:create, @request_body)
    validate_error_response({errors: 'Incorrect Password'}, 400)
  end

  # Skip testing (not saved). Not producable via real data. Tested in controller tests

  test 'should log in successfully' do
    new_login_token = 'pYSjnnZt99kLslv2GiJtegtt'
    SecureRandom.stubs(:base64).returns(new_login_token)
    post_request(:create, @request_body)
    exp_msg = {
                token: new_login_token,
                user: @user_1.basic_info
              }
    validate_success_response(exp_msg)
  end

  # :destroy
  test 'should log out successfully' do
    log_in_as(:user_1)
    delete_request(:destroy)
    validate_success_response({message: 'Logout Successful'})
  end

  private
  def post_request(action, request)
    post action, request
  end

  def delete_request(action)
    delete action
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

 def log_in_as(uid)
    request.headers["Authorization"] = ActionController::HttpAuthentication::Token.
                                         encode_credentials(users(uid).api_key)
  end
end
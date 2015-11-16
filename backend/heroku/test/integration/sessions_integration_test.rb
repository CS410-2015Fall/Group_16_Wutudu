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

  test 'should log in successfully' do
    new_login_token = 'pYSjnnZt99kLslv2GiJtegtt'
    SecureRandom.stubs(:base64).returns(new_login_token)
    post_request(:create, @request_body)
    @user_1.reload
    exp_msg = {
                token: new_login_token,
                user: @user_1.basic_info
              }
    validate_success_response(exp_msg)

    assert_equal new_login_token, @user_1.api_key 
    assert_equal @device_token, @user_1.device_token
  end

  test 'should log out successfully' do
    log_in_as(@user_1)
    delete_request(:destroy)
    @user_1.reload

    validate_success_response({message: 'Logout Successful'})

    assert_nil @user_1.api_key
    assert_nil @user_1.device_token
  end

  private
  def post_request(action, request)
    post action, request
  end

  def delete_request(action)
    delete action
  end

  def log_in_as(user)
    request.headers["Authorization"] = ActionController::HttpAuthentication::Token.
                                         encode_credentials(user.api_key)
  end
end
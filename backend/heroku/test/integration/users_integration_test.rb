require 'test_helper'

class UsersIntegrationTest < ActionController::TestCase
  def setup
    @user1 = users(:user_1)
    @controller = UsersController.new
    request.headers["Authorization"] = ActionController::HttpAuthentication::Token.encode_credentials(users(:user_1).api_key)
    request.headers["Content-Type"] = "application/json"

    # Params used
    @email = '' << generate_random_string(10) << '@test.com'
    @name = generate_random_string(10)
    @password = generate_random_string(15)
    @request_body = {user: {email: @email, name: @name, password: @password}}
    @device_token = generate_random_string(64)
    request.headers["Device-Token"] = @device_token
  end

  # helper functions
  test "should restrict access without a proper token" do
    request.headers["Authorization"] = nil
    get :show
    assert_equal 401, response.status
  end

  test "user_email_exist? should work" do
    @controller = UsersController.new
    assert @controller.send(:user_email_exist?, @user1.email)
    new_email = '' << generate_random_string(20) << '@test.com'
    assert_not @controller.send(:user_email_exist?, new_email)
  end

  # :show
  test "should return user info" do
    get :show
    validate_success_response({user: @user1.basic_info})
  end

  # :create
  test "should create new user successfully" do
    new_login_token = 'pYSjnnZt99kLslv2GiJtegtt'
    SecureRandom.stubs(:base64).returns(new_login_token)
    request.headers["Authorization"] = nil
    post_request_and_assert_diff_users(:create, @request_body, +1)
    new_user = User.find_by_email(@email)
    exp_body = {token: new_login_token, user: new_user.basic_info}
    validate_success_response(exp_body)
  end

  test "should not create user when email exists in db" do
    request.headers["Authorization"] = nil
    @request_body[:user][:email] = @user1.email
    post_request_and_assert_no_difference(:create, @request_body)
    validate_error_response({errors: 'Email Already Registered'}, 400)
  end

  test "should not create user when no device token passed" do
    request.headers["Authorization"] = nil
    request.headers["Device-Token"] = nil
    post_request_and_assert_no_difference(:create, @request_body)
    validate_error_response({errors: 'No Device Token'}, 400)
  end

  test "should not create user when params do not pass validations" do
    request.headers["Authorization"] = nil
    @request_body[:user][:email] = 'bademail'
    post_request_and_assert_no_difference(:create, @request_body)
    validate_error_response({errors: 'Failed To Create User - ["Email is not a valid email"]'}, 400)
  end

  private
  def post_request_and_assert_diff_users(action, request_body, diff)
    assert_difference 'User.count', diff do
      post action, request_body
    end
  end

  def post_request_and_assert_no_difference(action, request_body)
    assert_no_difference 'User.count', 'New User should not be created' do
      post action, request_body
    end
  end
end

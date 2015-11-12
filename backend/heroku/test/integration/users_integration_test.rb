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
    assert response.status == 401
  end

  test "user_email_exist? should work" do
    @controller = UsersController.new
    assert @controller.send(:user_email_exist?, @user1.email) == true
    new_email = '' << generate_random_string(20) << '@test.com'
    assert @controller.send(:user_email_exist?, new_email) == false
  end

  # :show
  test "should return user info" do
    get :show
    exp_response_body = sanitize_hash({user: @user1.basic_info})
    act_response_body = JSON.parse(response.body)
    assert response.status == 200
    assert act_response_body == exp_response_body
  end

  # :create
  test "should create new user successfully" do
    request.headers["Authorization"] = nil
    assert_difference('User.count', +1) do
      post :create, @request_body
    end
    assert response.status == 200
    response_body = JSON.parse(response.body)
    assert !response_body["token"].nil? && !response_body["token"].empty?
    assert !response_body["user"].nil? && \
           !response_body["user"]["id"].nil? &&\
           response_body["user"]["id"] != 0 &&\
           response_body["user"]["email"] == @email &&\
           response_body["user"]["name"] == @name

  end

  test "should not create user when email exists in db" do
    request.headers["Authorization"] = nil
    @request_body[:user][:email] = @user1.email
    assert_difference('User.count', 0) do
      post :create, @request_body
    end
    assert response.status == 400
    assert error_message(response.body) == 'Email Already Registered'
  end

  test "should not create user when no device token passed" do
    request.headers["Authorization"] = nil
    request.headers["Device-Token"] = nil
    assert_difference('User.count', 0) do
      post :create, @request_body
    end
    assert response.status == 400
    assert error_message(response.body) == 'No Device Token'
  end

  test "should not create user when params do not pass validations" do
    request.headers["Authorization"] = nil
    @request_body[:user][:email] = 'bademail'
    assert_difference('User.count', 0) do
      post :create, @request_body
    end
    assert response.status == 400
    assert error_message(response.body) == 'Failed To Create User - ["Email is not a valid email"]'
  end

  private

  def error_message(rbody)
    JSON.parse(rbody)['errors']
  end
end

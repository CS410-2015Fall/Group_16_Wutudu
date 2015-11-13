require 'test_helper'

class SessionsControllerTest < ActionController::TestCase
  def setup
    @user_1 = users(:user_1)
  end

  # :create
  test "should have correct error msg logic for :create and no device token" do
    test_create_setup
    request.headers["Device-Token"] = nil
    session_controller_expects_errors_msg('No Device Token', 400)
    post :create, @request_body
  end

  test "should have correct error msg logic for :create and email not found" do
    test_create_setup
    User.stubs(:exists?).returns(false)
    session_controller_expects_errors_msg('User With Email Not Found', 404)
    post :create, @request_body
  end

  test "should have correct error msg logic for :create and incorrect password" do
    test_create_setup
    User.any_instance.stubs(:bcrypt_password).returns('NotARealPassword')
    session_controller_expects_errors_msg('Incorrect Password', 400)
    post :create, @request_body
  end

  test "should have correct error msg logic for :create and fail to save user" do
    test_create_setup
    full_msgs = ['I hate unit tests']
    User.any_instance.stubs(:save).returns(false)
    User.any_instance.stubs(:errors).returns(stub(full_messages: full_msgs))
    session_controller_expects_errors_msg("Failed To Log In - #{full_msgs}", 400)
    post :create, @request_body
  end

  test "should have correct success msg logic for :create" do
    test_create_setup
    stub_msg = 'test'
    User.any_instance.stubs(:api_key).returns(stub_msg)
    User.any_instance.stubs(:basic_info).returns(stub_msg)

    session_controller_expects_success_msg
    post :create, @request_body
  end

  # :destroy
  test "should have correct error msg logic for :destroy and not saved correctly" do
    test_destroy_setup
    User.any_instance.stubs(:save).returns(false)
    session_controller_expects_errors_msg('Logout Failed', 400)
    delete :destroy
  end

  test "should have correct success msg logic for :destroy" do
    test_destroy_setup
    session_controller_expects_success_msg
    delete :destroy
  end

  private

  def test_create_setup
    plain_pswd = 'test'
    @request_body = {login: {email: @user_1.email, password: plain_pswd}}

    request.headers["Device-Token"] = '123'
    User.stubs(:exists?).returns(true)
    User.stubs(:find_by_email).returns(@user_1)
    User.any_instance.stubs(:bcrypt_password).returns(plain_pswd)
    User.any_instance.stubs(:renew_api_key).returns(nil)
    User.any_instance.stubs(:device_token=).returns(nil)
    User.any_instance.stubs(:save).returns(true)
  end

  def test_destroy_setup
    SessionsController.any_instance.stubs(:authenticate).returns(true)
    @controller.instance_variable_set(:@user, users(:user_1))
    User.any_instance.stubs(:api_key=).returns(nil)
    User.any_instance.stubs(:device_token=).returns(nil)
    User.any_instance.stubs(:save).returns(true)
  end

  def session_controller_expects_errors_msg(msg, code)
    SessionsController.any_instance.expects(:errors_msg).
      with(msg, code).returns({json: ''})
  end

  def session_controller_expects_success_msg
    SessionsController.any_instance.expects(:success_msg).returns({json: ''})
  end
end

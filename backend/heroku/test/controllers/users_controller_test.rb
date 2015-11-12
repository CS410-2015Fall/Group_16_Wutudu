require 'test_helper'

class UsersControllerTest < ActionController::TestCase
  def setup
    request.headers["Content-Type"] = "application/json"
    UsersController.any_instance.stubs(:authenticate).returns(nil)
    @controller.instance_variable_set(:@user, users(:user_1))
  end

  # :show
  test "should have correct success msg logic for :show users" do
    UsersController.any_instance.expects(:success_msg).returns({json: ''})
    get :show, :format => :json
  end

  # :create
  test "should have correct error msg logic when :create and email already exists" do
    test_create_setup
    UsersController.any_instance.stubs(:user_email_exist?).returns(true)
    users_controller_expects_errors_msg("Email Already Registered", 400)
    post :create, {user: {name: '1', email: '1', password: '1'}}
  end

  test "should have correct error msg logic when :create and email no device token" do
    test_create_setup
    request.headers["Device-Token"] = nil
    users_controller_expects_errors_msg("No Device Token", 400)
    post :create, {user: {name: '1', email: '1', password: '1'}}
  end

  test "should have correct error msg logic when :create and fail to save user" do
    test_create_setup
    User.any_instance.stubs(:save).returns(nil)
    User.any_instance.stubs(:errors).returns(stub(full_messages: "Error Message"))
    users_controller_expects_errors_msg("Failed To Create User - Error Message", 400)
    post :create, {user: {name: '1', email: '1', password: '1'}}
  end

  test "should have correct success msg logic when :create" do
    test_create_setup
    users_controller_expects_success_msg
    post :create, {user: {name: '1', email: '1', password: '1'}}
  end

  private

  def test_create_setup
    UsersController.any_instance.stubs(:user_email_exist?).returns(false)
    request.headers["Device-Token"] = "test"
    User.any_instance.stubs(:new).returns(users(:user_1))
    User.any_instance.stubs(:save).returns(true)
  end

  def users_controller_expects_errors_msg(msg, code)
    UsersController.any_instance.expects(:errors_msg).
      with(msg, code).returns({json: ''})
  end

  def users_controller_expects_success_msg
    UsersController.any_instance.expects(:success_msg).returns({json: ''})
  end
end

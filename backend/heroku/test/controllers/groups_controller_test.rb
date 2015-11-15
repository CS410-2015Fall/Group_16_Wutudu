require 'test_helper'

class GroupsControllerTest < ActionController::TestCase
  def setup
    request.headers["Content-Type"] = "application/json"
    GroupsController.any_instance.stubs(:send_users_notifications).returns(nil)
    GroupsController.any_instance.stubs(:authenticate).returns(nil)
    Group.any_instance.stubs(:save).returns(true)
    GroupUser.any_instance.stubs(:save).returns(true)
    @controller.instance_variable_set(:@user, users(:user_1))
    @request_body = {
                      group: {
                        name: 'test_group'
                      }
                    }
  end

  # :show
  test "should have correct succes msg logic for :show groups" do
    groups_controller_expects_success_msg
    get :show
  end

  # :create
  test "should have correct error msg logic for :create and group save fail" do
    test_create_setup
    Group.any_instance.stubs(:save).returns(false)
    groups_controller_expects_errors_msg('Failed To Create Group', 400)
    post :create, @request_body
  end

  test "should have correct error msg logic for :create and first group user save fail" do
    test_create_setup
    GroupUser.any_instance.stubs(:save).returns(false)
    groups_controller_expects_errors_msg('Failed To Create Group and Add User', 400)
    Group.any_instance.expects(:destroy).returns(true)
    post :create, @request_body
  end

  test "should have correct succes msg logic for :create when only no other users specified" do
    test_create_setup
    groups_controller_expects_success_msg
    post :create, @request_body
  end

  test "should have correct success msg logic for :create when add other users failed" do
    test_create_setup
    @request_body[:group][:emails] = ['RealEmail@test.com']
    Group.any_instance.stubs(:add_users_to_group).returns(["No Users Were Invited", 400, []] )
    groups_controller_expects_success_msg
    post :create, @request_body
  end

  test "should have correct success msg logic for :create when add all invited users succeed" do
    test_create_setup
    email = 'RealEmail@test.com'
    @request_body[:group][:emails] = [email]
    Group.any_instance.stubs(:add_users_to_group).returns([{message: "Only Some Users Were Invited"}, 200, [email]])
    groups_controller_expects_success_msg
    post :create, @request_body
  end

  private
  def test_create_setup
    Group.stubs(:new).returns(groups(:group_1))
    Group.any_instance.stubs(:save).returns(true)
    Group.any_instance.stubs(:group_users).returns(stub(build: group_users(:group_1_user_1)))
    GroupUser.any_instance.stubs(:save).returns(true)
    GroupsController.any_instance.stubs(:add_user_to_group).returns(['Success', 200])
    Group.any_instance.stubs(:destroy).returns(true)
  end

  def groups_controller_expects_errors_msg(msg, code)
    GroupsController.any_instance.expects(:errors_msg).
      with(msg, code).returns({json: ''})
  end

  def groups_controller_expects_success_msg
    GroupsController.any_instance.expects(:success_msg).returns({json: ''})
  end
end

require 'test_helper'

class GroupUsersControllerTest < ActionController::TestCase
  def setup
    request.headers['Content-Type'] = 'application/json'
    GroupUsersController.any_instance.stubs(:client_in_group).returns(nil)
    GroupUsersController.any_instance.stubs(:authenticate).returns(nil)
    GroupUsersController.any_instance.stubs(:send_users_notifications).returns(nil)
    @controller.instance_variable_set(:@user, users(:user_1))
    @controller.instance_variable_set(:@group, groups(:group_1))
    @controller.instance_variable_set(:@g_user, group_users(:group_1_user_1))

    @request_body = {
                      gid: group_users(:group_1_user_1).id,
                      group_user: {
                        emails: ['test2@test.com', 'test3@test.com']
                      }
                    }
  end

  # client_in_group
  test 'should have error msg logic when user not in group' do
    GroupUsersController.any_instance.unstub(:client_in_group)
    User.any_instance.stubs(:groups).returns(stub(find_by_id: nil))
    group_users_controller_expects_errors_msg('Not In Group', 404)
    post :create, @request_body
  end

  # :create
  test 'should have correct error msg logic for :create and group save fail' do
    test_create_setup
    Group.any_instance.stubs(:add_users_to_group).returns(['Fail Message', 400, ['user2']])
    group_users_controller_expects_errors_msg('Fail Message', 400)
    post :create, @request_body
  end

  test 'should have correct success msg logic for :create' do
    test_create_setup
    group_users_controller_expects_success_msg
    post :create, @request_body
  end

  # :update
  test 'should have correct error msg logic for :update and already in group' do
    test_update_setup
    GroupUser.any_instance.stubs(:approved).returns(true)
    group_users_controller_expects_errors_msg('Already In Group', 400)
    post :update, @request_body
  end

  test 'should have correct error msg logic for :update and fail to join group' do
    test_update_setup
    GroupUser.any_instance.stubs(:save).returns(false)
    group_users_controller_expects_errors_msg('Failed To Join Group', 400)
    post :update, @request_body
  end

  test 'should have correct success msg logic for :update' do
    test_update_setup
    group_users_controller_expects_success_msg
    post :update, @request_body
  end

  # :destroy
  test 'should have correct success msg logic for :destroy and request declined' do
    test_destroy_setup(false)
    group_users_controller_expects_success_msg
    delete :destroy, @request_body
  end

  test 'should have correct success msg logic for :destroy' do
    test_destroy_setup(false)
    group_users_controller_expects_success_msg
    delete :destroy, @request_body
  end

  private
  def test_create_setup
    Group.any_instance.stubs(:add_users_to_group).returns(['Success', 200, []])
  end

  def test_update_setup
    GroupUser.any_instance.stubs(:approved).returns(false)
    GroupUser.any_instance.stubs(:save).returns(true)
  end

  def test_destroy_setup(approved)
    GroupUser.any_instance.stubs(:approved).returns(approved)
  end

  def group_users_controller_expects_errors_msg(msg, code)
    GroupUsersController.any_instance.expects(:errors_msg).
      with(msg, code).returns({json: ''})
  end

  def group_users_controller_expects_success_msg
    GroupUsersController.any_instance.expects(:success_msg).returns({json: ''})
  end
end

require 'test_helper'

class GroupUsersIntegrationTest < ActionController::TestCase

  def setup
    GroupUsersController.any_instance.stubs(:send_users_notifications).returns(nil)
    @controller = GroupUsersController.new
    @group_1 = groups(:group_1)
    @group_2 = groups(:group_2)
    create_user_list
    log_in_as(:user_1)
    @request_body = {
                      gid: @group_2.id,
                      group_user: {
                        emails: []
                      }
                   }
  end

  # user not in group
  test 'should return error msg when user not in group' do
    log_in_as(:user_4)
    post_request_and_assert_no_difference(:create, @request_body)
    validate_error_response({errors: 'Not In Group'}, 404)
  end

  # :create
  test 'should return error msg with :create and no users invited' do
    @request_body[:group_user][:emails] = [@users[:user_1], @users[:user_2], @users[:user_3]]
    post_request_and_assert_no_difference(:create, @request_body)
    validate_error_response({errors: 'No Users Were Invited'}, 400)
  end

  test 'should return success msg with :create and all users invited' do
    @request_body[:group_user][:emails] = [@users[:user_4].email, @users[:user_5].email]
    count = @request_body[:group_user][:emails].length
    post_request_and_assert_diff_group_users(:create, @request_body, +count)
    validate_success_response({group: @group_2.basic_info, message: 'All Users Invited'})
  end

  test 'should return success msg with :create and only some users invited' do
    @request_body[:group_user][:emails] = [@users[:user_4].email, 'NotRealEmail']
    count = @request_body[:group_user][:emails].length - 1
    post_request_and_assert_diff_group_users(:create, @request_body, +count)
    validate_success_response({group: @group_2.basic_info, message: 'Only Some Users Were Invited'})
  end

  # :update
  test 'should return error msg with :update and already in group' do
    @request_body[:group_user] = nil
    post_request_and_assert_no_difference(:update, @request_body)
    validate_error_response({errors: 'Already In Group'}, 400)
  end

  test 'should return success msg with :update and join group' do
    log_in_as(:user_3)
    g_2_u_3 = group_users(:group_2_user_3)
    assert_not g_2_u_3.approved
    @request_body = {gid: @group_2.id}
    post_request_and_assert_no_difference(:update, @request_body)
    validate_success_response({group: @group_2.basic_info, message: 'Group Joined'})
    g_2_u_3.reload
    assert g_2_u_3.approved
  end

  # :destroy
  test 'should return success msg with :delete and declined request' do
    log_in_as(:user_3)
    @request_body = {gid: @group_2.id}
    delete_request_and_assert_diff_group_users(:destroy, @request_body, -1)
    validate_success_response({group: @group_2.basic_info, message: 'Request Declined'})
  end

  test 'should return success msg with :delete and left group' do
    @request_body = {gid: @group_1.id}
    delete_request_and_assert_diff_group_users(:destroy, @request_body, -1)
    validate_success_response({group: @group_1.basic_info, message: 'Left Group'})
  end

  private
  def create_user_list
    @users = {
              user_1: users(:user_1),
              user_2: users(:user_2),
              user_3: users(:user_3),
              user_4: users(:user_4),
              user_5: users(:user_5)
             }
  end

  def log_in_as(uid)
    request.headers['Authorization'] = ActionController::HttpAuthentication::Token.
                                         encode_credentials(users(uid).api_key)
  end

  def search_for_group_with_name(g_name)
    Group.find_by_name(g_name)
  end

  def post_request_and_assert_no_difference(action, request_body)
    assert_no_difference 'GroupUser.count', 'New GroupUser should not be created' do
      post action, request_body
    end
  end

  def post_request_and_assert_diff_group_users(action, request_body, diff)
    assert_difference 'GroupUser.count', diff do
      post action, request_body
    end
  end

  def delete_request_and_assert_diff_group_users(action, request_body, diff)
    assert_difference 'GroupUser.count', diff do
      delete action, request_body
    end
  end
end
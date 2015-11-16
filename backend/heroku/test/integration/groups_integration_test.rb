require 'test_helper'

class GroupsIntegrationTest < ActionController::TestCase

  def setup
    GroupsController.any_instance.stubs(:send_users_notifications).returns(nil)
    @controller = GroupsController.new
    @group_1 = groups(:group_1)
    @group_2 = groups(:group_2)
    create_user_list
    log_in_as(:user_1)
    @group_name = 'GroupThatWillNeverBeDuplicated'
    @request_body = {
                     group: {
                       name: @group_name
                     }
                   }
  end

  # :show
  test 'should return success msg with user group infos' do
    exp_response = {
                    groups: {
                              active_groups: [@group_1.basic_info],
                              pending_groups: [@group_2.basic_info]
                            }
                  }
    post :show
    validate_success_response(exp_response)
  end

  # create
  test 'should return error msg with :create and fail to create group when group name is too long' do
    @request_body[:group][:name] = 'a' * 101
    post_request_and_assert_no_difference(:create, @request_body)
    validate_error_response({errors: 'Failed To Create Group'}, 400)
  end

  test 'should return success msg with :create with empty email' do

    post_request_and_assert_new_group(:create, @request_body)
    new_group = search_for_group_with_name(@group_name)
    assert new_group, 'New group should be created'
    if new_group
      validate_success_response({group: new_group.basic_info, message: 'Group Created'})
      assert_equal @group_name, new_group.name
      assert_equal [@users[:user_1]], new_group.active_users
    end
  end

  test 'should return success msg with :create and all users added to the group' do
    @request_body[:group][:emails] = [@users[:user_2].email, @users[:user_3].email]
    post_request_and_assert_new_group(:create, @request_body)
    new_group = Group.find_by_name(@group_name)
    assert new_group
    if new_group
      validate_success_response({group: new_group.basic_info, message: 'New Group Created And All Users Invited'})
      assert_equal @group_name, new_group.name
      assert_equal [@users[:user_1]], new_group.active_users
      assert_equal [@users[:user_2], @users[:user_3]], new_group.pending_users
    end
  end

  test 'should return success msg with :create and only valid users added to the group' do
    @request_body[:group][:emails] = [@users[:user_2].email, 'NotRealEmail@test.com']
    post_request_and_assert_new_group(:create, @request_body)
    new_group = Group.find_by_name(@group_name)
    assert new_group
    if new_group
      validate_success_response({group: new_group.basic_info, message: 'New Group Created And Only Some Users Were Invited'})
      assert_equal @group_name, new_group.name
      assert_equal [@users[:user_1]], new_group.active_users
      assert_equal [@users[:user_2]], new_group.pending_users
    end
  end

  test 'should return success msg with :create and all users add failed' do
    @request_body[:group][:emails] = ['NotRealEmail@test.com', 'IHateIntegrationTests@test.com']
    post_request_and_assert_new_group(:create, @request_body)
    new_group = Group.find_by_name(@group_name)
    assert new_group
    if new_group
      validate_success_response({group: new_group.basic_info, message: 'New Group Created And No Users Were Invited'})
      assert_equal @group_name, new_group.name
      assert_equal [@users[:user_1]], new_group.active_users
      assert_equal [], new_group.pending_users
    end
  end

  private
  def create_user_list
    @users = {
              user_1: users(:user_1),
              user_2: users(:user_2),
              user_3: users(:user_3),
              user_4: users(:user_4)
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
    assert_no_difference 'Group.count', 'New Group should not be created' do
      post action, request_body
    end
  end

  def post_request_and_assert_new_group(action, request_body)
    assert_difference 'Group.count', +1 do
      post action, request_body
    end
  end
end
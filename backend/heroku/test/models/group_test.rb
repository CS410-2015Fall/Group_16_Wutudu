require 'test_helper'

class GroupTest < ActiveSupport::TestCase
  def setup
    @user_1 = users(:user_1)
    @user_2 = users(:user_2)
    @user_3 = users(:user_3)
    @user_4 = users(:user_4)
    @group_1 = groups(:group_1)
    @success_msg = 'All Users Invited'
    @partial_msg = 'Only Some Users Were Invited'
  end

  test 'should not allow creating new group with name too long' do
    new_group = Group.new(name: 'a' * 101)
    assert_not new_group.save
  end

  test 'add_users_to_group should add all users that were not in group' do
    message, status, users = @group_1.add_users_to_group([@user_3.email, @user_4.email])
    assert message == {group: @group_1.basic_info, message: @success_msg}
    assert status == 200
    assert users == [@user_3, @user_4]
  end

  test 'add_users_to_group should not add any existing users' do
    message, status, users = @group_1.add_users_to_group([@user_1.email, @user_2.email])
    assert message == 'No Users Were Invited'
    assert status == 400
    assert users == []
  end

  test 'add_users_to_group should add only users that exists and not already in the group' do
    message, status, users = @group_1.add_users_to_group([@user_1.email, @user_3.email, @user_4.email])
    assert message == {group: @group_1.basic_info, message: @partial_msg}
    assert status == 200
    assert users == [@user_3, @user_4]
  end
end

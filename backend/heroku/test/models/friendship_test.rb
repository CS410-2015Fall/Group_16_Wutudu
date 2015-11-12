require 'test_helper'

class FriendshipTest < ActiveSupport::TestCase
  def setup
    @fship = Friendship.new(user_id: 100, friend_id: 101, approved: true)
  end

  def teardown
    @fship = nil
  end

  test 'should correctly validate valid friendship' do
    assert @fship.valid?
  end

  test 'should have user_id' do
    @fship.user_id = nil
    assert_not @fship.valid?
  end

  test 'should have friend_id' do
    @fship.friend_id = nil
    assert_not @fship.valid?
  end

  test 'should have approved' do
    @fship.approved = nil
    assert_not @fship.valid?
  end
end

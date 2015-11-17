require 'test_helper'

class FriendshipsControllerTest < ActionController::TestCase
  def setup
    create_user_list
    request.headers["Content-Type"] = "application/json"
    FriendshipsController.any_instance.stubs(:send_notification).returns(nil)
    FriendshipsController.any_instance.stubs(:authenticate).returns(nil)
    Friendship.any_instance.stubs(:save).returns(true)
    @controller.instance_variable_set(:@user, @users[:user_1])
  end

  # :show
  test "should have correct success msg logic for :show friendships" do
    friendships_controller_expects_success_msg
    get :show, :format => :json
  end

  # :create
  test "should have correct error msg logic when :create and already friend" do
    test_create_setup(1)
    friendships_controller_expects_errors_msg("Already A Friend", 400)
    post :create, {friendship: {email: '1'}}
  end

  test "should have correct error msg logic when :create and friend request already sent" do
    test_create_setup(2)
    friendships_controller_expects_errors_msg("Friend Request Already Sent", 400)
    post :create, {friendship: {email: '1'}}
  end

  test "should have correct error msg logic when :create and friend request exists" do
    test_create_setup(3)
    friendships_controller_expects_errors_msg("Existing Friend Request From User", 400)
    post :create, {friendship: {email: '1'}}
  end

  test "should have correct error msg logic when :create and friendship not saved" do
    test_create_setup(0)
    Friendship.any_instance.stubs(:save).returns(nil)
    friendships_controller_expects_errors_msg("Unable To Send Friend Request", 400)
    post :create, {friendship: {email: '1'}}
  end

  test "should have correct msg logic when :create and friendship was created successfully" do
    test_create_setup(0)
    friendships_controller_expects_success_msg
    post :create, {friendship: {email: '1'}}
  end

  # :update
  test "should have correct error msg logic when :update and friendship not found" do
    test_update_setup
    Friendship.stubs(:where).returns(stub(first: nil))
    friendships_controller_expects_errors_msg("Friend Request Not Found", 404)
    post :update, {friendship: {email: '1'}}
  end

  test "should have correct error msg logic when :update and already a friend" do
    test_update_setup
    Friendship.any_instance.stubs(:approved).returns(true)
    friendships_controller_expects_errors_msg("Already A Friend", 400)
    post :update, {friendship: {email: '1'}}
  end

  test "should have correct error msg logic when :update and friendship not saved" do
    test_update_setup
    Friendship.any_instance.stubs(:save).returns(nil)
    friendships_controller_expects_errors_msg("Unable To Accept Friend", 400)
    post :update, {friendship: {email: '1'}}
  end

  test "should have correct success msg logic when :update and friendship approved" do
    test_update_setup
    friendships_controller_expects_success_msg
    post :update, {friendship: {email: '1'}}
  end

  # :destroy
  test "should have correct error msg when :destroy and friendship not found" do
    test_destroy_setup(true)
    Friendship.stubs(:where).returns(stub(where: stub(first: nil)))
    friendships_controller_expects_errors_msg("Not A Friend", 404)
    delete :destroy, {friendship: {email: '1'}}
  end

  test "should have correct error msg when :destroy and already friend" do
    test_destroy_setup(true)
    FriendshipsController.any_instance.expects(:success_msg).
      with({message: "Unfriended"}).returns({json: ''})
    delete :destroy, {friendship: {email: '1'}}
  end

  test "should have correct success msg when :destroy and not a friend yet" do
    test_destroy_setup(false)
    FriendshipsController.any_instance.expects(:success_msg).
      with({message: "Request Declined/Cancelled"}).returns({json: ''})
    delete :destroy, {friendship: {email: '1'}}
  end

  test "should have correct error msg when requested friend not found" do
    User.stubs(:find_by_email).returns(nil)
    friendships_controller_expects_errors_msg("User With Email Not Found", 404)
    post :update, {friendship: {email: '1'}}
  end

  test "should have correct error msg when requested friend is yourself" do
    User.stubs(:find_by_email).returns(@users[:user_1])
    friendships_controller_expects_errors_msg("Cannot Send Friend Request To Yourself", 400)
    post :update, {friendship: {email: '1'}}
  end

  # private methods
  private
  def create_user_list
    @users = {
              user_1: users(:user_1),
              user_2: users(:user_2),
              user_3: users(:user_3),
              user_4: users(:user_4)
             }
  end

  def test_create_setup(cid)
    User.stubs(:find_by_email).returns(@users[:user_2])
    User.any_instance.stubs(:friendship_status).returns(cid)
  end

  def test_update_setup
    User.stubs(:find_by_email).returns(@users[:user_2])
    Friendship.stubs(:where).returns(stub(first: friendships(:friendship_1)))
    Friendship.any_instance.stubs(:approved).returns(false)
  end

  def test_destroy_setup(approved)
    User.stubs(:find_by_email).returns(@users[:user_2])
    Friendship.stubs(:where).returns(stub(where: stub(first: friendships(:friendship_1))))
    Friendship.any_instance.stubs(:approved).returns(approved)
  end

  def friendships_controller_expects_errors_msg(msg, code)
    FriendshipsController.any_instance.expects(:errors_msg).
      with(msg, code).returns({json: ''})
  end

  def friendships_controller_expects_success_msg
    FriendshipsController.any_instance.expects(:success_msg).returns({json: ''})
  end
end

require 'test_helper'

class FriendshipsIntegrationTest < ActionController::TestCase
  def setup
    FriendshipsController.any_instance.stubs(:send_notification).returns(nil)
    @controller = FriendshipsController.new
    create_user_list
    log_in_as(:user_1)
  end

  # auth/verification cases
  test "should return error msg if target user doesn't exist" do
    request_body = {
                     friendship: {
                       email: 'KevinTheGreat@kevin.com'
                     }
                   }
    post_request_and_assert_no_difference(:create, request_body)
    validate_error_response({errors: "User With Email Not Found"}, 404)
  end

  test "should return error msg if target user is yourself" do
    request_body = {
                     friendship: {
                       email: users(:user_1).email
                     }
                   }
    post_request_and_assert_no_difference(:create, request_body)
    validate_error_response({errors: "Cannot Send Friend Request To Yourself"}, 400)
  end

  # :show
  test "should retrieve friendship successfully" do
    exp_response = {
                     friendships: {
                       friends: [@users[:user_2].basic_info],
                       sent_requests: [@users[:user_3].basic_info],
                       received_requests: []
                     }
                   }
    assert_no_difference 'Friendship.count', 'New Friendship should not be created' do
      get :show
    end
    validate_success_response(exp_response)
  end

  # :create
  test "should return error msg to user when :create and already a friend" do
    request_body = {
                     friendship: {
                       email: @users[:user_2].email
                     }
                   }
    post_request_and_assert_no_difference(:create, request_body)
    validate_error_response({errors: "Already A Friend"}, 400)
  end

  test "should return error msg to user when :update and friend request already sent" do
    request_body = {
                     friendship: {
                       email: @users[:user_3].email
                     }
                   }
    post_request_and_assert_no_difference(:create, request_body)
    validate_error_response({errors: "Friend Request Already Sent"}, 400)
  end

  test "should return error msg to user when :update and friend request already received" do
    log_in_as(:user_2)
    request_body = {
                     friendship: {
                       email: @users[:user_3].email
                     }
                   }
    post_request_and_assert_no_difference(:create, request_body)
    validate_error_response({errors: "Existing Friend Request From User"}, 400)
  end

  test "should return error msg to user when :create and unable to save friendship" do
    request_body = {
                     friendship: {
                       email: @users[:user_4].email
                     }
                   }
    Friendship.any_instance.stubs(:save).returns(false)
    post_request_and_assert_no_difference(:create, request_body)
    validate_error_response({errors: "Unable To Send Friend Request"}, 400)
  end

  test "should correctly send friend request to new user" do
    request_body = {
                     friendship: {
                       email: @users[:user_4].email
                     }
                   }
    FriendshipsController.any_instance.expects(:send_notification).returns(nil)
    assert_difference('Friendship.count') do
      post :create, request_body
    end
    validate_success_response({message: "Friend Request Sent"})
  end

  # :update
  test "should return error msg to user when :update and friend request not found" do
    request_body = {
                     friendship: {
                       email: @users[:user_4].email
                     }
                   }
    post_request_and_assert_no_difference(:update, request_body)
    validate_error_response({errors: "Friend Request Not Found"}, 404)
  end

  test "should return error msg to user when :update and already a friend" do
    log_in_as(:user_2)
    request_body = {
                     friendship: {
                       email: @users[:user_1].email
                     }
                   }
    post_request_and_assert_no_difference(:update, request_body)
    validate_error_response({errors: "Already A Friend"}, 400)
  end

  test "should return error msg to user when :update and unable to accept friendship" do
    log_in_as(:user_3)
    request_body = {
                     friendship: {
                       email: @users[:user_1].email
                     }
                   }
    Friendship.any_instance.stubs(:save).returns(false)
    post_request_and_assert_no_difference(:update, request_body)
    validate_error_response({errors: "Unable To Accept Friend"}, 400)
    assert !friendships(:friendship_2).approved
  end

  test "should correctly accpet request from user" do
    log_in_as(:user_3)
    request_body = {
                     friendship: {
                       email: @users[:user_1].email
                     }
                   }
    FriendshipsController.any_instance.expects(:send_notification).returns(nil)
    post_request_and_assert_no_difference(:update, request_body)
    validate_success_response({message: "Friend Accepted"})
    assert friendships(:friendship_2).approved
  end

  # :destroy
  test "should return error msg to user when :destroy and not a friend" do
    request_body = {
                     friendship: {
                       email: @users[:user_4].email
                     }
                   }
    assert_no_difference 'Friendship.count', 'No Friendship should be destroyed' do
      delete :destroy, request_body
    end
    validate_error_response({errors: "Not A Friend"}, 404)
  end

  test "should successfully unfriend an existing friend" do
    request_body = {
                     friendship: {
                       email: @users[:user_2].email
                     }
                   }
    assert_difference 'Friendship.count', -1 do
      delete :destroy, request_body
    end
    validate_success_response({message: "Unfriended"})
  end

  test "should successfully delete a received friend request" do
    log_in_as(:user_3)
    request_body = {
                     friendship: {
                       email: @users[:user_1].email
                     }
                   }
    assert_difference 'Friendship.count', -1 do
      delete :destroy, request_body
    end
    validate_success_response({message: "Request Declined/Cancelled"})
  end

  test "should successfully delete a sent out friend request" do
    request_body = {
                     friendship: {
                       email: @users[:user_3].email
                     }
                   }
    assert_difference 'Friendship.count', -1 do
      delete :destroy, request_body
    end
    validate_success_response({message: "Request Declined/Cancelled"})
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
    request.headers["Authorization"] = ActionController::HttpAuthentication::Token.
                                         encode_credentials(users(uid).api_key)
  end

  def post_request_and_assert_no_difference(action, request_body)
    assert_no_difference 'Friendship.count', 'New Friendship should not be created' do
      post action, request_body
    end
  end
end
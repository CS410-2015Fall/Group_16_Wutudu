class FriendshipsController < ApiController
  before_action :authenticate
  before_action :friend_exists, :check_not_yourself, except: [:show]

  def show
    all_fships = {
                   friendships:
                     {
                       friends: @user.friends_short,
                       sent_requests: @user.pending_short,
                       received_requests: @user.requested_short
                     }
                 }
    return send_success(all_fships)
  end

  def create
    case @user.friendship_status(@friend.id)
    when 1
      return send_errors("Already A Friend", 400)
    when 2
      return send_errors("Friend Request Already Sent", 400)
    when 3
      return send_errors("Existing Friend Request From User", 400)
    else
      friendship = @user.friendships.build(friend_id: @friend.id, approved: false)
      return send_errors("Unable To Send Friend Request", 400) unless friendship.save
      # TODO add attribute to tell client which page to go to
      # eg state: 'group', so that client can do $state.go[data.state]
      if @friend.device_token
        payload = {
          state: 'friend'
        }
        send_notification([@friend.device_token], \
                          "You have received a friend request from #{@user.name}", \
                          payload)
      end
      return send_success({message: "Friend Request Sent"})
    end
  end


  def update
    friendship = Friendship.where(user_id: @friend.id, friend_id: @user.id).first
    return send_errors("Friend Request Not Found", 404) unless friendship
    return send_errors("Already A Friend", 400) if friendship.approved

    friendship.update(approved: true)
    return send_errors("Unable To Accept Friend", 400) unless friendship.save
    payload = {
      state: 'friend'
    }
    send_notification([@friend.device_token],\
                      "#{@user.name} is now your friend", payload)
    return send_success({message: "Friend Accepted"})
  end

  def destroy
    friendship = Friendship.where(user_id: [@user.id, @friend.id]).where(friend_id: [@user.id, @friend.id]).first
    return send_errors("Not A Friend", 404) unless friendship


    approved = friendship.approved
    friendship.destroy
    return (approved ? send_success({message: "Unfriended"}) : \
                       send_success({message: "Request Declined/Cancelled"}))
  end

  private

  def friend_email
    params.require(:friendship).require(:email)
  end

  def friend_exists
    @friend = User.find_by_email(friend_email)
    return send_errors("User With Email Not Found", 404) unless @friend
  end

  def check_not_yourself
    return send_errors("Cannot Send Friend Request To Yourself", 400) \
      if @user.id == @friend.id
  end
end

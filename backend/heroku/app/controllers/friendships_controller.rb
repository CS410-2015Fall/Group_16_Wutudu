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
    render success_msg(all_fships) and return
  end

  def create
    case @user.friendship_status(@friend.id)
    when 1
      render errors_msg("Already A Friend", 400) and return
    when 2
      render errors_msg("Friend Request Already Sent", 400) and return
    when 3
      render errors_msg("Existing Friend Request From User", 400) and return
    else
      friendship = @user.friendships.build(friend_id: @friend.id, approved: false)
      render errors_msg("Unable To Send Friend Request", 400) and return \
        unless friendship.save
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
      render success_msg({message: "Friend Request Sent"}) and return
    end
  end


  def update
    friendship = Friendship.where(user_id: @friend.id, friend_id: @user.id).first
    render errors_msg("Friend Request Not Found", 404) and return \
      unless friendship
    render errors_msg("Already A Friend", 400) and return \
      if friendship.approved

    friendship.update(approved: true)
    render errors_msg("Unable To Accept Friend", 400) and return \
      unless friendship.save
    payload = {
      state: 'friend'
    }
    send_notification([@friend.device_token],\
                      "#{@user.name} is now your friend", payload)
    render success_msg({message: "Friend Accepted"}) and return
  end

  def destroy
    friendship = Friendship.where(user_id: [@user.id, @friend.id]).where(friend_id: [@user.id, @friend.id]).first
    render errors_msg("Not A Friend", 404) and return \
      unless friendship

    approved = friendship.approved
    friendship.destroy
    render (approved ? success_msg({message: "Unfriended"}) : \
                       success_msg({message: "Request Declined/Cancelled"})) and return
  end

  private

  def friend_email
    params.require(:friendship).require(:email)
  end

  def friend_exists
    @friend = User.find_by_email(friend_email)
    render errors_msg("User With Email Not Found", 404) and return \
      unless @friend
  end

  def check_not_yourself
    render errors_msg("Cannot Send Friend Request To Yourself", 400) and return\
      if @user.id == @friend.id
  end
end

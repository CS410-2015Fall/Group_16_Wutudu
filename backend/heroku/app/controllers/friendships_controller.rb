class FriendshipsController < ApiController
  before_action :authenticate

  def show
    render json: {friendships:
                   {friends: @user.friends_short,
                    sent_requests: @user.pending_short,
                    received_requests: @user.requested_short
                   }
                 }
  end

  def create
    friend = User.find_by_email(friend_params[:email])
    if friend
      case @user.friendship_status(friend_params[:email])
      when 1
        render json: {errors: "Already A Friend"}, status: 400
      when 2
        render json: {errors: "Friend Request Already Sent"}, status: 400
      when 3
        render json: {errors: "Existing Friend Request From User"}, status: 400
      else
        friendship = @user.friendships.build(:friend_id => friend.id, :approved => false)
        if friendship.save
          render json: {message: "Friend Request Sent"}, status: 200
        else
          render json: {errors: "Unable To Send Friend Request"}, status: 400
        end
      end
    else
      render json: {errors: "User With Email Not Found"}, status: 404
    end
  end


  def update
    friend = User.find_by_email(friend_params[:email])
    if friend
      friendship = Friendship.where(user_id: friend.id, friend_id: @user.id).first
      if friendship
        if !friendship.approved
          friendship.update(approved: true)
          if friendship.save
            render json: {message: "Friend Accepted"}, status: 200
          else
            render json: {errors: "Unable To Accept Friend"}, status: 400
          end
        else
          render json: {errors: "Already A Friend"}, status: 400
        end
      else
        render json: {errors: "Friend Request Not Found"}, status: 404
      end
    else
      render json: {errors: "Friend Not Found"}, status: 404
    end  
  end

  def destroy
    friend = User.find_by_email(friend_params[:email])
    if friend
      friendship = Friendship.where(approved: true).where(user_id: [@user.id, friend.id]).where(friend_id: [@user.id, friend.id]).first
      friendship_to_decline = Friendship.where(approved: false).where(user_id: friend.id).where(friend_id: @user.id).first
      if friendship
        friendship.destroy
        render json: {message: "Unfriended"}, status: 200
      elsif friendship_to_decline
        friendship_to_decline.destroy
        render json: {message: "Request Declined"}, status: 200
      else
        render json: {errors: "Not A Friend"}, status: 400
      end
    else
      render json: {errors: "Friend Not Found"}, status: 404
    end
  end

  private

  def friend_params
    params.require(:friendship).permit(:email)
  end
end

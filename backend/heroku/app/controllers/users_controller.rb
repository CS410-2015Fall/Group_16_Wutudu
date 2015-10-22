class UsersController < ApiController
  before_action :authenticate, only: [:show, :update]

  def create
    return send_errors("Email Already Registered", 400) if user_email_exist?(user_params[:email])

    @user = User.new(user_params)
    return send_errors('Failed To Create User', 400) unless @user.save
    return send_success({token: @user.api_key})
  end

  def show
    return send_success({user: @user.basic_info})
  end

  private

  def user_email_exist?(email)
    User.exists?(email: email)
  end

  def user_params
    u = params.require(:user).permit(:name, :email, :password)
    [:name, :email, :password].each {|p| u.require(p)}
    u
  end
end

class UsersController < ApiController
  before_action :authenticate, only: [:show, :update]

  def create
    return send_errors("Email Already Registered", 400) if user_email_exist?(user_params[:email])

    return send_errors('No Device Token', 400) \
      unless request.headers["Device-Token"]

    @user = User.new(user_params)
    @user.device_token = request.headers["Device-Token"]
    return send_errors("Failed To Create User - #{user.errors.full_messages}", 400) unless @user.save
    return send_success({token: @user.api_key, user: @user.basic_info})
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

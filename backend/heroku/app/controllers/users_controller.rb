class UsersController < ApiController
  before_action :authenticate, only: [:show, :update]

  def show
    render success_msg({user: @user.basic_info}) and return
  end

  def create
    render errors_msg("Email Already Registered", 400) and return \
      if user_email_exist?(user_params[:email])

    render errors_msg('No Device Token', 400) and return \
      unless request.headers["Device-Token"]

    @user = User.new(user_params)
    @user.device_token = request.headers["Device-Token"]
    render errors_msg("Failed To Create User - #{@user.errors.full_messages}", 400) and return \
      unless @user.save
    render success_msg({token: @user.api_key, user: @user.basic_info}) and return
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

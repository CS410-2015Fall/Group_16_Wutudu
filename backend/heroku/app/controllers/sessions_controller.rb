class SessionsController < ApiController
  before_action :authenticate, only: [:destroy]

  def create
    render errors_msg('No Device Token', 400) and return\
      unless request.headers["Device-Token"]

    render errors_msg('User With Email Not Found', 404) and return\
      unless User.exists?(email: login_params[:email])

    @user = User.find_by_email(login_params[:email])
    render errors_msg('Incorrect Password', 400) and return\
      unless @user.bcrypt_password == login_params[:password]

    @user.renew_api_key
    @user.device_token = request.headers["Device-Token"]

    render errors_msg("Failed To Log In - #{@user.errors.full_messages}", 400) and return \
      unless @user.save
    render success_msg({token: @user.api_key, user: @user.basic_info}) and return
  end

  def destroy
    @user.api_key = nil
    @user.device_token = nil
    render errors_msg("Logout Failed", 400) and return \
      unless @user.save
    render success_msg({message: "Logout Successful"}) and return
  end

  private

  def login_params
    l = params.require(:login).permit(:email, :password)
    [:email, :password].each {|p| l.require(p)}
    l
  end
end

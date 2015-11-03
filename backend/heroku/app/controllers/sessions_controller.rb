class SessionsController < ApiController
  before_action :authenticate, only: [:destroy]

  def create
    return send_errors('User With Email Not Found', 404) \
      unless User.exists?(email: login_params[:email])

    @user = User.find_by_email(login_params[:email])

    return send_errors('Incorrect Password', 400) \
      unless @user.bcrypt_password == login_params[:password]

    return send_errors('No Device Token', 400) \
      unless request.headers["Device-Token"]

    @user.renew_api_key
    @user.device_token = request.headers["Device-Token"]
    return send_errors("Failed To Log In", 400) unless @user.save
    return send_success({token: @user.api_key, user: @user.basic_info})
  end

  def destroy
    @user.api_key = nil
    @user.device_token = nil
    return send_errors("Logout Failed", 400) unless @user.save
    return send_success({message: "Logout Successful"})
  end

  private

  def login_params
    l = params.require(:login).permit(:email, :password)
    [:email, :password].each {|p| l.require(p)}
    l
  end
end

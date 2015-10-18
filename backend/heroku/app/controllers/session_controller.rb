class SessionController < ApiController
  before_action :authenticate, only: [:destroy]

  def create
    if User.exists?(email: login_params[:email])
      @user = User.find_by_email(login_params[:email])
      if @user.bcrypt_password == login_params[:password]
        @user.renew_api_key
        render json: {token: @user.api_key}, status: 200
      else
        render json: {errors: 'Incorrect Password'}, status: 400
      end
    else
      render json: {errors: 'User With Email Not Found'}, status: 404
    end
  end

  def destroy
    @user.api_key = nil
    if @user.save
      render json: {message: "Logout Successful"}, status: 200
    else
      render json: {errors: "Logout Unsuccessful"}, status: 400
    end
  end

  private

  def login_params
    params.require(:login).permit(:email, :password)
  end
end

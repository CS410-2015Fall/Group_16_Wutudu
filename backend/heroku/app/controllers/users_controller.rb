class UsersController < ApiController
  respond_to :json
  before_action :authenticate, only: [:show, :update]

  def index
    render json: {errors: 'Resource not found'}
  end

  def create
    @user = User.new(user_params)
    if !user_email_exist?(user_params[:email])
      if @user.save
        render json: {token: @user.api_key}, status: 200
      else
        render json: {errors: 'Failed to create user'}, status: 400
      end
    else
      render json: {errors: "Email already registered"}, status: 400
    end
  end

  def show
    if @user
      render json: {user: {email: @user.email, name: @user.name}}
    else
      render json: {errors: "No user found"}, status: 404
    end
  end

  def login
    if user_email_exist?(login_params[:email])
      @user = User.find_by_email(login_params[:email])
      if @user.bcrypt_password == login_params[:password]
        render json: {token: @user.api_key}, status: 400
      else
        render json: {errors: 'Incorrect Password'}, status: 400
      end
    else
      render json: {errors: 'User With Email Not Found'}, status: 404
    end
  end

  private

  def user_email_exist?(email)
    User.exists?(email: email)
  end

  def login_params
    params.require(:login).permit(:email, :password)
  end

  def user_params
    params.require(:user).permit(:name, :email, :password)
  end
end

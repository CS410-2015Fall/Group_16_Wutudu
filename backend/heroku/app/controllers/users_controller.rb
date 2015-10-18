class UsersController < ApiController
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
    render json: {user: @user.basic_info}
  end

  private

  def user_email_exist?(email)
    User.exists?(email: email)
  end

  def user_params
    params.require(:user).permit(:name, :email, :password)
  end
end

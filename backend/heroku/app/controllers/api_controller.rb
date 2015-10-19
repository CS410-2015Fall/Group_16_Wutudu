class ApiController < ApplicationController
  def authenticate
    authenticate_or_request_with_http_token do |token, options|
      @user = User.where(api_key: token).first
    end
  end

  def send_success(return_msg)
    render json: return_msg, status: 200
  end

  def send_errors(err_msg, code)
    render json: {errors: err_msg}, status: code
  end
end

class ApiController < ApplicationController
  include GCMNotification

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

  def send_internal_error
    render json: {errors: 'Internal Server Error'}, status: 500
  end
end
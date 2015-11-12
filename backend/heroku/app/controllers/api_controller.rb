class ApiController < ApplicationController
  include GCMNotification

  respond_to :json

  def authenticate
    authenticate_or_request_with_http_token do |token, options|
      @user = User.where(api_key: token).first
    end
  end

  def success_msg(return_msg)
    {json: return_msg, status: 200}
  end

  def errors_msg(err_msg, code)
    {json: {errors: err_msg}, status: code}
  end

  def internal_error_msg
    {json: {errors: 'Internal Server Error'}, status: 500}
  end
end
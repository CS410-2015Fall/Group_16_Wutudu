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

  def send_internal_error
    render json: {errors: "Internal Server Error"}, status: 500
  end

  def send_notification(tokens, title, message, payload=nil)
    service = IonicPush::PushService.new(device_tokens: tokens)
    note = {
             alert: message,
             android: {
               title: title
             }
           }
    note[:android][:payload] = payload unless payload.nil?
    service.notify do note end
  end
end

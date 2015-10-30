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

  def send_notification(tokens, message, payload)
    gcm = GCM.new(ENV['GOOGLE-API-KEY'])
    options = {
                delay_while_idle: true,
                notification: {
                  style: "inbox",
                },
                data: {
                  title: "Wutudu",
                  message: message,
                }
              }
    options[:data].merge!(payload) if payload
    response = gcm.send(tokens, options)
  end
end
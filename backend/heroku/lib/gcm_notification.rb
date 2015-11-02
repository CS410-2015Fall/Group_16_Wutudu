module GCMNotification
  def send_notification(tokens, message, payload)
    gcm = GCM.new(ENV['GOOGLE-API-KEY'])
    options = {
                data: {
                  title: "Wutudu",
                  message: message
                }
              }
    options[:data].merge!(payload) if payload
    response = gcm.send(tokens, options)
  end
end
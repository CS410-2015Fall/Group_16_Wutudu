require File.dirname(__FILE__) + '/../gcm_notification'
include GCMNotification

def send_users_notifications(users)
  device_tokens = users.collect{|u| u.device_token}.compact
  unless device_tokens.empty?
    payload = {
      group: group.basic_info,
      state: 'group'
    }
    send_notification(device_tokens, \
                      "You have been invited to join Group #{group.name}", \
                      payload)
  end
end

desc "This task is called by the Heroku scheduler add-on"
task :send_reminders => :environment do
  all_we = WutuduEvent.all
  all_we.each do |we|
    device_tokens = all_we.accepted_users.collect{|au| au.device_token}.compact
    if device_tokens && !device_tokens.empty?
      message = 'You have an upcoming Wutudu event'
    end
  end
  puts "Sending Upcoming Wutudu Redminers"
  end
end
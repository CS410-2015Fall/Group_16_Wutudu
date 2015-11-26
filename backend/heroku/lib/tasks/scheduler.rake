require File.dirname(__FILE__) + '/../gcm_notification'
require 'time'
include GCMNotification

namespace :event_reminders do
  # send notification HOUR_TOL hours ahead of the event time
  HOUR_TOL = 12

  desc "This task sends Wutudu event reminders to accepted users that runs every 12 hours"
  task :send_reminders => :environment do
    all_we = WutuduEvent.all
    all_we.each do |we|
      e_time = Time.parse(we.event_time.to_s) if we.event_time
      device_tokens = we.accepted_users.collect{|au| au.device_token}.compact

      if !we.reminders_sent && event_soon?(we.event_time) && !device_tokens.empty?
        payload = {
          group: we.group.basic_info,
          wutudu_event: we.basic_info,
          state: 'wutudu'
        }
        we.reminders_sent = true
        we.save
        send_notification(device_tokens,
                          "Reminder: You have an upcoming event in less than #{hours_until_event(e_time) + 1} hours",
                          payload)
      end
    end
    puts "Sending Upcoming Wutudu Redminers at #{Time.now}"
  end

  def hours_until_event(et)
    ((et - Time.now)/1.hour).truncate
  end

  def event_soon?(et)
    hue = hours_until_event(et)
    0 <= hue && hue <= HOUR_TOL
  end

end
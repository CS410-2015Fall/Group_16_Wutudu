class AddReminderSentToWutuduEvent < ActiveRecord::Migration
  def change
    add_column :wutudu_events, :reminders_sent, :boolean
  end
end

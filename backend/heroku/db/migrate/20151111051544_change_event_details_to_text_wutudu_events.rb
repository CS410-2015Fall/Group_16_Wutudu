class ChangeEventDetailsToTextWutuduEvents < ActiveRecord::Migration
  def change
    change_column :wutudu_events, :event_details, :text
  end
end

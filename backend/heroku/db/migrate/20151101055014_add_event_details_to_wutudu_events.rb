class AddEventDetailsToWutuduEvents < ActiveRecord::Migration
  def change
    add_column :wutudu_events, :event_details, :string
  end
end

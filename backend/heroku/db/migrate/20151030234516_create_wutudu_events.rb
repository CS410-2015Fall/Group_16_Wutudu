class CreateWutuduEvents < ActiveRecord::Migration
  def change
    create_table :wutudu_events do |t|
      t.string :activity_name
      t.references :category, index: true, foreign_key: true
      t.datetime :event_time
      t.decimal :latitude
      t.decimal :longitude
      t.references :group, index: true, foreign_key: true
      t.references :pre_wutudu, index: true, foreign_key: true
    end
  end
end

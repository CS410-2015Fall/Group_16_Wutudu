class CreatePreWutudus < ActiveRecord::Migration
  def change
    create_table :pre_wutudus do |t|
      t.datetime :event_date
      t.decimal :latitude
      t.decimal :longitude
      
      t.timestamps
    end
  end
end

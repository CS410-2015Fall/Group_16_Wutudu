class AddFinishedBooleanToPreWutudu < ActiveRecord::Migration
  def change
    add_column :pre_wutudus, :finished, :boolean
  end
end

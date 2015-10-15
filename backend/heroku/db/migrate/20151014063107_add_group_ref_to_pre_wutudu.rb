class AddGroupRefToPreWutudu < ActiveRecord::Migration
  def change
    add_reference :pre_wutudus, :group, index: true, foreign_key: true
  end
end

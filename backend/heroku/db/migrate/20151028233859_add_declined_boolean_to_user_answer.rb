class AddDeclinedBooleanToUserAnswer < ActiveRecord::Migration
  def change
    add_column :user_answers, :declined, :boolean
  end
end

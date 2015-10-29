class RemoveAnumsFromUserAnswer < ActiveRecord::Migration
  def change
    remove_column :user_answers, :a0, :integer
    remove_column :user_answers, :a1, :integer
    remove_column :user_answers, :a2, :integer
    remove_column :user_answers, :a3, :integer
    remove_column :user_answers, :a4, :integer
    remove_column :user_answers, :a5, :integer
    remove_column :user_answers, :a6, :integer
    remove_column :user_answers, :a7, :integer
    remove_column :user_answers, :a8, :integer
    remove_column :user_answers, :a9, :integer
  end
end

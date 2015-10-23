class AddAnswerTextToQuestion < ActiveRecord::Migration
  def change
    add_column :questions, :a0_text, :text
    add_column :questions, :a1_text, :text
    add_column :questions, :a2_text, :text
    add_column :questions, :a3_text, :text
  end
end

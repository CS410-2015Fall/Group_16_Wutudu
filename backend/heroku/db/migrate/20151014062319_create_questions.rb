class CreateQuestions < ActiveRecord::Migration
  def change
    create_table :questions do |t|
      t.integer :qnum
      t.text :question
    end
  end
end

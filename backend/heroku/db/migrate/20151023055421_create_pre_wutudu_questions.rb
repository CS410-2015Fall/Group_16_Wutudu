class CreatePreWutuduQuestions < ActiveRecord::Migration
  def change
    create_table :pre_wutudu_questions do |t|
      t.integer :qnum
      t.references :question, index: true, foreign_key: true
      t.references :pre_wutudu, index: true, foreign_key: true

      t.timestamps null: false
    end
    add_index :pre_wutudu_questions, :qnum
  end
end

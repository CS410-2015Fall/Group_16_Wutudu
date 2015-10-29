class CreateAnswerWeights < ActiveRecord::Migration
  def change
    create_table :answer_weights do |t|
      t.integer :anum
      t.integer :weight
      t.references :question, index: true, foreign_key: true
      t.references :category, index: true, foreign_key: true
    end
  end
end

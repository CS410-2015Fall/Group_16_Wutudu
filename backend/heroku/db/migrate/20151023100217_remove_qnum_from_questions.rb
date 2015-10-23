class RemoveQnumFromQuestions < ActiveRecord::Migration
  def change
    remove_column :questions, :qnum, :integer
  end
end

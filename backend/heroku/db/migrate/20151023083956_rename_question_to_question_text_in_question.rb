class RenameQuestionToQuestionTextInQuestion < ActiveRecord::Migration
  def change
    change_table :questions do |t|
      t.rename :question, :question_text
    end
  end
end

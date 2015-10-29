class AddAnswersArrayToUserAnswers < ActiveRecord::Migration
  def change
    add_column :user_answers, :answers, :text
  end
end

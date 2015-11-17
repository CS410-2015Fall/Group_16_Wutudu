class AnswerWeight < ActiveRecord::Base
  belongs_to :question
  belongs_to :category
  validates :anum, :weight, presence: true
  validates :anum, numericality: {
    greater_than_or_equal_to: 0,
    less_than_or_equal_to: 3,
  }
  validates :anum, uniqueness: {scope: [:question_id, :category_id]}
end
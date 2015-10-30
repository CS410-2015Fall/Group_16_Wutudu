class AnswerWeight < ActiveRecord::Base
  belongs_to :question
  belongs_to :category
  validates :anum, :weight, presence: true
  validates :anum, numericality: {
    greater_than_or_equal_to: 0,
    less_than_or_equal_to: 3,
  }
end
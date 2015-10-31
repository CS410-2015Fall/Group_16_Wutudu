class PreWutuduQuestion < ActiveRecord::Base
  belongs_to :question
  belongs_to :pre_wutudu
  validates :qnum, presence: true
    validates :qnum, numericality: {
    greater_than_or_equal_to: 0,
    less_than: 10,
  }
end

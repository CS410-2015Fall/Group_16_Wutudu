class Question < ActiveRecord::Base
	validates :question_text, :a0_text, :a1_text,:a2_text, :a3_text, presence: true
  has_many :answer_weights

  def category_weights(anum)
    category_weights = {}
    self.answer_weights.where(anum: anum).each do |aw|
      category_weights[aw.category.cat_id] = 0 if category_weights[aw.category.cat_id].nil?
      category_weights[aw.category.cat_id] += aw.weight
    end
    category_weights
  end
end

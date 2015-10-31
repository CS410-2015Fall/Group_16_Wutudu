class UserAnswer < ActiveRecord::Base
  belongs_to :pre_wutudu
  belongs_to :user
  serialize :answers
  validate :validate_answers, unless: :declined?

  def basic_info
    {id: self.id, declined: self.declined?, answers: self.answers}
  end

  def category_weights
    category_weights = {}
    (0..9).each do |i|
      q = self.pre_wutudu.pre_wutudu_questions.find_by_qnum(i).question
      category_weights.merge!(q.category_weights(answers[i])) {|key, v0, v1| v0 + v1}  
    end
    category_weights
  end

  private

  def validate_answers
    if !self.answers.is_a?(Array) || \
        self.answers.size != 10 || \
        self.answers.detect{|d| !(0..3).include?(d)}
      errors.add(:answers, :invalid)
    end
  end
end

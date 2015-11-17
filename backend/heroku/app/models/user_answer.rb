class UserAnswer < ActiveRecord::Base
  belongs_to :pre_wutudu, touch: true
  belongs_to :user
  serialize :answers
  validate :validate_answers

  def basic_info
    {id: self.id, declined: self.declined?, answers: self.answers}
  end

  def handle_answers(answers)
    if answers.count(-1) == answers.size
      self.declined = true
    else
      self.answers = answers
    end
  end

  def category_weights
    category_weights = {}
    (0..9).each do |i|
      # q = self.pre_wutudu.pre_wutudu_questions.find_by_qnum(i).question
      q = self.pre_wutudu.get_question(i)
      category_weights.merge!(q.category_weights(answers[i])) {|key, v0, v1| v0 + v1}  
    end
    category_weights
  end

  private

  def validate_answers
    if self.declined?
      errors.add(:answers, "cannot be set when declined is true") if self.answers?
    elsif !self.answers.is_a?(Array) || \
           self.answers.size != 10 || \
           self.answers.detect{|d| !(0..3).include?(d)}
      errors.add(:answers, "must be an array of 10 elements from 0 to 3")
    end
  end
end

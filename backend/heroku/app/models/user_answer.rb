class UserAnswer < ActiveRecord::Base
  belongs_to :pre_wutudu
  belongs_to :user
  serialize :answers
  validate :validate_answers, unless: :declined?

  def basic_info
    {id: self.id, declined: self.declined?, answers: self.answers}
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

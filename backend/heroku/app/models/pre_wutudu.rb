class PreWutudu < ActiveRecord::Base
	belongs_to :group
	has_many :pre_wutudu_questions, dependent: :destroy
	has_many :questions, through: :pre_wutudu_questions
	# TODO: add validation of location
  has_many :user_answers, dependent: :destroy

  def basic_info_per_user(user_id)
    {
      pre_wutudu_id: self.id,
      event_date: self.event_date,
      latitude: self.latitude,
      longitude: self.longitude,
      questions: self.qnum_and_questions,
      user_answer: self.user_answers.find_by_user_id(user_id),
      total_possible: self.total_possible_count,
      completed_answers: self.completed_answers.count,
      declined_answers: self.declined_answers_count,
    }
  end

	def qnum_and_questions
		hash = {}
		self.pre_wutudu_questions.each do |x|
			hash[x.qnum] = self.questions.find_by_id(x.question_id)
		end
		hash
	end

  def aggregate_category_weights
    aggregate_weights = {}
    self.completed_answers.each do |x|
      aggregate_weights.merge!(x.category_weights) {|key, v0, v1| v0 + v1} 
    end
    aggregate_weights
  end

  def completed_answers
    self.user_answers.where(declined: nil)
  end

  def declined_answers_count
    self.user_answers.where(declined: true).count
  end

  def completed_answers_count
    self.completed_answers.count
  end

  def total_possible_count
    self.group.active_users.count - self.declined_answers_count
  end
end

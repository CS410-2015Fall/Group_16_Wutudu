class PreWutudu < ActiveRecord::Base
	belongs_to :group
	has_many :pre_wutudu_questions, dependent: :destroy
	has_many :questions, through: :pre_wutudu_questions
	# TODO: add validation of location

  def show_info
    {
      pre_wutudu_id: self.id,
      event_date: self.event_date,
      latitude: self.latitude,
      longitude: self.longitude,
      questions: self.qnum_and_questions,
    }
  end

	def qnum_and_questions
		hash = {}
		self.pre_wutudu_questions.each do |x|
			hash[x.qnum] = self.questions.find_by_id(x.question_id)
		end
		hash
	end
end

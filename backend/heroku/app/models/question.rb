class Question < ActiveRecord::Base
	validates :question_text, presence: true
  #WILL-TODO: uncomment this after I have all the answers for the questions
	#validates, :a0_text, :a1_text,:a2_text, :a3_text, presence: true
end

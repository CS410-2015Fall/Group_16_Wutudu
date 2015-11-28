class PreWutudu < ActiveRecord::Base
  include GCMNotification

  belongs_to :group
  has_many :pre_wutudu_questions, dependent: :destroy
  has_many :questions, through: :pre_wutudu_questions
  # TODO: add validation of location
  has_many :user_answers, dependent: :destroy
  has_one :wutudu_event

  after_touch :handle_answer_completion

  def basic_info_per_user(user_id)
    {
      pre_wutudu_id: self.id,
      event_date: self.event_date,
      latitude: self.latitude,
      longitude: self.longitude,
      total_possible: self.total_possible_count,
      completed_answers: self.completed_answers.count,
      declined_answers: self.declined_answers_count,
      finished: self.finished?,
      user_answer: self.user_answers.find_by_user_id(user_id),
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

  def get_question(qnum)
    self.pre_wutudu_questions.find_by_qnum(qnum).question if (0..9).include?(qnum)
  end

  def aggregate_category_weights
    aggregate_weights = {}
    self.completed_answers.each do |x|
      aggregate_weights.merge!(x.category_weights) {|key, v0, v1| v0 + v1}
    end
    aggregate_weights
  end

  def top_category
    weights = self.aggregate_category_weights
    top_category = Category.find_by_cat_id(weights.max_by{|k,v| v}[0])
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

  def generate_wutudu_event
    bl = Magic::BestLocation.new(self.latitude, self.longitude, [self.top_category.yelp_id], self.event_date)
    event_details = bl.find_best_location # use top category
    return "Unable To Create Wutudu Event", 500 unless event_details
    self.wutudu_event = WutuduEvent.create(
                          pre_wutudu_id: self.id,
                          group_id: self.group_id,
                          category_id: self.top_category.id,
                          latitude: self.latitude,
                          longitude: self.longitude,
                          event_time: self.event_date,
                          event_details: event_details.to_s
                        )
    self.finished = true
    self.save
    return "Wutudu Event Created", 200
  end

  private

  def handle_answer_completion
    if self.total_possible_count == 0
      wid = self.id
      self.destroy
      p "All users declined. pre_wutudu #{wid} destroyed" if self.destroyed?
    elsif self.completed_answers_count == self.total_possible_count

      # Thread.new do
        msg, status = self.generate_wutudu_event
        if status == 200
          p "All possible users answered. wutudu event created"
          group = self.group
          tokens = group.active_users_device_tokens
          unless tokens.empty?
            payload = {
              group: group.basic_info,
              wutudu_event: self.wutudu_event.basic_info,
              state: 'wutudu'
            }
            send_notification(tokens, \
                              "A Wutudu has been generated for Group #{group.name}", \
                              payload)
          end
        else
          p "There was a #{status} error with wutudu event creation"
        end
        # exit
        # ActiveRecord::Base.connection.close
        # Thread.exit
      # end
    end
  end
end

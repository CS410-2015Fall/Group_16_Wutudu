class WutuduEvent < ActiveRecord::Base
  belongs_to :group
  belongs_to :pre_wutudu
  belongs_to :category
  has_many :user_answers, through: :pre_wutudu
  has_many :accepted_users, -> {where(user_answers: {declined: nil})}, :through => :user_answers, :source => :user

  def basic_info
    {
      id: self.id,
      pre_wutudu_id: self.pre_wutudu.id,
      category: self.category.basic_info,
      event_time: self.event_time,
      latitude: self.latitude,
      longitude: self.longitude,
      accepted_users: self.accepted_user_info,
      event_details: eval(self.get_event_details)
    }
  end

  def get_event_details
    return self.get_event_details unless self.event_details.nil?
    ""
  end

  def accepted_user_info
    self.accepted_users.collect {|u| u.basic_info}
  end
end

class Group < ActiveRecord::Base
  # Users
  has_many :group_users
  has_many :users, through: :group_users

  has_many :active_users, -> { where(group_users: { approved: true}) }, :through => :group_users, :source => :user
  has_many :pending_users, -> { where(group_users: { approved: false}) }, :through => :group_users, :source => :user

  # Wutudus
  has_many :pre_wutudus, -> { order('event_date')}
  has_many :wutudu_events, -> { order('event_time')}

  def basic_info
    {id: self.id, name: self.name}
  end

  def group_users_info
    {
      active_users: self.active_users.collect {|u| u.basic_info},
      pending_users: self.pending_users.collect {|u| u.basic_info}
    }
  end

  def ongoing_pre_wutudus_info_per_user(user_id)
    self.pre_wutudus.where(finished: nil).collect {|pw| pw.basic_info_per_user(user_id)}
  end

  def wutudu_events_info
    self.wutudu_events.collect {|we| we.basic_info}
  end

  def all_info_per_user(user_id)
    {
      group_users: self.group_users_info,
      pre_wutudus: self.ongoing_pre_wutudus_info_per_user(user_id),
      wutudu_events: self.wutudu_events_info
    }
  end

  def active_users_device_tokens
    self.active_users.collect {|u| u.device_token}.compact
  end

  def pending_users_device_tokens
    self.pending_users.collect {|u| u.device_token}.compact
  end
end

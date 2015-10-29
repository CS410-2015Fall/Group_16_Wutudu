class Group < ActiveRecord::Base
  # Users
  has_many :group_users
  has_many :users, through: :group_users

  has_many :active_users, -> { where(group_users: { approved: true}) }, :through => :group_users, :source => :user
  has_many :pending_users, -> { where(group_users: { approved: false}) }, :through => :group_users, :source => :user

  # Wutudus
  has_many :pre_wutudus

  def basic_info
    {id: self.id, name: self.name}
  end

  def group_users_info
  	{ 
  		active_users: self.active_users.collect {|u| u.basic_info},
     pending_users: self.pending_users.collect {|u| u.basic_info}
    }
  end

  def pre_wutudus_info_per_user(user_id)
  	self.pre_wutudus.collect {|pw| pw.basic_info_per_user(user_id)}
  end

  def all_info_per_user(user_id)
  	{
  		group_users: self.group_users_info,
  		pre_wutudus: self.pre_wutudus_info_per_user(user_id),
  	}
  end

  def active_users_device_tokens
    self.active_users.collect {|u| u.device_token}
  end
end
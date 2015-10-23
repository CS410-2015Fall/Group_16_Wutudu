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
end
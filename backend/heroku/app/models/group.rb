class Group < ActiveRecord::Base
  has_many :group_users
  has_many :users, through: :group_users

  has_many :active_users, -> { where(group_users: { approved: true}) }, :through => :group_users, :source => :user
  has_many :pending_users, -> { where(group_users: { approved: false}) }, :through => :group_users, :source => :user

  def basic_info
    {id: self.id, name: self.name}
  end
end
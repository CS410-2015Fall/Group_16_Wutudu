require 'bcrypt'

# Aux function for email: true
class EmailValidator < ActiveModel::EachValidator
 def validate_each(record, attribute, value)
   record.errors.add attribute, (options[:message] || "is not a valid email") unless
   value =~ /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i
 end
end

class User < ActiveRecord::Base
  include BCrypt

  before_create :generate_new_api_key, :hash_password

  # Requirements:
  validates :name, :password, :email, presence: true, allow_blank: false
  validates :email, uniqueness: true, email: true, length: { maximum: 50 }
  validates :name, length: { maximum: 50 }

  # Friendships
  has_many :friendships
  has_many :passive_friendships, :class_name => "Friendship", :foreign_key => "friend_id"

  has_many :active_friends, -> { where(friendships: { approved: true}) }, :through => :friendships, :source => :friend
  has_many :passive_friends, -> { where(friendships: { approved: true}) }, :through => :passive_friendships, :source => :user
  has_many :pending_friends, -> { where(friendships: { approved: false}) }, :through => :friendships, :source => :friend
  has_many :requested_friendships, -> { where(friendships: { approved: false}) }, :through => :passive_friendships, :source => :user

  # Groups
  has_many :group_users
  has_many :groups, through: :group_users

  has_many :active_groups, -> { where(group_users: { approved: true}) }, :through => :group_users, :source => :group
  has_many :pending_groups, -> { where(group_users: { approved: false}) }, :through => :group_users, :source => :group

  # PreWutudu/Wutudu
  has_many :pre_wutudus, through: :group
  has_many :wudutu_events

  def bcrypt_password
    BCrypt::Password.new(self.password)
  end

  def basic_info
    {id: self.id, email: self.email, name: self.name}
  end

  def renew_api_key
    generate_new_api_key
    self.save
  end

  def friends
    active_friends | passive_friends
  end

  def friends_short
    compact_friends_info(friends)
  end

  def pending_short
    compact_friends_info(pending_friends)
  end

  def requested_short
    compact_friends_info(requested_friendships)
  end

  def friendship_status(id)
    case
    when friends.bsearch {|f| id - f.id}
      1
    when pending_friends.bsearch {|f| id - f.id}
      2
    when requested_friendships.bsearch {|f| id - f.id}
      3
    else
      0
    end
  end

  private

  # generate api key upon creation
  def generate_new_api_key
    begin
      token = SecureRandom.base64.tr('+/=', 'Qrt')
    end until !User.exists?(api_key: token)
    self.api_key = token
  end

  def compact_friends_info(friends)
    friends.collect {|f| f.slice(:id, :name, :email)}
  end

  def hash_password
    self.password = BCrypt::Password.create(self.password)
  end
end

class Friendship < ActiveRecord::Base
  belongs_to :user
  belongs_to :friend, :class_name => "User"

  # Requirements:
  validates :user_id, :friend_id, presence: true
  validates_inclusion_of :approved, in: [true, false]
  validates :user_id, uniqueness: {scope: [:friend_id]}
end

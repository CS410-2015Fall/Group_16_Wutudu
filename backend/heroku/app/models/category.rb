class Category < ActiveRecord::Base
	validates :cat_id, presence: true, uniqueness: true
end

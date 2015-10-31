class Category < ActiveRecord::Base
	validates :cat_id, presence: true, uniqueness: true

  def basic_info
    {cat_id: self.cat_id, name: self.category_name}
  end
end

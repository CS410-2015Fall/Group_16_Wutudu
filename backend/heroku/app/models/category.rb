class Category < ActiveRecord::Base
	validates :cat_id, :category_name, presence: true
  validates :cat_id, uniqueness: true # TODO: might want the name to be unique too?

  def basic_info
    {cat_id: self.cat_id, name: self.category_name}
  end
end

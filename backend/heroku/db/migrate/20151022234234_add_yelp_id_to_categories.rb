class AddYelpIdToCategories < ActiveRecord::Migration
  def change
    add_column :categories, :yelp_id, :string
    add_index :categories, :yelp_id
  end
end

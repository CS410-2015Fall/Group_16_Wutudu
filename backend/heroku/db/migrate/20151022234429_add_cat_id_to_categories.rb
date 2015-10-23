class AddCatIdToCategories < ActiveRecord::Migration
  def change
    add_column :categories, :cat_id, :integer
    add_index :categories, :cat_id
  end
end

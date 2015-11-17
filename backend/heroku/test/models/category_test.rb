require 'test_helper'

class CategoryTest < ActiveSupport::TestCase
  def setup
    @category = Category.new(cat_id: 101, category_name: "c101", yelp_id: "yelp_c101")
  end

  def teardown
    @category = nil
  end

  test 'should correctly validate valid category' do
    assert @category.valid?
  end

  test 'should allow missing yelp_id' do
    @category.yelp_id = nil
    assert @category.valid?
  end

  test 'should invalidate missing cat_id' do
    @category.cat_id = nil
    assert_not @category.valid?
  end

  test 'should invalidate missing category_name' do
    @category.category_name = nil
    assert_not @category.valid?
  end

  test 'should invalidate existing cat_id' do
    assert @category.save
    cat2 = Category.new(cat_id: @category.cat_id,
                        category_name: "cat2",
                        yelp_id: "yelp_cat2" )
    assert_not cat2.valid?
    @category.destroy
  end
end

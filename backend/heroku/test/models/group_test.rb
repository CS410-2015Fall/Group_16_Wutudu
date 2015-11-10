require 'test_helper'

class GroupTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  test "group one has name" do
    assert groups(:group_1).name = "Group One"
  end
end

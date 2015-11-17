require 'test_helper'

class PreWutuduTest < ActiveSupport::TestCase
  def setup
    user_answers_completed = [stub(category_weights: {1 => 10}, declined: nil),
                              stub(category_weights: {2 => 5, 1 => 5, 3 => 6}, declined: nil),
                              stub(category_weights: {2 => -5, 3 => -3}, declined: nil)]
    user_answers_declined = [stub(declined: true), stub(declined: true)]                                  
    all_answers = user_answers_completed + user_answers_declined
    all_answers.stubs(:where).with(declined: nil).returns(user_answers_completed)
    all_answers.stubs(:where).with(declined: true).returns(user_answers_declined)

    group = stub(group_name: "Group")
    active_users = [stub(user_id: 1), stub(user_id: 2), stub(user_id: 3), stub(user_id: 4),
                    stub(user_id: 5), stub(user_id: 6), stub(user_id: 7), stub(user_id: 8)]
    group.stubs(:active_users).returns(active_users)
    
    @pre_wutudu = PreWutudu.new(
                                event_date: Time.now,
                                latitude: 1.0,
                                longitude: 1.0,
                                group_id: 1,
                                )
    @pre_wutudu.stubs(:user_answers).returns(all_answers)
    @pre_wutudu.stubs(:group).returns(group)

    @pre_wutudu_fixture = pre_wutudus(:pre_wutudu_1)
  end

  def teardown
    @pre_wutudu = nil
    @pre_wutudu_fixture = nil
  end

  test 'should correctly aggregate weights' do
    assert_equal({1 => 15, 2 => 0, 3 => 3}, @pre_wutudu.aggregate_category_weights)
  end

  test 'should correctly return top category' do
    cat1 = Category.new(cat_id: 1, category_name: "cat1" )
    Category.stubs(:find_by_cat_id).with(1).returns(cat1)
    assert_equal(cat1, @pre_wutudu.top_category)
  end

  test 'should correctly return answer counts' do
    assert_equal(3, @pre_wutudu.completed_answers_count, "Incorrectly calculated completed answer counts for stub data")
    assert_equal(2, @pre_wutudu.declined_answers_count,  "Incorrectly calculated declined answer counts for stub data")
    assert_equal(6, @pre_wutudu.total_possible_count,  "Incorrectly calculated total possible answer counts for stub data")
  end

  test 'should correctly get question, in fixture' do
    assert_equal(questions(:question_4), @pre_wutudu_fixture.get_question(3))
  end

  test 'should return nil for bad qnums, in fixture' do
    assert_nil(@pre_wutudu_fixture.get_question(10))
    assert_nil(@pre_wutudu_fixture.get_question(-1))
  end

  test 'should correctly aggregate weights, in fixture' do
    # [0, 1, 1, 0, 1, 0, 1, 3, 2, 3]
    # [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
    assert_equal({1 => 3, 2 => 4, 3 => 11, 4 => 2}, @pre_wutudu_fixture.aggregate_category_weights)
  end

  test 'should correctly return top category, in fixture' do
    assert_equal(categories(:category_3), @pre_wutudu_fixture.top_category)
  end

  test 'should correctly return answer counts, in fixture' do
    assert_equal(2, @pre_wutudu_fixture.completed_answers_count, "Incorrectly calculated completed answer counts for fixture data")
    assert_equal(1, @pre_wutudu_fixture.declined_answers_count,  "Incorrectly calculated declined answer counts for fixture data")
    assert_equal(3, @pre_wutudu_fixture.total_possible_count,  "Incorrectly calculated total possible answer counts for fixture data")
  end

  # TODO: tests for event generation
end

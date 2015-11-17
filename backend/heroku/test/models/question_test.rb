require 'test_helper'

class QuestionTest < ActiveSupport::TestCase
  def setup
    @question1 = Question.new(
                      question_text: "question?",
                            a0_text: "a0",
                            a1_text: "a1",
                            a2_text: "a2",
                            a3_text: "a3"
                      )
    @question1_fixture = questions(:question_1)
  end

  def teardown
    @question1 = nil
    @question1_fixture = nil
  end

  test "should correctly validate valid question" do
    assert @question1.question_text == "question?"
    assert @question1.a0_text == "a0"
    assert @question1.a1_text == "a1"
    assert @question1.a2_text == "a2"
    assert @question1.a3_text == "a3"
    assert @question1.valid?
  end

  test "should invalidate missing question text" do
    @question1.question_text = nil
    assert_not @question1.valid?, "Valid with missing question text"
  end

  test "should invalidate missing answer texts" do
    @question1.a0_text = nil
    assert_not @question1.valid?, "Valid with missing a0_text"

    @question1.a1_text = nil
    assert_not @question1.valid?, "Valid with missing a1_text"

    @question1.a2_text = nil
    assert_not @question1.valid?, "Valid with missing a2_text"

    @question1.a3_text = nil
    assert_not @question1.valid?, "Valid with missing a3_text"
  end

  test "should correctly aggregate weights for each anum" do
    answer_weights_0 = [stub(anum: 0, category: stub(cat_id: 1), weight: 0)]
    answer_weights_1 = [stub(anum: 1, category: stub(cat_id: 1), weight: -1),
                        stub(anum: 1, category: stub(cat_id: 2), weight: 1)]
    answer_weights_2 = [stub(anum: 2, category: stub(cat_id: 2), weight: 2)]
    answer_weights_3 = [stub(anum: 3, category: stub(cat_id: 1), weight: 5),
                        stub(anum: 3, category: stub(cat_id: 2), weight: 4),
                        stub(anum: 3, category: stub(cat_id: 3), weight: 3),
                        stub(anum: 3, category: stub(cat_id: 4), weight: 2),
                        stub(anum: 3, category: stub(cat_id: 5), weight: 1)]
    answer_weights = [answer_weights_0 + answer_weights_1 + answer_weights_2 + answer_weights_3]
    answer_weights.stubs(:where).with(anum: 0).returns(answer_weights_0)
    answer_weights.stubs(:where).with(anum: 1).returns(answer_weights_1)
    answer_weights.stubs(:where).with(anum: 2).returns(answer_weights_2)
    answer_weights.stubs(:where).with(anum: 3).returns(answer_weights_3)
    @question1.stubs(:answer_weights).returns(answer_weights)

    assert_equal( {1 => 0}, @question1.category_weights(0), "Incorrectly aggregated anum 0")
    assert_equal( {1 => -1, 2 => 1}, @question1.category_weights(1), "Incorrectly aggregated anum 1")
    assert_equal( {2 => 2}, @question1.category_weights(2), "Incorrectly aggregated anum 3")
    assert_equal( {1 => 5, 2 => 4, 3 => 3, 4 => 2, 5 => 1},
                   @question1.category_weights(3) ,
                   "Incorrectly aggregated anum 4")
  end

  test "should correctly aggregate weights for each anum, in fixture" do 
    assert_equal( {1 => 1}, @question1_fixture.category_weights(0), "Incorrectly aggregated anum 0 in fixture data")
    assert_equal( {2 => 1}, @question1_fixture.category_weights(1), "Incorrectly aggregated anum 1 in fixture data")
    assert_equal( {3 => 1}, @question1_fixture.category_weights(2), "Incorrectly aggregated anum 3 in fixture data")
    assert_equal( {4 => 1}, @question1_fixture.category_weights(3), "Incorrectly aggregated anum 3 in fixture data")
  end
end

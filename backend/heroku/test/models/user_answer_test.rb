require 'test_helper'

class UserAnswerTest < ActiveSupport::TestCase
  def setup
    @user_answer = UserAnswer.new(pre_wutudu_id: 1, user_id: 1)
  end

  def teardown
    @user_answer = nil
  end

  test 'should correctly handle completed answers' do
    answers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    @user_answer.handle_answers(answers)
    assert_equal answers, @user_answer.answers
    assert_not @user_answer.declined?
  end

  test 'should correctly handle declined answers' do
    answers = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
    @user_answer.handle_answers(answers)
    assert_nil @user_answer.answers
    assert @user_answer.declined?
  end

  test 'should correctly calculate category weights for the answers' do
    ua2 = user_answers(:user_2_pw_2_answer)
    # answers = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
    # all answer weights are +1 weight to category anum + 1 
    # (i.e. anum 3 will add +1 to category_4)
    assert_equal({4 => 10}, ua2.category_weights, "Incorrectly calculated weights all 3")

    ua2.answers = [0, 1, 1, 2, 2, 2, 3, 3, 3, 3]
    assert_equal({1 => 1, 2 => 2, 3 => 3, 4 => 4}, ua2.category_weights, "Incorrectly calculated assorted weights")
  end 

  test 'should validate valid answers' do
    @user_answer.answers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    assert @user_answer.valid?

    @user_answer.answers = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
    assert @user_answer.valid?

    @user_answer.answers = [0, 1, 1, 0, 1, 0, 1, 3, 2, 3]
    assert @user_answer.valid?
  end

  test 'should invalidate invalid answers' do
    @user_answer.answers = [4, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    assert_not @user_answer.valid?

    @user_answer.answers = [3, 3, 3, 3, 3, 3, 3, 3, 3, -1]
    assert_not @user_answer.valid?

    @user_answer.answers = [0, 1, 1, 0, 1, 1, 3, 2, 3]
    assert_not @user_answer.valid?

    @user_answer.answers = "kappa123"
    assert_not @user_answer.valid?
  end

  test 'should validate declined user answer' do
    @user_answer.declined = true
    assert @user_answer.valid?
  end

  test 'should invalidate answers if declined' do
    @user_answer.answers = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
    @user_answer.declined = true
    assert_not @user_answer.valid?
  end
end

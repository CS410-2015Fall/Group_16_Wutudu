require 'test_helper'

class AnswerWeightTest < ActiveSupport::TestCase
  def setup
    @answeight = answer_weights(:aw_0_question_1)
  end

  def teardown
    @answeight = nil
  end

  test 'should correctly validate valid answer weight' do
    assert @answeight.valid?
  end

  test 'should invalidate invalid anum -1' do 
    @answeight.anum = -1
    assert_not @answeight.valid?
  end

  test 'should invalidate invalid anum 4' do 
    @answeight.anum = 4
    assert_not @answeight.valid?
  end

  test 'should invalidate invalid anum 0' do 
    @answeight.anum = 10
    assert_not @answeight.valid?
  end

  test 'should invalidate missing anum' do 
    @answeight.anum = nil
    assert_not @answeight.valid?
  end

  test 'should invalidate missing weight' do 
    @answeight.weight = nil
    assert_not @answeight.valid?
  end

  test 'should invalidate repeated answer weight' do
    answeight2 = AnswerWeight.new(
                    question_id: @answeight.question_id,
                    category_id: @answeight.category_id, 
                    anum: @answeight.anum,
                    weight: 2)
    assert_not answeight2.valid?
  end
end

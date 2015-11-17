require 'test_helper'

class PreWutuduQuestionTest < ActiveSupport::TestCase
  def setup
    @pwquestion = pre_wutudu_questions(:pre_wutudu_1_question_1)
  end

  def teardown
    @pwquestion = nil
  end

  test 'should correctly validate pre wutudu question' do 
    assert @pwquestion.valid?
  end

  test 'should invalidate missing qnum' do
    @pwquestion.qnum = nil
    assert_not @pwquestion.valid?
  end

  test 'should invalidate negative qnum' do
    @pwquestion.qnum = -1
    assert_not @pwquestion.valid?
  end

  test 'should invalidate invalid qnum' do
    @pwquestion.qnum = 'lol'
    assert_not @pwquestion.valid?
  end

  test 'should invalidate qnum 11' do
    @pwquestion.qnum = 11
    assert_not @pwquestion.valid?
  end

  test 'should invalidate large qnum' do
    @pwquestion.qnum = 100
    assert_not @pwquestion.valid?
  end

  test 'should invalidate creation of same qnum' do
    pwq2 = PreWutuduQuestion.new(
                  pre_wutudu_id: @pwquestion.pre_wutudu_id,
                  qnum: @pwquestion.pre_wutudu_id,
                  question_id: @pwquestion.question_id + 10,
              )
    assert_not pwq2.valid?
  end
end

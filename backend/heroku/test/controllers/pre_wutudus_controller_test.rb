require 'test_helper'

class PreWutudusControllerTest < ActionController::TestCase
  def setup
    request.headers["Content-Type"] = "application/json"
    PreWutudusController.any_instance.stubs(:authenticate).returns(nil)
    PreWutudusController.any_instance.stubs(:active_in_group).returns(nil)
    PreWutudusController.any_instance.stubs(:pre_wutudu_in_group).returns(nil)
    PreWutudusController.any_instance.stubs(:pre_wutudu_not_finished).returns(nil)
    PreWutudusController.any_instance.stubs(:send_notification).returns(nil)
    @controller.instance_variable_set(:@user, users(:user_1))
    @controller.instance_variable_set(:@group, groups(:group_1))
    @controller.instance_variable_set(:@pre_wutudu, pre_wutudus(:pre_wutudu_1))

    @request_body = { 
                      gid: groups(:group_1).id,
                      pid: pre_wutudus(:pre_wutudu_1).id,
                      pre_wutudu: {
                        event_date: "2015-11-23 21:31:16.01569",
                        latitude: 1.0,
                        longitude: 1.0
                      }
                    }
  end

  # active_in_group
  test 'should have correct error msg logic when group not found' do
    PreWutudusController.any_instance.unstub(:active_in_group)
    Group.stubs(:find_by_id).returns(nil)
    pre_wutudu_controller_expects_errors_msg('Group Not Found', 404)
    get :show, @request_body
  end

  test 'should have correct error msg logic when user not active in group' do
    PreWutudusController.any_instance.unstub(:active_in_group)
    Group.any_instance.stubs(:active_users).returns(stub(find_by_id: nil))
    pre_wutudu_controller_expects_errors_msg('User Not Active In Group', 400)
    get :show, @request_body
  end

  # pre_wutudu_in_group
  test 'should have correct error msg logic when pre_wutudu not in group' do
    PreWutudusController.any_instance.unstub(:pre_wutudu_in_group)
    Group.any_instance.stubs(:pre_wutudus).returns(stub(find_by_id: nil))
    pre_wutudu_controller_expects_errors_msg('PreWutudu Not Found In Group', 404)
    get :show, @request_body
  end

  # pre_wutudu_not_finished
  test 'should have correct error msg logic when pre_wutudu already finished' do
    PreWutudusController.any_instance.unstub(:pre_wutudu_not_finished)
    PreWutudu.any_instance.stubs(:finished?).returns(true)
    pre_wutudu_controller_expects_errors_msg('Action Invalid. PreWutudu Already Finished', 400)
    get :show, @request_body
  end

  # :show
  test 'should have correct msg logic for :show pre wutudu' do
    PreWutudu.any_instance.stubs(:basic_info_per_user).returns("")
    pre_wutudu_controller_expects_success_msg
    get :show, @request_body
  end

  # :create
  test 'should have correct internal error msg logic for :create when questions nil' do
    test_create_setup
    Group.any_instance.stubs(:pre_wutudus).returns(stub(build: stub()))
    Question.stubs(:all).returns(stub(sample: nil))
    pre_wutudu_controller_expects_internal_error_msg
    post :create, @request_body
  end

  test 'should have correct internal error msg logic for :create when questions empty' do
    test_create_setup
    Group.any_instance.stubs(:pre_wutudus).returns(stub(build: stub()))
    Question.stubs(:all).returns(stub(sample: stub(present?: false)))
    pre_wutudu_controller_expects_internal_error_msg
    post :create, @request_body
  end

  test 'should have correct internal error msg logic for :create when qnum exists' do
    test_create_setup
    PreWutudu.any_instance.stubs(:pre_wutudu_questions).returns(stub(exists?: true))
    pre_wutudu_controller_expects_internal_error_msg
    post :create, @request_body
  end

  test 'should have correct internal error msg logic for :create when questions size not 10' do
    test_create_setup
    pre_wutudu_questions = stub()
    pre_wutudu_questions.stubs(:exists?).returns(false)
    pre_wutudu_questions.stubs(:build).returns(nil)
    pre_wutudu_questions.stubs(:size).returns(0)
    PreWutudu.any_instance.stubs(:pre_wutudu_questions).returns(pre_wutudu_questions)
    pre_wutudu_controller_expects_internal_error_msg
    post :create, @request_body
  end

  test 'should have correct error msg logic for :create when save failed' do
    test_create_setup
    PreWutudu.any_instance.stubs(:save).returns(false)
    pre_wutudu_controller_expects_errors_msg('Failed To Create PreWutudu', 400)
    post :create, @request_body
  end

  test 'should have correct msg logic for :create pre wutudu' do
    test_create_setup
    pre_wutudu_controller_expects_success_msg
    post :create, @request_body
  end

  # :destroy
  test 'should have correct error msg logic for :destroy when destroy failed' do
    PreWutudu.any_instance.stubs(:destroy).returns(nil)
    PreWutudu.any_instance.stubs(:destroyed?).returns(false)
    pre_wutudu_controller_expects_errors_msg('Failed To Delete PreWutudu', 400)
    post :destroy, @request_body
  end

  test 'should have correct msg logic for :destroy' do
    PreWutudu.any_instance.stubs(:destroy).returns(nil)
    PreWutudu.any_instance.stubs(:destroyed?).returns(true)
    pre_wutudu_controller_expects_success_msg
    post :destroy, @request_body
  end

  private

  def test_create_setup
    Group.any_instance.stubs(:pre_wutudus).returns(stub(build: pre_wutudus(:pre_wutudu_1)))
    questions = [questions(:question_1), questions(:question_2), questions(:question_3),
                 questions(:question_4), questions(:question_5), questions(:question_6),
                 questions(:question_7), questions(:question_8), questions(:question_9), 
                 questions(:question_10)]
    Question.stubs(:all).returns(stub(sample: questions))
    pre_wutudu_questions = stub()
    pre_wutudu_questions.stubs(:exists?).returns(false)
    pre_wutudu_questions.stubs(:build).returns(nil)
    pre_wutudu_questions.stubs(:size).returns(10)
    PreWutudu.any_instance.stubs(:pre_wutudu_questions).returns(pre_wutudu_questions)
    PreWutudu.any_instance.stubs(:save).returns(true)
    User.any_instance.stubs(:id).returns(1)
    PreWutudu.any_instance.stubs(:basic_info_per_user).returns(stub)
  end

  def pre_wutudu_controller_expects_internal_error_msg
    PreWutudusController.any_instance.expects(:internal_error_msg).returns({json: ''})
  end  

  def pre_wutudu_controller_expects_errors_msg(msg, code)
    PreWutudusController.any_instance.expects(:errors_msg).
      with(msg, code).returns({json: ''})
  end

  def pre_wutudu_controller_expects_success_msg
    PreWutudusController.any_instance.expects(:success_msg).returns({json: ''})
  end
end

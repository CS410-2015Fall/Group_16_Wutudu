require 'test_helper'

class UserAnswersControllerTest < ActionController::TestCase
  def setup
    UserAnswersController.any_instance.stubs(:authenticate).returns(nil)
    UserAnswersController.any_instance.stubs(:active_in_group).returns(nil)
    UserAnswersController.any_instance.stubs(:pre_wutudu_in_group).returns(nil)
    UserAnswersController.any_instance.stubs(:pre_wutudu_not_finished).returns(nil)
    @controller.instance_variable_set(:@user, users(:user_1))
    @controller.instance_variable_set(:@group, groups(:group_1))
    @controller.instance_variable_set(:@pre_wutudu, pre_wutudus(:pre_wutudu_1))

    @request_body = { 
                      gid: groups(:group_1).id,
                      pid: pre_wutudus(:pre_wutudu_1).id,
                      user_answer: {
                        answers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                      }
                    }
  end

  # active_in_group
  test 'should have correct error msg logic when group not found' do
    UserAnswersController.any_instance.unstub(:active_in_group)
    Group.stubs(:find_by_id).returns(nil)
    user_answers_controller_expects_errors_msg('Group Not Found', 404)
    post :create, @request_body
  end

  test 'should have correct error msg logic when user not active in group' do
    UserAnswersController.any_instance.unstub(:active_in_group)
    Group.any_instance.stubs(:active_users).returns(stub(find_by_id: nil))
    user_answers_controller_expects_errors_msg('User Not Active In Group', 400)
    post :create, @request_body
  end

  # pre_wutudu_in_group
  test 'should have correct error msg logic when pre_wutudu not in group' do
    UserAnswersController.any_instance.unstub(:pre_wutudu_in_group)
    Group.any_instance.stubs(:pre_wutudus).returns(stub(find_by_id: nil))
    user_answers_controller_expects_errors_msg('PreWutudu Not Found In Group', 404)
    post :create, @request_body
  end

  # pre_wutudu_not_finished
  test 'should have correct error msg logic when pre_wutudu already finished' do
    UserAnswersController.any_instance.unstub(:pre_wutudu_not_finished)
    PreWutudu.any_instance.stubs(:finished?).returns(true)
    user_answers_controller_expects_errors_msg('Action Invalid. PreWutudu Already Finished', 400)
    post :create, @request_body
  end

  # :show
  test 'should have correct error msg logic for :show not completed user answer' do
    PreWutudu.any_instance.stubs(:user_answers).returns(stub(find_by_user_id: nil))
    user_answers_controller_expects_errors_msg('User Has Not Answered', 400)
    get :show, @request_body
  end

  test 'should have correct msg logic for :show completed user answer' do
    PreWutudu.any_instance.stubs(:user_answers).returns(stub(find_by_user_id: stub(basic_info: "")))
    user_answers_controller_expects_success_msg
    get :show, @request_body
  end

  # :create
  test 'should have correct error msg logic for :create when already completed user answer' do
    PreWutudu.any_instance.stubs(:user_answers).returns(stub(find_by_user_id: stub(basic_info: "")))
    user_answers_controller_expects_errors_msg('User Already Answered', 400)
    post :create, @request_body
  end

  test 'should have correct error msg logic for :create when invalid user answer' do
    test_create_setup
    UserAnswer.any_instance.stubs(:valid?).returns(false)
    user_answers_controller_expects_errors_msg('User Answer Invalid', 400)
    post :create, @request_body
  end

  test 'should have correct error msg logic for :create when fail save user answer' do
    test_create_setup
    UserAnswer.any_instance.stubs(:save).returns(false)
    user_answers_controller_expects_errors_msg('Failed To Save Answers', 400)
    post :create, @request_body
  end

  test 'should have correct msg logic for :create user answer' do
    test_create_setup
    UserAnswer.any_instance.stubs(:save).returns(true)
    UserAnswer.any_instance.stubs(:declined).returns(false)
    user_answers_controller_expects_success_msg
    post :create, @request_body
  end

  test 'should have correct msg logic for :create decline answer' do
    test_create_setup
    UserAnswer.any_instance.stubs(:save).returns(true)
    UserAnswer.any_instance.stubs(:declined).returns(true)
    user_answers_controller_expects_success_msg
    post :create, @request_body
  end

  private 

  def test_create_setup
    user_answers = stub()
    user_answers.stubs(:find_by_user_id).returns(nil)
    user_answers.stubs(:build).returns(user_answers(:user_1_pw_1_answer))
    PreWutudu.any_instance.stubs(:user_answers).returns(user_answers)
    UserAnswer.any_instance.stubs(:handle_answers).returns(nil)
  end

  def user_answers_controller_expects_errors_msg(msg, code)
    UserAnswersController.any_instance.expects(:errors_msg).
      with(msg, code).returns({json: ''})
  end

  def user_answers_controller_expects_success_msg
    UserAnswersController.any_instance.expects(:success_msg).returns({json: ''})
  end
end

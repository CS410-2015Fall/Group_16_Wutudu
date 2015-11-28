require 'test_helper'

class UserAnswersIntegrationTest < ActionController::TestCase
  def setup
    @controller = UserAnswersController.new
    request.headers["Content-Type"] = "application/json"
    log_in_as(:user_4)
    @request_body = {
                      gid: groups(:group_1).id,
                      pid: pre_wutudus(:pre_wutudu_1).id,
                      user_answer: {
                        answers: []
                      }
                    }
    PreWutudu.any_instance.stubs(:handle_answer_completion).returns(nil)
    PreWutudu.any_instance.stubs(:generate_wutudu_event).returns(nil)
  end

  # helper functions
  test 'should return error msg when group not found' do
    @request_body[:gid] = -1
    post_request_and_assert_no_difference(:create, @request_body)
    validate_error_response({errors: 'Group Not Found'}, 404)
  end

  test 'should return error msg when user not active in group' do
    log_in_as(:user_3)
    @request_body[:gid] = groups(:group_2).id
    @request_body[:pid] = pre_wutudus(:pre_wutudu_2).id
    post_request_and_assert_no_difference(:create, @request_body)
    validate_error_response({errors: 'User Not Active In Group'}, 400)
  end

  # pre_wutudu_in_group
  test 'should return error msg when pre_wutudu not in group' do
    log_in_as(:user_1)
    @request_body[:pid] = -1
    post_request_and_assert_no_difference(:create, @request_body)
    validate_error_response({errors: 'PreWutudu Not Found In Group'}, 404)
  end

  # pre_wutudu_not_finished
  test 'should return error msg when pre_wutudu already finished' do
    log_in_as(:user_1)
    @request_body[:gid] = groups(:group_2).id
    @request_body[:pid] = pre_wutudus(:pre_wutudu_2).id
    post_request_and_assert_no_difference(:create, @request_body)
    validate_error_response({errors: 'Action Invalid. PreWutudu Already Finished'}, 400)
  end

  # :show
  test 'should return error msg for :show on not completed user answer' do
    log_in_as(:user_4)
    get_request_and_assert_no_difference(:show, @request_body)
    validate_error_response({errors: 'User Has Not Answered'}, 400)
  end

  test 'should correctly return msg for :show on completed user answer' do
    log_in_as(:user_1)
    get_request_and_assert_no_difference(:show, @request_body)
    validate_success_response({user_answer: user_answers(:user_1_pw_1_answer).basic_info})
  end

  # :create
  test 'should return error msg for :create when already completed user answer' do
    log_in_as(:user_1)
    post_request_and_assert_no_difference(:create, @request_body)
    validate_error_response({errors: 'User Already Answered'}, 400)
  end

  test 'should return error msg for :create when invalid user answer' do
    @request_body[:user_answer][:answers] = [0, 0, 0, 0, 0]
    post_request_and_assert_no_difference(:create, @request_body)
    validate_error_response({errors: 'User Answer Invalid'}, 400)
  end

  test 'should correctly return msg for :create user answer' do
    @request_body[:user_answer][:answers] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    post_request_and_assert_difference(:create, @request_body, +1)
    validate_success_response({message: 'User Answer Saved'})
  end

  test 'should correctly return msg for :create decline answer' do
    @request_body[:user_answer][:answers] = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
    post_request_and_assert_difference(:create, @request_body, +1)
    validate_success_response({message: 'PreWutudu Declined'})
  end

  private

  def log_in_as(uid)
    request.headers["Authorization"] = ActionController::HttpAuthentication::Token.
                                         encode_credentials(users(uid).api_key)
  end

  def get_request_and_assert_no_difference(action, request_body)
    assert_no_difference 'UserAnswer.count', 'New UserAnswer should not be created' do
      # get action, request_body.to_json, format: :json
      get action, request_body
    end
  end

  def post_request_and_assert_no_difference(action, request_body)
    assert_no_difference 'UserAnswer.count', 'New UserAnswer should not be created' do
      # post action, request_body.to_json, format: :json
      post action, request_body
    end
  end

  def post_request_and_assert_difference(action, request_body, diff)
    assert_difference 'UserAnswer.count', diff do
      # post action, request_body.to_json, format: :json
      post action, request_body
    end
  end
end

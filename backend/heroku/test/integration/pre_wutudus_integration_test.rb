require 'test_helper'

class PreWutudusIntegrationTest < ActionController::TestCase
  def setup
    PreWutudusController.any_instance.stubs(:send_notification).returns(nil)
    @controller = PreWutudusController.new
    request.headers["Content-Type"] = "application/json"
    log_in_as(:user_1)
    @group = groups(:group_1)
    @request_body = { 
                      gid: @group.id,
                      pid: pre_wutudus(:pre_wutudu_1).id,
                      pre_wutudu: {
                        event_date: "2015-11-23 21:31:16.01569",
                        latitude: 1.0,
                        longitude: 1.0
                      }
                    }
  end
  # active_in_group
  test 'should return error msg when group not found for :show' do
    @request_body[:gid] = -1
    get_request_and_assert_no_difference(:show, @request_body)
    validate_error_response({errors: 'Group Not Found'}, 404)
  end

  test 'should return error msg when group not found for :create' do
    @request_body[:gid] = -1
    post_request_and_assert_no_difference(:create, @request_body)
    validate_error_response({errors: 'Group Not Found'}, 404)
  end

  test 'should return error msg when group not found for :destroy' do
    @request_body[:gid] = -1
    delete_request_and_assert_no_difference(:destroy, @request_body)
    validate_error_response({errors: 'Group Not Found'}, 404)
  end

  test 'should return error msg when user not active in group for :show' do
    log_in_as(:user_3)
    @request_body[:gid] = groups(:group_2).id
    get_request_and_assert_no_difference(:show, @request_body)
    validate_error_response({errors: 'User Not Active In Group'}, 400)
  end

  test 'should return error msg when user not active in group for :create' do
    log_in_as(:user_3)
    @request_body[:gid] = groups(:group_2).id
    post_request_and_assert_no_difference(:create, @request_body)
    validate_error_response({errors: 'User Not Active In Group'}, 400)
  end

  test 'should return error msg when user not active in group for :destroy' do
    log_in_as(:user_3)
    @request_body[:gid] = groups(:group_2).id
    delete_request_and_assert_no_difference(:destroy, @request_body)
    validate_error_response({errors: 'User Not Active In Group'}, 400)
  end

  # pre_wutudu_in_group
  test 'should return error msg when pre_wutudu not in group for :show' do
    @request_body[:pid] = -1
    get_request_and_assert_no_difference(:show, @request_body)
    validate_error_response({errors: 'PreWutudu Not Found In Group'}, 404)
  end

  test 'should return error msg when pre_wutudu not in group for :destroy' do
    @request_body[:pid] = -1
    delete_request_and_assert_no_difference(:destroy, @request_body)
    validate_error_response({errors: 'PreWutudu Not Found In Group'}, 404)
  end

  # pre_wutudu_not_finished
  test 'should return error msg when pre_wutudu already finished for :show' do
    @request_body[:gid] = groups(:group_2).id
    @request_body[:pid] = pre_wutudus(:pre_wutudu_2).id
    get_request_and_assert_no_difference(:show, @request_body)
    validate_error_response({errors: 'Action Invalid. PreWutudu Already Finished'}, 400)
  end

  test 'should return error msg when pre_wutudu already finished for :destroy' do
    @request_body[:gid] = groups(:group_2).id
    @request_body[:pid] = pre_wutudus(:pre_wutudu_2).id
    delete_request_and_assert_no_difference(:destroy, @request_body)
    validate_error_response({errors: 'Action Invalid. PreWutudu Already Finished'}, 400)
  end

  # :show
  test 'should correctly return msg for :show pre wutudu' do
    get_request_and_assert_no_difference(:show, @request_body)
    validate_success_response({pre_wutudu: pre_wutudus(:pre_wutudu_1).basic_info_per_user(users(:user_1).id)})
  end

  # :create
  # won't cover internal server errors, since they shouldnt happen
  test 'should correctly return msg for :create pre wutudu' do
    post_request_and_assert_difference(:create, @request_body, +1)
    pre_wutudu = assigns(:pre_wutudu)
    validate_success_response({pre_wutudu: pre_wutudu.basic_info_per_user(users(:user_1).id),
                               message: 'PreWutudu Created'})
  end

  # :destroy
  test 'should correctly return msg for :destroy' do
    delete_request_and_assert_difference(:destroy, @request_body, -1)
    validate_success_response({message: 'PreWutudu Deleted'})
  end

  private 

  def log_in_as(uid)
    request.headers["Authorization"] = ActionController::HttpAuthentication::Token.
                                         encode_credentials(users(uid).api_key)
  end

  def get_request_and_assert_no_difference(action, request_body)
    assert_no_difference 'PreWutudu.count', 'New PreWutudu should not be created' do
      # get action, request_body.to_json, format: :json
      get action, request_body
    end
  end

  def post_request_and_assert_no_difference(action, request_body)
    assert_no_difference 'PreWutudu.count', 'New PreWutudu should not be created' do
      # post action, request_body.to_json, format: :json
      post action, request_body
    end
  end

  def post_request_and_assert_difference(action, request_body, diff)
    assert_difference 'PreWutudu.count', diff do
      # post action, request_body.to_json, format: :json
      post action, request_body
    end
  end

  def delete_request_and_assert_no_difference(action, request_body)
    assert_no_difference 'PreWutudu.count' do
      # post action, request_body.to_json, format: :json
      delete action, request_body
    end
  end

  def delete_request_and_assert_difference(action, request_body, diff)
    assert_difference 'PreWutudu.count', diff do
      # post action, request_body.to_json, format: :json
      delete action, request_body
    end
  end
end

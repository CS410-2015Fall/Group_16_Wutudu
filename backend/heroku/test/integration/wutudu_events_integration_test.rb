require 'test_helper'

class WutuduEventsIntegrationTest < ActionController::TestCase
  def setup
    WutuduEventsController.any_instance.stubs(:send_notification).returns(nil)
    @controller = WutuduEventsController.new
    request.headers["Content-Type"] = "application/json"
    log_in_as(:user_1)
    @group = groups(:group_2)
    @request_body = { 
                      gid: @group.id,
                      pid: pre_wutudus(:pre_wutudu_2).id,
                      wid: wutudu_events(:wutudu_event_1).id
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

  test 'should return error msg when user not active in group for :show' do
    log_in_as(:user_3)
    get_request_and_assert_no_difference(:show, @request_body)
    validate_error_response({errors: 'User Not Active In Group'}, 400)
  end

  test 'should return error msg when user not active in group for :create' do
    log_in_as(:user_3)
    post_request_and_assert_no_difference(:create, @request_body)
    validate_error_response({errors: 'User Not Active In Group'}, 400)
  end

  # pre_wutudu_in_group
  test 'should return error msg when pre_wutudu not in group for :create' do
    @request_body[:pid] = -1
    post_request_and_assert_no_difference(:create, @request_body)
    validate_error_response({errors: 'PreWutudu Not Found In Group'}, 404)
  end

  test 'should return error msg when pre_wutudu not in group for :show' do
    @request_body[:wid] = -1
    get_request_and_assert_no_difference(:show, @request_body)
    validate_error_response({errors: 'WutuduEvent Not Found In Group'}, 404)
  end

  # :show
  test 'should correctly return msg for :show wutudu event' do
    get_request_and_assert_no_difference(:show, @request_body)
    validate_success_response({wutudu_event: wutudu_events(:wutudu_event_1).basic_info})
  end

  # :create
  # TODO: Add in when wutudu event + magic are finalized

  private 

  def log_in_as(uid)
    request.headers["Authorization"] = ActionController::HttpAuthentication::Token.
                                         encode_credentials(users(uid).api_key)
  end

  def get_request_and_assert_no_difference(action, request_body)
    assert_no_difference 'WutuduEvent.count', 'New WutuduEvent should not be created' do
      # get action, request_body.to_json, format: :json
      get action, request_body
    end
  end

  def post_request_and_assert_no_difference(action, request_body)
    assert_no_difference 'WutuduEvent.count', 'New WutuduEvent should not be created' do
      # post action, request_body.to_json, format: :json
      post action, request_body
    end
  end

  def post_request_and_assert_difference(action, request_body, diff)
    assert_difference 'WutuduEvent.count', diff do
      # post action, request_body.to_json, format: :json
      post action, request_body
    end
  end

  def delete_request_and_assert_no_difference(action, request_body)
    assert_no_difference 'WutuduEvent.count' do
      # post action, request_body.to_json, format: :json
      delete action, request_body
    end
  end

  def delete_request_and_assert_difference(action, request_body, diff)
    assert_difference 'WutuduEvent.count', diff do
      # post action, request_body.to_json, format: :json
      delete action, request_body
    end
  end

  def validate_error_response(err, code)
    validate_response(err, code)
  end

  def validate_success_response(msg)
    validate_response(msg, 200)
  end

  def validate_response(msg, code)
    exp_response_body = sanitize_hash(msg)
    act_response_body = JSON.parse(response.body)
    assert_equal exp_response_body, act_response_body
    assert_response(code)
  end
end
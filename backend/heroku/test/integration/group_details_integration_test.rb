require 'test_helper'

class GroupDetailsIntegrationTest < ActionController::TestCase
  def setup
    @controller = GroupDetailsController.new
    @group1 = groups(:group_1)
    @group3 = groups(:group_3)
    @user1 = users(:user_1)
    request.headers["Authorization"] = ActionController::HttpAuthentication::Token.encode_credentials(users(:user_1).api_key)
  end

  # user not in group
  test 'should restrict access if user is not in group' do
    get(:show, {gid: @group3.id})
    validate_error_response({errors: 'User Not In Group'}, 404)
  end

  # :show
  test 'should return all the group details for user' do
    get(:show, {gid: @group1.id})
    validate_success_response(@group1.all_info_per_user(@user1.id))
  end

  private

  def validate_error_response(err, code)
    validate_response(err, code)
  end

  def validate_success_response(msg)
    validate_response(msg, 200)
  end

  def validate_response(msg, code)
    exp_response_body = sanitize_hash(msg)
    act_response_body = JSON.parse(response.body)
    assert response.status == code
    assert act_response_body == exp_response_body
  end
end

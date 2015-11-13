require 'test_helper'

class ApiIntegrationTest < ActionController::TestCase
  # testing with User controller
  test "should authenticate to valid user" do
    @controller = UsersController.new
    request.headers["Authorization"] = ActionController::HttpAuthentication::Token.
                                                     encode_credentials(users(:user_1).api_key)
    get :show
    assert response.status == 200
    assert_not_nil response.body
  end

  test "should return access denied when not valid api" do
    @controller = UsersController.new
    request.headers["Authorization"] = ActionController::HttpAuthentication::Token.
                                                     encode_credentials("NotRealAPIKey")
    get :show
    assert response.status == 401
    assert response.body == "HTTP Token: Access denied.\n"
  end
end
require 'test_helper'

class ApiControllerTest < ActionController::TestCase
  test "should return formatted succes msg for rendering" do
    msg = {message: "Everything worked and nothing broke"}
    exp_result = {json: msg, status: 200}
    assert_equal exp_result, @controller.success_msg(msg)
  end

  test "should return formatted error msg for rendering" do
    err_msg = "Nothing worked and everything broke"
    status = 404
    exp_result = {json: {errors: err_msg}, status: status}
    assert_equal exp_result, @controller.errors_msg(err_msg, status)
  end
end

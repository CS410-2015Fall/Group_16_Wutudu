require 'test_helper'

class GroupDetailsControllerTest < ActionController::TestCase
  def setup
    GroupDetailsController.any_instance.stubs(:authenticate).returns(nil)
    GroupDetailsController.any_instance.stubs(:client_in_group).returns(nil)
    @controller.instance_variable_set(:@user, users(:user_1))
    @controller.instance_variable_set(:@group, groups(:group_1))
  end

  # user not in group
  test 'should have correct error msg logic for user not in group' do
    GroupDetailsController.any_instance.unstub(:client_in_group)
    User.any_instance.stubs(:groups).returns(stub(find_by_id: nil))
    GroupDetailsController.any_instance.expects(:errors_msg).
      with('User Not In Group', 404).returns({json: ''})
    get :show, {gid: 1}
  end

  # :show
  test 'should have correct success msg logic for :show group details' do
    GroupDetailsController.any_instance.expects(:success_msg).returns({json: ''})
    get :show, {gid: 1}
  end

  private

  def error_message(rbody)
    JSON.parse(rbody)['errors']
  end
end

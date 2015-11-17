require 'test_helper'

class WutuduEventsControllerTest < ActionController::TestCase
  def setup
    request.headers["Content-Type"] = "application/json"
    WutuduEventsController.any_instance.stubs(:authenticate).returns(nil)
    WutuduEventsController.any_instance.stubs(:active_in_group).returns(nil)
    WutuduEventsController.any_instance.stubs(:pre_wutudu_in_group).returns(nil)
    WutuduEventsController.any_instance.stubs(:wutudu_event_in_group).returns(nil)
    WutuduEventsController.any_instance.stubs(:send_notification).returns(nil)
    @controller.instance_variable_set(:@user, users(:user_1))
    @controller.instance_variable_set(:@group, groups(:group_1))
    @controller.instance_variable_set(:@pre_wutudu, pre_wutudus(:pre_wutudu_1))
    @controller.instance_variable_set(:@wutudu_event, wutudu_events(:wutudu_event_1))

    @show_request_body = { 
                           gid: groups(:group_1).id,
                           wid: wutudu_events(:wutudu_event_1).id
                         }
    @create_request_body = { 
                           gid: groups(:group_1).id,
                           pid: pre_wutudus(:pre_wutudu_1).id
                         }

  end

  # active_in_group
  test 'should have correct error msg logic when group not found for :get' do
    WutuduEventsController.any_instance.unstub(:active_in_group)
    Group.stubs(:find_by_id).returns(nil)
    wutudu_events_controller_expects_errors_msg('Group Not Found', 404)
    get :show, @show_request_body
  end

  test 'should have correct error msg logic when group not found for :create' do
    WutuduEventsController.any_instance.unstub(:active_in_group)
    Group.stubs(:find_by_id).returns(nil)
    wutudu_events_controller_expects_errors_msg('Group Not Found', 404)
    post :create, @create_request_body
  end

  test 'should have correct error msg logic when user not active in group for :get' do
    WutuduEventsController.any_instance.unstub(:active_in_group)
    Group.any_instance.stubs(:active_users).returns(stub(find_by_id: nil))
    wutudu_events_controller_expects_errors_msg('User Not Active In Group', 400)
    get :show, @show_request_body
  end

  test 'should have correct error msg logic when user not active in group for :create' do
    WutuduEventsController.any_instance.unstub(:active_in_group)
    Group.any_instance.stubs(:active_users).returns(stub(find_by_id: nil))
    wutudu_events_controller_expects_errors_msg('User Not Active In Group', 400)
    post :create, @create_request_body
  end

  # pre_wutudu_in_group
  test 'should have correct error msg logic when pre_wutudu not in group for :create' do
    WutuduEventsController.any_instance.unstub(:pre_wutudu_in_group)
    Group.any_instance.stubs(:pre_wutudus).returns(stub(find_by_id: nil))
    wutudu_events_controller_expects_errors_msg('PreWutudu Not Found In Group', 404)
    post :create, @create_request_body
  end

  # wutudu_event_in_group
  test 'should have correct error msg logic when wutudu event not found in group for :show' do
    WutuduEventsController.any_instance.unstub(:wutudu_event_in_group)
    Group.any_instance.stubs(:wutudu_events).returns(stub(find_by_id: nil))
    wutudu_events_controller_expects_errors_msg('WutuduEvent Not Found In Group', 404)
    get :show, @show_request_body
  end
  
  # :show
  test 'should have correct msg logic for :show' do
    WutuduEvent.any_instance.stubs(:basic_info).returns("")
    wutudu_events_controller_expects_success_msg
    get :show, @show_request_body
  end

  # :create
  # TODO: Add in when wutudu event + magic are finalized

  private 

  def wutudu_events_controller_expects_internal_error_msg
    WutuduEventsController.any_instance.expects(:internal_error_msg).returns({json: ''})
  end  

  def wutudu_events_controller_expects_errors_msg(msg, code)
    WutuduEventsController.any_instance.expects(:errors_msg).
      with(msg, code).returns({json: ''})
  end

  def wutudu_events_controller_expects_success_msg
    WutuduEventsController.any_instance.expects(:success_msg).returns({json: ''})
  end  
end

class WutuduEventsController < ApiController
  before_action :authenticate, :active_in_group
  before_action :pre_wutudu_in_group, only: [:create]
  before_action :wutudu_event_in_group, except: [:create]

  def show
    render success_msg({wutudu_event: @wutudu_event.basic_info})
  end

  def create
    render errors_msg("Wutudu Event Already Created", 400) and return \
      unless @pre_wutudu.wutudu_event.nil?
    render errors_msg("No Answers Completed", 400) and return \
      if @pre_wutudu.completed_answers_count == 0
    top_category = @pre_wutudu.top_category
    render internal_error_msg and return \
      unless top_category
    message, code = @pre_wutudu.generate_wutudu_event
    render errors_msg(message, code) and return \
      unless code == 200
    send_active_users_notifications(@pre_wutudu)
    render success_msg(
                {
                  weights: @pre_wutudu.aggregate_category_weights,
                  top: top_category.basic_info,
                  wutudu_event: @pre_wutudu.wutudu_event.basic_info,
                  message: message
                }
            ) and return
  end

  private

  def active_in_group
    @group = Group.find_by_id(params[:gid])
    render errors_msg("Group Not Found", 404) and return \
      unless @group
    render errors_msg("User Not Active In Group", 400) and return\
      unless @group.active_users.find_by_id(@user.id)
  end

  def pre_wutudu_in_group
    @pre_wutudu = @group.pre_wutudus.find_by_id(params[:pid])
    render errors_msg("PreWutudu Not Found In Group", 404) and return \
      unless @pre_wutudu
  end

  def wutudu_event_in_group
    @wutudu_event = @group.wutudu_events.find_by_id(params[:wid])
    render errors_msg("WutuduEvent Not Found In Group", 404) and return \
      unless @wutudu_event
  end

  def send_active_users_notifications(pre_wutudu)
    tokens = @group.active_users_device_tokens
    unless tokens.empty?
      payload = {
        group: @group.basic_info,
        wutudu_event: pre_wutudu.wutudu_event.basic_info,
        state: 'wutudu'
      }
      send_notification(tokens, \
                        "A Wutudu have been generated for Group #{@group.name}", \
                        payload)
    end
  end
end
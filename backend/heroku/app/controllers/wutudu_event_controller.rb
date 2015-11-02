class WutuduEventController < ApiController
  before_action :authenticate, :active_in_group
  before_action :pre_wutudu_in_group, only: [:create]
  before_action :wutudu_event_in_group, except: [:create]

  def show
    return send_success({wutudu_event: @wutudu_event.basic_info})
  end

  def create
    return send_errors("Wutudu Event Already Created", 400) unless @pre_wutudu.wutudu_event.nil?
    return send_errors("No Answers Completed", 400) if @pre_wutudu.completed_answers_count == 0
    top_category = @pre_wutudu.top_category
    return send_internal_error unless top_category
    message, code = @pre_wutudu.generate_wutudu_event
    return send_errors(message, code) unless code == 200
    return send_success(
                {
                  weights: @pre_wutudu.aggregate_category_weights,
                  top: top_category.basic_info,
                  wutudu_event: @pre_wutudu.wutudu_event.basic_info
                }
            )
  end

  private

  def active_in_group
    @group = Group.find_by_id(params[:gid])
    return send_errors("Group Not Found", 404) unless @group
    return send_errors("User Not Active In Group", 400) \
      unless @group.active_users.find_by_id(@user.id)
  end

  def pre_wutudu_in_group
    @pre_wutudu = @group.pre_wutudus.find_by_id(params[:pid])
    return send_errors("PreWutudu Not Found In Group", 404) unless @pre_wutudu
  end

  def wutudu_event_in_group
    @wutudu_event = @group.wutudu_events.find_by_id(params[:wid])
    return send_errors("WutuduEvent Not Found In Group", 404) unless @wutudu_event
  end
end
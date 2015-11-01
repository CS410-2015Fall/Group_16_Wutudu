class WutuduEventController < ApiController
  before_action :authenticate, :active_in_group
  before_action :pre_wutudu_in_group, only: [:create]
  before_action :wutudu_event_in_group, except: [:create]

  def show
    return send_success({wutudu_event: @wutudu_event.basic_info})
  end

  def create
    return send_errors("Wutudu Event Already Created", 400) unless @pre_wutudu.wutudu_event.nil?
    weights = @pre_wutudu.aggregate_category_weights
    return send_internal_error unless weights
    return send_errors("No Answers Completed", 400) if weights.empty?
    top_category = Category.find_by_id(weights.max_by{|k,v| v}[0])
    return send_internal_error unless top_category
    wutudu_event = @group.wutudu_events.build( \
                          category_id: top_category.id, \
                          latitude: @pre_wutudu.latitude, \
                          longitude: @pre_wutudu.longitude, \
                          event_time: @pre_wutudu.event_date \
                          )
    @pre_wutudu.wutudu_event = wutudu_event
    @pre_wutudu.finished = true;
    return send_errors("Unable To Create Wutudu Event", 400) unless @pre_wutudu.save
    return send_success({weights: weights, top: top_category.basic_info, wutudu_event: wutudu_event.basic_info})
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
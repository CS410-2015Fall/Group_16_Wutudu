class WutuduEventController < ApiController
  before_action :authenticate, :active_in_group, :wutudu_in_group

  def create
    #WutuduEvent.new()
    weights = @pre_wutudu.aggregate_category_weights
    return send_internal_error unless weights
    return send_errors('No Answers Completed', 400) if weights.empty?
    top_category = Category.find_by_id(weights.max_by{|k,v| v}[0])
    return send_internal_error unless top_category
    return send_success({weights: weights, top: top_category})
  end

  private

  def active_in_group
    @group = Group.find_by_id(params[:gid])
    return send_errors("Group Not Found", 404) unless @group
    return send_errors("User Not Active In Group", 400) \
      unless @group.active_users.find_by_id(@user.id)
  end

  def wutudu_in_group
    @pre_wutudu = @group.pre_wutudus.find_by_id(params[:id])
    return send_errors("PreWutudu Not Found In Group", 404) unless @pre_wutudu
  end
end
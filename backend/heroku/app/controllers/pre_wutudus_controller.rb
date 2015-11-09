class PreWutudusController < ApiController
  before_action :authenticate, :active_in_group
  before_action :pre_wutudu_in_group, :pre_wutudu_not_finished, except: [:create]

  def show
    message = { pre_wutudu: @pre_wutudu.basic_info_per_user(@user.id) }
    return send_success(message)
  end

  def create
    pre_wutudu = @group.pre_wutudus.build(create_params)

    questions = Question.all.sample(10)
    return send_internal_error unless questions
    return send_internal_error if questions.empty?

    (0..9).each do |qnum|
      return send_internal_error if pre_wutudu.pre_wutudu_questions.exists?(qnum: qnum)
      pre_wutudu.pre_wutudu_questions.build(question_id: questions[qnum].id, qnum: qnum)
    end

    return send_internal_error if pre_wutudu.pre_wutudu_questions.size != 10
    return send_errors("Failed To Create PreWutudu", 400) unless pre_wutudu.save
    send_active_users_notifications(pre_wutudu)
    return send_success({pre_wutudu: pre_wutudu.basic_info_per_user(@user.id), message: "PreWutudu Created"})
  end

  def destroy
    @pre_wutudu.destroy
    return send_errors("Failed To Delete PreWutudu", 400) unless @pre_wutudu.destroyed?
    return send_success({message: "PreWutudu Deleted"})
  end

  private

  def create_params
    c = params.require(:pre_wutudu).permit(:event_date, :latitude, :longitude)
    [:event_date, :latitude, :longitude].each {|p| c.require(p)}
    c
  end

  #TODO: Move these to an abstract prewutudu controller, since they are used in various places
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

  def pre_wutudu_not_finished
    return send_errors("Action Invalid. PreWutudu Already Finished", 400) if @pre_wutudu.finished?
  end

  def send_active_users_notifications(pre_wutudu)
    device_tokens = @group.active_users_device_tokens.reject{|t| t == @user.device_token}
    unless device_tokens.empty?
      payload = {
        group: @group.basic_info,
        pre_wutudu: pre_wutudu.basic_info_per_user(@user.id),
        state: 'pre_wutudu'
      }
      send_notification(device_tokens, \
                        "You have been invited to complete a Wutudu with Group #{@group.name}", \
                        payload)
    end
  end
end

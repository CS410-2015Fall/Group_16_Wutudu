class UserAnswerController < ApiController
  before_action :authenticate, :active_in_group, :pre_wutudu_in_group, :pre_wutudu_not_finished

  def show
    user_answer = @pre_wutudu.user_answers.find_by_user_id(@user.id)
    return send_errors("User Has Not Answered", 400) unless user_answer
    return send_success({user_answer: user_answer.basic_info})
  end

  def create
    return send_errors("User Already Answered", 400) \
      if @pre_wutudu.user_answers.find_by_user_id(@user.id)
    user_answer = @pre_wutudu.user_answers.build(user_id: @user.id)
    answers = create_user_answer_params[:answers]
    if answers.count(-1) == answers.size
      user_answer.declined = true
    else
      user_answer.answers = answers
    end
    return send_errors("User Answer Invalid", 400) unless user_answer.valid?
    return send_errors("Failed To Save Answers", 400) unless user_answer.save
    send_active_users_notifications(@pre_wutudu)
    return (user_answer.declined? ? send_success({message: "PreWutudu Declined"}) : \
                                    send_success({message: "User Answer Saved"}))
  end

  private

  def create_user_answer_params
    u = params.require(:user_answer).permit(:answers => [])
    u.require(:answers)
    u
  end

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
    unless @group.active_users_device_tokens.empty?
      payload = {
        group: @group.basic_info,
        wutudu_event: pre_wutudu.wutudu_event.basic_info,
        state: 'wutudu'
      }
      send_notification(@group.active_users_device_tokens, \
                        "A Wutudu have been generated for Group #{@group.name}", \
                        payload)
    end
  end
end